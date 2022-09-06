import { useState, useEffect } from "react";
import ResourceDetails from "../resourceDetails/resourceDetails";
import Loadingspinner from "../loadingSpinner/loadingSpinner";
import "./resourceView.scss";

/**
 * @param root0
 * @param root0.id
 * @param root0.config
 */
function Resourceview({ id, config }) {
  useEffect(() => {}, []);

  return (
    <div className="Resourceview">
      <br />
      <hr />
      <br />
      <h1>Ressource Information:</h1>
      <ResourceDetails config={config} />
    </div>
  );
}

export default Resourceview;
