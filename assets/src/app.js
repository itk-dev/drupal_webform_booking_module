import "./app.scss";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import dayjs from "dayjs";
import ConfigLoader from "./util/config-loader";
import Calendar from "./components/calendar";
import Api from "./util/api";

/** App component. */
function App() {
  // Configuration.
  const [config, setConfig] = useState(null);

  // User selections.
  const [location, setLocation] = useState(null);
  const [resource, setResource] = useState(null);
  const [date, setDate] = useState(new Date());
  const [minimumSeatsRequired, setMinimumSeatsRequired] = useState(null);
  const [calendarSelection, setCalendarSelection] = useState({});

  // Loaded data.
  const [locations, setLocations] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [resources, setResources] = useState([]);
  const [resourcesOptions, setResourcesOptions] = useState([]);
  const [events, setEvents] = useState([]);

  const onCalendarSelection = (data) => {
    setCalendarSelection(data);
  };

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
          // TODO: Display error and retry option for user. (v0.1)
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
          // TODO: Display error and retry option for user. (v0.1)
        });
    }
  }, [location]);

  // Get events for the given resources.
  useEffect(() => {
    if (config && resources?.length > 0 && date !== null) {
      Api.fetchEvents(
        config.api_endpoint,
        resources,
        dayjs(date).startOf("day")
      )
        .then((loadedEvents) => {
          setEvents(loadedEvents);
        })
        .catch(() => {
          // TODO: Display error and retry option for user. (v0.1)
        });
    }
  }, [resources, date]);

  return (
    <div className="App">
      {!config && <div>Loading...</div>}
      <div className="container-fluid">
        {config && (
          <div className="row filters-wrapper">
            <div className="col-md-3">
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
            </div>
            <div className="col-md-3">
              {/* Add dropdown with options from resources */}
              <Select
                styles={{}}
                options={resourcesOptions}
                onChange={(newValue) => {
                  setLocation(newValue.value);
                }}
              />
            </div>
            {/* Add dropdown with options for facilities */}
            <div className="col-md-3">
              {/* TODO: Add dropdown with options from facilities (v1) */}
              {}
            </div>
            {/* Add dropdown capacity widget. */}
            <div className="col-md-3">
              {/* TODO: Add dropdown with options from capacity (v1) */}
              {}
            </div>
          </div>
        )}

        {/* Add info box */}
        <div className="row">
          {config && (
            <div className="col-md-12">
              {/* TODO: Add info text box (v0.1) */}
              {}
            </div>
          )}
        </div>

        {/* Display calendar for selections */}
        <div className="row">
          {config && (
            <Calendar
              resources={resources}
              events={events}
              date={date}
              setDate={setDate}
              onCalendarSelection={onCalendarSelection}
              drupalConfig={config}
            />
          )}
        </div>

        {/* Display author fields */}
        <div className="row">
          {/* TODO: Required author fields (v0.1) */}
          {}
        </div>
      </div>
    </div>
  );
}

export default App;
