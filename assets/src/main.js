import { Calendar } from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import daLocale from "@fullcalendar/core/locales/da";
import resourceTimegrid from "@fullcalendar/resource-timegrid";
import "./main.css";

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
        const resourceDropdownElement = document.getElementById(
          `booking-room-select-${elementId}`
        );
        const calendarElement = document.getElementById(
          `calendar-${elementId}`
        );

        buildCalendar(
          drupalSettings,
          elementSettings,
          elementId,
          resourceDropdownElement,
          calendarElement
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
 * @param {HTMLElement} resourceDropdownElement : The resource dropdown HTML element.
 * @param {HTMLElement} calendarElement : The calendar HTML element.
 */
function buildCalendar(
  drupalSettings,
  elementSettings,
  elementId,
  resourceDropdownElement,
  calendarElement
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
        resourceDropdownElement,
        calendarElement,
        data
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
 * @param {HTMLElement} resourceDropdownElement : The resource dropdown HTML element.
 * @param {HTMLElement} calendarElement : The calendar HTML element.
 * @param {Array} data : An array of data from multiple sources.
 */
function setupCalendar(
  drupalSettings,
  elementSettings,
  elementId,
  resourceDropdownElement,
  calendarElement,
  data
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
          filterSelectedResource,
          elementSettings
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
    initialDate: now.toISOString().split("T")[0],
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
    id: value.name,
    title: value.readable_name,
  };
}

/**
 * Defines the contents of the resource dropdown.
 *
 * @param frontpageUrl The URL to the frontpage.
 * @param resourceDropdownElement The dropdown to be populated.
 */
/*
function setResourceDropdown(frontpageUrl, resourceDropdownElement) {
  fetch(`${frontpageUrl}/itkdev_booking/resources`)
    .then((response) => response.json())
    .then((resources) => {
      resources["hydra:member"].forEach((key) => {
        resourceDropdownElement.options[
          resourceDropdownElement.options.length
        ] = new Option(key.readable_name, key.name);
      });
    });
}
*/

/**
 * Remove resources from array if they have not been selected in the Drupal
 * backend. "this" represents the drupal configuration for the webform element.
 *
 * @param {number} index : The index of the resource.
 * @param {Array} arr : The array of resources.
 * @returns {boolean} : Whether the resource was selected to be isplayed in the
 *   Drupal backend.
 */
function filterSelectedResource(index, arr) {
  if (this.rooms[arr[index].id] === 0) {
    return false;
  }
  return true;
}
