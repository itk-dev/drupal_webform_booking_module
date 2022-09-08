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
import CalendarCellInfoButton from "./calendar-cell-info-button";

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
 * @param {Function} props.setShowResourceView Set to show resource view
 * @param {Function} props.setResourceId Set resource id to load
 * @returns {string} Calendar component.
 */
function Calendar({
  resources,
  events,
  date,
  setDate,
  calendarSelection,
  onCalendarSelection,
  config,
  showResourceViewId,
  setShowResourceViewId
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

  /** @param {string} showResourceViewId Id of the resource to load */
  function triggerResourceView(showResourceViewId) {
    setShowResourceViewId(showResourceViewId);
  }

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
            resourceAreaColumns={[
              {
                headerContent: "Ressource titel",
                cellContent(arg) {
                  return (
                    <CalendarCellInfoButton
                      title={arg.resource.title}
                      resourceId={arg.resource.id}
                      onClickEvent={triggerResourceView}
                    />
                  );
                },
              },
              {
                headerContent: {
                  html: '<div class="resource-calendar-capacity"><img src="/assets/images/icons/Chair.svg" /></div>',
                },
                width: "60px",
                cellContent(arg) {
                  return arg.resource.extendedProps.capacity;
                },
              },
            ]}
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
  showResourceViewId: PropTypes.string.isRequired,
  setShowResourceViewId: PropTypes.func.isRequired
};

export default Calendar;
