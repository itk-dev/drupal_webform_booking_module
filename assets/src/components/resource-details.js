import React, { useEffect } from "react";
import * as PropTypes from "prop-types";
import Api from "../util/api";
import LoadingSpinner from "./loading-spinner";
import "./resource-details.scss";
import { ReactComponent as IconChair } from "../assets/chair.svg";
import { ReactComponent as IconProjector } from "../assets/projector.svg";
import { ReactComponent as IconWheelchair } from "../assets/wheelchair.svg";
import { ReactComponent as IconVideocamera } from "../assets/videocamera.svg";
import { ReactComponent as IconFood } from "../assets/food.svg";
import { ReactComponent as IconCandles } from "../assets/candles.svg";

/**
 * @param {object} props Props.
 * @param {object} props.config App config.
 * @param {Function} props.hideResourceView Hides and resets resource view
 * @param {object} props.resource Resource information object
 * @param {Function} props.setResource Resource information object setter
 * @param {Function} props.facilities Facilities information object
 * @param {Function} props.setFacilities Facilities information object setter
 * @param {string} props.showResourceViewId Id of the resource to load
 * @returns {JSX.Element} Component.
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
        .then((data) => {
          const resourceData = { ...data };
          resourceData.facilities = {
            ...(data.monitorequipment && {
              monitorequipment: {
                title: "Projektor / Skærm",
                icon: <IconProjector />,
              },
            }),
            ...(data.wheelchairaccessible && {
              wheelchairaccessible: {
                title: "Handicapvenligt",
                icon: <IconWheelchair />,
              },
            }),
            ...(data.videoconferenceequipment && {
              videoconferenceequipment: {
                title: "Videoconference",
                icon: <IconVideocamera />,
              },
            }),
            ...(data.catering && {
              catering: {
                title: "Forplejning",
                icon: <IconFood />,
              },
            }),
            ...(data.holidayOpeningHours && {
              holidayOpeningHours: {
                title: "Tilgængelig på helligdag",
                icon: <IconCandles />,
              },
            }),
          };
          setResource(resourceData);
          setFacilities(resourceData.facilities);
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
    );
  }

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
  resource: PropTypes.shape({
    capacity: PropTypes.number,
    resourceName: PropTypes.string,
    location: PropTypes.string,
    resourceDescription: PropTypes.string,
  }),
  setResource: PropTypes.func.isRequired,
  facilities: PropTypes.shape({}),
  setFacilities: PropTypes.func.isRequired,
  showResourceViewId: PropTypes.number,
};

ResourceDetails.defaultProps = {
  resource: null,
  facilities: null,
  showResourceViewId: null,
};

export default ResourceDetails;
