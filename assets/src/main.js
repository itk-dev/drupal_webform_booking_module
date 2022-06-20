import { Calendar } from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import daLocale from "@fullcalendar/core/locales/da";
import resourceTimegrid from "@fullcalendar/resource-timegrid";
import "./main.css";
import { bookingFilterValues, initializeResourceDropdown } from "./filters";

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
  const parameters = new URLSearchParams(filters).toString();
  Promise.all([
    fetch(`${elementSettings.front_page_url}/itkdev_booking/bookings?${parameters}`),
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
    .catch(function (error) {
      // If there's an error, log it.
      // eslint-disable-next-line no-console
      console.log(error);
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
          filters.resources
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
    ],
    initialView: "resourceTimeGridDay",
    duration: "days: 3",
    initialDate: filters.dateStart
      ? filters.dateStart
      : now.toISOString().split("T")[0],
    navLinks: false,
    editable: false,
    dayMaxEvents: true,
    locale: daLocale,
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
    id: value.email,
    title: value.title,
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
  return this.rooms[arr[index].id] !== 0;
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
  const resources = this.split(',');
  return resources.length > 1 || this === element.id;
}
