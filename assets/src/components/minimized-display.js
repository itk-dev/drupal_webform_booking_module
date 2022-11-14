import React from "react";
import dayjs from "dayjs";
import * as PropTypes from "prop-types";
import "./minimized-display.scss";

/**
 * Minimized display component.
 *
 * @param {object} props Props.
 * @param {Function} props.setDisplayState Set display state function.
 * @param {object} props.urlResource Resource fetched from URL.
 * @param {object} props.calendarSelection A selection in calendar.
 * @returns {JSX.Element} Calendar header component.
 */
function MinimizedDisplay({ setDisplayState, urlResource, calendarSelection }) {
  const onChangeBooking = () => setDisplayState("maximized");
  const formatUrlDate = (dateString) => dayjs(dateString).format("DD/MM/YYYY - HH:mm");

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
              <span>{formatUrlDate(calendarSelection.start)}</span>
              <span>→</span>
              <span>{formatUrlDate(calendarSelection.end)}</span>
            </div>
            <div>
              <button id="change-booking" type="button" onClick={onChangeBooking}>
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
  setDisplayState: PropTypes.func.isRequired,
  urlResource: PropTypes.shape({
    location: PropTypes.string.isRequired,
    resourceName: PropTypes.string.isRequired,
  }).isRequired,
  calendarSelection: PropTypes.shape({
    start: PropTypes.shape({}),
    end: PropTypes.shape({}),
  }).isRequired,
};

export default MinimizedDisplay;
