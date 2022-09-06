import React from "react";
import * as PropTypes from "prop-types";
import ResourceDetails from "./resource-details";
import "./resource-view.scss";

/**
 * @param {object} props Props
 * @param {string} props.id Resource id.
 * @param {object} props.config App config.
 * @returns {string} Component.
 */
function ResourceView({ id, config }) {
  return (
    <div className="Resourceview">
      <br />
      <hr />
      <br />
      <h1>Ressource Information:</h1>
      {}
      <ResourceDetails config={config} resourceId={id} />
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
