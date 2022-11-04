import React, { useEffect, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import dayjs from "dayjs";
import * as PropTypes from "prop-types";
import "./user-panel.scss";
import FullCalendar from "@fullcalendar/react";
import resourceTimegrid from "@fullcalendar/resource-timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import daLocale from "@fullcalendar/core/locales/da";
import { handleBusyIntervals, handleResources } from "../util/calendar-utils";
import "./calendar.scss";
import CalendarHeader from "./calendar-header";
import Api from "../util/api";
import CalendarSelectionBox from "./calendar-selection-box";
import { displayError, displaySuccess } from "../util/display-toast";
import LoadingSpinner from "./loading-spinner";

/**
 * @param {object} props Props.
 * @param {object} props.config App config.
 * @param {object} props.booking Booking to edit.
 * @param {Function} props.onBookingChanged Callback when booking has changed.
 * @param {Function} props.close Callback to close edit component without action.
 * @returns {JSX.Element} Component.
 */
function UserBookingEdit({ config, booking, onBookingChanged, close }) {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [resources, setResources] = useState([]);
  const [date, setDate] = useState(new Date());
  const [calendarSelection, setCalendarSelection] = useState(null);
  const calendarRef = useRef();

  useEffect(() => {
    if (booking) {
      setDate(new Date(booking.start));

      Api.fetchResource(config.api_endpoint, booking.resourceMail).then((resource) => {
        setResources([resource]);

        Api.fetchEvents(config.api_endpoint, [resource], date).then((newEvents) => setEvents(newEvents));
      });
    }
  }, [booking]);

  useEffect(() => {
    if (calendarSelection) {
      calendarRef?.current?.getApi().gotoDate(date);
    }

    if (resources.length > 0) {
      Api.fetchEvents(config.api_endpoint, resources, date).then((newEvents) => setEvents(newEvents));
    }
  }, [date]);

  /**
   * Edit booking.
   *
   * @param {object} bookingEdit Booking to edit.
   * @param {Date} newStart New start date.
   * @param {Date} newEnd New end date.
   */
  const requestDateChange = (bookingEdit, newStart, newEnd) => {
    const newData = {
      id: bookingEdit.id,
      start: newStart.toISOString(),
      end: newEnd.toISOString(),
    };

    if (bookingEdit?.id) {
      setLoading(true);

      Api.patchBooking(config.api_endpoint, bookingEdit.id, newData)
        .then(() => {
          displaySuccess("Ændring af tidspunkt lykkedes");

          onBookingChanged(bookingEdit);
        })
        .catch((err) => {
          displayError("Ændring af tidspunkt fejlede.", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  /**
   * @param {Date} dateObj Date for format.
   * @returns {string} Date formatted as string.
   */
  function getFormattedDateTime(dateObj) {
    return dayjs(dateObj).format("D/M [kl.] HH:mm");
  }

  /**
   * OnCalenderSelection.
   *
   * @param {object} selection The new selection object.
   * @returns {void} Nothing is returned
   */
  const onCalendarSelection = (selection) => {
    const newSelection = {
      allDay: selection.allDay,
      resourceId: selection.resource.id,
      end: selection.end,
      start: selection.start,
    };

    setCalendarSelection(newSelection);
  };

  useEffect(() => {
    const highlightElement = document.querySelector("div.fc-highlight");

    if (highlightElement !== null && resources?.length > 0) {
      setTimeout(() => {
        document.querySelector("div.fc-highlight").innerHTML = ReactDOMServer.renderToString(
          <CalendarSelectionBox
            calendarSelection={calendarSelection}
            calendarSelectionResourceTitle={resources[0].resourceName ?? ""}
            calendarSelectionResourceId={resources[0].id}
            actionText="Anmod om ændring af tidspunkt"
          />
        );

        document.getElementById("calendar-selection-choice-confirm").addEventListener("mousedown", (e) => {
          e.stopPropagation();

          requestDateChange(booking, calendarSelection.start, calendarSelection.end);
        });

        document.getElementById("calendar-selection-container").addEventListener("mousedown", (e) => {
          e.stopPropagation();
        });

        document.getElementById("calendar-selection-close").addEventListener("mousedown", (e) => {
          e.stopPropagation();

          calendarRef.current.getApi().unselect();

          setCalendarSelection(null);
        });
      }, 1);
    }
  }, [calendarSelection, events]);

  return (
    <div className="main-container">
      <div className="Calendar no-gutter col-md-12">
        <h2>Vælg nyt tidspunkt for booking</h2>
        <div className="row">
          <div className="col small-padding" style={{ width: "100%" }}>
            {loading && <LoadingSpinner />}
            {!loading && (
              <>
                <div style={{ margin: "1em 0" }}>
                  <div>
                    <strong>Resource: </strong>
                    {booking.displayName}
                  </div>
                  <div>
                    <strong>Titel på booking: </strong>
                    {booking.subject}
                  </div>
                  <div>
                    <strong>Nuværende valg: </strong>
                    {getFormattedDateTime(booking.start)} - {getFormattedDateTime(booking.end)}
                  </div>
                  <div>
                    {calendarSelection && (
                      <>
                        <strong>Nyt valg: </strong>
                        {getFormattedDateTime(calendarSelection.start)} - {getFormattedDateTime(calendarSelection.end)}
                      </>
                    )}
                  </div>
                </div>

                <CalendarHeader config={config} date={date} setDate={setDate} />
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
                  height="300px"
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
                  validRange={{
                    start: date,
                  }}
                  resourceOrder="resourceId"
                  resources={resources.map((value) => handleResources(value, date))}
                  events={events.map((value) => handleBusyIntervals(value))}
                />

                <button type="button" onClick={close} style={{ margin: "1em 0" }}>
                  Annullér
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

UserBookingEdit.propTypes = {
  config: PropTypes.shape({
    api_endpoint: PropTypes.string.isRequired,
    license_key: PropTypes.string,
  }).isRequired,
  booking: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
    resourceMail: PropTypes.string.isRequired,
  }).isRequired,
  onBookingChanged: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

export default UserBookingEdit;
