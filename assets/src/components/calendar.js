import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import daLocale from "@fullcalendar/core/locales/da";
import resourceTimegrid from "@fullcalendar/resource-timegrid";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import * as PropTypes from "prop-types";

/**
 * @param {object} props Props.
 * @param {Array} props.resources List of resources.
 * @param {Array} props.events List of events for the given resources and date.
 * @returns {string} Calendar component.
 * @see https://fullcalendar.io/docs/react#calendar-api
 */
function Calendar({ resources, events }) {
  //

  // calendarRef required for navigation.
  const calendarRef = React.createRef();

  const dateNow = new Date();
  const [dateDisplayed, setDateDisplayed] = useState(dateNow);

  /* @todo set default date selection. */
  const setDate = (info) => {
    // console.log(info);
  };

  /* @todo handle date selection. */
  const handleDateSelect = (selectionInfo) => {
    // console.log(selectionInfo);
  };

  /*  */
  const getValidRange = () => {
    return { start: dateNow };
  };

  /**
   * Prepare json data source for display.
   *
   * @param data {object} A data source.
   */
  const handleData = (data) => {
    const dataFormatted = [];
    switch (data["@id"]) {
      case "/v1/busy-intervals":
        dataFormatted.data = data["hydra:member"].map(handleBusyIntervals);
        break;
      case "/v1/resources":
        dataFormatted.data = data["hydra:member"].map(handleResources);
        break;
      default:
    }
    return dataFormatted.data;
  };

  return (
    <div className="Calendar">
      <FullCalendar
        plugins={[
          resourceTimegrid,
          interactionPlugin,
          dayGridPlugin,
          timeGridPlugin,
          listPlugin,
          resourceTimelinePlugin,
        ]}
        titleFormat={{
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          weekday: "long",
        }}
        customButtons={{
          prev: {
            text: "Prev",
            click() {
              // window.calendar.prev();
              // window.calendar.refetchResources();
            },
          },
          next: {
            text: "Next",
            click() {
              // window.calendar.next();
              // window.calendar.refetchResources();
            },
          },
        }}
        height="850px"
        selectMirror
        /* scrollTime=@todo */
        initialView="resourceTimelineDay"
        duration="days: 3"
        initialDate={dateDisplayed}
        /* selectConstraint="businessHours" */
        nowIndicator
        navLinks
        slotDuration="00:15:00"
        selectable
        unselectAuto={false}
        schedulerLicenseKey="0245891543-fcs-1654684785"
        slotMinTime="07:00:00"
        slotMaxTime="21:00:00"
        slotLabelFormat={{ hour: "2-digit", minute: "2-digit" }}
        selectOverlap={false}
        nextDayThreshold="21:00:00"
        editable={false}
        dayMaxEvents
        locale={daLocale}
        select={handleDateSelect}
        validRange={getValidRange}
        datesSet={setDate}
        loading={false}
        resources={resources.map(handleResources)}
        events={events.map(handleBusyIntervals)}
      />
    </div>
  );
}

Calendar.propTypes = {
  // TODO: Fix prop types for resources and events.
  resources: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  events: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default Calendar;

/**
 * Handle busy intervals.
 *
 * @param {object} value : A single busy interval.
 * @returns {{ object }} : A usable format for a fullcalendar event.
 */
function handleBusyIntervals(value) {
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
 * @param {object} value : A single resource.
 * @returns {{ object }} : A usable format for a fullcalendar resource.
 */
function handleResources(value) {
  const businessStartHour = Math.floor(Math.random() * (12 - 2 + 1) + 2);
  return {
    id: value.resourcemail,
    title: value.resourcename,
    capacity: value.capacity,
    building: value.location,
    description: value.resourcedescription,
    image:
      "data:image/png;base64,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",
    /*
    businessHours: {
      startTime: businessHoursOrNearestHalfHour(businessStartHour),
      // startTime: businessStartHour,
      endTime: `${Math.floor(Math.random() * (22 - 16 + 1) + 16)}:00`,
    },
     */
  };
}
