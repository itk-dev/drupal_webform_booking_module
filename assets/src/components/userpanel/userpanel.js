import { useEffect } from "react";
import UserBookingsList from "../userBookingsList/userBookingsList";
import Loadingspinner from "../loadingSpinner/loadingSpinner";
import Api from "../../util/api";
import "./userpanel.scss";

/**
 * @param root0
 * @param root0.userId
 * @param root0.config
 */
function Userpanel({ userId, config }) {
  /** @param bookingId */
  function requestDeletion(bookingId) {
    if (bookingId) {
      bookingId = btoa(bookingId);
      Api.deleteBooking(config.api_endpoint, bookingId)
        .then((resource) => {
          console.log(resource);
        })
        .catch(() => {
          // TODO: Display error and retry option for user.
        });

      // alert('Request deletion for booking hitid: ' + bookingId);
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

export default Userpanel;
