import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import * as PropTypes from "prop-types";
import Api from "../util/api";
import LoadingSpinner from "./loading-spinner";
import "./user-panel.scss";

/**
 * @param {object} props Props.
 * @param {object} props.config App config.
 * @returns {JSX.Element} Component.
 */
function UserPanel({ config }) {
  const [loading, setLoading] = useState(true);
  const [userBookings, setUserBookings] = useState();

  /** @param {string} bookingId Booking id to request deletion of. */
  const requestDeletion = (bookingId) => {
    if (bookingId) {
      Api.deleteBooking(config.api_endpoint, bookingId)
        .then((resp) => {
          console.log("success deleting", resp);
          // TODO: Report delete success.
          // TODO: Update list of bookings.
        })
        .catch((err) => {
          console.log("error deleting", err);
          // TODO: Display error and retry option for user.
        });
    }
  };

  /**
   * @param booking
   * @param {object} data Data to patch.
   */
  const requestDateChange = (booking, data) => {
    console.log(booking);

    const newData = {
/*
      "@context": booking["@context"],
      "@id": booking["@id"],
      "@type": booking["@type"],
*/
      id: booking.id,
      start: "2022-10-25T08:00:00.000Z",
      end: "2022-10-25T08:30:00.000Z",
    };

    if (booking?.id) {
      Api.patchBooking(config.api_endpoint, booking.id, newData)
        .then((resp) => {
          console.log("success patching", resp);
          // TODO: Report delete success.
          // TODO: Update list of bookings.
        })
        .catch((err) => {
          console.log("error patching", err);
          // TODO: Display error and retry option for user.
        });
    }
  };

  /**
   * @param {Date} dateObj Date for format.
   * @returns {string} Date formatted as string.
   */
  function getFormattedDateTime(dateObj) {
    return dayjs(dateObj).format("dddd [d.] D/M [kl.] HH:mm");
  }

  // Load user bookings.
  useEffect(() => {
    if (config) {
      Api.fetchUserBookings(config.api_endpoint)
        .then((loadedUserBookings) => {
          setUserBookings(loadedUserBookings);
        })
        .catch(() => {
          // TODO: Display error and retry option for user.
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [config]);

  return (
    <div className="userpanel">
      <h1>User Panel:</h1>
      <div className="userbookings-container">
        {loading && <LoadingSpinner />}
        {!loading &&
          userBookings &&
          Object.values(userBookings).map((obj) => (
            <div className="user-booking" key={obj.id}>
              <div>
                <span className="location">{obj.displayName}</span>
                <span className="subject">{obj.subject}</span>
              </div>
              <div>
                <span>{getFormattedDateTime(obj.start)}</span>
                <span>→</span>
                <span>{getFormattedDateTime(obj.end)}</span>
              </div>
              <div>
                <button type="button" onClick={() => requestDeletion(obj.id)}>
                  Anmod om sletning
                </button>
                <button type="button" onClick={() => requestDateChange(obj)}>
                  Anmod om ændring af tidspunkt
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

UserPanel.propTypes = {
  config: PropTypes.shape({
    api_endpoint: PropTypes.string.isRequired,
  }).isRequired,
};

export default UserPanel;
