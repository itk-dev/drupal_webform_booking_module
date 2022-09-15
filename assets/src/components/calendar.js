import React, { useEffect, useRef, useState } from "react";
// FullCalendar must be imported before FullCalendar plugins
import ReactDOMServer from "react-dom/server";
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
import CalendarSelectionBox from "./calendar-selection-box";
import { ReactComponent as IconChair } from "../assets/chair.svg";
import "./calendar.scss";

/**
 * Calendar component.
 *
 * @param {object} props Props.
 * @param {Array} props.resources Resources to show calendar for.
 * @param {Array} props.events Events to show in calendar.
 * @param {Date} props.date Date to show calendar for.
 * @param {Function} props.setDate Set date function.
 * @param {object} props.calendarSelection The current calendar selection.
 * @param {Function} props.setCalendarSelection Set calendar selection function.
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
  setCalendarSelection,
  config,
  setShowResourceViewId,
}) {
  const calendarRef = useRef();
  const dateNow = new Date();
  const [internalSelection, setInternalSelection] = useState();

  const onCalendarSelection = (selection) => {

    const newSelection = {
      resource: selection.resource,
      allDay: selection.allDay,
      end: selection.end,
      resourceId: selection.resource.id,
      start: selection.start,
    };

    const serialized = JSON.stringify(newSelection);
    setInternalSelection(serialized);
    setCalendarSelection(newSelection);
  };

  const getValidRange = () => {
    return { start: dateNow };
  };

  // Set calendar selection.
  useEffect(() => {
    if (calendarSelection) {
      calendarRef?.current?.getApi().select(calendarSelection);
    }
  }, [internalSelection]);

  // Go to calendar date when date changes.
  useEffect(() => {
    if (calendarSelection) {
      calendarRef?.current?.getApi().gotoDate(date);
      calendarRef?.current?.getApi().select(calendarSelection);
    }
  }, [date]);

  /** @param {string} showResourceViewId Id of the resource to load */
  const triggerResourceView = (showResourceViewId) => {
    setShowResourceViewId(showResourceViewId);
  };

  useEffect(() => {
    const highlightElement = document.querySelector("div.fc-highlight");
    console.log(highlightElement);
    if (highlightElement !== null) {
      setTimeout(() => {
        const calendarSelectionBox = ReactDOMServer.renderToString(
          <CalendarSelectionBox calendarSelection={calendarSelection} />
        );
        document.querySelector("div.fc-highlight").innerHTML =
          calendarSelectionBox;
        document
          .getElementById("calendar-selection-choice-confirm")
          .addEventListener("mousedown", (e) => {
            e.stopPropagation();
          });
        document
          .getElementById("calendar-selection-container")
          .addEventListener("mousedown", (e) => {
            e.stopPropagation();
          });
        document
          .getElementById("calendar-selection-close")
          .addEventListener("mousedown", (e) => {
            e.stopPropagation();
            calendarRef.current.getApi().unselect();
          });
      }, 1);
    }
  }, [calendarSelection]);

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
              displayEventTime
              scrollTimeReset={false}
              slotLabelFormat={{
                hour: "numeric",
                omitZeroMinute: false,
              }}
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
              resources={resources.map((value) =>
                handleResources(value, calendarRef)
              )}
              resourceGroupField="building"
              resourceAreaColumns={[
                {
                  headerContent: "Ressourcer",
                  cellContent(arg) {
                    return renderCalendarCellInfoButton(
                      arg.resource.title,
                      // eslint-disable-next-line no-underscore-dangle
                      arg.resource._resource.extendedProps.resourceId,
                      triggerResourceView
                    );
                  },
                },
                {
                  headerContent: <IconChair />,
                  headerClassNames: "resource-calendar-capacity-header",
                  width: "60px",
                  cellClassNames: "resource-calendar-capacity-value",
                  cellContent(arg) {
                    return arg.resource.extendedProps.capacity;
                  },
                },
              ]}
              events={events.map((value) => handleBusyIntervals(value))}
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
  calendarSelection: PropTypes.shape({}),
  setCalendarSelection: PropTypes.func.isRequired,
  config: PropTypes.shape({
    license_key: PropTypes.string.isRequired,
  }).isRequired,
  setShowResourceViewId: PropTypes.func.isRequired,
};

Calendar.defaultProps = {
  calendarSelection: null,
};

export default Calendar;
