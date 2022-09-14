import React, { useEffect } from "react";
import * as PropTypes from "prop-types";
import Api from "../util/api";
import LoadingSpinner from "./loading-spinner";
import IconChair from "./icon-chair";
import "./resource-details.scss";

/**
 * @param {object} props Props.
 * @param {object} props.config App config.
 * @param {Function} props.hideResourceView Hides and resets resource view
 * @param {object} props.resource Resource information object
 * @param {Function} props.setResource Resource information object setter
 * @param {Function} props.facilities Facilities information object
 * @param {Function} props.setFacilities Facilities information object setter
 * @param {string} props.showResourceViewId Id of the resource to load
 * @returns {object} Component.
 */
function ResourceDetails({
  config,
  hideResourceView,
  resource,
  setResource,
  facilities,
  setFacilities,
  showResourceViewId,
}) {
  useEffect(() => {
    if (config && showResourceViewId !== null) {
      Api.fetchResource(config.api_endpoint, showResourceViewId)
        .then((loadedResource) => {
          setResource(loadedResource);
          setFacilities(loadedResource.facilities);
        })
        .catch(() => {
          // TODO: Display error and retry option for user.
        });
    }
  }, [showResourceViewId, config]);

  /**
   * Get facilities list.
   *
   * @returns {string} Facilities list.
   */
  function getFacilitiesList() {
    return (
      <div className="facility-container">
        <div className="facility-item">
          <div className="facility-icon">
            {<IconChair />}
          </div>
          <span>{resource.capacity} siddepladser</span>
        </div>
        {Object.keys(facilities).map((key) => {
          return (
            <div className="facility-item" key={key}>
              <div className="facility-icon">
                {facilities[key].icon}
              </div>
              <span>{facilities[key].title}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={
        showResourceViewId !== null
          ? "fade-in-content resource-container"
          : "  resource-container"
      }
    >
      {!resource && <LoadingSpinner />}
      {console.log(resource)}
      {resource && (
        <div>
          <div className="resource-headline">
            <span>Ressource information</span>
            <button type="button" onClick={hideResourceView}>
              Tilbage til listen
            </button>
          </div>
          <div className="resource-title">
            <h2>{resource.resourceName}</h2>
          </div>
          <div className="resource-details">
            <div className="image">
              <img src="https://via.placeholder.com/500x300" alt="" />
            </div>
            <div className="facilities">
              <span>Faciliteter</span>
              {facilities && getFacilitiesList()}
            </div>
            <div className="location">
              <span>Lokation</span>
              <div>
                <span>{resource.location}</span>
              </div>
              <div>
                <span>...</span>
              </div>
            </div>
          </div>
          <div className="resource-description">
            <span>Beskrivelse</span>
            <div>
              <span>{resource.resourceDescription}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

ResourceDetails.propTypes = {
  config: PropTypes.shape({
    api_endpoint: PropTypes.string.isRequired,
  }).isRequired,
  hideResourceView: PropTypes.func.isRequired,
  resource: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setResource: PropTypes.func.isRequired,
  facilities: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  setFacilities: PropTypes.func.isRequired,
  showResourceViewId: PropTypes.string.isRequired,
};

export default ResourceDetails;
