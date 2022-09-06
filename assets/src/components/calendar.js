import React, { useEffect, useRef } from "react";
// FullCalendar must be imported before FullCalendar plugins
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import daLocale from "@fullcalendar/core/locales/da";
import resourceTimegrid from "@fullcalendar/resource-timegrid";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import * as PropTypes from "prop-types";
import CalendarHeader from "./calendar-header";
import { handleBusyIntervals, handleResources } from "../util/calendar-utils";

/**
 * Calendar component.
 *
 * @param {object} props Props.
 * @param {Array} props.resources Resources to show calendar for.
 * @param {Array} props.events Events to show in calendar.
 * @param {Date} props.date Date to show calendar for.
 * @param {Function} props.setDate Set date function.
 * @param {Function} props.onCalendarSelection Set calendar selection function.
 * @param {object} props.config Config for the app.
 * @returns {string} Calendar component.
 */
function Calendar({
  resources,
  events,
  date,
  setDate,
  onCalendarSelection,
  config,
}) {
  const calendarRef = useRef();
  const dateNow = new Date();

  const getValidRange = () => {
    return { start: dateNow };
  };

  // Go to calendar date when date changes.
  useEffect(() => {
    calendarRef?.current?.getApi().gotoDate(date);
  }, [date]);

  return (
    <div className="Calendar">
      <CalendarHeader config={config} date={date} setDate={setDate} />
      <div className="col-md-12">
        {
          <FullCalendar
            ref={calendarRef}
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
              month: "long",
              day: "numeric",
            }}
            headerToolbar=""
            height="850px"
            /* scrollTime=@todo */
            initialView="resourceTimelineDay"
            duration="days: 3"
            /* selectConstraint="businessHours" */
            selectMirror
            nowIndicator
            navLinks
            slotDuration="00:15:00"
            selectable
            unselectAuto={false}
            schedulerLicenseKey={config.license_key}
            slotMinTime="07:00:00"
            slotMaxTime="21:00:00"
            slotLabelFormat={{ hour: "2-digit", minute: "2-digit" }}
            selectOverlap={false}
            nextDayThreshold="21:00:00"
            editable={false}
            dayMaxEvents
            locale={daLocale}
            select={onCalendarSelection}
            validRange={getValidRange}
            loading={false}
            resources={resources.map(handleResources)}
            events={events.map(handleBusyIntervals)}
          />
        }
      </div>
    </div>
  );
}

Calendar.propTypes = {
  resources: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  events: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  date: PropTypes.shape({}).isRequired,
  setDate: PropTypes.func.isRequired,
  onCalendarSelection: PropTypes.func.isRequired,
  config: PropTypes.shape({
    license_key: PropTypes.string.isRequired,
  }).isRequired,
};

export default Calendar;
