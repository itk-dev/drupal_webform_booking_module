import React from "react";
import UserBookingsList from "./user-bookings-list";
import Api from "../util/api";
import "./user-panel.scss";

/**
 * @param {object} props Props.
 * @param {object} props.config App config.
 */
function UserPanel({ config }) {
  /** @param {string} bookingId Booking id to request deletion of. */
  function requestDeletion(bookingId) {
    if (bookingId) {
      bookingId = btoa(bookingId);
      Api.deleteBooking(config.api_endpoint, bookingId)
        .then((resource) => {
          // TODO: Report delete success.
          // TODO: Update list of bookings.
          console.log(resource);
        })
        .catch(() => {
          // TODO: Display error and retry option for user.
        });
    }
  }

  return (
    <div className="userpanel">
      <br />
      <hr />
      <br />
      <h1>User Panel:</h1>
      <UserBookingsList
        config={config}
        userId="userId"
        key="hallo"
        onDeleteBooking={requestDeletion}
      />
    </div>
  );
}

export default UserPanel;
