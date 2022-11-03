import React, {useEffect, useRef, useState} from "react";
import dayjs from "dayjs";
import * as PropTypes from "prop-types";
import Api from "../util/api";
import "./user-panel.scss";
import FullCalendar from "@fullcalendar/react";
import resourceTimegrid from "@fullcalendar/resource-timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import {
  handleBusyIntervals, handleResources,
} from "../util/calendar-utils";
import daLocale from "@fullcalendar/core/locales/da";
import "./calendar.scss";
import CalendarHeader from "./calendar-header";
import ReactDOMServer from "react-dom/server";
import CalendarSelectionBox from "./calendar-selection-box";
import displayError, {displaySuccess} from "../util/display-toast";
import LoadingSpinner from "./loading-spinner";

/**
 * @param {object} props Props.
 * @param {object} props.config App config.
 * @returns {JSX.Element} Component.
 */
function UserBookingDelete({config, booking, onBookingDeleted, close}) {
  const [loading, setLoading] = useState(false);

  /** @param {object} booking Booking to request deletion of. */
  const requestDeletion = (booking) => {
    if (booking.id) {
      setLoading(true);

      Api.deleteBooking(config.api_endpoint, booking.id)
        .then(() => {
          onBookingDeleted();
        })
        .catch((err) => {
          displayError("Sletning af booking fejlede", err);
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

  return (
    <div className="main-container">
      <div className="no-gutter col-md-12" style={{padding: "1em"}}>
        <h2>Slet booking</h2>
        <div className="row">
          <div className="col small-padding" style={{width: "100%"}}>
            {loading && <LoadingSpinner/>}
            {!loading && <>
              <div style={{margin: "1em 0"}}>
                <div><strong>Resource: </strong>{booking.displayName}</div>
                <div><strong>Titel på booking: </strong>{booking.subject}</div>
                <div>
                  <strong>Tidspunkt: </strong>{getFormattedDateTime(booking.start)} - {getFormattedDateTime(booking.end)}
                </div>

                <div style={{margin: "1em 0"}}>
                  <strong>Er du sikker på, at du vil slette bookingen?</strong>
                </div>

                <button type="button" onClick={() => requestDeletion(booking)} style={{margin: "0 .5em 0 0"}}>
                  Ja, slet den!
                </button>
                <button type="button" onClick={close}>
                  Annullér
                </button>
              </div>
            </>}
          </div>
        </div>
      </div>
    </div>
  );
}

UserBookingDelete.propTypes = {
  config: PropTypes.shape({
    api_endpoint: PropTypes.string.isRequired,
  }).isRequired,
  booking: PropTypes.shape({}).isRequired,
  onBookingDeleted: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

export default UserBookingDelete;
