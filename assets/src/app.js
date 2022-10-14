import "./app.scss";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import dayjs from "dayjs";
import "dayjs/locale/da";
import { useSearchParams } from "react-router-dom";
import AppMenu from "./components/app-menu";
import AuthorFields from "./components/author-fields";
import Calendar from "./components/calendar";
import UserPanel from "./components/user-panel";
import MinimizedDisplay from "./components/minimized-display";
import ResourceView from "./components/resource-view";
import LoadingSpinner from "./components/loading-spinner";
import InfoBox from "./components/info-box";
import ListContainer from "./components/list-container";
import Api from "./util/api";
import ConfigLoader from "./util/config-loader";
import UrlValidator from "./util/url-validator";
import { capacityOptions, facilityOptions } from "./util/filter-utils";
import hasOwnProperty from "./util/helpers";

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
  const [urlResource, setUrlResource] = useState(null); // A resource fetched from API if validUrlParams are set.
  const [validUrlParams, setValidUrlParams] = useState(null); // Validated url params through url-validator.js.
  const [urlParams] = useSearchParams(); // Url parameters when the app is loaded.
  const [bookingView, setBookingView] = useState("calendar");
  // Options for filters.
  const [locationOptions, setLocationOptions] = useState([]);
  const [resourcesOptions, setResourcesOptions] = useState([]);
  // User selections in the filters.
  const [date, setDate] = useState(new Date()); // Date filter selected in calendar header component.
  const [filterParams, setFilterParams] = useState({}); // An object containing structured information about current filtering.
  const [locationFilter, setLocationFilter] = useState([]);
  const [resourceFilter, setResourceFilter] = useState([]);
  const [capacityFilter, setCapacityFilter] = useState([]);
  const [facilityFilter, setFacilityFilter] = useState([]);
  // App display for calendar, list and map.
  const [events, setEvents] = useState([]); // Events related to the displayed resources (free/busy).
  // Resources need to be false until we set it the first time, because [] equals no results and false triggers placeholder resources.
  // TODO: Handle this in another way so the propType does not throw a warning.
  const [resources, setResources] = useState(null); // The result after filtering resources
  const [locations, setLocations] = useState(null);
  const [showResourceDetails, setShowResourceDetails] = useState(null); // ID of the displayed resource.
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
    // Set location filter.
    if (urlResource && hasOwnProperty(urlResource, "location")) {
      setLocationFilter([
        {
          value: urlResource.location,
          label: urlResource.location,
        },
      ]);
    }

    // Set resource filter.
    if (urlResource && hasOwnProperty(urlResource, "resourceMail") && hasOwnProperty(urlResource, "resourceName")) {
      setResourceFilter([
        {
          value: urlResource.resourceMail,
          label: urlResource.resourceName,
        },
      ]);
    }

    // Use data from url parameters.
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

  // Set capacity filter.
  useEffect(() => {
    const newFilterParams = { ...filterParams };
    const capacityType = capacityFilter.type ?? null;
    const capacityValue = capacityFilter.value ?? 0;

    // Delete opposite entry to prevent both capacity[between] and capacity[gt] being set, causing a dead end.
    delete newFilterParams["capacity[between]"];

    delete newFilterParams["capacity[gt]"];

    // Set capacity filter according to capacityType.
    let capacity;

    switch (capacityType) {
      case "between":
        capacity = { "capacity[between]": capacityValue };

        break;
      case "gt":
      default:
        capacity = { "capacity[gt]": capacityValue };

        break;
    }

    setFilterParams({ ...newFilterParams, ...capacity });
  }, [capacityFilter]);

  // Set facility filter.
  useEffect(() => {
    const filterParamsObj = { ...filterParams };

    delete filterParamsObj.monitorEquipment;

    delete filterParamsObj.wheelchairAccessible;

    delete filterParamsObj.videoConferenceEquipment;

    delete filterParamsObj.catering;

    const facilitiesObj = {};

    facilityFilter.forEach((value) => {
      facilitiesObj[value.value] = "true";
    });

    setFilterParams({ ...filterParamsObj, ...facilitiesObj });
  }, [facilityFilter]);

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

  const viewSwapHandler = (event) => {
    const view = event.target.getAttribute("data-view");

    setBookingView(view);
  };

  return (
    <div className="App">
      {config && config.user_name && displayState && (
        <AppMenu config={config} displayState={displayState} setDisplayState={setDisplayState} />
      )}
      <div className="container-fluid app-wrapper">
        {!config && <LoadingSpinner />}
        {config && displayState === "maximized" && (
          <div className="app-content">
            <div className={`row filters-wrapper ${showResourceDetails !== null ? "disable-filters" : ""}`}>
              <div className="col-md-3">
                {/* Dropdown with locations */}
                <Select
                  styles={{}}
                  defaultValue={locationFilter}
                  placeholder="lokationer..."
                  closeMenuOnSelect={false}
                  options={locationOptions}
                  onChange={(selectedLocations) => {
                    setLocationFilter(selectedLocations);
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
                  onChange={(selectedResources) => {
                    setResourceFilter(selectedResources);
                  }}
                  isMulti
                />
              </div>
              {/* Dropdown with facilities */}
              <div className="col-md-3">
                <Select
                  styles={{}}
                  defaultValue={facilityFilter}
                  placeholder="Facilitieter..."
                  closeMenuOnSelect={false}
                  options={facilityOptions}
                  onChange={(selectedFacilities) => {
                    setFacilityFilter(selectedFacilities);
                  }}
                  isMulti
                />
              </div>
              {/* Dropdown with capacity */}
              <div className="col-md-3">
                <Select
                  styles={{}}
                  defaultValue={{ value: "0", label: "Alle", type: "gt" }}
                  placeholder="Siddepladser..."
                  closeMenuOnSelect
                  options={capacityOptions}
                  onChange={(selectedCapacity) => {
                    setCapacityFilter(selectedCapacity);
                  }}
                />
              </div>
            </div>

            {/* Add info box */}
            <div className="row info-box-wrapper">
              {config.info_box_color && config.info_box_header && config.info_box_content && (
                <InfoBox config={config} />
              )}
            </div>

            {/* Add viewswapper */}
            <div className="row viewswapper-wrapper">
              <div className="viewswapper-container">
                <button
                  type="button"
                  onClick={viewSwapHandler}
                  data-view="map"
                  className={bookingView === "map" ? "active booking-btn" : "booking-btn"}
                >
                  Kort
                </button>
                <button
                  type="button"
                  onClick={viewSwapHandler}
                  data-view="calendar"
                  className={bookingView === "calendar" ? "active booking-btn" : "booking-btn"}
                >
                  Kalender
                </button>
                <button
                  type="button"
                  onClick={viewSwapHandler}
                  data-view="list"
                  className={bookingView === "list" ? "active booking-btn" : "booking-btn"}
                >
                  Liste
                </button>
              </div>
            </div>

            {bookingView === "map" && (
              <div className="row no-gutter main-container map">
                <h2>Map view!</h2>
              </div>
            )}
            {bookingView === "list" && (
              <div
                className={`row no-gutter main-container list ${
                  showResourceDetails !== null ? "resourceview-visible" : ""
                }`}
              >
                <ListContainer resources={resources} setShowResourceDetails={setShowResourceDetails} />
                <ResourceView
                  showResourceDetails={showResourceDetails}
                  setShowResourceDetails={setShowResourceDetails}
                />
              </div>
            )}
            {bookingView === "calendar" && (
              // {/* Display calendar for selections */}
              <div
                className={`row no-gutter main-container calendar ${
                  showResourceDetails !== null ? "resourceview-visible" : ""
                }`}
              >
                <Calendar
                  resources={resources}
                  events={events}
                  date={date}
                  setDate={setDate}
                  calendarSelection={calendarSelection}
                  setCalendarSelection={setCalendarSelection}
                  config={config}
                  setShowResourceDetails={setShowResourceDetails}
                  urlResource={urlResource}
                  setDisplayState={setDisplayState}
                  locations={locations}
                  setEvents={setEvents}
                  validUrlParams={validUrlParams}
                  locationFilter={locationFilter}
                  showResourceDetails={showResourceDetails}
                />
                {/* TODO: Only show if resource view is requested */}
                <ResourceView
                  showResourceDetails={showResourceDetails}
                  setShowResourceDetails={setShowResourceDetails}
                />
              </div>
            )}
          </div>
        )}

        {config && displayState === "userPanel" && (
          <div className="user-panel-content">
            <div className="row no-gutter main-container">
              <UserPanel config={config} />
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
