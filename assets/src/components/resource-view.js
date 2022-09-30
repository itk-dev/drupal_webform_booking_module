import React from "react";
import * as PropTypes from "prop-types";
import ResourceDetails from "./resource-details";
import "./resource-view.scss";

/**
 * @param {object} props Props
 * @param {object} props.config App config.
 * @param {number} props.showResourceViewId Id of the resource to load
 * @param {Function} props.setShowResourceViewId ShowResourceViewId data setter
 * @returns {JSX.Element} Component.
 */
function ResourceView({ config, showResourceViewId, setShowResourceViewId }) {
  const hideResourceView = () => {
    setShowResourceViewId(null);
  };

  return (
    <div className="fade-in-background resource-view">
      <ResourceDetails config={config} hideResourceView={hideResourceView} showResourceViewId={showResourceViewId} />
    </div>
  );
}

ResourceView.propTypes = {
  config: PropTypes.shape({
    api_endpoint: PropTypes.string.isRequired,
  }).isRequired,
  showResourceViewId: PropTypes.number,
  setShowResourceViewId: PropTypes.func.isRequired,
};

ResourceView.defaultProps = {
  showResourceViewId: null,
};

export default ResourceView;
