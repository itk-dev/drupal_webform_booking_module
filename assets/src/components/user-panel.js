import React from "react";
import * as PropTypes from "prop-types";
import UserBookingsList from "./user-bookings-list";
import Api from "../util/api";
import "./user-panel.scss";

/**
 * User panel.
 *
 * @param {object} props Props.
 * @param {object} props.config App config.
 * @returns {string} User panel component.
 */
function UserPanel({ config }) {
  /** @param {string} bookingId Booking id to request deletion of. */
  const requestDeletion = (bookingId) => {
    if (bookingId) {
      const requestBookingId = btoa(bookingId);
      Api.deleteBooking(config.api_endpoint, requestBookingId)
        .then(() => {
          // TODO: Report delete success.
          // TODO: Update list of bookings.
        })
        .catch(() => {
          // TODO: Display error and retry option for user.
        });
    }
  };

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

UserPanel.propTypes = {
  config: PropTypes.shape({
    api_endpoint: PropTypes.string.isRequired,
  }).isRequired,
};

export default UserPanel;
