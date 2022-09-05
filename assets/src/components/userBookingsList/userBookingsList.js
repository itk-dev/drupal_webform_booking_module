import { useEffect } from "react";
import { useState } from 'react';
import Api from "../../util/api"

function UserBookingsList({ userId, key, onDeleteBooking, config }) {
    const [userBookings, setUserBookings] = useState();

    useEffect(() => {
        loadUserBookings();
    }, [userId]);

    function loadUserBookings() {
        if (config && userId !== null) {
            Api.fetchUserBookings(config.api_endpoint, "")
                .then((userBookings) => {
                    setUserBookings(userBookings)
                })
                .catch(() => {
                    // TODO: Display error and retry option for user.
                });
        }
    }

    function getFormattedDate(dateObj) {
        let formatted_date = new Date(dateObj).toLocaleDateString("da-dk", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        })

        return formatted_date;
    }
    function getFormattedTime(dateObj) {
        let formatted_time = new Date(dateObj).toLocaleTimeString("da-dk", {
            hour: "2-digit",
            minute: "2-digit",
        });
        return formatted_time;
    }
    return (
        <div className="userbookings-container">
            {userBookings && Object.values(userBookings).map((obj, index) => (
                <div className="user-booking" key={index}>
                    <div>
                        <span className="location">{obj.displayName}</span>
                        <span className="subject">{obj.subject}</span>
                    </div>
                    <div>
                        <span>{getFormattedDate(obj.start)} - kl. {getFormattedTime(obj.start)}</span>
                        <span>→</span>
                        <span>{getFormattedDate(obj.end)} - kl. {getFormattedTime(obj.end)}</span>
                    </div>
                    <div>
                        <button onClick={() => onDeleteBooking(obj.hitId)}>Anmod om sletning</button>
                    </div>
                </div>
            ))
            }
        </div>
    );
}
export default UserBookingsList;