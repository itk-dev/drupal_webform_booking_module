import dayjs from "dayjs";
/**
 * Round to nearest 15 minutes.
 *
 * @param {object} date - Date object
 * @returns {object} - Date object representing the current datetime, rounded up
 *   to the next half an hour.
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
 * @param {object} currentCalendarDate Datetime object of the current
 *   Fullcalendar instance
 * @returns {string} : formatted date to represent the start of when the
 *   resource is available from, either direct resourcedata or the current time
 *   rounded up to the next half an hour, depending on which is largest.
 */
function businessHoursOrNearestHalfHour(
  businessStartHour,
  currentCalendarDate
) {
  let today = new Date();
  today = today.setHours(0, 0, 0, 0);
  const calendarDate = currentCalendarDate.setHours(0, 0, 0, 0);

  const currentClosestHalfAnHourFormatted = `${
    roundToNearest15(new Date()).getHours().toString().length === 1
      ? `0${roundToNearest15(new Date()).getHours()}`
      : roundToNearest15(new Date()).getHours()
  }:${
    roundToNearest15(new Date()).getMinutes().toString().length === 1
      ? `0${roundToNearest15(new Date()).getMinutes()}`
      : roundToNearest15(new Date()).getMinutes()
  }`;
  if (today !== calendarDate) {
    return businessStartHour;
  }
  if (currentClosestHalfAnHourFormatted > businessStartHour) {
    return currentClosestHalfAnHourFormatted;
  }
  return businessStartHour;
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
  // TODO: Add business hours.
  const businessHoursArray = []; // eslint-disable-line no-param-reassign
  // reformatting openHours to fullcalendar-readable format
  value.openHours.forEach((v) => {
    const startTime = dayjs(v.open).format("HH:mm");
    const endTime = dayjs(v.close).format("HH:mm");
    const businessHours = {
      daysOfWeek: [v.weekday],
      startTime: businessHoursOrNearestHalfHour(startTime, currentCalendarDate),
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
    businessHours: {
      startTime: "00:00",
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
    placeholderReources.push({
        id: 3,
        building: "tester medtoord",
        title: "loading...",
    });
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
