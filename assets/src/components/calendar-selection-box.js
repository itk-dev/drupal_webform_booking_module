import React from "react";
import * as PropTypes from "prop-types";
import dayjs from "dayjs";
/* eslint no-underscore-dangle: 0 */

/**
 * Calendar selection box component.
 *
 * @param {object} props Props.
 * @param {object} props.calendarSelection Object containing selection info
 *   returned by fullcalendar
 * @returns {object} Calendar selection box
 */
function CalendarSelectionBox({ calendarSelection }) {
  /**
   * @param {string} startStr String containing the start-dateTime of the
   *   selection
   * @returns {string} Date formatted as string.
   */
  function getFormattedDate(startStr) {
    const formattedDate = dayjs(startStr).format("dddd [d.] D. MMMM YYYY");
    return formattedDate;
  }

  /**
   * @param {string} startStr String containing the start-dateTime of the
   *   selection
   * @param {string} endStr String containing the end-dateTime of the selection
   * @returns {string} Time formatted as string.
   */
  function getFormattedTime(startStr, endStr) {
    const formattedTimeStart = dayjs(startStr).format("HH:mm");
    const formattedTimeEnd = dayjs(endStr).format("HH:mm");

    return `kl. ${formattedTimeStart} til ${formattedTimeEnd}`;
  }

  return (
    <div id="calendar-selection-dot">
      <div id="calendar-selection-line">
        <div id="calendar-selection-container">
          <button id="calendar-selection-close" type="button">
            x
          </button>
          <span id="calendar-selection-choice">Dit valg</span>
          <span id="calendar-selection-choice-title">
            <b>{calendarSelection.resource._resource.title}</b>
          </span>
          <span>
            <b>{getFormattedDate(calendarSelection.start)}</b>
          </span>
          <span>
            <b>
              {getFormattedTime(calendarSelection.start, calendarSelection.end)}
            </b>
          </span>
          <button id="calendar-selection-choice-confirm" type="button">
            Fortsæt med dette valg
          </button>
        </div>
      </div>
    </div>
  );
}

CalendarSelectionBox.propTypes = {
  calendarSelection: PropTypes.shape({
    resource: PropTypes.shape({
      _resource: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    start: PropTypes.shape({}).isRequired,
    end: PropTypes.shape({}).isRequired,
  }).isRequired,
};

export default CalendarSelectionBox;
