import React, { useEffect } from "react";
import "./list.scss";
import * as PropTypes from "prop-types";
import getResourceFacilities from "../util/resource-utils";
import { ReactComponent as IconChair } from "../assets/chair.svg";

/**
 * @param {object} props Props.
 * @param {object} props.resources Resources object
 * @param {Function} props.setShowResourceDetails Setter for showResourceDetails resource object
 * @returns {JSX.Element} List of resources
 */
function List({ resources, setShowResourceDetails }) {
  useEffect(() => {}, [resources]);

  const showResourceView = (event) => {
    const key = event.target.getAttribute("data-key");

    if (resources[key]) {
      setShowResourceDetails(resources[key]);
    }
  };

  /**
   * Get facilities list.
   *
   * @param {object} resource Resource object
   * @returns {string} Facilities list.
   */
  const getFacilitiesList = (resource) => {
    const facilities = getResourceFacilities(resource);

    return (
      <div className="facility-container">
        <div className="facility-item">
          <div className="facility-icon">
            <IconChair /> {resource.capacity}
          </div>
        </div>
        {Object.values(facilities).map((value) => {
          return (
            <div className="facility-item" key={value.title}>
              <div className="facility-icon">{value.icon}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      {Object.keys(resources).map((key) => {
        return (
          <div key={key} className="list-resource">
            <div className="list-resource-image">
              <img alt="kitten" src="https://placekitten.com/150/150" />
            </div>
            <div className="list-resource-details col-md-10">
              <span>
                <b>{resources[key].resourceName}</b>
              </span>
              <div>
                <span className="">{resources[key].location}</span>
                <div>{getFacilitiesList(resources[key])}</div>
              </div>
              <span>{resources[key].resourceDescription}</span>
            </div>
            <div className="list-resource-actions col-md-2">
              <button type="button" className="booking-btn" data-key={key} onClick={showResourceView}>
                Vis resource
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

List.propTypes = {
  resources: PropTypes.arrayOf(
    PropTypes.shape({
      resourceName: PropTypes.string,
      location: PropTypes.string,
      resourceDescription: PropTypes.string,
    })
  ).isRequired,
  setShowResourceDetails: PropTypes.func.isRequired,
};

export default List;
