import React from "react";
import dayjs from "dayjs";
import "dayjs/locale/da";
import "react-toastify/dist/ReactToastify.css";
import * as PropTypes from "prop-types";

dayjs.locale("da");

/**
 * CreateBookingTabs component.
 *
 * @param {object} props The props
 * @param {string} props.activeTab Name of the active tab.
 * @param {Function} props.setActiveTab Set the active tab.
 * @returns {JSX.Element} Component.
 */
function CreateBookingTabs({ activeTab, setActiveTab }) {
  const onTabClick = (event) => {
    const tab = event.target.getAttribute("data-view");

    setActiveTab(tab);
  };

  return (
    <div className="row viewswapper-wrapper">
      <div className="viewswapper-container">
        <button
          type="button"
          onClick={onTabClick}
          data-view="calendar"
          className={activeTab === "calendar" ? "active booking-btn" : "booking-btn"}
        >
          Kalender
        </button>
        <button
          type="button"
          onClick={onTabClick}
          data-view="list"
          className={activeTab === "list" ? "active booking-btn" : "booking-btn"}
        >
          Liste
        </button>
        <button
          type="button"
          onClick={onTabClick}
          data-view="map"
          className={activeTab === "map" ? "active booking-btn" : "booking-btn"}
        >
          Kort
        </button>
      </div>
    </div>
  );
}

CreateBookingTabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default CreateBookingTabs;
