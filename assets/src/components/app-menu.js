import React from "react";
import * as PropTypes from "prop-types";
import showFormFields from "../util/dom-manipulation-utils";
import "./app-menu.scss";

/**
 * App menu component.
 *
 * @class
 * @param {object} props Props.
 * @param {object} props.config Config for the app.
 * @param {string} props.displayState The current display state.
 * @param {Function} props.setDisplayState Set display state function.
 * @returns {JSX.Element} App menu component.
 */
function AppMenu({ config, displayState, setDisplayState }) {
  const onMenuClick = (e, display) => {
    e.preventDefault();

    e.stopPropagation();

    switch (display) {
      case "user_panel":
        setDisplayState("userPanel");

        showFormFields(false);

        break;
      default:
        setDisplayState("maximized");

        showFormFields(true);
    }
  };

  return (
    <div className="container-fluid app-menu">
      <ul>
        <li className="user-name">{config.user_name}</li>
        <li>
          <button
            id="change-booking"
            type="button"
            onClick={(e) => onMenuClick(e, "new_booking")}
            className={displayState === "maximized" ? "active" : "inactive"}
          >
            Ny booking
          </button>
        </li>
        <li>
          <button
            id="change-booking"
            type="button"
            onClick={(e) => onMenuClick(e, "user_panel")}
            className={displayState === "userPanel" ? "active" : "inactive"}
          >
            Dine bookinger
          </button>
        </li>
      </ul>
    </div>
  );
}

AppMenu.propTypes = {
  config: PropTypes.shape({
    user_name: PropTypes.string.isRequired,
  }).isRequired,
  displayState: PropTypes.string.isRequired,
  setDisplayState: PropTypes.func.isRequired,
};

export default AppMenu;
