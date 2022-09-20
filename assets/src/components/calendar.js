import React, { useEffect, useRef, useState } from "react";
// FullCalendar must be imported before FullCalendar plugins
import ReactDOMServer from "react-dom/server";
import FullCalendar, { renderMicroColGroup } from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import daLocale from "@fullcalendar/core/locales/da";
import resourceTimegrid from "@fullcalendar/resource-timegrid";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import * as PropTypes from "prop-types";
import CalendarHeader from "./calendar-header";
import { handleBusyIntervals, handleResources, setPlaceholderResources } from "../util/calendar-utils";
import CalendarCellInfoButton from "./calendar-cell-info-button";
import CalendarSelectionBox from "./calendar-selection-box";
import { ReactComponent as IconChair } from "../assets/chair.svg";
import Api from "../util/api";
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
 * @param {object} props.urlResource The resource object loaded from URL id.
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
  urlResource,
  setDisplayState,
  locationFilter,
  resourceFilter,
  locations
}) {
  const calendarRef = useRef();
  const dateNow = new Date();
  const internalStyling = document.createElement('style');
  document.body.appendChild(internalStyling);
  const [internalSelection, setInternalSelection] = useState();
  const [calendarSelectionResourceTitle, setCalendarSelectionResourceTitle] = useState();
  const onCalendarSelection = (selection) => {
    const newSelection = {
      allDay: selection.allDay,
      resourceId: urlResource
        ? urlResource.resourceMail
        : selection.resource.id,
      end: selection.end,
      start: selection.start,
    };
   

    const serialized = JSON.stringify(newSelection);
    setInternalSelection(serialized);
    setCalendarSelection(newSelection);

    if (selection.resource) {
      setCalendarSelectionResourceTitle(selection.resource.title);
    } else if (urlResource) {
      setCalendarSelectionResourceTitle(urlResource.resourceName);
    }
  };

  function fetchResourcesOnLocation(locationName) {
    let searchParams = "location=" + locationName;
    Api.fetchResources(config.api_endpoint, searchParams)
      .then((loadedResources) => {
          setTimeout(function() {
            loadedResources.forEach((resource) => {
              let mappedResource = handleResources(resource, date);
              calendarRef?.current?.getApi().addResource(mappedResource);
              let expander = document.querySelector(".fc-datagrid-cell#"+locationName+" .fc-icon-plus-square");
              if (expander) {
                expander.click();
              }
              internalStyling.innerHTML += "td.fc-resource[data-resource-id='"+locationName+"'] {display:none;}";
          });
        }, 1)
      })
    return false;
  }
  const getScrollTime = () => { 
    const dateTimeNow = new Date();
    dateTimeNow.setHours(dateTimeNow.getHours() - 2);
    const scrollTimeString = `${dateTimeNow.getHours()}:00:00`;
    return scrollTimeString;
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
    if (highlightElement !== null) {
      setTimeout(() => {
        const calendarSelectionBox = ReactDOMServer.renderToString(
          <CalendarSelectionBox
            calendarSelection={calendarSelection}
            calendarSelectionResourceTitle={calendarSelectionResourceTitle}
          />
        );
        document.querySelector("div.fc-highlight").innerHTML =
          calendarSelectionBox;
        document
          .getElementById("calendar-selection-choice-confirm")
          .addEventListener("mousedown", (e) => {
            e.stopPropagation();
            switch (config.step_one) {
              case true:
                const paramsObj = {
                  from: calendarSelection.start.toISOString(),
                  to: calendarSelection.end.toISOString(),
                  resource: calendarSelection.resourceId ?? undefined,
                };
                if (
                  paramsObj.from === undefined ||
                  paramsObj.to === undefined ||
                  paramsObj.resource === undefined
                ) {
                  window.open(config.redirect_url, "_self");
                } else {
                  const paramsStr = new URLSearchParams(paramsObj).toString();
                  window.open(`${config.redirect_url}?${paramsStr}`, "_self");
                }
                break;
              case false:
                setDisplayState("minimized");
                break;
            }
            return false;
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
            setCalendarSelection({});
          });
      }, 1);
    }
  }, [calendarSelection, events]);

  const renderCalendarCellInfoButton = (title, id, triggerResourceViewEv) => {
    return (
      <CalendarCellInfoButton
        title={title}
        showResourceViewId={id}
        onClickEvent={triggerResourceViewEv}
      />
    );
  };
  
  const generateResourcePlaceholders = () => {
        if (locationFilter.length === 0 && resourceFilter.length === 0 && locations !== null && locations.length !== 0 && typeof calendarRef != "undefined") {
      let placeholderResources = setPlaceholderResources(locationFilter, resourceFilter, locations, calendarRef);
      let placeholderResourcesArray= [];
      placeholderResources.forEach((value) => {
        placeholderResourcesArray.push(
          {
            id: value.building,
            resourceId: value.id,
            building: value.building,
            title: value.title
          }
        );
      })
      return placeholderResourcesArray;
    }
  }

  return (
    <div className="Calendar no-gutter col-md-12">
      <CalendarHeader config={config} date={date} setDate={setDate} />
      <div className="row">
        <div className="col-md-12">
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
            scrollTime={getScrollTime()}
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
            resourceGroupLabelDidMount={
              (info) => {
                  info.el.setAttribute("id", info.groupValue);
                  document.getElementById(info.groupValue).addEventListener("click", function (e) {
                  e.preventDefault();
                  e.stopPropagation();
                  let locationName = info.groupValue;
                  fetchResourcesOnLocation(locationName);
                }, {once:true});
              }
            }
            initialResources={generateResourcePlaceholders()}
            nowIndicator
            navLinks
            slotDuration="00:15:00"
            allDaySlot={false}
            resourcesInitiallyExpanded={false}
            selectable
            unselectAuto={false}
            schedulerLicenseKey={config.license_key}
            slotMinTime="06:00:00"
            slotMaxTime="24:00:00"
            selectOverlap={false}
            nextDayThreshold="21:00:00"
            editable={false}
            dayMaxEvents
            locale={daLocale}
            select={onCalendarSelection}
            {...(resources && { resources: resources.map((value) => handleResources(value, date)) })}            
            validRange={getValidRange}
            resourceOrder="resourceId"
            resourceGroupField="building"
            resourceAreaColumns={[
              {
                headerContent: "Ressourcer",
                cellContent(arg) {
                  return renderCalendarCellInfoButton(
                    arg.resource.title,
                    arg.resource.extendedProps.resourceId,
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
            events={events && events.map((value) => handleBusyIntervals(value))}
          />
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
  calendarSelection: PropTypes.shape({
    resource: PropTypes.shape({
      _resource: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    start: PropTypes.shape({
      toISOString: PropTypes.func.isRequired,
    }).isRequired,
    end: PropTypes.shape({
      toISOString: PropTypes.func.isRequired,
    }).isRequired,
    resourceId: PropTypes.string.isRequired,
  }),
  setCalendarSelection: PropTypes.func.isRequired,
  setShowResourceViewId: PropTypes.func.isRequired,
  config: PropTypes.shape({
    license_key: PropTypes.string.isRequired,
    redirect_url: PropTypes.string.isRequired,
  }).isRequired,
  urlResource: PropTypes.shape({
    resourceMail: PropTypes.string.isRequired,
    resourceName: PropTypes.string.isRequired,
  }),
  setDisplayState: PropTypes.string.isRequired
};

Calendar.defaultProps = {
  calendarSelection: null,
  urlResource: null,
};

export default Calendar;
