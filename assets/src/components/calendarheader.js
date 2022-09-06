import { useEffect, useState } from "react";
import dayjs from "dayjs";
import Calendar from "./calendar";
import ConfigLoader from "../util/config-loader";

/**
 * @param root0
 * @param root0.drupalConfig
 * @param root0.date
 * @param root0.setDate
 */
function CalendarHeader({ drupalConfig, date, setDate }) {
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
    <div className="col-md-12">
      <div className="row calendar-header-wrapper">
        <div className="col-md-4">
          <button id="calendar-today" onClick={(e) => onChangeDate(e)}>
            Today
          </button>
        </div>
        <div className="col-md-4">
          <div className="datepicker text-center">
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
          <div className="pull-right">
            <button
              id="calendar-back"
              disabled={new Date() > date}
              onClick={(e) => onChangeDate(e)}
            >
              Back
            </button>
            <button id="calendar-forward" onClick={(e) => onChangeDate(e)}>
              Forward
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarHeader;
