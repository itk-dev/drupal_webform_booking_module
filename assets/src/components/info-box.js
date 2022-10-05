import React, { useEffect, useState } from "react";
import * as PropTypes from "prop-types";
import "./info-box.scss";

/**
 * Information box component.
 *
 * @param {object} props Props.
 * @param {object} props.config Object containing configuration from drupal
 * @returns {JSX.Element} Info box component
 */
function InfoBox({ config }) {
  const [infoBoxColor, setInfoBoxColor] = useState("");
  const [infoBoxHeader, setInfoBoxHeader] = useState("");
  const [infoBoxContent, setInfoBoxContent] = useState("");
  const [showInfoBox, setShowInfoBox] = useState("flex");
  const hideInfoBox = () => setShowInfoBox("none");

  useEffect(() => {
    setInfoBoxColor(config.info_box_color);

    setInfoBoxHeader(config.info_box_header);

    setInfoBoxContent(config.info_box_content);
  }, [config]);

  // TODO: Handle "onKeyPress" deprecation.
  return (
    <div className="row info-box" style={{ backgroundColor: `${infoBoxColor}em`, display: showInfoBox }}>
      <div className="col-md-11 info-box-content">
        <span className="info-box-content-header">
          <b>{infoBoxHeader}</b>
        </span>
        <span className="info-box-content-text">{infoBoxContent}</span>
      </div>
      <div className="col-md-1 info-box-close" onClick={hideInfoBox} onKeyPress={hideInfoBox} role="presentation">
        <span>x</span>
      </div>
    </div>
  );
}

InfoBox.propTypes = {
  config: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default InfoBox;
