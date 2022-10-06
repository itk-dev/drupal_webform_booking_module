import React from "react";
import * as PropTypes from "prop-types";
import LoadingSpinner from "./loading-spinner";
import getResourceFacilities from "../util/resource-utils"
import "./resource-details.scss";
import { ReactComponent as IconChair } from "../assets/chair.svg";

/**
 * @param {object} props Props.
 * @param {Function} props.hideResourceView Hides and resets resource view
 * @param {Object} props.showResourceDetails Object of the resource to show
 * @returns {JSX.Element} Component.
 */
function ResourceDetails({
  hideResourceView,
  showResourceDetails
}) {

  const getFacilitiesList = (resource) => {
    let facilities = getResourceFacilities(resource);
    return (
      <div className="facility-container">
        <div className="facility-item">
          <div className="facility-icon">
            <IconChair />
          </div>
          <span>{showResourceDetails.capacity ?? showResourceDetails.extendedProps.capacity} siddepladser</span>
        </div>
        {Object.values(facilities).map((value, key) => {
          return (
            <div className="facility-item" key={key}>
              <div className="facility-icon">{value.icon}</div>
              <span>{value.title}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={showResourceDetails !== null ? "fade-in-content resource-container" : "  resource-container"}>
      {!showResourceDetails && <LoadingSpinner />}
      {showResourceDetails && (
        <div>
          <div className="resource-headline">
            <span>Ressource information</span>
            <button type="button" className="booking-btn-inv" onClick={hideResourceView}>
              Tilbage til listen
            </button>
          </div>
          <div className="resource-title">
            <h2>{showResourceDetails.title ?? showResourceDetails.resourceName}</h2>
          </div>
          <div className="resource-details">
            <div className="image">
              <img src="https://via.placeholder.com/500x300" alt="" />
            </div>
            <div className="facilities">
              <span>Faciliteter</span>
              <div>
              {getFacilitiesList(showResourceDetails)}
              </div>
            </div>
            <div className="location">
              <span>Lokation</span>
              <div>
                <span>{showResourceDetails.location ?? showResourceDetails.extendedProps.building}</span>
              </div>
              <div>
                <span>...</span>
              </div>
            </div>
          </div>
          <div className="resource-description">
            <span>Beskrivelse</span>
            <div>
              <span>{showResourceDetails.resourceDescription ?? showResourceDetails.extendedProps.description}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

ResourceDetails.propTypes = {
  hideResourceView: PropTypes.func.isRequired,
  showResourceDetails: PropTypes.shape({})
};

ResourceDetails.defaultProps = {
  showResourceDetails: null
};

export default ResourceDetails;
