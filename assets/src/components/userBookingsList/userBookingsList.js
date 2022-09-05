import { useEffect } from "react";
import { useState } from 'react';
import Api from "../../util/api"
import dayjs from "dayjs";


function UserBookingsList({ userId, onDeleteBooking, config }) {
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

    function getFormattedDateTime(dateObj) {
        let formatted_date = dayjs(dateObj).format('dddd [d.] D/M');
        let formatted_time = dayjs(dateObj).format('[kl.] HH:mm');
        let formatted_date_time = formatted_date+" "+formatted_time;
        return formatted_date_time;
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
                        <span>{getFormattedDateTime(obj.start)}</span>
                        <span>→</span>
                        <span>{getFormattedDateTime(obj.end)}</span>
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