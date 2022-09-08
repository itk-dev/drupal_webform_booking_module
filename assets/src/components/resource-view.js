import React from "react";
import * as PropTypes from "prop-types";
import ResourceDetails from "./resource-details";
import "./resource-view.scss";

/**
 * @param root0
 * @param root0.id
 * @param root0.config
 * @param root0.setResourceId
 * @param root0.showResourceView
 * @param root0.setShowResourceView
 * @param root0.resource
 * @param root0.setResource
 * @param root0.facilities
 * @param root0.setFacilities
 */

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
  setResourceId,
  showResourceView,
  setShowResourceView,
  resource,
  setResource,
  facilities,
  setFacilities,
}) {

  function hideResourceView() {
    setShowResourceView(null);
    setResourceId(null);
    setResource(false);
    setFacilities(null);
  }
  return (
    <div
      className={
        showResourceView === true
          ? "fade-in-background resource-view"
          : "resource-view"
      }
      style={{ display: showResourceView === true ? "block" : "none" }}
    >
      <ResourceDetails
        config={config}
        resourceId={id}
        hideResourceView={hideResourceView}
        resource={resource}
        setResource={setResource}
        facilities={facilities}
        setFacilities={setFacilities}
        showResourceView={showResourceView}
      />
    </div>
  );
}

ResourceView.propTypes = {
  id: PropTypes.string.isRequired,
  config: PropTypes.shape({
    api_endpoint: PropTypes.string.isRequired,
  }).isRequired,
  setResourceId: PropTypes.func.isRequired,
  showResourceView: PropTypes.bool.isRequired,
  setShowResourceView: PropTypes.func.isRequired,
  resource: PropTypes.object.isRequired,
  setResource: PropTypes.func.isRequired,
  facilities: PropTypes.object.isRequired,
  setFacilities: PropTypes.func.isRequired,
};

export default ResourceView;
