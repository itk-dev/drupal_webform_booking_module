import {useEffect} from "react";

function Calendar({location, onCalendarChange}) {
  useEffect(() => {
    console.log("Location changed to " + location)
  }, [location]);

  return (
    <div className="Calendar">
      Selected location: {location}
      
    </div>
  );
}

export default Calendar;
