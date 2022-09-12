import "./app.scss";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import dayjs from "dayjs";
import "dayjs/locale/da";
import UserPanel from "./components/user-panel";
import ConfigLoader from "./util/config-loader";
import Calendar from "./components/calendar";
import AuthorFields from "./components/author-fields";
import Api from "./util/api";
import ResourceView from "./components/resource-view";

dayjs.locale("da");

/**
 * App component.
 *
 * @returns {string} App component.
 */
function App() {
  // Configuration.
  const [config, setConfig] = useState(null);

  // Options for filters.
  const [locationOptions, setLocationOptions] = useState([]);
  const [resourcesOptions, setResourcesOptions] = useState([]);

  // User selections in the filters.
  const [date, setDate] = useState(new Date()); // Date filter selected in calendar header component.
  const [locationFilter, setLocationFilter] = useState([]);
  const [resourceFilter, setResourceFilter] = useState([]); // eslint-disable-line no-unused-vars

  // App display for calendar, list and map.
  const [resources, setResources] = useState([]); // The result after filtering resources
  const [events, setEvents] = useState([]); // Events related to the displayed resources (free/busy).

  // Id of a specific resource to be displayed in resource view.
  // @todo Do we need the resource and facilities constant in app? Should they not be contained within component?
  const [resource, setResource] = useState(null); // The resource displayed in the resource view component.
  const [facilities, setFacilities] = useState(null); // Facilities displayed in the resource view component.
  const [showResourceViewId, setShowResourceViewId] = useState(null); // ID of the displayed resource.

  // App output. - Data to be pushed to API or used as parameters for redirect.
  const [calendarSelection, setCalendarSelection] = useState({}); // The selection of a time span in calendar.
  const [authorFields, setAuthorFields] = useState({ email: "" }); // Additional fields for author information.

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
          setResourceFilter([]);
        })
        .catch(() => {
          // TODO: Display error and retry option for user. (v0.1)
        });
    }
  }, [config]);

  // Get resources for the given location.
  useEffect(() => {
    if (config && locationFilter !== null) {
      Api.fetchResources(config.api_endpoint, locationFilter)
        .then((loadedResources) => {
          setResources(loadedResources);

          setResourcesOptions(
            loadedResources.map((res) => {
              return {
                value: res.resourceMail,
                label: res.resourceName,
              };
            })
          );
        })
        .catch(() => {
          // TODO: Display error and retry option for user. (v0.1)
        });
    }
  }, [locationFilter]);

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
        {!config && <div>Loading...</div>}
        {config && (
          <>
            <div className="row filters-wrapper">
              <div className="col-md-3">
                {/* Dropdown with locations */}
                <Select
                  styles={{}}
                  placeholder="lokationer..."
                  options={locationOptions}
                  onChange={(newValue) => {
                    setLocationFilter(newValue);
                  }}
                  isMulti
                />
              </div>
              <div className="col-md-3">
                {/* Dropdown with resources */}
                <Select
                  styles={{}}
                  placeholder="ressourcer..."
                  options={resourcesOptions}
                  onChange={(newValue) => {
                    setResourceFilter(newValue);
                  }}
                  isMulti
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
            <div className="row no-gutter calendar-container">
              <Calendar
                resources={resources}
                events={events}
                date={date}
                setDate={setDate}
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
            <UserPanel config={config} />

            {/* Display author fields */}
            <div className="row no-gutter">
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
