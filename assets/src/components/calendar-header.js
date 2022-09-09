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
              type="button"
              onClick={(e) => onChangeDate(e)}
            >
              Today
            </button>
          </div>
          <div className="col-md-4">
            <div className="datepicker">
              <input
                className="calendar-datepicker-input"
                id="calendar-datepicker"
                type="date"
                min={dayjs(new Date()).format("YYYY-MM-DD")}
                value={dayjs(date).format("YYYY-MM-DD")}
                onChange={(e) => onChangeDate(e)}
              />
              <label className="h3 calendar-title" htmlFor="calendar-datepicker">
                {dayjs(date).format("D. MMMM YYYY")}
                <span className="small">X</span>
              </label>
            </div>
          </div>
          <div className="col-md-4">
            <div className="calendar-nav">
              <button
                id="calendar-back"
                type="button"
                disabled={new Date() > date}
                onClick={(e) => onChangeDate(e)}
              >
                Back
              </button>
              <button
                id="calendar-forward"
                type="button"
                onClick={(e) => onChangeDate(e)}
              >
                Forward
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
