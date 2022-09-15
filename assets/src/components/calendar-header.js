import React from "react";
import dayjs from "dayjs";
import * as PropTypes from "prop-types";
import "./calendar-header.scss";

/**
 * Calendar header component.
 *
 * @param {object} props Props.
 * @param {object} props.date Date.
 * @param {Function} props.setDate Set date function.
 * @returns {string} Calendar header component.
 */
function CalendarHeader({ date, setDate }) {
  const onChangeDate = (event) => {
    switch (event.target.id) {
      case "calendar-today":
        setDate(new Date());
        break;
      case "calendar-back":
        if (new Date() < date) {
          setDate(
            new Date(dayjs(date).subtract(1, "day").format("YYYY-MM-DD"))
          );
        }
        break;
      case "calendar-forward":
        setDate(new Date(dayjs(date).add(1, "day").format("YYYY-MM-DD")));
        break;
      case "calendar-datepicker":
        setDate(new Date(event.target.value));
        break;
      default:
    }
  };

  return (
    <div className="row">
      <div className="col-md-12 no-gutter">
        <div className="row calendar-header-wrapper">
          <div className="col-md-4">
            <button
              id="calendar-today"
              className="booking-btn"
              type="button"
              onClick={onChangeDate}
            >
              I dag
            </button>
          </div>
          <div className="col-md-4 datepicker-container">
            <div className="datepicker">
              <label htmlFor="calendar-datepicker" className="datepicker-label">
                <input
                  type="date"
                  id="calendar-datepicker"
                  min={dayjs(new Date()).format("YYYY-MM-DD")}
                  value={dayjs(date).format("YYYY-MM-DD")}
                  onChange={onChangeDate}
                />
                <button type="button" id="calendar_text">
                  {dayjs(date).format("D. MMMM YYYY")} <span>📅</span>
                </button>
              </label>
            </div>
          </div>
          <div className="col-md-4">
            <div className="calendar-nav">
              <button
                id="calendar-back"
                className="booking-btn"
                type="button"
                disabled={new Date() > date}
                onClick={onChangeDate}
              >
                ‹
              </button>
              <button
                id="calendar-forward"
                className="booking-btn"
                type="button"
                onClick={onChangeDate}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

CalendarHeader.propTypes = {
  date: PropTypes.shape({}).isRequired,
  setDate: PropTypes.func.isRequired,
};

export default CalendarHeader;
