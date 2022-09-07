import React, { useState, useEffect } from "react";
import * as PropTypes from "prop-types";
import Api from "../util/api";
import LoadingSpinner from "./loading-spinner";
import "./resource-details.scss";

/**
 * @param {object} props Props.
 * @param {object} props.resourceId Resource id.
 * @param {object} props.config App config.
 * @param props.hideResourceView
 * @param props.resource
 * @param props.setResource
 * @param props.facilities
 * @param props.setFacilities
 * @param props.showResourceView
 * @returns {object} Component.
 */
function ResourceDetails({
  resourceId,
  config,
  hideResourceView,
  resource,
  setResource,
  facilities,
  setFacilities,
  showResourceView,
}) {
  useEffect(() => {
    if (config && resourceId !== null) {
      Api.fetchResource(config.api_endpoint, resourceId)
        .then((loadedResource) => {
          setResource(loadedResource);
          setFacilities(loadedResource.facilities);
        })
        .catch(() => {
          // TODO: Display error and retry option for user.
        });
    }
  }, [resourceId, config]);

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
            <img src="/assets/images/icons/Chair.svg" alt="capacity" />
          </div>
          <span>{resource.capacity} siddepladser</span>
        </div>
        {Object.keys(facilities).map((key) => {
          return (
            <div className="facility-item" key={key}>
              <div className="facility-icon">
                <img src={facilities[key].icon} alt="facility" />
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
        showResourceView === true
          ? "fade-in-content resource-container"
          : "  resource-container"
      }
    >
      {!resource && <LoadingSpinner />}
      {resource && (
        <div>
          <div className="resource-headline">
            <span>Ressource information</span>
            <button type="button" onClick={hideResourceView}>
              Tilbage til listen
            </button>
          </div>
          <div className="resource-title">
            <h2>{resource.resourcemail}</h2>
          </div>
          <div className="resource-details">
            <div className="image">
              <img
                src="https://via.placeholder.com/500x300"
                onStateChange={(imageState) => {
                  console.log(imageState);
                }}
                alt=""
              />
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
                <span>Adresse...</span>
              </div>
            </div>
          </div>
          <div className="resource-description">
            <span>Beskrivelse</span>
            <div>
              <span>{resource.resourcedescription}</span>
            </div>
          </div>
          <div className="resource-guidelines">
            <span>Priser og vilkår</span>
            <div>
              <span>Priser og vilkår...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

ResourceDetails.propTypes = {
  resourceId: PropTypes.string.isRequired,
  config: PropTypes.shape({
    api_endpoint: PropTypes.string.isRequired,
  }).isRequired,
};

export default ResourceDetails;
