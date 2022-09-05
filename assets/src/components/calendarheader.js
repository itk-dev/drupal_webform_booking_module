import { useEffect, useState } from 'react';
import dayjs from "dayjs";
import Calendar from "./calendar";
import ConfigLoader from "../util/config-loader";

function CalendarHeader({drupalConfig, date, setDate}) {

  const onChangeDate = (event) => {
    switch(event.target.id) {
      case 'calendar-today':
        setDate(new Date());
        break;
      case 'calendar-back':
        if(new Date() < date) {
          setDate(new Date(dayjs(date).subtract(1, 'day').format("YYYY-MM-DD")));
        }
        break;
      case 'calendar-forward':
        setDate(new Date(dayjs(date).add(1, 'day').format("YYYY-MM-DD")));
        break;
      case 'calendar-datepicker':
        setDate(new Date(event.target.value))
        break;
      default:
    }
  };

  return (
    <div className="col-md-12">
      <button id="calendar-today" onClick={(e)=>onChangeDate(e)}>Today</button>
      <button id="calendar-back" disabled={new Date() > date} onClick={(e)=>onChangeDate(e)}>Back</button>
      <button id="calendar-forward" onClick={(e)=>onChangeDate(e)}>Forward</button>
      <div className="datepicker pull-right">
        <input
          class="calendar-datepicker-input"
          id="calendar-datepicker"
          type="date"
          min={dayjs(new Date()).format("YYYY-MM-DD")}
          value={dayjs(date).format("YYYY-MM-DD")}
          onChange={(e)=>onChangeDate(e)}
        />
      </div>
    </div>
  );
}

export default CalendarHeader;
