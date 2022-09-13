import React from "react";
import dayjs from "dayjs";
import * as PropTypes from "prop-types";
import "./minimized-display.scss";

/**
 * Calendar header component.
 *
 * @param {object} props Props.
 * @param {object} props.urlParams Date.
 * @param {Function} props.setDisplayState Set display state function.
 * @returns {string} Calendar header component.
 */
function MinimizedDisplay({ urlParams, setDisplayState }) {
  const onChangeBooking = (event) => {
    setDisplayState('maximized');
  };

  return (
    <div className="col-md-12">
      <div className="row">
        <div className="minimized-display col-md-12">
          <div>
            <span className="location">asdfg</span>
            <span className="subject">dsafgh</span>
          </div>
          <div>
            <span>dsaf</span>
            <span>→</span>
            <span>dsf</span>
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
      </div>
    </div>
  );
}

MinimizedDisplay.propTypes = {
  urlParams: PropTypes.shape({}).isRequired,
  setDisplayState: PropTypes.func.isRequired,
};

export default MinimizedDisplay;
