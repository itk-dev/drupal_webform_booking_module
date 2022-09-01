import { useEffect } from "react";
import UserBookingsList from "../userBookingsList/userBookingsList"
import Loadingspinner from '../loadingSpinner/loadingSpinner';
import './userpanel.css';

function Userpanel({ userId, config }) {

    useEffect(() => {

    }, [userId]);

    function requestDeletion(bookingId) {
        if (bookingId) {
            bookingId = encodeURIComponent(bookingId);
            alert('Request deletion for booking hitid: ' + bookingId);
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
