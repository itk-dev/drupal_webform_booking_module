import React from "react";
import * as PropTypes from "prop-types";
import ResourceDetails from "./resource-details";
import "./resource-view.scss";

/**
 * @param {object} props Props
 * @param {object} props.config App config.
 * @param {object} props.resource Resource data
 * @param {Function} props.setResource Resource data setter
 * @param {object} props.facilities Facilities data
 * @param {Function} props.setFacilities Facilities data setter
 * @param {string} props.showResourceViewId Id of the resource to load
 * @param {Function} props.setShowResourceViewId ShowResourceViewId data setter
 * @returns {string} Component.
 */
function ResourceView({
  config,
  resource,
  setResource,
  facilities,
  setFacilities,
  showResourceDetails,
  setShowResourceDetails,
}) {
  /** Hide resource view */
  const hideResourceView = () => {
    setShowResourceDetails(null);
    setResource(false);
    setFacilities(null);
  };

  return (
    <div
      className={
        showResourceDetails !== null
          ? "fade-in-background resource-view"
          : "resource-view"
      }
      style={{ display: showResourceDetails !== null ? "block" : "none" }}
    >
      <ResourceDetails
        hideResourceView={hideResourceView}
        resource={resource}
        setResource={setResource}
        facilities={facilities}
        setFacilities={setFacilities}
        showResourceDetails={showResourceDetails}
      />
    </div>
  );
}

ResourceView.propTypes = {
  config: PropTypes.shape({
    api_endpoint: PropTypes.string.isRequired,
  }).isRequired,
  resource: PropTypes.arrayOf(PropTypes.shape({})),
  setResource: PropTypes.func.isRequired,
  facilities: PropTypes.arrayOf(PropTypes.shape({})),
  setFacilities: PropTypes.func.isRequired,
  showResourceDetails: PropTypes.shape({}),
  setShowResourceDetails: PropTypes.func.isRequired,
};

ResourceView.defaultProps = {
  resource: null,
  facilities: null,
  showResourceDetails: null,
};

export default ResourceView;
