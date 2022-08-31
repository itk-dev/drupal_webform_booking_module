import './app.css';
import Calendar from "./components/calendar";
import {useEffect, useState} from "react";
import Select from "react-select";
import ConfigLoader from "./config-loader";
import dayjs from "dayjs";

function App() {
  // Configuration.
  const [config, setConfig] = useState(null);

  // User selections.
  const [location, setLocation] = useState(null);
  const [resource, setResource] = useState(null);
  const [date, setDate] = useState(dayjs().startOf('day'));
  const [minimumSeatsRequired, setMinimumSeatsRequired] = useState(null);

  // Loaded data.
  const [locations, setLocations] = useState([]);
  const [resources, setResources] = useState([]);
  const [resourcesOptions, setResourcesOptions] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Load configuration.
    ConfigLoader.loadConfig().then((loadedConfig) => {
      setConfig(loadedConfig);
    });
  }, []);

  useEffect(() => {
    // Load locations.
    if (config !== null) {
      fetch(`${config.api_endpoint}itkdev_booking/locations`)
      .then((response) => {
        if (!response.ok) {
          // TODO: Display loading error and retry option.
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        return response.json();
      })
      .then((actualLocations) => {
        setLocations(
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
    console.log("useEffect: [location]");

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
      .then((loadedResources) => {
        setResources(loadedResources["hydra:member"]);

        setResourcesOptions(loadedResources["hydra:member"].map((res) => {
          return {
            value: res.resourcemail,
            label: res.resourcename,
          };
        }))
      });
    }
  }, [location]);

  useEffect(() => {
    if (resources.length > 0) {
      const dateEnd = dayjs(date).endOf('day');

      // Setup query parameters.
      const urlSearchParams = new URLSearchParams({
        resources: resources.map((resource) => resource.resourcemail),
        dateStart: date.toISOString(),
        dateEnd: dateEnd.toISOString(),
        page: 1,
      });

      // Events on resource.
      fetch(`${config.api_endpoint}itkdev_booking/bookings?${urlSearchParams}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `This is an HTTP error: The status is ${response.status}`
            );
          }
          return response.json();
        })
        .then((actualEvents) => {
          setEvents(actualEvents["hydra:member"]);
        })
        .catch((err) => {
          setEvents([]);
        })
    }
  }, [resources]);

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
          {locations.length > 0 &&
            <Select
              styles={{}}
              options={locations}
              onChange={(newValue) => {setLocation(newValue.value)}}
            />
          }

          {/* Add dropdown with options from resources */}
          {resourcesOptions?.length > 0 &&
            <Select
              styles={{}}
              options={resourcesOptions}
              onChange={(newValue) => {setLocation(newValue.value)}}
            />
          }

          {/* TODO: Add dropdown with options from facilities */}
          {/* TODO: Add dropdown with options from capacity */}

          {/* TODO: Add info text box */}

          {/* Display calendar for selections */}
          {resources?.length > 0 && events?.length > 0 &&
            <Calendar
              resources={resources}
              events={events}
            />
          }

          {/* TODO: Required author fields */}
        </>
      }
    </div>
  );
}

export default App;
