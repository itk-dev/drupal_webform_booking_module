import {useEffect} from "react";

function Calendar({location, onCalendarChange}) {
  useEffect(() => {
    console.log("Location changed to " + location)
  }, [location]);

  return (
    <div className="Calendar">
      Selected location: {location}

      <button onClick={() => {
        onCalendarChange('fisk')
      }}>FISK</button>
    </div>
  );
}

export default Calendar;
