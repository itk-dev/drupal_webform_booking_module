import React from "react";
import * as PropTypes from "prop-types";
import ResourceDetails from "./resource-details";
import "./resource-view.scss";

/**
 * @param {object} props Props
 * @param {object} props.config App config.
 * @param {number} props.showResourceDetails Object of the resource to load
 * @param {Function} props.setShowResourceDetails showResourceDetails data setter
 * @returns {JSX.Element} Component.
 */
function ResourceView({
  showResourceDetails,
  setShowResourceDetails,
}) {
  /** Hide resource view */
  const hideResourceView = () => {
    setShowResourceDetails(null);
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
        showResourceDetails={showResourceDetails}
      />
    </div>
  );
}

ResourceView.propTypes = {
  showResourceDetails: PropTypes.shape({}),
  setShowResourceDetails: PropTypes.func.isRequired,
};

ResourceView.defaultProps = {
  showResourceDetails: null
};

export default ResourceView;
