import React, { useEffect, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { toast } from "react-toastify";
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
import dayjs from "dayjs";
import { handleBusyIntervals, handleResources, getScrollTime } from "../util/calendar-utils";
import CalendarCellInfoButton from "./calendar-cell-info-button";
import CalendarSelectionBox from "./calendar-selection-box";
import { removeEmptyAriaLabelled, tabindexCalendar } from "../util/dom-manipulation-utils";
import NoResultOverlay from "./no-result-overlay";
import Api from "../util/api";
import CalendarHeader from "./calendar-header";
import LoadingSpinner from "./loading-spinner";
import "./calendar.scss";

/**
 * Calendar component.
 *
 * @param {object} props Props.
 * @param {Array} props.resources Resources to show calendar for.
 * @param {Date} props.date Date to show calendar for.
 * @param {Function} props.setDate Set date function.
 * @param {object} props.calendarSelection The current calendar selection.
 * @param {Function} props.setCalendarSelection Set calendar selection function.
 * @param {object} props.config Config for the app.
 * @param {Function} props.setShowResourceDetails Setter for showResourceDetails
 * @param {object} props.urlResource The resource object loaded from URL id.
 * @param {Function} props.setDisplayState State of the calendar - "minimized" or "maximized"
 * @param {boolean} props.userHasInteracted Has the user interacted with filters
 * @param {boolean} props.isLoading Loading state
 * @param {Function} props.setIsLoading Loading state setter
 * @returns {JSX.Element} Calendar component.
 */
function Calendar({
  resources,
  date,
  setDate,
  calendarSelection,
  setCalendarSelection,
  config,
  setShowResourceDetails,
  urlResource,
  setDisplayState,
  userHasInteracted,
  isLoading,
  setIsLoading,
}) {
  const calendarRef = useRef();
  const dateNow = new Date();
  const [internalSelection, setInternalSelection] = useState();
  const [calendarSelectionResourceTitle, setCalendarSelectionResourceTitle] = useState();
  const [calendarSelectionResourceId, setCalendarSelectionResourceId] = useState();
  const [events, setEvents] = useState([]);

  removeEmptyAriaLabelled();

  tabindexCalendar();

  /**
   * OnCalenderSelection.
   *
   * @param {object} selection The new selection object.
   * @returns {void} Nothing is returned
   */
  const onCalendarSelection = (selection) => {
    if (selection.start < dateNow) {
      return false;
    }

    const newSelection = {
      allDay: selection.allDay,
      resourceId: urlResource ? urlResource.resourceMail : selection.resource.id,
      end: selection.end,
      start: selection.start,
    };

    const serialized = JSON.stringify(newSelection);

    setInternalSelection(serialized);

    if (typeof selection.resource !== "undefined" && selection.resource !== null) {
      setCalendarSelectionResourceId(selection.resource.extendedProps.resourceId);
    }

    setCalendarSelection(newSelection);

    if (selection.resource) {
      setCalendarSelectionResourceTitle(selection.resource.title);
    } else if (urlResource) {
      setCalendarSelectionResourceTitle(urlResource.resourceName);
    }

    return undefined;
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

  // Get events for the given resources.
  useEffect(() => {
    if (config && resources?.length > 0 && date !== null) {
      Api.fetchEvents(config.api_endpoint, resources, dayjs(date).startOf("day"))
        .then((loadedEvents) => {
          setEvents(loadedEvents);

          setTimeout(() => {
            setIsLoading(false);
          }, 200);
        })
        .catch((fetchEventsError) => {
          setIsLoading(false);

          toast.error("Der opstod en fejl. Prøv igen senere.", fetchEventsError);
        });
    }
    if (resources && resources?.length === 0) {
      setIsLoading(false);
    }
  }, [resources, date]);

  useEffect(() => {
    const highlightElement = document.querySelector("div.fc-highlight");

    if (highlightElement !== null) {
      setTimeout(() => {
        document.querySelector("div.fc-highlight").innerHTML = ReactDOMServer.renderToString(
          <CalendarSelectionBox
            calendarSelection={calendarSelection}
            calendarSelectionResourceTitle={calendarSelectionResourceTitle}
            calendarSelectionResourceId={calendarSelectionResourceId}
          />
        );

        document.getElementById("calendar-selection-choice-confirm").addEventListener("mousedown", (e) => {
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

        document.getElementById("calendar-selection-container").addEventListener("mousedown", (e) => {
          e.stopPropagation();
        });

        document.getElementById("calendar-selection-close").addEventListener("mousedown", (e) => {
          e.stopPropagation();

          calendarRef.current.getApi().unselect();

          setCalendarSelection({});
        });
      }, 1);
    }
  }, [calendarSelection, events]);

  /** @param {string} resource Object of the resource to load */
  const triggerResourceView = (resource) => {
    // eslint-disable-next-line no-underscore-dangle
    setShowResourceDetails(resource._resource);
  };

  const renderCalendarCellInfoButton = (resource, triggerResourceViewEv) => {
    return <CalendarCellInfoButton resource={resource} onClickEvent={triggerResourceViewEv} />;
  };

  return (
    <div className="Calendar no-gutter col" role="application">
      {(!resources || (resources && resources.length === 0)) && !userHasInteracted && (
        <NoResultOverlay state="initial" />
      )}
      {(!resources || (resources && resources.length === 0)) && userHasInteracted && (
        <NoResultOverlay state="noresult" />
      )}
      {isLoading && <LoadingSpinner />}
      <CalendarHeader date={date} setDate={setDate} setIsLoading={setIsLoading} />
      <div className="row" aria-hidden="true">
        <div className="col small-padding">
          <div hidden id="calendar-caption">
            Kalender booking element
          </div>
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
            resourcesInitiallyExpanded
            nowIndicator
            navLinks
            slotDuration="00:15:00"
            allDaySlot={false}
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
            validRange={{
              start: dateNow,
            }}
            resourceOrder="resourceId"
            resourceGroupField="building"
            resourceAreaColumns={[
              {
                headerContent: "Ressourcer",
                cellContent(arg) {
                  return renderCalendarCellInfoButton(arg.resource, triggerResourceView);
                },
              },
              {
                headerContent: ["Kapacitet"],
                headerClassNames: "resource-calendar-capacity-header",
                width: "85px",
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
  resources: PropTypes.arrayOf(PropTypes.shape({})),
  date: PropTypes.shape({}).isRequired,
  setDate: PropTypes.func.isRequired,
  calendarSelection: PropTypes.shape({
    resource: PropTypes.shape({
      _resource: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }),
    }),
    start: PropTypes.shape({
      toISOString: PropTypes.func.isRequired,
    }),
    end: PropTypes.shape({
      toISOString: PropTypes.func.isRequired,
    }),
    resourceId: PropTypes.string,
  }),
  setCalendarSelection: PropTypes.func.isRequired,
  setShowResourceDetails: PropTypes.func.isRequired,
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
  setDisplayState: PropTypes.func.isRequired,
  validUrlParams: PropTypes.shape({}),
  userHasInteracted: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  setIsLoading: PropTypes.func.isRequired,
};

Calendar.defaultProps = {
  calendarSelection: null,
  urlResource: null,
  validUrlParams: {},
  resources: {},
};

export default Calendar;
