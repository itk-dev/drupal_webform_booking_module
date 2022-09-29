import React, { useEffect, useState } from "react";
import * as PropTypes from "prop-types";
import Api from "../util/api";
import LoadingSpinner from "./loading-spinner";
import "./resource-details.scss";
import { ReactComponent as IconChair } from "../assets/chair.svg";
import getResourceFacilities from "../util/resource-utils";

/**
 * @param {object} props Props.
 * @param {object} props.config App config.
 * @param {Function} props.hideResourceView Hides and resets resource view
 * @param {string} props.showResourceViewId Id of the resource to load
 * @returns {JSX.Element} Component.
 */
function ResourceDetails({ config, hideResourceView, showResourceViewId }) {
  const [facilities, setFacilities] = useState({});
  const [resource, setResource] = useState([]);

  // Load
  useEffect(() => {
    if (config && showResourceViewId) {
      Api.fetchResource(config.api_endpoint, showResourceViewId)
        .then((data) => {
          const newFacilities = getResourceFacilities(data);
          setResource(data);
          setFacilities(newFacilities);
        })
        .catch(() => {
          // TODO: Display error and retry option for user.
        });
    }
  }, [showResourceViewId, config]);

  return (
    <div className={showResourceViewId !== null ? "fade-in-content resource-container" : "  resource-container"}>
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
            <h2>{resource.resourceName}</h2>
          </div>
          <div className="resource-details">
            <div className="image">
              <img src="https://via.placeholder.com/500x300" alt="" />
            </div>
            <div className="facilities">
              <span>Faciliteter</span>
              <div className="facility-container">
                <div className="facility-item">
                  <div className="facility-icon">
                    <IconChair />
                  </div>
                  <span>{resource.capacity} siddepladser</span>
                </div>
                {Object.keys(facilities).map((key) => {
                  return (
                    <div className="facility-item" key={key}>
                      <div className="facility-icon">{facilities[key].icon}</div>
                      <span>{facilities[key].title}</span>
                    </div>
                  );
                })}
              </div>
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
  showResourceViewId: PropTypes.number,
};

ResourceDetails.defaultProps = {
  showResourceViewId: null,
};

export default ResourceDetails;
