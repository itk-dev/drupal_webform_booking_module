import { useState } from 'react';
import { useEffect } from "react";
import { getUserBookings } from "../../services/userBookingsService";
import Loadingspinner from '../loadingSpinner/loadingSpinner';
import './userpanel.css';

function Userpanel({ location, name }) {
    const [userBookings, setUserBookings] = useState();

    useEffect(() => {
        getUserBookings(name)
            .then(d => {
                console.log(d);
                setUserBookings(d)
            })
        console.log("Location changed to " + location);
    }, [location]);

    const userBookingsList = userBookings
        &&
        Object.values(userBookings).map((obj, index) => {
            const startDate = new Date(obj.start).toLocaleDateString("da-dk", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
            })
            const startTime = new Date(obj.start).toLocaleTimeString("da-dk", {
                hour: "2-digit",
                minute: "2-digit",
            });
            const endDate = new Date(obj.end).toLocaleDateString("da-dk", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
            })
            const endTime = new Date(obj.end).toLocaleTimeString("da-dk", {
                hour: "2-digit",
                minute: "2-digit",
            });
            return (
                <div className="user-booking" key={index}>
                    <div>
                        <span className="location">{obj.displayName}</span>
                        <span className="subject">{obj.subject}</span>
                    </div>
                    <div>
                        <span>{startDate} - kl. {startTime}</span>
                        <span>→</span>
                        <span>{endDate} kl. {endTime}</span>
                    </div>
                    <div>
                        <button booking_id={obj.hitId} onClick={e => requestDeletion(e.target.getAttribute('booking_id'), index)}>Anmod om sletning</button>
                    </div>
                </div>
            )
        })
    function requestDeletion(bookingId, ref) {
        ref.remove;
        if (bookingId) {
            bookingId = encodeURIComponent(bookingId);

            alert('Request deletion for booking hitid: '+bookingId);
            // fetch('https://selvbetjening.local.itkdev.dk/da/itkdev_booking/user-bookings/'+bookingId)
            // .then(function (response) {
            //     return response.json();
            // })
            // .then(function (myJson) {
            //     console.log(myJson);
            // });
        }
    }
    return (
        <div className="userpanel">
            Selected location: {location}
            <div className="userbookings-container">
                {userBookingsList ? userBookingsList : <Loadingspinner />}
            </div>
        </div>
    );
}


export default Userpanel;
