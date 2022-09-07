import React, { useState } from "react";
import * as PropTypes from "prop-types";
import ResourceDetails from "./resource-details";
import "./resource-view.scss";

/**
 * @param {object} props Props
 * @param {string} props.id Resource id.
 * @param {object} props.config App config.
 * @returns {string} Component.
 */

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
  /** @param event */
  function clickme(event) {
    if (event.target.className.indexOf("resource-view") > -1) {
      hideResourceView();
    }
  }
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
      onClick={clickme}
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
};

export default ResourceView;
