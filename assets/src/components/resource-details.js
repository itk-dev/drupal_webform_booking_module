import React from "react";
import * as PropTypes from "prop-types";
import LoadingSpinner from "./loading-spinner";
import getResourceFacilities from "../util/resource-utils";
import "./resource-details.scss";
import { ReactComponent as IconChair } from "../assets/chair.svg";

/**
 * @param {object} props Props.
 * @param {object} props.resource Object of the resource to show
 * @returns {JSX.Element} Component.
 */
function ResourceDetails({setShowResourceDetails, resource}) {
  const hideResourceView = () => {
    setShowResourceDetails(null);
  };

  const getFacilitiesList = (resource) => {
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
            <h2>{resource.title}</h2>
          </div>
          <div className="resource-details">
            <div className="image">
              <img alt="placeholder" src="https://via.placeholder.com/500x300" />
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
              <div className="spacer"></div>
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


export default ResourceDetails;
