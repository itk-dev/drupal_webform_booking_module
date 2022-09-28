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
import dayjs from "dayjs";
import CalendarHeader from "./calendar-header";
import {
  handleBusyIntervals,
  handleResources,
  setPlaceholderResources,
  adjustAsyncResourcesBusinessHours,
} from "../util/calendar-utils";
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
 * @param {string} props.setDisplayState State of the calendar - minimized or
 *   maximized
 * @param {object} props.locations Object containing available locations
 * @param {Function} props.setEvents Set calendar events
 * @param {object} props.validUrlParams Validated url parameters from step1
 * @param {object} props.locationFilter Object containing selected filtered
 *   locations
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
  locations,
  setEvents,
  validUrlParams,
  locationFilter,
}) {
  const calendarRef = useRef();
  const dateNow = new Date();
  const internalStyling = document.createElement("style");
  document.body.appendChild(internalStyling);
  const [internalSelection, setInternalSelection] = useState();
  const [calendarSelectionResourceTitle, setCalendarSelectionResourceTitle] =
    useState();
  const [calendarSelectionResourceId, setCalendarSelectionResourceId] =
    useState();
  const [asyncEvents, setAsyncEvents] = useState();
  const internalAsyncEvents = [];
  const alreadyHandledResourceIds = [];
  const onCalendarSelection = (selection) => {
    if (selection.start < dateNow) {
      return false;
    }
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
    if (
      typeof selection.resource !== "undefined" &&
      selection.resource !== null
    ) {
      setCalendarSelectionResourceId(
        selection.resource.extendedProps.resourceId
      );
    }
    setCalendarSelection(newSelection);

    if (selection.resource) {
      setCalendarSelectionResourceTitle(selection.resource.title);
    } else if (urlResource) {
      setCalendarSelectionResourceTitle(urlResource.resourceName);
    }
    return false;
  };

  /** @param {string} locationName Name of the expanded location */
  function fetchResourcesOnLocation(locationName) {
    let location = locationName;
    if (location.trim().indexOf("___") !== -1) {
      // locationName contains space and has been glued. Now unglue.
      const ungluedLocationName = location.replace("___", " ");
      location = ungluedLocationName;
    }
    const searchParams = `location=${location}`;
    const expander = document.querySelector(
      `.fc-datagrid-cell#${location} .fc-icon-plus-square`
    );
    // Load resources for the clicked location
    Api.fetchResources(config.api_endpoint, searchParams).then(
      (loadedResources) => {
        setTimeout(() => {
          loadedResources.forEach((resource) => {
            const mappedResource = handleResources(resource, date);
            calendarRef?.current?.getApi().addResource(mappedResource);
            internalStyling.innerHTML += `td.fc-resource[data-resource-id='${location}'] {display:none;}`;
          });

          // As these resources are loaded async, we need to manually update their business hours.
          const currentlyLoadedResources = calendarRef?.current
            ?.getApi()
            .getResources();
          adjustAsyncResourcesBusinessHours(
            currentlyLoadedResources,
            calendarRef,
            date
          );

          // Load events for newly added resources, and finally expand location group.
          if (config && date !== null) {
            Api.fetchEvents(
              config.api_endpoint,
              loadedResources,
              dayjs(date).startOf("day")
            )
              .then((loadedEvents) => {
                setAsyncEvents(loadedEvents);
                if (expander) {
                  expander.click();
                }
              })
              .catch(() => {
                // TODO: Display error and retry option for user. (v0.1)
              });
          }
        }, 1);
      }
    );
  }
  useEffect(() => {
    setTimeout(() => {
      if (locationFilter.length !== 0) {
        calendarRef.current._calendarApi.setOption(
          /* eslint no-underscore-dangle: 0 */
          "resourcesInitiallyExpanded",
          "true"
        );
      }
    }, 800);
  }, [locationFilter]);
  useEffect(() => {
    if (!validUrlParams) {
      let ascev = asyncEvents;
      if (typeof asyncEvents === "undefined") {
        ascev = [];
      }
      events.forEach((ev) => {
        internalAsyncEvents.push(ev);
      });
      ascev.forEach((asev) => {
        internalAsyncEvents.push(asev);
      });
      setEvents(internalAsyncEvents);
    }
  }, [asyncEvents]);

  useEffect(() => {
    if (validUrlParams !== null) {
      calendarRef.current._calendarApi.setOption(
        /* eslint no-underscore-dangle: 0 */
        "resourcesInitiallyExpanded",
        "true"
      );
    }
  }, [validUrlParams]);

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
    if (calendarRef) {
      const currentlyLoadedResources = calendarRef?.current
        ?.getApi()
        .getResources();
      adjustAsyncResourcesBusinessHours(
        currentlyLoadedResources,
        calendarRef,
        date
      );
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
            calendarSelectionResourceId={calendarSelectionResourceId}
          />
        );
        document.querySelector("div.fc-highlight").innerHTML =
          calendarSelectionBox;
        document
          .getElementById("calendar-selection-choice-confirm")
          .addEventListener("mousedown", (e) => {
            e.stopPropagation();
            const resourceId = e.target.getAttribute("data-resource-id");
            const paramsObj = {
              from: calendarSelection.start.toISOString(),
              to: calendarSelection.end.toISOString(),
              resourceMail: calendarSelection.resourceId ?? undefined,
              resource: resourceId,
            };
            switch (config.step_one) {
              case true:
                if (
                  paramsObj.from === undefined ||
                  paramsObj.to === undefined ||
                  paramsObj.resourceMail === undefined ||
                  paramsObj.resource === undefined
                ) {
                  window.open(config.redirect_url, "_self");
                } else {
                  const paramsStr = new URLSearchParams(paramsObj).toString();
                  window.open(`${config.redirect_url}?${paramsStr}`, "_self");
                }
                break;
              case false:
              default:
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
    if (
      locations !== null &&
      locations.length !== 0 &&
      typeof calendarRef !== "undefined"
    ) {
      const placeholderResources = setPlaceholderResources(locations);
      const placeholderResourcesArray = [];
      placeholderResources.forEach((value) => {
        placeholderResourcesArray.push({
          id: value.building,
          resourceId: value.id,
          building: value.building,
          title: value.title,
        });
      });
      return placeholderResourcesArray;
    }
    return false;
  };
  const handleAddedResource = (info) => {
    if (
      info.groupValue === "" ||
      alreadyHandledResourceIds.includes(info.groupValue) ||
      resources ||
      validUrlParams !== null
    ) {
      return false;
    }
    let location = info.groupValue;
    if (location.trim().indexOf(" ") !== -1) {
      const gluedGroupValue = location.replace(" ", "___");
      location = gluedGroupValue;
    }
    info.el.setAttribute("id", location);
    document
      .querySelector(`#${location} .fc-icon-plus-square`)
      .addEventListener(
        "click",
        (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (e.target.classList.contains("loading")) {
            return false;
          }
          e.target.setAttribute("class", "fc-icon fc-icon-plus-square loading");
          const locationName = location;
          fetchResourcesOnLocation(locationName);
          return false;
        },
        { once: true }
      );
    alreadyHandledResourceIds.push(location);
    return false;
  };

  useEffect(() => {
        console.log(resources);
  }, [resources]);

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
            resourceGroupLabelDidMount={handleAddedResource}
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
            /* eslint-disable react/jsx-props-no-spreading */
            {...(resources && {
              resources: resources.map((value) => handleResources(value, date)),
            })}
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
    api_endpoint: PropTypes.string.isRequired,
    step_one: PropTypes.bool.isRequired,
  }).isRequired,
  urlResource: PropTypes.shape({
    resourceMail: PropTypes.string.isRequired,
    resourceName: PropTypes.string.isRequired,
  }),
  setDisplayState: PropTypes.string.isRequired,
  locations: PropTypes.shape({
    length: PropTypes.number.isRequired,
  }).isRequired,
  setEvents: PropTypes.func.isRequired,
  validUrlParams: PropTypes.shape({}).isRequired,
  locationFilter: PropTypes.shape({
    length: PropTypes.number.isRequired,
  }).isRequired,
};

Calendar.defaultProps = {
  calendarSelection: null,
  urlResource: null,
};

export default Calendar;
