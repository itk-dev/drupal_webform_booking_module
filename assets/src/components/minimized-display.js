import React from "react";
import dayjs from "dayjs";
import * as PropTypes from "prop-types";
import "./minimized-display.scss";

/**
 * Minimized display component.
 *
 * @param {object} props Props.
 * @param {object} props.validUrlParams Validated parameters.
 * @param {Function} props.setDisplayState Set display state function.
 * @param {object} props.urlResource Resource fetched from URL.
 * @returns {string} Calendar header component.
 */
function MinimizedDisplay({ validUrlParams, setDisplayState, urlResource }) {
  const onChangeBooking = () => {
    setDisplayState("maximized");
  };

  return (
    <div className="col-md-12">
      <div className="row">
        {urlResource && (
          <div className="minimized-display col-md-12">
            <div>
              <span className="location">{urlResource.location}</span>
              <span className="subject">{urlResource.resourceName}</span>
            </div>
            <div>
              <span>
                {dayjs(validUrlParams.get("from")).format("DD/MM/YYYY - HH:mm")}
              </span>
              <span>→</span>
              <span>
                {dayjs(validUrlParams.get("to")).format("DD/MM/YYYY - HH:mm")}
              </span>
            </div>
            <div>
              <button
                id="change-booking"
                type="button"
                onClick={(e) => onChangeBooking(e)}
              >
                Change booking
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

MinimizedDisplay.propTypes = {
  validUrlParams: PropTypes.shape({
    get: PropTypes.func.isRequired,
  }),
  setDisplayState: PropTypes.func.isRequired,
  urlResource: PropTypes.shape({
    location: PropTypes.string.isRequired,
    resourceName: PropTypes.string.isRequired,
  }).isRequired,
};

MinimizedDisplay.defaultProps = {
  validUrlParams: null,
};

export default MinimizedDisplay;
