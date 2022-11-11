import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as PropTypes from "prop-types";
import AuthorFields from "./components/author-fields";
import Calendar from "./components/calendar";
import MinimizedDisplay from "./components/minimized-display";
import ResourceView from "./components/resource-view";
import InfoBox from "./components/info-box";
import ListContainer from "./components/list-container";
import MapWrapper from "./components/map-wrapper";
import MainNavigation from "./components/main-navigation";
import Api from "./util/api";
import UrlValidator from "./util/url-validator";
import { hasOwnProperty, filterAllResources } from "./util/helpers";
import "react-toastify/dist/ReactToastify.css";
import CreateBookingFilters from "./components/create-booking-filters";
import CreateBookingTabs from "./components/create-booking-tabs";

/**
 * CreateBooking component.
 *
 * @param {object} props The props
 * @param {object} props.config App config.
 * @returns {JSX.Element} Component.
 */
function CreateBooking({ config }) {
  const [urlParams] = useSearchParams();
  // Booking data.
  const [date, setDate] = useState(new Date());
  const [calendarSelection, setCalendarSelection] = useState({});
  const [authorFields, setAuthorFields] = useState({ subject: "", email: "" });
  // Filter parameters, selected in CreateBookingFilters. An object containing
  // structured information about current filtering.
  const [filterParams, setFilterParams] = useState({});
  const [locationFilter, setLocationFilter] = useState([]);
  const [resourceFilter, setResourceFilter] = useState([]);
  // App configuration and behavior.
  const [displayState, setDisplayState] = useState("maximized");
  const [urlResource, setUrlResource] = useState(null);
  const [validUrlParams, setValidUrlParams] = useState(null);
  const [activeTab, setActiveTab] = useState("calendar");
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResourceDetails, setShowResourceDetails] = useState(null);
  // Loaded data.
  const [resources, setResources] = useState(null);
  const [allResources, setAllResources] = useState([]);

  // Get configuration.
  useEffect(() => {
    if (UrlValidator.valid(urlParams) !== null) {
      setValidUrlParams(urlParams);

      setDisplayState("minimized");
    }
  }, []);

  // Effects to run when config is loaded. This should only happen once at app
  // initialisation.
  useEffect(() => {
    if (config) {
      Api.fetchAllResources(config.api_endpoint)
        .then((loadedResources) => {
          setAllResources(loadedResources);
        })
        .catch((fetchAllResourcesError) => {
          toast.error("Der opstod en fejl. Prøv igen senere.", fetchAllResourcesError);
        });
    }

    if (config && validUrlParams !== null) {
      Api.fetchResource(config.api_endpoint, validUrlParams.get("resource"))
        .then((loadedResource) => {
          setUrlResource(loadedResource);
        })
        .catch((fetchResourceError) => {
          toast.error("Der opstod en fejl. Prøv igen senere.", fetchResourceError);
        });
    }
  }, [config]);

  // Effects to run when urlResource is set. This should only happen once in
  // extension of app initialisation.
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
        resource: urlResource,
      });
    }
  }, [urlResource]);

  // Find resources that match filterParams.
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

      if (Object.values(filterParams).length > 0 && urlSearchParams.toString() !== "") {
        setIsLoading(true);

        const matchingResources = filterAllResources(allResources, filterParams);

        setUserHasInteracted(true);

        if (matchingResources.length !== 0) {
          setResources(matchingResources);
        } else {
          setResources([]);

          setIsLoading(false);
        }
      } else {
        setResources([]);
      }
    }
  }, [filterParams]);

  // Set selection as json.
  useEffect(() => {
    if (config?.output_field_id) {
      document.getElementById(config.output_field_id).value = JSON.stringify({
        start: calendarSelection.start,
        end: calendarSelection.end,
        resourceId: calendarSelection?.resource?.resourceMail ?? calendarSelection.resourceId,
        ...authorFields,
      });
    }
  }, [calendarSelection, authorFields]);

  const displayInfoBox = config?.info_box_color && config?.info_box_header && config?.info_box_content;

  return (
    config && (
      <div className="App">
        <div className="container-fluid">
          <MainNavigation config={config} />
          <div className="app-wrapper">
            <div>
              {displayState === "maximized" && (
                <div className="app-content">
                  <CreateBookingFilters
                    filterParams={filterParams}
                    setFilterParams={setFilterParams}
                    allResources={allResources}
                    disabled={showResourceDetails ?? false}
                    locationFilter={locationFilter}
                    setLocationFilter={setLocationFilter}
                    resourceFilter={resourceFilter}
                    setResourceFilter={setResourceFilter}
                  />

                  {displayInfoBox && <InfoBox config={config} />}

                  <CreateBookingTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                  {/* Map view */}
                  {activeTab === "map" && (
                    <div className="row no-gutter main-container map">
                      <MapWrapper
                        allResources={allResources}
                        config={config}
                        setLocationFilter={setLocationFilter}
                        setBookingView={setActiveTab}
                      />
                    </div>
                  )}

                  {/* List view */}
                  {activeTab === "list" && (
                    <div
                      className={`row no-gutter main-container list ${
                        showResourceDetails !== null ? "resourceview-visible" : ""
                      }`}
                    >
                      <ListContainer
                        resources={resources}
                        setShowResourceDetails={setShowResourceDetails}
                        userHasInteracted={userHasInteracted}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                      />
                      <ResourceView
                        showResourceDetails={showResourceDetails}
                        setShowResourceDetails={setShowResourceDetails}
                      />
                    </div>
                  )}

                  {/* Calendar view */}
                  {activeTab === "calendar" && (
                    // {/* Display calendar for selections */}
                    <div
                      className={`row no-gutter main-container calendar ${
                        showResourceDetails !== null ? "resourceview-visible" : ""
                      }`}
                    >
                      <Calendar
                        resources={resources}
                        date={date}
                        setDate={setDate}
                        calendarSelection={calendarSelection}
                        setCalendarSelection={setCalendarSelection}
                        config={config}
                        setShowResourceDetails={setShowResourceDetails}
                        urlResource={urlResource}
                        setDisplayState={setDisplayState}
                        showResourceDetails={showResourceDetails}
                        userHasInteracted={userHasInteracted}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                      />

                      <ResourceView
                        showResourceDetails={showResourceDetails}
                        setShowResourceDetails={setShowResourceDetails}
                      />
                    </div>
                  )}
                </div>
              )}

              {urlResource && displayState === "minimized" && calendarSelection && (
                <div className="row">
                  <MinimizedDisplay
                    setDisplayState={setDisplayState}
                    urlResource={urlResource}
                    calendarSelection={calendarSelection}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Display author fields if user is logged in */}
        {!config?.step_one && (
          <div className="row no-gutter">
            {authorFields && <AuthorFields authorFields={authorFields} setAuthorFields={setAuthorFields} />}
          </div>
        )}
      </div>
    )
  );
}

CreateBooking.propTypes = {
  config: PropTypes.shape({
    api_endpoint: PropTypes.string.isRequired,
    license_key: PropTypes.string,
    output_field_id: PropTypes.string,
    info_box_color: PropTypes.string,
    info_box_header: PropTypes.string,
    info_box_content: PropTypes.string,
    step_one: PropTypes.bool,
  }).isRequired,
};

export default CreateBooking;