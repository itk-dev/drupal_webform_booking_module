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
import { bookingFilterValues, initializeResourceDropdown } from "./filters";

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
          bookingFilterValues(bookingFilterNodes)
        );

        // Add event listener on all filters.
        bookingFilterNodes.forEach((bookingFilter) => {
          bookingFilter.addEventListener("change", () => {
            buildCalendar(
              drupalSettings,
              elementSettings,
              elementId,
              resourceDropdownNode,
              calendarElement,
              bookingFilterValues(bookingFilterNodes)
            );
          });
        });
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
 * @param {object} filters : A list of filters.
 */
function buildCalendar(
  drupalSettings,
  elementSettings,
  elementId,
  resourceDropdownNode,
  calendarElement,
  filters
) {
  Promise.all([
    fetch(`${elementSettings.front_page_url}/itkdev_booking/bookings`),
    fetch(`${elementSettings.front_page_url}/itkdev_booking/resources`),
  ])
    .then(function (responses) {
      return Promise.all(
        responses.map(function (response) {
          return response.json();
        })
      );
    })
    .then(function (data) {
      setupCalendar(
        drupalSettings,
        elementSettings,
        elementId,
        resourceDropdownNode,
        calendarElement,
        data,
        filters
      );
    })
    .catch(function () {
      // If there's an error, log it.
      // eslint-disable-next-line no-console
    });
}

/**
 * Create calendar.
 *
 * @param {object} drupalSettings : Settings provided by Drupal
 * @param {object} elementSettings : Settings related to a specific webform element
 * @param {string} elementId : elementId Id of the webform element.
 * @param {HTMLElement} resourceDropdownNode : The resource dropdown HTML element.
 * @param {HTMLElement} calendarElement : The calendar HTML element.
 * @param {Array} data : An array of data from multiple sources.
 * @param {object} filters : A list of filters.
 */
function setupCalendar(
  drupalSettings,
  elementSettings,
  elementId,
  resourceDropdownNode,
  calendarElement,
  data,
  filters
) {
  const now = new Date();
  const dataFormatted = [];

  data.forEach(function setData(response) {
    switch (response["@id"]) {
      case "/v1/busy-intervals":
        dataFormatted.bookings =
          response["hydra:member"].map(handleBusyIntervals);
        break;
      case "/v1/resources":
        dataFormatted.resources = response["hydra:member"].map(handleResources);
        dataFormatted.resources = dataFormatted.resources.filter(
          filterSelectedResourceBackend,
          elementSettings
        );
        dataFormatted.resources = dataFormatted.resources.filter(
          filterSelectedResourceFrontend,
          filters.resource
        );
        break;
      default:
    }
  });
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
    selectConstraint: "businessHours",
    businessHours: {
      startTime: "06:00",
      endTime: "22:00",
    },
    initialDate: filters.bookingDate
      ? filters.bookingDate
      : now.toISOString().split("T")[0],
    navLinks: false,
    selectable: elementSettings.enable_booking === true,
    select(selectionInfo) {
      const modal = new Modal();
      modal.from = selectionInfo.start;
      modal.to = selectionInfo.end;
      modal.resourceId = selectionInfo.resource._resource.id;
      modal.resourceTitle = selectionInfo.resource._resource.title;
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
    resources: dataFormatted.resources,
    events: dataFormatted.bookings,
  });
  calendar.render();
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
    id: value.name,
    title: value.readable_name,
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
function filterSelectedResourceBackend(element, index, arr) {
  if (this.rooms[arr[index].id] === 0) {
    return false;
  }
  return true;
}

/** @param {object} info : The resouce metadata */
function renderResourceTooltips(info) {
  const tooltip = new Tooltip();
  tooltip.distance = 5;
  tooltip.delay = 0;
  tooltip.position = "center bottom";

  const resourceImage = info.resource._resource.extendedProps.image;
  const resourceDescription = info.resource._resource.extendedProps.description;
  const resourceTitle = info.resource._resource.id;
  const resourceCapacity = info.resource._resource.extendedProps.capacity;
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
  if (this === null || this === element.id) {
    return true;
  }
  return false;
}
