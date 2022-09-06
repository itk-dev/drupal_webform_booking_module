import React, { useEffect } from "react";
import ResourceDetails from "./resource-details";
import "./resource-view.scss";

/**
 * @param root0
 * @param root0.id
 * @param root0.config
 */
function ResourceView({ id, config }) {
  useEffect(() => {}, []);

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

export default ResourceView;
