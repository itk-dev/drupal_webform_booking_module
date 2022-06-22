import { Calendar } from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import daLocale from "@fullcalendar/core/locales/da";
import resourceTimegrid from "@fullcalendar/resource-timegrid";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import "./main.css";
import "./modal/modal.css";
import "./tooltip/tooltip.css";
import Modal from "./modal/modal";
import Tooltip from "./tooltip/tooltip";
import {
  bookingFilterValues,
  initializeResourceDropdown,
  calendarApplyFilters,
} from "./filters";

/* eslint no-underscore-dangle: 0 */
/**
 * Provide a calendar from (https://fullcalendar.io/) with data from Drupal.
 *
 * @param {object} Drupal : A Drupal object.
 * @param {object} drupalSettings : Drupal settings added to this js.
 * @param {Function} once : Use once function globally.
 */
(function (Drupal, drupalSettings, once) {
  Drupal.behaviors.itkdevBooking = {
    attach(context) {
      once(
        "itkdevBooking",
        document.getElementsByClassName("booking_calendar"),
        context
      ).forEach(function (element) {
        // It is possible to add multiple calendars to a page so we have to support it. We use a webform element id to
        // distinguish between calendars.
        const elementId = element.getAttribute("booking-element-id");
        const elementSettings = drupalSettings.booking_calendar[elementId];
        const bookingFilterNodes = document.querySelectorAll(
          `#booking-filters-${elementId} .booking-filter`
        );
        const resourceDropdownNode = document.getElementById(
          `booking-room-select-${elementId}`
        );
        const calendarElement = document.getElementById(
          `calendar-${elementId}`
        );

        initializeResourceDropdown(resourceDropdownNode, elementSettings);
        buildCalendar(
          drupalSettings,
          elementSettings,
          elementId,
          resourceDropdownNode,
          calendarElement,
          bookingFilterNodes
        );
      });
    },
  };
})(Drupal, drupalSettings, once);

/**
 * Build a calendar if we have the data needed.
 *
 * @param {object} drupalSettings : Settings provided by Drupal.
 * @param {object} elementSettings : Settings related to a specific webform element.
 * @param {string} elementId : Id of the webform element.
 * @param {HTMLElement} resourceDropdownNode : The resource dropdown HTML element.
 * @param {HTMLElement} calendarElement : The calendar HTML element.
 * @param {object} bookingFilterNodes : A list of filter nodes.
 */
function buildCalendar(
  drupalSettings,
  elementSettings,
  elementId,
  resourceDropdownNode,
  calendarElement,
  bookingFilterNodes
) {
  const calendar = setupCalendar(
    drupalSettings,
    elementSettings,
    elementId,
    resourceDropdownNode,
    calendarElement,
    bookingFilterNodes
  );

  applyEventListeners(calendar, bookingFilterNodes, elementSettings);
}

/**
 * Create calendar.
 *
 * @param {object} drupalSettings : Settings provided by Drupal
 * @param {object} elementSettings : Settings related to a specific webform element
 * @param {string} elementId : elementId Id of the webform element.
 * @param {HTMLElement} resourceDropdownNode : The resource dropdown HTML element.
 * @param {HTMLElement} calendarElement : The calendar HTML element.
 * @param {object} bookingFilterNodes : A list of filter nodes.
 * @returns {Calendar} The rendered calendar object
 */
function setupCalendar(
  drupalSettings,
  elementSettings,
  elementId,
  resourceDropdownNode,
  calendarElement,
  bookingFilterNodes
) {
  const now = new Date();
  const filters = bookingFilterValues(bookingFilterNodes);
  const startHour = new Date().getHours() - 1; // The hour for the calendar to scroll to, to always show relevant bookings at first glance.
  const calendar = new Calendar(calendarElement, {
    schedulerLicenseKey: elementSettings.license_key,
    plugins: [
      resourceTimegrid,
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
      resourceTimelinePlugin,
    ],
    height: 850,
    selectMirror: true,
    scrollTime: `${startHour}:00:00`,
    initialView: "resourceTimeGridDay",
    duration: "days: 3",
    initialDate: filters.dateStart
      ? filters.dateStart
      : now.toISOString().split("T")[0],
    selectConstraint: "businessHours",
    nowIndicator: true,
    navLinks: false,
    validRange(nowDate) {
      return {
        start: nowDate,
      };
    },
    selectable: elementSettings.enable_booking === true,
    unselectAuto: false,
    select(selectionInfo) {
      const dateNow = new Date();
      if (selectionInfo.start < dateNow) {
        calendar.unselect();
        return false;
      }
      initModal(selectionInfo, calendar);
    },
    selectOverlap: false,
    editable: false,
    dayMaxEvents: true,
    locale: daLocale,
    resourceLabelDidMount(info) {
      if (elementSettings.enable_resource_tooltips === true) {
        renderResourceTooltips(info);
      }
    },
    // eslint-disable-next-line no-unused-vars
    resources(info, successCallback, failureCallback) {
      const resourceFilters = bookingFilterValues(bookingFilterNodes);
      fetch(`${elementSettings.front_page_url}/itkdev_booking/resources`)
        .then((response) => response.json())
        .then((data) =>
          successCallback(handleData(data, resourceFilters, elementSettings))
        );
    },
    // eslint-disable-next-line no-unused-vars
    events(info, successCallback, failureCallback) {
      const eventFilters = initFilters(info, elementSettings);
      const parameters = new URLSearchParams(eventFilters).toString();
      fetch(
        `${elementSettings.front_page_url}/itkdev_booking/bookings?${parameters}`
      )
        .then((response) => response.json())
        .then((data) =>
          successCallback(handleData(data, eventFilters, elementSettings))
        );
    },
    datesSet(info) {
      // This is called fairly often. Use with care. https://fullcalendar.io/docs/datesSet
      // Change date select to match calendar date.
      const calendarDate = new Date(
        Date.UTC(
          info.start.getFullYear(),
          info.start.getMonth(),
          info.start.getDate()
        )
      );
      document.getElementById("booking-date-picker-booking").valueAsDate =
        calendarDate;
    },
    loading(bool) {
      if (bool) {
        return false;
      }
      document.getElementsByClassName("loader")[0].classList.remove("showing");
    }
  });
  calendar.render();

  return calendar;
}

/**
 * Handle busy intervals.
 *
 * @param {object} value : A single busy interval.
 * @returns {{ object }} : A usable format for a fullcalendar event.
 */
function handleBusyIntervals(value) {
  return {
    groupId: 0,
    title: Drupal.t("Busy"),
    start: value.startTime,
    end: value.endTime,
    resourceId: value.resource,
  };
}

/**
 * Handle resources.
 *
 * @param {object} value : A single resource.
 * @returns {{ object }} : A usable format for a fullcalendar resource.
 */
function handleResources(value) {
  const businessStartHour = Math.floor(Math.random() * (12 - 2 + 1) + 2);
  return {
    id: value.email,
    title: value.title,
    capacity: value.capacity,
    building: value.building,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas elementum purus ut lectus auctor ornare. Etiam fringilla vel ante ut hendrerit. In varius metus lacus. Proin scelerisque finibus tellus at gravida. Mauris bibendum hendrerit mauris, a feugiat leo consectetur vitae. Nulla vulputate orci id enim ullamcorper, id feugiat massa eleifend. Integer congue semper purus ut efficitur. Mauris erat enim, ullamcorper ut fringilla eget, rhoncus a augue.",
    image:
      "data:image/png;base64,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",
    businessHours: {
      startTime: businessHoursOrNearestHalfHour(businessStartHour),
      endTime: `${Math.floor(Math.random() * (22 - 16 + 1) + 16)}:00`,
    },
  };
}

/**
 * Remove resources from array if they have not been selected in the Drupal
 * backend. "this" represents the drupal configuration for the webform element.
 *
 * @param {object} element : The resource element.
 * @returns {boolean} : Whether the resource was selected to be displayed in the
 *   Drupal backend.
 */
// eslint-disable-next-line no-unused-vars
function filterSelectedResourceBackend(element, index, arr) {
  return this.rooms[element.id] !== 0;
}

/**
 * Render the resource tooltips.
 *
 * @param {object} info : The resource metadata
 */
function renderResourceTooltips(info) {
  const tooltip = new Tooltip();
  tooltip.distance = 5;
  tooltip.delay = 0;
  tooltip.position = "center bottom";

  const resourceImage = info.resource._resource.extendedProps.image
    ? info.resource._resource.extendedProps.image
    : "";
  const resourceDescription = info.resource._resource.extendedProps.description
    ? info.resource._resource.extendedProps.description
    : "";
  const resourceTitle = info.resource._resource.id
    ? info.resource._resource.id
    : "";
  const resourceCapacity = info.resource._resource.extendedProps.capacity
    ? info.resource._resource.extendedProps.capacity
    : "";
  const questionMark = document.createElement("span");
  questionMark.innerText = " ( ? ) ";
  questionMark.dataset.tooltip = `<img src='${resourceImage}' /><p><b>${resourceTitle}</b><br><b>Kapacitet: ${resourceCapacity}</b><br>${resourceDescription}</p>`;
  questionMark.dataset.position = "center bottom";
  info.el.appendChild(questionMark);

  tooltip.renderTooltip(tooltip);
}

/**
 * Remove resources from array if they have not been selected in the Drupal
 * frontend. "this" represents the resource filter value set in resource dropdown.
 *
 * @param {object} element : The resource element.
 * @param {number} index : The index of the resource.
 * @param {Array} arr : The array of resources.
 * @returns {boolean} : Whether the resource was selected to be displayed in the
 *   Drupal frontend.
 */
// eslint-disable-next-line no-unused-vars
function filterSelectedResourceFrontend(element, index, arr) {
  const resources = this.split(",");
  return resources.length > 1 || this === element.id;
}

/**
 * Add event listeners for external events (Input filters etc.).
 *
 * @param {object} calendar : The calendar object.
 * @param {object} bookingFilterNodes : A list of filter nodes.
 */
function applyEventListeners(calendar, bookingFilterNodes) {
  // Add event listener on all filters.
  bookingFilterNodes.forEach((bookingFilter) => {
    bookingFilter.addEventListener("change", () => {
      calendarApplyFilters(calendar, bookingFilterNodes);
    });
  });
}

/**
 * Prepare json data source for display.
 *
 * @param {object} data : A data source.
 * @param {object} filters : A list of filters.
 * @param {object} elementSettings : Settings related to a specific webform element.
 * @returns {any} : The data filtered and delivered in a way the calendar understands.
 */
function handleData(data, filters, elementSettings) {
  const dataFormatted = [];
  switch (data["@id"]) {
    case "/v1/busy-intervals":
      dataFormatted.data = data["hydra:member"].map(handleBusyIntervals);
      break;
    case "/v1/resources":
      dataFormatted.data = data["hydra:member"].map(handleResources);
      dataFormatted.data = dataFormatted.data.filter(
        filterSelectedResourceBackend,
        elementSettings
      );
      dataFormatted.data = dataFormatted.data.filter(
        filterSelectedResourceFrontend,
        filters.resources
      );
      break;
    default:
  }
  return dataFormatted.data;
}

/**
 * Initialize filters when new data is fetched.
 *
 * @param {object} info : Calendar state information.
 * @param {object} drupalSettings : Drupal settings added to this js.
 * @returns {{ dateStart: any; resources: string; dateEnd: any }} Readable filter values.
 */
function initFilters(info, drupalSettings) {
  let resources = "";
  Object.keys(drupalSettings.rooms).forEach((key) => {
    if (drupalSettings.rooms[key] !== 0) {
      resources += `${key},`;
    }
  });
  resources = resources.slice(0, -1);
  return {
    dateStart: info.startStr,
    dateEnd: info.endStr,
    resources,
  };
}
/**
 * @param {object} s : The selection event info
 * @param {object} cal : The calendar instance
 */
function initModal(s, cal) {
  const modal = new Modal();
  modal.calendarInstance = cal;
  modal.date = `${s.start.getDate()}/${s.start.getMonth()}-${s.start.getFullYear()}`;
  modal.from = `${(s.start.getHours() < 10 ? "0" : "") + s.start.getHours()}:${s.start.getMinutes() < 10 ? "0" : ""
    }${s.start.getMinutes()}`;
  modal.to = `${(s.end.getHours() < 10 ? "0" : "") + s.end.getHours()}:${s.end.getMinutes() < 10 ? "0" : ""
    }${s.end.getMinutes()}`;
  modal.resourceId = s.resource._resource.id;
  modal.resourceTitle = s.resource._resource.title;
  modal.drupal = Drupal;
  modal.buildModal();
}
/**
 * @param {object} date - Date object
 * @returns {object} - Date object representing the current datetime, rounded up
 *   to the next half an hour.
 */
function roundToNearest30(date = new Date()) {
  const minutes = 30;
  const ms = 1000 * 60 * minutes;

  return new Date(Math.ceil(date.getTime() / ms) * ms);
}

/**
 * @param {number} businessStartHour - The hour the resource is available from
 * @returns {string} : formatted date to represent the start of when the
 *   resource is available from, either direct resourcedata or the current time
 *   rounded up to the next half an hour, depending on which is largest.
 */
function businessHoursOrNearestHalfHour(businessStartHour) {
  const businessStartHourFormatted =
    businessStartHour.toString().length === 1
      ? `0${businessStartHour}:00`
      : `${businessStartHour}:00`;
  const currentClosestHalfAnHourFormatted = `${roundToNearest30(new Date()).getHours().toString().length === 1
    ? `0${roundToNearest30(new Date()).getHours()}`
    : roundToNearest30(new Date()).getHours()
    }:${roundToNearest30(new Date()).getMinutes().toString().length === 1
      ? `0${roundToNearest30(new Date()).getMinutes()}`
      : roundToNearest30(new Date()).getMinutes()
    }`;
  if (currentClosestHalfAnHourFormatted > businessStartHourFormatted) {
    return currentClosestHalfAnHourFormatted;
  }
  return businessStartHourFormatted;
}