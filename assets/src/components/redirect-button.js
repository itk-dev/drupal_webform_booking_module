import React from "react";
import * as PropTypes from "prop-types";

/**
 * Redirect button component.
 *
 * @param {object} props Props.
 * @param {object} props.calendarSelection The selected timeslot in booking
 *   calendar.
 * @param {object} props.config Config for the app.
 * @returns {string} Redirect button.
 */
function RedirectButton({ calendarSelection, config }) {
  const onRedirectClick = () => {
    const paramsObj = {
      from: calendarSelection.startStr,
      to: calendarSelection.endStr,
      resource: Object.prototype.hasOwnProperty.call(
        calendarSelection,
        "resource"
      )
        ? calendarSelection.resource.id
        : undefined,
    };
    if (
      paramsObj.from === undefined ||
      paramsObj.to === undefined ||
      paramsObj.resource === undefined
    ) {
      window.open(config.redirect_url, "_self");
    } else {
      const paramsStr = new URLSearchParams(paramsObj).toString();
      window.open(`${config.redirect_url}?${paramsStr}`, "_self");
    }
  };

  return (
    <button
      id="redirect-button"
      type="button"
      onClick={(e) => onRedirectClick(e)}
    >
      Log ind for at foretage booking
    </button>
  );
}

RedirectButton.propTypes = {
  calendarSelection: PropTypes.shape({
    startStr: PropTypes.string.isRequired,
    endStr: PropTypes.string.isRequired,
    resource: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }).isRequired,
  config: PropTypes.shape({
    license_key: PropTypes.string.isRequired,
    redirect_url: PropTypes.string.isRequired,
  }).isRequired,
};

export default RedirectButton;
