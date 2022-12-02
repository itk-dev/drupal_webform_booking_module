import React from "react";
import * as PropTypes from "prop-types";
import LoadingSpinner from "./loading-spinner";
import getResourceFacilities from "../util/resource-utils";
import "./resource-details.scss";
import { ReactComponent as IconChair } from "../assets/chair.svg";

/**
 * REsourece details component.
 *
 * @param {object} props Props.
 * @param {object} props.setShowResourceDetails Set show resource details
 * @param {object} props.resource Object of the resource to show
 * @returns {JSX.Element} Component.
 */
function ResourceDetails({ setShowResourceDetails, resource }) {
  const hideResourceView = () => {
    setShowResourceDetails(null);
  };

  const getFacilitiesList = () => {
    const facilities = getResourceFacilities(resource);

    return (
      <div className="facility-container">
        <div className="facility-item">
          <div className="facility-icon">
            <IconChair />
          </div>
          <span>{resource.capacity} siddepladser</span>
        </div>
        {Object.values(facilities).map((value) => {
          return (
            <div className="facility-item" key={value.title}>
              <div className="facility-icon">{value.icon}</div>
              <span>{value.title}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={resource !== null ? "fade-in-content resource-container" : "resource-container"}>
      {!resource && <LoadingSpinner />}
      {resource && (
        <div>
          <div className="resource-headline">
            <span>Ressource information</span>
            <button type="button" className="booking-btn-inv" onClick={hideResourceView}>
              Tilbage til listen
            </button>
          </div>
          <div className="resource-title">
            <h2>{resource.displayName}</h2>
          </div>
          <div className="resource-details">
            <div className="image-wrapper">
              <div className="image">
                <img alt={resource.displayName} src={resource.resourceImage} />
              </div>
            </div>
            <div className="facilities">
              <span className="resource-details--title">Faciliteter</span>
              <div>{getFacilitiesList(resource)}</div>
            </div>
            <div className="location">
              <span className="resource-details--title">Lokation</span>
              <div>
                <span>{resource.location}</span>
              </div>
              <div className="spacer" />
              <div>
                <span>{resource.streetName}</span>
              </div>
              <div>
                <span>{resource.postalCode}</span>
                &nbsp;
                <span>{resource.city}</span>
              </div>
            </div>
          </div>
          {resource.resourceDescription && (
            <div className="resource-description">
              <span>Beskrivelse</span>
              <div>
                <span>{resource.resourceDescription}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

ResourceDetails.propTypes = {
  setShowResourceDetails: PropTypes.func.isRequired,
  resource: PropTypes.shape({
    capacity: PropTypes.number.isRequired,
    displayName: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    streetName: PropTypes.string.isRequired,
    postalCode: PropTypes.number.isRequired,
    city: PropTypes.string.isRequired,
    resourceImage: PropTypes.string,
    resourceDescription: PropTypes.string,
  }).isRequired,
};

export default ResourceDetails;
