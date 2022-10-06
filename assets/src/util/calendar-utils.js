import dayjs from "dayjs";

const internalOpeningHours = [];

// Disabling no-underscore-dangle due to having to accessing the fullcalendar api through (calendarref.current._calendarApi)
/* eslint no-underscore-dangle: 0 */

/**
 * Round to nearest 15 minutes.
 *
 * @param {object} date - Date object
 * @returns {object} - Date object representing the current datetime, rounded up to the next half an hour.
 */
function roundToNearest15(date = new Date()) {
  const minutes = 15;
  const ms = 1000 * 60 * minutes;

  return new Date(Math.ceil(date.getTime() / ms) * ms);
}

/**
 * Round business hours to nearest half hour.
 *
 * @param {number} businessStartHour The hour the resource is available from
 * @param {object} currentCalendarDate Datetime object of the current Fullcalendar instance
 * @param {boolean} returnMilliseconds Return value in ms
 * @returns {string} : formatted date to represent the start of when the resource is available from, either direct
 *   resourcedata or the current time rounded up to the next half an hour, depending on which is largest.
 */
function businessHoursOrNearestFifteenMinutes(businessStartHour, currentCalendarDate, returnMilliseconds) {
  const calendarDate = currentCalendarDate.setHours(0, 0, 0, 0);

  let adjustedBusinessHour = businessStartHour;
  let today = new Date();

  today = today.setHours(0, 0, 0, 0);

  const currentClosestHalfAnHourFormatted = `${
    roundToNearest15(new Date()).getHours().toString().length === 1
      ? `0${roundToNearest15(new Date()).getHours()}`
      : roundToNearest15(new Date()).getHours()
  }:${
    roundToNearest15(new Date()).getMinutes().toString().length === 1
      ? `0${roundToNearest15(new Date()).getMinutes()}`
      : roundToNearest15(new Date()).getMinutes()
  }`;

  if (currentClosestHalfAnHourFormatted > adjustedBusinessHour && calendarDate === today) {
    adjustedBusinessHour = currentClosestHalfAnHourFormatted;
  }

  if (returnMilliseconds) {
    const timeParts = adjustedBusinessHour.split(":");

    adjustedBusinessHour = timeParts[0] * (60000 * 60) + timeParts[1] * 60000;
  }

  return adjustedBusinessHour;
}

/**
 * Handle busy intervals.
 *
 * @param {object} value Busy interval.
 * @returns {object} Busy interval formatted for fullcalendar.
 */
export function handleBusyIntervals(value) {
  return {
    resourceId: value.resource,
    title: "Busy",
    start: value.startTime,
    end: value.endTime,
  };
}

/**
 * Handle resources.
 *
 * @param {object} value Resource.
 * @param {object} currentCalendarDate The current calendar date.
 * @returns {object} Resource formatted for fullcalendar.
 */
export function handleResources(value, currentCalendarDate) {
  if (value.location === "") {
    return false;
  }

  // TODO: Add business hours.
  const businessHoursArray = []; // eslint-disable-line no-param-reassign

  // reformatting openHours to fullcalendar-readable format
  value.openHours.forEach((v) => {
    const startTime = dayjs(v.open).format("HH:mm");
    const endTime = dayjs(v.close).format("HH:mm");

    const businessHours = {
      daysOfWeek: [v.weekday],
      startTime: businessHoursOrNearestFifteenMinutes(startTime, currentCalendarDate, false),
      endTime,
    };

    businessHoursArray.push(businessHours);
  });

  if (businessHoursArray.length > 0) {
    return {
      resourceId: value.id,
      id: value.resourceMail,
      title: value.resourceName,
      capacity: value.capacity,
      building: value.location,
      description: value.resourcedescription,
      image: "http://placekitten.com/1920/1080",
      facilities: value.facilities,
      businessHours: businessHoursArray,
    };
  }

  return {
    resourceId: value.id,
    id: value.resourceMail,
    title: value.resourceName,
    capacity: value.capacity,
    building: value.location,
    description: value.resourcedescription,
    image: "http://placekitten.com/1920/1080",
    facilities: value.facilities,
    businessHours: {
      startTime: businessHoursOrNearestFifteenMinutes("08:00", currentCalendarDate, false),
      endTime: "24:00",
    },
  };
}

/**
 * @param {object} locations Object of locations retrieved from the database
 * @returns {Array} Of placeholder resources based on locations
 */
export function setPlaceholderResources(locations) {
  const placeholderReources = [];

  if (locations.length !== 0) {
    locations.forEach((value, index) => {
      placeholderReources.push({
        id: index,
        building: value.name,
        title: "loading...",
      });
    });

    return placeholderReources;
  }

  return false;
}

/**
 * Pads the given number, until the length is 2. ex. 8 becomes 08
 *
 * @param {number} number Number to pad
 * @returns {string} Padded number
 */
function padTo2Digits(number) {
  return number.toString().padStart(2, "0");
}

/**
 * Converts milliseconds to formatted time (hh:mm)
 *
 * @param {number} milliseconds OpeningHours ms timestamp
 * @returns {string} Formatted time
 */
function convertMsToTime(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const minutesLeft = minutes % 60;

  return `${padTo2Digits(hours)}:${padTo2Digits(minutesLeft)}`;
}

/**
 * Updates the currently expanded placeholder locations, to prevent selection before now, if openinghour is lower than
 * now..
 *
 * @param {Array} resources Currently loaded resources
 * @param {object} calendarRef Reference to the calendar instance
 * @param {Date} date The current date of the calendar instance
 * @returns {boolean} False
 */
export function adjustAsyncResourcesBusinessHours(resources, calendarRef, date) {
  resources.forEach((resource) => {
    if (resource.title !== "loading...") {
      const resourceId = resource.id;

      // def index is variable
      const def = Object.keys(
        calendarRef.current._calendarApi.currentDataManager.data.resourceStore[resourceId].businessHours.defs
      )[0];

      let startTime;

      // Startime of the resource in ms. If the openingHours are already modified in this session, refer to internal object for original openingHours.
      if (resourceId in internalOpeningHours) {
        startTime = internalOpeningHours[resourceId];
      } else {
        startTime =
          calendarRef.current._calendarApi.currentDataManager.data.resourceStore[resourceId].businessHours.defs[def]
            .recurringDef.typeData.startTime.milliseconds;

        internalOpeningHours[resourceId] = startTime;
      }

      // Converts ms to formatted time
      startTime = convertMsToTime(startTime);

      const adjustedBusinessStartTime = businessHoursOrNearestFifteenMinutes(startTime, date, true);

      // Modifying the resource object to reflect the adjusted business start time
      // Disabling no-param-reassign because we are modifying the internal calendar data storage provided by FullCalendar
      /* eslint-disable no-param-reassign */
      calendarRef.current._calendarApi.currentDataManager.data.resourceStore[resourceId].businessHours.defs[
        def
      ].recurringDef.typeData.startTime.milliseconds = adjustedBusinessStartTime;
      /* eslint-enable no-param-reassign */
    }
  });

  return false;
}
