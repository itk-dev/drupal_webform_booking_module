import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import * as PropTypes from "prop-types";
import Api from "../util/api";

/**
 * @param {object} props Props.
 * @param {string} props.userId User id.
 * @param {Function} props.onDeleteBooking OnDeleteBooking handler.
 * @param {object} props.config App config.
 * @returns {JSX.Element} Component.
 */
function UserBookingsList({ userId, onDeleteBooking, config }) {
  const [userBookings, setUserBookings] = useState();

  /** Loads user bookings. */
  function loadUserBookings() {
    if (config && userId !== null) {
      Api.fetchUserBookings(config.api_endpoint)
        .then((loadedUserBookings) => {
          setUserBookings(loadedUserBookings);
        })
        .catch(() => {
          // TODO: Display error and retry option for user.
        });
    }
  }

  /**
   * @param {Date} dateObj Date for format.
   * @returns {string} Date formatted as string.
   */
  function getFormattedDateTime(dateObj) {
    const formattedDate = dayjs(dateObj).format("dddd [d.] D/M");
    const formattedTime = dayjs(dateObj).format("[kl.] HH:mm");

    return `${formattedDate} ${formattedTime}`;
  }

  useEffect(() => {
    loadUserBookings();
  }, [userId]);

  return (
    <div className="userbookings-container">
      {userBookings &&
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
              <button type="button" onClick={() => onDeleteBooking(obj.hitId)}>
                Anmod om sletning
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}

UserBookingsList.propTypes = {
  userId: PropTypes.string.isRequired,
  onDeleteBooking: PropTypes.func.isRequired,
  config: PropTypes.shape({
    api_endpoint: PropTypes.string.isRequired,
  }).isRequired,
};

export default UserBookingsList;
