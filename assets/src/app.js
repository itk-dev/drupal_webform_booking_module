import './app.css';
import Calendar from "./components/calendar";
import {useEffect, useState} from "react";
import Select from "react-select";
import ConfigLoader from "./config-loader";

function App() {
  // Configuration.
  const [config, setConfig] = useState(null);

  // User selections.
  const [location, setLocation] = useState(null);
  const [resource, setResource] = useState(null);

  // Loaded data.
  const [availableLocations, setAvailableLocations] = useState([]);
  const [resources, setResources] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Load configuration.
    ConfigLoader.loadConfig().then((loadedConfig) => {
      setConfig(loadedConfig);
    });
  }, []);

  useEffect(() => {
    // Fetch locations.
    if (config !== null) {
      fetch(`${config.api_endpoint}itkdev_booking/locations`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        return response.json();
      })
      .then((actualLocations) => {
        setAvailableLocations(
          actualLocations["hydra:member"].map(function (value) {
            return {
              value: value.name,
              label: value.name,
            };
          })
        );
      })
      .catch((err) => {
        // TODO: Display loading error and retry option.
      })
    }
  }, [config]);

  // Get data.
  useEffect(() => {
    // If we have no resources try and fetch some.
    if (config && resources.length === 0) {
      fetch(`${config.api_endpoint}itkdev_booking/resources`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        return response.json();
      })
      .then((actualResources) => {
        setResources(actualResources);
        return actualResources;
      })
      .catch((err) => {
        setResources([]);
      })
      .then((resources) => {
        // If we found any resources get events for those resources.
        if(resources) {
          fetch(`${config.api_endpoint}itkdev_booking/bookings?resources=dokk1-lokale-test1%40aarhus.dk&dateStart=2022-05-30T17%3A32%3A28Z&dateEnd=2022-06-22T17%3A32%3A28Z&page=1`)
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `This is an HTTP error: The status is ${response.status}`
              );
            }
            return response.json();
          })
          .then((actualEvents) => {
            setEvents(actualEvents);
          })
          .catch((err) => {
            setEvents([]);
          })
        }
      })
    }
  }, [location]);

  const onCalendarChange = (param) => {
    //console.log("onCalendarChange", param);
  }

  return (
    <div className="App">
      {!config &&
        <div>Loading...</div>
      }
      {config &&
        <>
          {/* Add dropdown with options from locations */}
          {availableLocations.length > 0 &&
            <Select
              styles={{}}
              options={availableLocations}
              onChange={(newValue) => {setLocation(newValue.value)}}
            />
          }
          {/* Add dropdown with options from resources */}
          {/* Add dropdown with options from facilities */}
          {/* Add dropdown with options from capacity */}

          {/* Add info text box */}

          {/* Display calendar for selections */}
          {resources && events &&
            <Calendar
              location={location}
              resources={resources}
              events={events}
              onCalendarChange={onCalendarChange}
            />
          }

          {/* Required author fields */}
        </>
      }
    </div>
  );
}

export default App;
