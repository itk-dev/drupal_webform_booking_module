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

/**
 * RemoveDuplicateEvents - Checks if any events stored in the internal storage of events loaded asynchronously are
 * dupliactes, and removes them.
 *
 * @param {object} internalAsyncEvents Object of all resource events gathered async
 * @returns {object} Object of all resource events gatered async, cleaned for duplicates
 */
export function removeDuplicateEvents(internalAsyncEvents) {
  internalAsyncEvents.forEach((event1, index1) => {
    const eventLeft = event1.resource + event1.startTime + event1.endTime;

    internalAsyncEvents.forEach((event2, index2) => {
      const eventRight = event2.resource + event2.startTime + event2.endTime;

      if (eventLeft === eventRight && index1 !== index2) {
        internalAsyncEvents.splice(index2, 1);
      }
    });
  });

  return internalAsyncEvents;
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



/** Graveyard for calendar resource placeholders functionality - Rest in peace */


  // const [asyncEvents, setAsyncEvents] = useState([]);
  // const [internalStyling, setInternalStyling] = useState([]);
  // const internalAsyncEvents = [];
  // const alreadyHandledResourceIds = [];

  // Fullcalendar params
  // resourcesInitiallyExpanded={expandResourcesByDefault}
  // initialResources={generateResourcePlaceholders()}
  // resourceGroupLabelDidMount={setPlaceholderClickEvent}

  // /**
  //  * GenerateResourcePlaceholders - generates an array of resources based on all locationnames
  //  *
  //  * @returns {Array} Of placeholder resources
  //  */
  //  const generateResourcePlaceholders = () => {
  //   if (locations !== null && locations.length !== 0 && typeof calendarRef !== "undefined") {
  //     const placeholderResources = setPlaceholderResources(locations);
  //     const placeholderResourcesArray = [];

  //     placeholderResources.forEach((value) => {
  //       placeholderResourcesArray.push({
  //         id: value.building,
  //         resourceId: value.id,
  //         building: value.building,
  //         title: value.title,
  //       });
  //     });

  //     return placeholderResourcesArray;
  //   }

  //   return false;
  // };

  // /**
  //  * Fetch resources for locations.
  //  *
  //  * @param {string} locationName Name of the expanded location
  //  */
  // function fetchResourcesOnLocation(locationName) {
  //   const location = locationName.replaceAll("___", " ");
  //   const searchParams = `location=${location}`;
  //   const expander = document.querySelector(`.fc-datagrid-cell#${locationName} .fc-icon-plus-square`);

  //   // Load resources for the clicked location
  //   Api.fetchResources(config.api_endpoint, searchParams).then((loadedResources) => {
  //     setTimeout(() => {
  //       loadedResources.forEach((resource) => {
  //         const mappedResource = handleResources(resource, date);

  //         calendarRef?.current?.getApi().addResource(mappedResource);
  //       });

  //       // As these resources are loaded async, we need to manually update their business hours.
  //       const currentlyLoadedResources = calendarRef?.current?.getApi().getResources();

  //       adjustAsyncResourcesBusinessHours(currentlyLoadedResources, calendarRef, date);

  //       // Load events for newly added resources, and finally expand location group.
  //       if (config && date !== null) {
  //         Api.fetchEvents(config.api_endpoint, loadedResources, dayjs(date).startOf("day"))
  //           .then((loadedEvents) => {
  //             setAsyncEvents(loadedEvents);

  //             if (expander) {
  //               expander.click();
  //             }
  //           })
  //           .catch(() => {
  //             // TODO: Display error and retry option for user. (v0.1)
  //           });
  //       }
  //     }, 1);
  //   });

  //   const internalStylingArray = internalStyling;

  //   internalStylingArray.push(
  //     `#react-booking-app .Calendar td.fc-resource[data-resource-id='${location}'] {display:none;}`
  //   );

  //   setInternalStyling(internalStylingArray);
  // }

  // /**
  //  * SetPlaceholderClickEvent - Sets click events for placeholder resources, to load real resources upon click
  //  *
  //  * @param {object} resource Object of the added resource
  //  * @returns {void} Nothing is returned
  //  */
  // const setPlaceholderClickEvent = (resource) => {
  //   if (
  //     resource.groupValue === "" ||
  //     alreadyHandledResourceIds.includes(resource.groupValue) ||
  //     resources ||
  //     validUrlParams !== null
  //   ) {
  //     return false;
  //   }

  //   let location = resource.groupValue;

  //   location = location.replaceAll(" ", "___");

  //   resource.el.setAttribute("id", location);
 
  //   document.querySelector(`#${location} .fc-icon-plus-square`).addEventListener(
  //     "click",
  //     (e) => {
  //       e.preventDefault();

  //       e.stopPropagation();

  //       if (e.target.classList.contains("loading")) {
  //         return false;
  //       }

  //       e.target.setAttribute("class", "fc-icon fc-icon-plus-square loading");

  //       fetchResourcesOnLocation(location);

  //       return undefined;
  //     },
  //     { once: true }
  //   );

  //   alreadyHandledResourceIds.push(location);

  //   return undefined;
  // };

  // useEffect(() => {
  //   // Called when events are loaded asynchronously and we need to set setEvents for FullCalendar

  //   if (validUrlParams === null) {
  //     // Only for step-1
  //     /* 
  //       asyncEvents only contains the events loaded for the resource expanded just now,
  //       therefore we loop events, which contains all already loaded events, to ensure that they are not lost.
  //       We add them to our object containing all the events we want to set.
  //     */
  //     events.forEach((event) => {
  //       internalAsyncEvents.push(event);
  //     });

  //     /*
  //       We loop our newly loaded events, and add them to the object aswell.
  //     */
  //     Object.values(asyncEvents).forEach((event) => {
  //       internalAsyncEvents.push(event);
  //     });

  //     /* 
  //       Now, internalAsyncEvents contains all previous loaded events, and our newly loaded events.
  //       Events persists through "view swaps", but the state of our placeholders does not, which means that our placeholders reset after a viewswap, but events does not,
  //       causing the same event to be added multiple times, if a placeholder is expanded, the view is swapped to "list" and back to "calendar" and the same placeholder is expanded once again.
  //       Therefore, duplicates are removed via this method below
  //     */
  //     const eventObj = removeDuplicateEvents(internalAsyncEvents);

  //     // The events are finally set, which triggers them to be rendered in fullcalendar.
  //     setEvents(eventObj);
  //   }
  // }, [asyncEvents]);

    // Expands location groups if locations are selected
    // useEffect(() => {
    //   setTimeout(() => {
    //     if (locationFilter.length !== 0) {
    //       setExpandResourcesByDefault(true);
    //     } else {
    //       setExpandResourcesByDefault(false);
    //     }
    //   }, 800);
    // }, [locationFilter, asyncEvents]);



    // HTML   
    // <style>{internalStyling}</style>