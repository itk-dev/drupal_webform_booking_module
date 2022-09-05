import "./app.scss";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import dayjs from "dayjs";
import ConfigLoader from "./util/config-loader";
import Calendar from "./components/calendar";
import Api from "./util/api";

/**
 * App component.
 *
 * @returns {string} App component.
 */
function App() {
  // Configuration.
  const [config, setConfig] = useState(null);

  // User selections.
  const [location, setLocation] = useState(null);
  const [resource, setResource] = useState(null);
  const [date, setDate] = useState(dayjs().startOf("day"));
  const [minimumSeatsRequired, setMinimumSeatsRequired] = useState(null);

  // Loaded data.
  const [locations, setLocations] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [resources, setResources] = useState([]);
  const [resourcesOptions, setResourcesOptions] = useState([]);
  const [events, setEvents] = useState([]);

  // Get configuration.
  useEffect(() => {
    ConfigLoader.loadConfig().then((loadedConfig) => {
      setConfig(loadedConfig);
    });
  }, []);

  // Get locations.
  useEffect(() => {
    if (config !== null) {
      Api.fetchLocations(config.api_endpoint)
        .then((loadedLocations) => {
          setLocations(loadedLocations);

          setLocationOptions(
            loadedLocations.map((value) => {
              return {
                value: value.name,
                label: value.name,
              };
            })
          );
        })
        .catch(() => {
          // TODO: Display error and retry option for user.
        });
    }
  }, [config]);

  // Get resources for the given location.
  useEffect(() => {
    if (config && location !== null) {
      Api.fetchResources(config.api_endpoint, location)
        .then((loadedResources) => {
          setResources(loadedResources);

          setResourcesOptions(
            loadedResources.map((res) => {
              return {
                value: res.resourcemail,
                label: res.resourcename,
              };
            })
          );
        })
        .catch(() => {
          // TODO: Display error and retry option for user.
        });
    }
  }, [location]);

  // Get events for the given resources.
  useEffect(() => {
    if (config && resources?.length > 0) {
      Api.fetchEvents(config.api_endpoint, resources, date)
        .then((loadedEvents) => {
          setEvents(loadedEvents);
        })
        .catch(() => {
          // TODO: Display error and retry option for user.
        });
    }
  }, [resources]);

  return (
    <div className="App">
      {!config && <div>Loading...</div>}
      {config && (
        <>
          {/* Add dropdown with options from locations */}
          {locationOptions.length > 0 && (
            <Select
              styles={{}}
              options={locationOptions}
              onChange={(newValue) => {
                setLocation(newValue.value);
              }}
            />
          )}

          {/* Add dropdown with options from resources */}
          {resourcesOptions?.length > 0 && (
            <Select
              styles={{}}
              options={resourcesOptions}
              onChange={(newValue) => {
                setLocation(newValue.value);
              }}
            />
          )}

          {/* TODO: Add dropdown with options from facilities */}
          {/* TODO: Add dropdown with options from capacity */}

          {/* TODO: Add info text box */}

          {/* Display calendar for selections */}
          {resources?.length > 0 && events?.length > 0 && (
            <Calendar resources={resources} events={events} />
          )}

          {/* TODO: Required author fields */}
        </>
      )}
    </div>
  );
}

export default App;
