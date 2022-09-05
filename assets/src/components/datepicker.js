import { useState } from 'react';
import dayjs from "dayjs";
import Calendar from "./calendar";

function DatePicker({drupalConfig}) {
  const [calendarDisplayDate, setCalendarDisplayDate] = useState(dayjs().format("YYYY-MM-DD"));

  const onChangeDate = (date) => {
    setCalendarDisplayDate(dayjs(new Date(date.target.value)).format("YYYY-MM-DD"));
  };

  return (
    <div className="col-md-12">
      <div className="datepicker pull-right">
        <input
          type="date"
          value={calendarDisplayDate}
          onChange={(e)=>onChangeDate(e)}
        />
      </div>
    </div>
  );
}

export default DatePicker;
