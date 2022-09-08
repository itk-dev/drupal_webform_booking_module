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
export function handleResources(value) {
  // TODO: Add business hours.
  // const businessStartHour = Math.floor(Math.random() * (12 - 2 + 1) + 2);
  return {
    id: value.id,
    title: value.resourcename,
    capacity: value.capacity,
    building: value.location,
    description: value.resourcedescription,
    image: "http://placekitten.com/1920/1080",
    /*
    businessHours: {
      startTime: businessHoursOrNearestHalfHour(businessStartHour),
      // startTime: businessStartHour,
      endTime: `${Math.floor(Math.random() * (22 - 16 + 1) + 16)}:00`,
    },
     */
  };
}
