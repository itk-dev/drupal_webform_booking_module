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
  const [userInformation, setUserInformation] = useState(null);

  // Get configuration.
  useEffect(() => {
    Api.fetchAllResources(config.api_endpoint)
      .then((loadedResources) => {
        setAllResources(loadedResources);
      })
      .catch((fetchAllResourcesError) => {
        toast.error("Der opstod en fejl. Prøv igen senere.", fetchAllResourcesError);
      });

    Api.fetchUserInformation(config.api_endpoint).then((retrievedUserInformation) => {
      setUserInformation(retrievedUserInformation);
    });
  }, []);

  useEffect(() => {
    // If existing booking data is set in url, start in minimized state.
    if (UrlValidator.valid(urlParams) !== null && allResources !== []) {
      setValidUrlParams(urlParams);

      const matchingResource = Object.values(allResources).filter((value) => {
        return value.id === parseInt(urlParams.get("resource"), 10);
      })[0];

      setUrlResource(matchingResource);

      setDisplayState("minimized");
    }
  }, [allResources]);

  // Effects to run when urlResource is set. This should only happen once in
  // extension of app initialisation.
  useEffect(() => {
    // If resource is set in url parameters, select the relevant filters.
    if (urlResource && urlResource !== []) {
      // Set location filter.
      if (hasOwnProperty(urlResource, "location")) {
        setLocationFilter([
          {
            value: urlResource.location,
            label: urlResource.location,
          },
        ]);
      }

      // Set resource filter.
      if (hasOwnProperty(urlResource, "resourceMail") && hasOwnProperty(urlResource, "resourceName")) {
        setResourceFilter([
          {
            value: urlResource.resourceMail,
            label: urlResource.resourceName,
          },
        ]);
      }
    }
    // Set filter params to trigger filtering of resources
    if (urlResource && urlResource.location && urlResource.resourceMail) {
      setFilterParams({ "location[]": urlResource.location, "resourceMail[]": urlResource.resourceMail });
    }

    // Use data from url parameters.
    if (validUrlParams && Object.values(calendarSelection).length === 0 && urlResource) {
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
    setIsLoading(true);

    setResources(filterAllResources(allResources, filterParams));

    if (Object.values(filterParams).length > 0) {
      setUserHasInteracted(true);
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

  const onTabChange = (tab) => {
    setActiveTab(tab);

    setIsLoading(true);
  };

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
                    disabled={showResourceDetails !== null ?? false}
                    locationFilter={locationFilter}
                    setLocationFilter={setLocationFilter}
                    resourceFilter={resourceFilter}
                    setResourceFilter={setResourceFilter}
                    userType={userInformation?.userType}
                  />

                  {displayInfoBox && <InfoBox config={config} />}

                  <CreateBookingTabs activeTab={activeTab} onTabChange={onTabChange} />

                  {/* Map view */}
                  {activeTab === "map" && (
                    <div className="row no-gutter main-container map">
                      <MapWrapper
                        allResources={allResources}
                        config={config}
                        setLocationFilter={setLocationFilter}
                        setBookingView={onTabChange}
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
