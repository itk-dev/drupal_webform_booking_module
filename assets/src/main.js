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
    initialView: "resourceTimeGridDay",
    duration: "days: 3",
    initialDate: filters.dateStart
      ? filters.dateStart
      : now.toISOString().split("T")[0],

    selectConstraint: "businessHours",
    businessHours: {
      startTime: "06:00",
      endTime: "22:00",
    },
    navLinks: false,
    selectable: elementSettings.enable_booking === true,
    select(selectionInfo) {
      const modal = new Modal();
      modal.from = selectionInfo.start;
      modal.to = selectionInfo.end;
      modal.resourceId = selectionInfo.resource._resource.id;
      modal.resourceTitle = selectionInfo.resource._resource.title;
      modal.drupal = Drupal;
      modal.buildModal();
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
  return {
    id: value.email,
    title: value.title,
    capacity: value.capacity,
    building: value.building,
    description: value.description,
    image: value.image,
  };
}

/**
 * Remove resources from array if they have not been selected in the Drupal
 * backend. "this" represents the drupal configuration for the webform element.
 *
 * @param {object} element : The resource element.
 * @param {number} index : The index of the resource.
 * @param {Array} arr : The array of resources.
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
