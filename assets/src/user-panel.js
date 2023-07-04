import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import * as PropTypes from "prop-types";
import Api from "./util/api";
import LoadingSpinner from "./components/loading-spinner";
import { displayError } from "./util/display-toast";
import UserBookingEdit from "./components/user-booking-edit";
import UserBookingDelete from "./components/user-booking-delete";
import "./user-panel.scss";
import MainNavigation from "./components/main-navigation";

/**
 * @param {object} props Props.
 * @param {object} props.config App config.
 * @returns {JSX.Element} Component.
 */
function UserPanel({ config }) {
  const [loading, setLoading] = useState(true);
  const [userBookings, setUserBookings] = useState(null);
  const [editBooking, setEditBooking] = useState(null);
  const [deleteBooking, setDeleteBooking] = useState(null);
  const [changedBookingId, setChangedBookingId] = useState(null);

  const onBookingChanged = (bookingId, start, end) => {
    setEditBooking(null);

    setChangedBookingId(bookingId);

    const booking = userBookings.find((el) => el.id === bookingId);

    if (booking) {
      booking.start = start;

      booking.end = end;
    }
  };

  const onBookingDeleted = (bookingId) => {
    setDeleteBooking(null);

    const newUserBookings = userBookings.filter((el) => el.id !== bookingId);

    setUserBookings(newUserBookings);
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
    if (config && !userBookings) {
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
  }, []);

  const currentBookings = userBookings
    ? Object.values(userBookings).filter((obj) => !obj.expired && obj.status !== "DECLINED")
    : null;

  const expiredBookings = userBookings
    ? Object.values(userBookings).filter((obj) => obj.expired || obj.status === "DECLINED")
    : null;

  const getStatus = (status) => {
    switch (status) {
      case "ACCEPTED":
        return "Godkendt";
      case "DECLINED":
        return "Afvist";
      case "AWAITING_APPROVAL":
        return "Afventer godkendelse";
      default:
        return "Ukendt status";
    }
  };

  return (
    <div className="App">
      <div className="container-fluid">
        <MainNavigation config={config} />
        <div className="app-wrapper">
          {deleteBooking && (
            <UserBookingDelete
              config={config}
              booking={deleteBooking}
              onBookingDeleted={onBookingDeleted}
              close={close}
            />
          )}
          {editBooking && (
            <UserBookingEdit config={config} booking={editBooking} onBookingChanged={onBookingChanged} close={close} />
          )}
          {!editBooking && !deleteBooking && (
            <div className="userpanel row">
              <div className="col no-gutter">
                {loading && <LoadingSpinner />}
                {!loading && !editBooking && userBookings && (
                  <div className="userbookings-container">
                    <h3>Aktive bookinger</h3>

                    {currentBookings.map((obj) => (
                      <div className="user-booking" key={obj.id}>
                        <div>
                          {obj.id === changedBookingId && <>Ændring gennemført.</>}
                          <span className="location">{obj.resourceDisplayName}</span>
                          <span className="subject">{obj.subject}</span>
                          <span className="status">{getStatus(obj.status)}</span>
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
                )}

                {!loading && !editBooking && expiredBookings && (
                  <div className="userbookings-container">
                    <h3>Afsluttede bookinger</h3>
                    {expiredBookings.map((obj) => (
                      <div className="user-booking expired" key={obj.id}>
                        <div>
                          {obj.id === changedBookingId && <>Ændring gennemført.</>}
                          <span className="location">{obj.resourceDisplayName}</span>
                          <span className="subject">{obj.subject}</span>
                          <span className="status">{getStatus(obj.status)}</span>
                        </div>
                        <div>
                          <span>{getFormattedDateTime(obj.start)}</span>
                          <span>→</span>
                          <span>{getFormattedDateTime(obj.end)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
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
