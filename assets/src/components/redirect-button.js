import React from "react";
import * as PropTypes from "prop-types";

/**
 * Redirect button component.
 *
 * @param {object} props Props.
 * @param {object} props.calendarSelection The selected timeslot in booking calendar.
 * @param {object} props.config Config for the app.
 * @returns {JSX.Element} Redirect button.
 */
function RedirectButton({ calendarSelection, config }) {
  const onRedirectClick = () => {
    const paramsObj = {
      from: calendarSelection.start.toISOString(),
      to: calendarSelection.end.toISOString(),
      resource: calendarSelection.resource.extendedProps.resourceId ?? undefined,
    };
    if (paramsObj.from === undefined || paramsObj.to === undefined || paramsObj.resource === undefined) {
      window.open(config.redirect_url, "_self");
    } else {
      const paramsStr = new URLSearchParams(paramsObj).toString();
      window.open(`${config.redirect_url}?${paramsStr}`, "_self");
    }
  };

  return (
    <button id="redirect-button" type="button" onClick={onRedirectClick}>
      Log ind for at foretage booking
    </button>
  );
}

RedirectButton.propTypes = {
  calendarSelection: PropTypes.shape({
    resource: PropTypes.shape({
      extendedProps: PropTypes.shape({
        resourceId: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired,
    start: PropTypes.shape({
      toISOString: PropTypes.func.isRequired,
    }).isRequired,
    end: PropTypes.shape({
      toISOString: PropTypes.func.isRequired,
    }).isRequired,
    resourceId: PropTypes.string.isRequired,
  }).isRequired,
  config: PropTypes.shape({
    license_key: PropTypes.string.isRequired,
    redirect_url: PropTypes.string.isRequired,
  }).isRequired,
};

export default RedirectButton;
