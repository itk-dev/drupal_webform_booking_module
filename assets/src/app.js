import './app.css';
import Calendar from "./components/calendar";
import {useEffect, useState} from "react";
import Select from "react-select";

function App() {
  const [config, setConfig] = useState(null);
  const [location, setLocation] = useState(null);
  const [availableLocations, setAvailableLocations] = useState([]);

  useEffect(() => {
    if (window?.drupalSettings?.booking_app?.booking) {
      setConfig(window.drupalSettings.booking_app.booking);

      console.log("Booking config set", window.drupalSettings.booking_app.booking);
    } else {
      // Allow loading from
    }
  }, []);

  useEffect(() => {
    if (config !== null) {
      // Fetch locations.
      setAvailableLocations([
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
      ]);
    }
  }, [config]);

  useEffect(() => {
    // Fetch resources from location.
  }, [location]);

  const onCalendarChange = (param) => {
    console.log("onCalendarChange", param);
  }

  return (
    <div className="App">
      {/* Add dropdown with options from locations */}
      {availableLocations.length > 0 &&
        <Select
          options={availableLocations}
        />
      }
      {/* Add dropdown with options from resources */}
      {/* Add dropdown with options from facilities */}
      {/* Add dropdown with options from capacity */}

      {/* Add info text box */}

      {/* Display calendar for selections */}
      <Calendar location={location} onCalendarChange={onCalendarChange} />

      {/* Required author fields */}
    </div>
  );
}

export default App;
