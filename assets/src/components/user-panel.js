import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import * as PropTypes from "prop-types";
import Api from "../util/api";
import LoadingSpinner from "./loading-spinner";
import { displayError } from "../util/display-toast";
import "./user-panel.scss";
import UserBookingEdit from "./user-booking-edit";
import UserBookingDelete from "./user-booking-delete";

/**
 * @param {object} props Props.
 * @param {object} props.config App config.
 * @returns {JSX.Element} Component.
 */
function UserPanel({ config }) {
  const [loading, setLoading] = useState(true);
  const [userBookings, setUserBookings] = useState();
  const [editBooking, setEditBooking] = useState(null);
  const [deleteBooking, setDeleteBooking] = useState(null);
  const [changedBookingId, setChangedBookingId] = useState(null);

  const onBookingChanged = (changedBooking) => {
    setEditBooking(null);

    setLoading(true);

    setChangedBookingId(changedBooking.id);

    Api.fetchUserBookings(config.api_endpoint)
      .then((loadedUserBookings) => {
        setUserBookings(loadedUserBookings);
      })
      .catch((fetchUserBookingsError) => {
        displayError("Der opstod en fejl. Prøv igen senere...", fetchUserBookingsError);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onBookingDeleted = () => {
    setDeleteBooking(null);

    setLoading(true);

    Api.fetchUserBookings(config.api_endpoint)
      .then((loadedUserBookings) => {
        setUserBookings(loadedUserBookings);
      })
      .catch((fetchUserBookingsError) => {
        displayError("Der opstod en fejl. Prøv igen senere...", fetchUserBookingsError);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const close = () => {
    setDeleteBooking(null);

    setEditBooking(null);
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
        .catch((fetchUserBookingsError) => {
          displayError("Der opstod en fejl. Prøv igen senere...", fetchUserBookingsError);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [config]);

  return (
    <>
      {deleteBooking && (
        <UserBookingDelete config={config} booking={deleteBooking} onBookingDeleted={onBookingDeleted} close={close} />
      )}
      {editBooking && (
        <UserBookingEdit config={config} booking={editBooking} onBookingChanged={onBookingChanged} close={close} />
      )}
      {!editBooking && !deleteBooking && (
        <div className="userpanel row">
          <div className="col no-gutter">
            <div className="userbookings-container">
              {loading && <LoadingSpinner />}
              {!loading &&
                !editBooking &&
                userBookings &&
                Object.values(userBookings).map((obj) => (
                  <div className="user-booking" key={obj.id}>
                    {obj.id === changedBookingId && <>Ændring gennemført.</>}
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
                      <button type="button" onClick={() => setDeleteBooking(obj)}>
                        Anmod om sletning
                      </button>
                      <button type="button" onClick={() => setEditBooking(obj)}>
                        Anmod om ændring af tidspunkt
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

UserPanel.propTypes = {
  config: PropTypes.shape({
    api_endpoint: PropTypes.string.isRequired,
  }).isRequired,
};

export default UserPanel;
