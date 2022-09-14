import React, { useEffect, useState } from 'react';
import "./info-box.scss";

function infoBox({ config }) {
    const [infoBoxColor, setInfoBoxColor] = useState("");
    const [infoBoxHeader, setInfoBoxHeader] = useState("");
    const [infoBoxContent, setInfoBoxContent] = useState("");
    const [showInfoBox, setShowInfoBox] = useState("flex");

    useEffect(() => {
        setInfoBoxColor(config.info_box_color);
        setInfoBoxHeader(config.info_box_header);
        setInfoBoxContent(config.info_box_content);
    }, [config]);
    const hideInfoBox = () => {
        setShowInfoBox("none");
    }
    return (
        <div className="row info-box" style={{backgroundColor: infoBoxColor + 'em', display: showInfoBox}}>
            <div className="col-md-11 info-box-content">
                <span className="info-box-content-header"><b>{infoBoxHeader}</b></span>
                <span className="info-box-content-text">{infoBoxContent}</span>
            </div>
            <div className="col-md-1 info-box-close" onClick={hideInfoBox}>
                <span>x</span>
            </div>
        </div>
    );
}
export default infoBox;