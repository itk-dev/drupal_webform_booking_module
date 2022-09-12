import "./app.scss";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import dayjs from "dayjs";
import "dayjs/locale/da";
// import UserPanel from "./components/user-panel";
import ConfigLoader from "./util/config-loader";
import Calendar from "./components/calendar";
import AuthorFields from "./components/author-fields";
import Api from "./util/api";
import ResourceView from "./components/resource-view";
import LoadingSpinner from "./components/loading-spinner";

dayjs.locale("da");

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
  const [date, setDate] = useState(new Date());
  const [calendarSelection, setCalendarSelection] = useState({});
  const [authorFields, setAuthorFields] = useState({});
  // TODO: Add these.
  // const [resource, setResource] = useState(null);
  const [resource, setResource] = useState(null);
  const [facilities, setFacilities] = useState(null);
  // const [minimumSeatsRequired, setMinimumSeatsRequired] = useState(null);

  // ResourceView overlay trigger & global data
  const [showResourceViewId, setShowResourceViewId] = useState(null);

  // Loaded data.
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
          setLocationOptions(
            loadedLocations.map((value) => {
              return {
                value: value.name,
                label: value.name,
              };
            })
          );
          setLocation("LOCATION1");
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

  // Set selection as json.
  useEffect(() => {
    if (config) {
      document.getElementById(config.output_field_id).value = JSON.stringify({
        ...calendarSelection,
        ...authorFields,
      });
    }
  }, [calendarSelection, authorFields]);

  return (
    <div className="App">
      <div className="container-fluid">
        {!config && <LoadingSpinner />}
        {config && (
          <>
            <div className="container filters-wrapper">
              <div className="col-md-3">
                {/* Dropdown with locations */}
                <Select
                  styles={{}}
                  placeholder="lokationer..."
                  options={locationOptions}
                  onChange={(newValue) => {
                    setLocation(newValue.value);
                  }}
                />
              </div>
              <div className="col-md-3">
                {/* Dropdown with resources */}
                <Select
                  styles={{}}
                  placeholder="ressourcer..."
                  options={resourcesOptions}
                  onChange={(newValue) => {
                    setLocation(newValue.value);
                  }}
                />
              </div>
              {/* Dropdown with facilities */}
              <div className="col-md-3">
                {/* TODO: Add dropdown with options from facilities (v1) */}
              </div>
              {/* Dropdown with capacity */}
              <div className="col-md-3">
                {/* TODO: Add dropdown with options from capacity (v1) */}
              </div>
            </div>

            {/* Add info box */}
            <div className="row">
              <div className="col-md-12">
                {/* TODO: Add info text box (v0.1) */}
              </div>
            </div>

            {/* Display calendar for selections */}
            <div className="row calendar-container">
              <Calendar
                resources={resources}
                events={events}
                date={date}
                setDate={setDate}
                calendarSelection={calendarSelection}
                onCalendarSelection={setCalendarSelection}
                config={config}
                setShowResourceViewId={setShowResourceViewId}
              />
              {/* TODO: Only show if resource view is requested */}
              <ResourceView
                config={config}
                resource={resource}
                setResource={setResource}
                facilities={facilities}
                setFacilities={setFacilities}
                showResourceViewId={showResourceViewId}
                setShowResourceViewId={setShowResourceViewId}
              />
            </div>

            {/* TODO: Only show if user menu is requested */}
            {/* <UserPanel config={config} /> */}

            {/* Display author fields */}
            <div className="row">
              {authorFields && (
                <AuthorFields
                  authorFields={authorFields}
                  setAuthorFields={setAuthorFields}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
