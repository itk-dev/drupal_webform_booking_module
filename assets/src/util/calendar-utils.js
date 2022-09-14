/**
 * Handle busy intervals.
 *
 * @param {object} value Busy interval.
 * @returns {object} Busy interval formatted for fullcalendar.
 */
export function handleBusyIntervals(value) {
  return {
    groupId: 0,
    title: "Busy",
    start: value.startTime,
    end: value.endTime,
    resourceId: value.resource,
  };
}

/**
 * Handle resources.
 *
 * @param {object} value Resource.
 * @returns {object} : Resource formatted for fullcalendar.
 */
export function handleResources(value, calendarRef) {
  // TODO: Add business hours.
  let currentCalendarDate = calendarRef.current.getApi().getDate();
  return {
    id: value.id,
    title: value.resourceName,
    capacity: value.capacity,
    building: value.location,
    description: value.resourcedescription,
    image: "http://placekitten.com/1920/1080",
    businessHours: {
      startTime: businessHoursOrNearestHalfHour("8", currentCalendarDate),
      endTime: "19:00"
    },
  };
}


/**
 * Round business hours to nearest half hour.
 *
 * @param {number} businessStartHour - The hour the resource is available from
 * @returns {string} : formatted date to represent the start of when the
 *   resource is available from, either direct resourcedata or the current time
 *   rounded up to the next half an hour, depending on which is largest.
 */
function businessHoursOrNearestHalfHour(businessStartHour, currentCalendarDate) {
  let today = new Date();
  today = today.setHours(0, 0, 0, 0);
  const calendarDate = currentCalendarDate.setHours(0, 0, 0, 0);

  const businessStartHourFormatted =
    businessStartHour.toString().length === 1
      ? `0${businessStartHour}:00`
      : `${businessStartHour}:00`;
  const currentClosestHalfAnHourFormatted = `${roundToNearest15(new Date()).getHours().toString().length === 1
      ? `0${roundToNearest15(new Date()).getHours()}`
      : roundToNearest15(new Date()).getHours()
    }:${roundToNearest15(new Date()).getMinutes().toString().length === 1
      ? `0${roundToNearest15(new Date()).getMinutes()}`
      : roundToNearest15(new Date()).getMinutes()
    }`;
  if (today !== calendarDate) {
    return businessStartHourFormatted;
  }
  if (currentClosestHalfAnHourFormatted > businessStartHourFormatted) {
    return currentClosestHalfAnHourFormatted;
  }
  return businessStartHourFormatted;
}

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

