import dayjs from "dayjs";

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
    return {};
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
 * GetScrollTime gets the time to horizontally scroll the calendar to on load
 *
 * @returns {string} A formatted string, containing the time to scroll to, format "xx:00:00"
 */
export function getScrollTime() {
  // Calculates the time the calender should scroll to horizontally when the calendar loads (now - 2 hours)
  const dateTimeNow = new Date();

  dateTimeNow.setHours(dateTimeNow.getHours() - 2);

  return `${dateTimeNow.getHours()}:00:00`;
}
