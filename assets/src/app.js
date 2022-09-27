import "./app.scss";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import dayjs from "dayjs";
import "dayjs/locale/da";
import { useSearchParams } from "react-router-dom";
import AuthorFields from "./components/author-fields";
import Calendar from "./components/calendar";
import MinimizedDisplay from "./components/minimized-display";
import ResourceView from "./components/resource-view";
import LoadingSpinner from "./components/loading-spinner";
import InfoBox from "./components/info-box";
import Api from "./util/api";
import ConfigLoader from "./util/config-loader";
import UrlValidator from "./util/url-validator";

dayjs.locale("da");

/**
 * App component.
 *
 * @returns {JSX.Element} App component.
 */
function App() {
  // App configuration and behavior.
  const [config, setConfig] = useState(null); // Config imported from an external source.
  const [displayState, setDisplayState] = useState("maximized"); // The app display mode to be used.
  const [urlParams] = useSearchParams(); // Url parameters when the app is loaded.
  const [urlResource, setUrlResource] = useState(null); // A resource fetched from API if validUrlParams are set.
  const [validUrlParams, setValidUrlParams] = useState(null); // Validated url params through url-validator.js.

  // Options for filters.
  const [locationOptions, setLocationOptions] = useState([]);
  const [resourcesOptions, setResourcesOptions] = useState([]);

  // User selections in the filters.
  const [date, setDate] = useState(new Date()); // Date filter selected in calendar header component.
  const [filterParams, setFilterParams] = useState({}); // An object containing structured information about current filtering.
  const [locationFilter, setLocationFilter] = useState([]);
  const [resourceFilter, setResourceFilter] = useState([]);

  // App display for calendar, list and map.
  const [events, setEvents] = useState([]); // Events related to the displayed resources (free/busy).
  const [resources, setResources] = useState([]); // The result after filtering resources

  // Id of a specific resource to be displayed in resource view.
  // TODO: Do we need the resource and facilities constant in app? Should they not be contained within component?
  const [locations, setLocations] = useState(null);
  const [facilities, setFacilities] = useState(null); // Facilities displayed in the resource view component.
  const [resource, setResource] = useState(null); // The resource displayed in the resource view component.
  const [showResourceViewId, setShowResourceViewId] = useState(null); // ID of the displayed resource.

  // App output. - Data to be pushed to API or used as parameters for redirect.
  const [authorFields, setAuthorFields] = useState({ subject: "", email: "" }); // Additional fields for author information.
  const [calendarSelection, setCalendarSelection] = useState({}); // The selection of a time span in calendar.

  // Get configuration.
  useEffect(() => {
    ConfigLoader.loadConfig().then((loadedConfig) => {
      setConfig(loadedConfig);
    });

    if (UrlValidator.valid(urlParams) !== null) {
      setValidUrlParams(urlParams);
      setDisplayState("minimized");
    }
  }, []);

  // Effects to run when config is loaded. This should only happen once at app initialisation.
  useEffect(() => {
    if (config) {
      Api.fetchLocations(config.api_endpoint)
        .then((loadedLocations) => {
          setLocations(loadedLocations);
          setLocationOptions(
            loadedLocations
              .map((value) => {
                return {
                  value: value.name,
                  label: value.name,
                };
              })
              .sort()
          );
          setResourceFilter([]);
        })
        .catch(() => {
          // TODO: Display error and retry option for user. (v0.1)
        });
    }

    if (config && validUrlParams !== null) {
      Api.fetchResource(config.api_endpoint, validUrlParams.get("resource"))
        .then((loadedResource) => {
          setUrlResource(loadedResource);
        })
        .catch(() => {
          // TODO: Display error and retry option for user.
        });
    }
  }, [config]);

  // Effects to run when urlResource is set. This should only happen once in extension of app initialisation.
  useEffect(() => {
    if (urlResource && Object.prototype.hasOwnProperty.call(urlResource, "location")) {
      setLocationFilter([
        {
          value: urlResource.location,
          label: urlResource.location,
        },
      ]);
    }
    if (
      urlResource &&
      Object.prototype.hasOwnProperty.call(urlResource, "resourceMail") &&
      Object.prototype.hasOwnProperty.call(urlResource, "resourceName")
    ) {
      setResourceFilter([
        {
          value: urlResource.resourceMail,
          label: urlResource.resourceName,
        },
      ]);
    }
    if (validUrlParams) {
      setDate(new Date(validUrlParams.get("from")));
      setCalendarSelection({
        start: new Date(validUrlParams.get("from")),
        end: new Date(validUrlParams.get("to")),
        allDay: false,
        resource: validUrlParams.get("resource"),
      });
    }
  }, [urlResource]);

  // Set resources from filterParams.
  useEffect(() => {
    if (config) {
      const urlSearchParams = new URLSearchParams();

      Object.entries(filterParams).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((arrayValue) => urlSearchParams.append(key, arrayValue.toString()));
        } else {
          urlSearchParams.append(key, value.toString());
        }
      });

      if (Object.values(filterParams).length > 0) {
        Api.fetchResources(config.api_endpoint, urlSearchParams)
          .then((loadedResources) => {
            setResources([]);
            setTimeout(() => {
              setResources(loadedResources);
            }, 1);
          })
          .catch(() => {
            // TODO: Display error and retry option for user. (v0.1)
          });
      }
    }
  }, [filterParams]);

  // Set location filter and resource dropdown options.
  useEffect(() => {
    const locationValues = locationFilter.map(({ value }) => value);
    setFilterParams({ ...filterParams, ...{ "location[]": locationValues } });

    // Set resource dropdown options.
    if (config) {
      const dropdownParams = locationFilter.map(({ value }) => ["location[]", value]);
      const urlSearchParams = new URLSearchParams(dropdownParams);

      Api.fetchResources(config.api_endpoint, urlSearchParams)
        .then((loadedResources) => {
          setResourcesOptions(
            loadedResources.map((value) => {
              return {
                value: value.resourceMail,
                label: value.resourceName,
              };
            })
          );
        })
        .catch(() => {
          // TODO: Display error and retry option for user. (v0.1)
        });
    }
  }, [locationFilter]);

  // Set resource filter.
  useEffect(() => {
    const resourceValues = resourceFilter.map(({ value }) => value);

    setFilterParams({
      ...filterParams,
      ...(resourceValues.length ? { "resourceMail[]": resourceValues } : ""),
    });
  }, [resourceFilter]);

  // Get events for the given resources.
  useEffect(() => {
    if (config && resources?.length > 0 && date !== null) {
      Api.fetchEvents(config.api_endpoint, resources, dayjs(date).startOf("day"))
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
    if (config?.output_field_id) {
      document.getElementById(config.output_field_id).value = JSON.stringify({
        start: calendarSelection.start,
        end: calendarSelection.end,
        resourceId: calendarSelection.resourceId,
        ...authorFields,
      });
    }
  }, [calendarSelection, authorFields]);

  return (
    <div className="App">
      <div className="container-fluid">
        {!config && <LoadingSpinner />}
        {config && displayState === "maximized" && (
          <div className="app-content">
            <div className={`row filters-wrapper ${showResourceViewId !== null ? "disable-filters" : ""}`}>
              <div className="col-md-3">
                {/* Dropdown with locations */}
                <Select
                  styles={{}}
                  defaultValue={locationFilter}
                  placeholder="lokationer..."
                  closeMenuOnSelect={false}
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
                  defaultValue={resourceFilter}
                  placeholder="ressourcer..."
                  closeMenuOnSelect={false}
                  options={resourcesOptions}
                  onChange={(newValue) => {
                    setResourceFilter(newValue);
                  }}
                  isMulti
                />
              </div>
              {/* Dropdown with facilities */}
              <div className="col-md-3">{/* TODO: Add dropdown with options from facilities (v1) */}</div>
              {/* Dropdown with capacity */}
              <div className="col-md-3">{/* TODO: Add dropdown with options from capacity (v1) */}</div>
            </div>

            {/* Add info box */}
            <div className="row info-box-wrapper">
              {config.info_box_color && config.info_box_header && config.info_box_content && (
                <InfoBox config={config} />
              )}
            </div>

            {/* Display calendar for selections */}
            <div className="row no-gutter calendar-container">
              <Calendar
                resources={resources}
                events={events}
                date={date}
                setDate={setDate}
                calendarSelection={calendarSelection}
                setCalendarSelection={setCalendarSelection}
                config={config}
                setShowResourceViewId={setShowResourceViewId}
                urlResource={urlResource}
                setDisplayState={setDisplayState}
                locations={locations}
                setEvents={setEvents}
                validUrlParams={validUrlParams}
                locationFilter={locationFilter}
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
          </div>
        )}
        {config && validUrlParams && urlResource && displayState === "minimized" && (
          <div className="row">
            <MinimizedDisplay
              validUrlParams={validUrlParams}
              setDisplayState={setDisplayState}
              urlResource={urlResource}
            />
          </div>
        )}

        {/* TODO: Only show if user menu is requested */}
        {/* <UserPanel config={config} /> */}

        {/* Display author fields */}
        {config && !config.step_one && (
          <div className="row no-gutter">
            {authorFields && <AuthorFields authorFields={authorFields} setAuthorFields={setAuthorFields} />}
          </div>
        )}

        {/* Display redirect button */}
        {/* {config && config.step_one && calendarSelection && (
          <div className="row">
            <RedirectButton
              calendarSelection={calendarSelection}
              config={config}
            />
          </div>
        )} */}
      </div>
    </div>
  );
}

export default App;
