import { useEffect } from "react";
import UserBookingsList from "../userBookingsList/userBookingsList"
import Loadingspinner from '../loadingSpinner/loadingSpinner';
import Api from "../../util/api"
import './userpanel.css';

function Userpanel({ userId, config }) {

    function requestDeletion(bookingId) {
        if (bookingId) {
            bookingId = encodeURIComponent(bookingId);
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
            <br></br>
            <hr></hr>
            <br></br>
            <h1>User Panel:</h1>
            {<UserBookingsList config={config} userId={"userId"} key={"hallo"} onDeleteBooking={requestDeletion}/>}
                
        </div>
    );
}

export default Userpanel;
