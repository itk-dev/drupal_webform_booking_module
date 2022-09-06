import { useState, useEffect } from "react";
import Api from "../../util/api";

/**
 * @param root0
 * @param root0.resourceId
 * @param root0.config
 */
function resourceDetails({ resourceId, config }) {
  const [resource, setResource] = useState();
  const [facilities, setFacilities] = useState();

  useEffect(() => {
    if (config && resourceId !== null) {
      Api.fetchResource(config.api_endpoint, "1")
        .then((resource) => {
          setResource(resource);
          setFacilities(resource.facilities);
        })
        .catch(() => {
          // TODO: Display error and retry option for user.
        });
    }
  }, [resourceId]);

  /**
   *
   */
  function getFacilitiesList() {
    return (
      <div className="facility-container">
        <div className="facility-item">
          <div className="facility-icon">
            <img src="/assets/images/icons/Chair.svg" />
          </div>
          <span>{resource.capacity} siddepladser</span>
        </div>
        {Object.keys(facilities).map((key, index) => {
          return (
            <div className="facility-item" key={index}>
              <div className="facility-icon">
                <img src={facilities[key].icon} />
              </div>
              <span>{facilities[key].title}</span>
            </div>
          );
        })}
      </div>
    );
  }
  return (
    resource && (
      <div className="resource-container">
        <div className="resource-headline">
          <span>Ressource information</span>
          <button>Tilbage til listen</button>
        </div>
        <div className="resource-title">
          <h2>{resource.resourcemail}</h2>
        </div>
        <div className="resource-details">
          <div className="image">
            <img src="https://via.placeholder.com/500x300" />
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
    )
  );
}
export default resourceDetails;
