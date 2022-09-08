import React from "react";
import * as PropTypes from "prop-types";
import ResourceDetails from "./resource-details";
import "./resource-view.scss";

/**
 * @param {object} props Props
 * @param {string} props.id Resource id.
 * @param {object} props.config App config.
 * @param {Function} props.setResourceId Resource id setter
 * @param {object} props.showResourceView Show resourceview
 * @param {Function} props.setShowResourceView Show resourceview setter
 * @param {object} props.resource Resource data
 * @param {Function} props.setResource Resource data setter
 * @param {object} props.facilities Facilities data
 * @param {Function} props.setFacilities Facilities data setter
 * @returns {string} Component.
 */
function ResourceView({
  id,
  config,
  resource,
  setResource,
  facilities,
  setFacilities,
  showResourceViewId,
  setshowResourceViewId
}) {
  /** Hide resource view */
  function hideResourceView() {
    setshowResourceViewId(null);
    setResource(false);
    setFacilities(null);
  }
  return (
    <div
      className={
        showResourceViewId !== null
          ? "fade-in-background resource-view"
          : "resource-view"
      }
      style={{ display: showResourceViewId !== null ? "block" : "none" }}
    >
      <ResourceDetails
        config={config}
        resourceId={id}
        hideResourceView={hideResourceView}
        resource={resource}
        setResource={setResource}
        facilities={facilities}
        setFacilities={setFacilities}
        showResourceViewId={showResourceViewId}
      />
    </div>
  );
}

ResourceView.propTypes = {
  id: PropTypes.string.isRequired,
  config: PropTypes.shape({
    api_endpoint: PropTypes.string.isRequired,
  }).isRequired,
  resource: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setResource: PropTypes.func.isRequired,
  facilities: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setFacilities: PropTypes.func.isRequired,
  showResourceViewId: PropTypes.string.isRequired,
  setShowResourceView: PropTypes.func.isRequired
};

export default ResourceView;
