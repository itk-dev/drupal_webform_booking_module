import React, { useEffect, useRef } from "react";
// FullCalendar must be imported before FullCalendar plugins
import ReactDOMServer from 'react-dom/server'
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
import { handleBusyIntervals, handleResources, getSpecifiedBusinessHours } from "../util/calendar-utils";
import CalendarCellInfoButton from "./calendar-cell-info-button";
import CalendarSelectionBox from "./calendar-selection-box";
import "./calendar.scss";

/**
 * Calendar component.
 *
 * @param {object} props Props.
 * @param {Array} props.resources Resources to show calendar for.
 * @param {Array} props.events Events to show in calendar.
 * @param {Date} props.date Date to show calendar for.
 * @param {Function} props.setDate Set date function.
 * @param {Function} props.calendarSelection Calendar selection function.
 * @param {Function} props.onCalendarSelection Set calendar selection function.
 * @param {object} props.config Config for the app.
 * @param {Function} props.setShowResourceViewId Setter for showResourceViewId
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
  setShowResourceViewId,
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
  const triggerResourceView = (showResourceViewId) => {
    setShowResourceViewId(showResourceViewId);
  };

  useEffect(() => {
    let highlight_element = document.querySelector('div.fc-highlight');
    if (highlight_element !== null) {
      setTimeout(function () {
        let calendarSelectionBox = ReactDOMServer.renderToString(<CalendarSelectionBox calendarSelection={calendarSelection} />);
        document.querySelector('div.fc-highlight').innerHTML = calendarSelectionBox;
        document.getElementById("calendar-selection-choice-confirm").addEventListener("mousedown", function(e) {
          e.stopPropagation();
        });
        document.getElementById("calendar-selection-container").addEventListener("mousedown", function(e) {
          e.stopPropagation();
        });
        document.getElementById("calendar-selection-close").addEventListener("mousedown", function(e) {
          e.stopPropagation();
          calendarRef.current.getApi().unselect();
        });
      }, 1)
    }
  }, [calendarSelection])

  const renderCalendarCellInfoButton = (title, id, triggerResourceViewEv) => {
    return (
      <CalendarCellInfoButton
        title={title}
        showResourceViewId={id}
        onClickEvent={triggerResourceViewEv}
      />
    );
  };

  return (
    <div className="Calendar no-gutter col-md-12">
      <CalendarHeader config={config} date={date} setDate={setDate} />
      <div className="row">
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
              height="650px"
              /* scrollTime=@todo */
              initialView="resourceTimelineDay"
              duration="days: 3"
              selectConstraint="businessHours"
              selectMirror
              displayEventTime={true}
              slotLabelFormat={
                {
                  hour: "numeric",
                  omitZeroMinute: false
                }
              }
              nowIndicator
              navLinks
              slotDuration="00:15:00"
              allDaySlot={false}
              selectable
              unselectAuto={false}
              schedulerLicenseKey={config.license_key}
              slotMinTime="07:00:00"
              slotMaxTime="21:00:00"
              selectOverlap={false}
              nextDayThreshold="21:00:00"
              editable={false}
              dayMaxEvents
              locale={daLocale}
              select={onCalendarSelection}
              validRange={getValidRange}
              loading={false}
              resources={resources.map((value) => handleResources(value, calendarRef))}
              resourceGroupField={"building"}
              resourceAreaColumns={[
                {
                  headerContent: "Ressourcer",
                  cellContent(arg) {
                    return renderCalendarCellInfoButton(
                      arg.resource.title,
                      arg.resource.id,
                      triggerResourceView
                    );
                  },
                },
                {
                  headerContent: {
                    html: '<img src="/assets/images/icons/Chair.svg" />',
                  },
                  headerClassNames: "resource-calendar-capacity-header",
                  width: "60px",
                  cellClassNames: "resource-calendar-capacity-value",
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
    </div>
  );
}
Calendar.propTypes = {
  resources: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  events: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  date: PropTypes.shape({}).isRequired,
  setDate: PropTypes.func.isRequired,
  calendarSelection: PropTypes.object.isRequired,
  onCalendarSelection: PropTypes.func.isRequired,
  config: PropTypes.shape({
    license_key: PropTypes.string.isRequired,
  }).isRequired,
  setShowResourceViewId: PropTypes.func.isRequired,
};

export default Calendar;
