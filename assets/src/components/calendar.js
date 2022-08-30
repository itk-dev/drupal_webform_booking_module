import {useEffect} from "react";
import FullCalendar from '@fullcalendar/react' // must go before plugins
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import daLocale from "@fullcalendar/core/locales/da";
import resourceTimegrid from "@fullcalendar/resource-timegrid";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";

function Calendar({location, onCalendarChange}) {
  const dateNow = new Date();

  useEffect(() => {
    console.log("Location changed to " + location)
  }, [location]);

  return (
    <div className="Calendar">
      Selected location: {location}

      <button onClick={() => {
        onCalendarChange('fisk')
      }}>FISK</button>
      <FullCalendar
        plugins={[
          resourceTimegrid,
          interactionPlugin,
          dayGridPlugin,
          timeGridPlugin,
          listPlugin,
          resourceTimelinePlugin,
        ]}

        titleFormat={{
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          weekday: "long",
        }}
        customButtons={{
          prev: {
            text: "Prev",
            click() {
              //window.calendar.prev();
              //window.calendar.refetchResources();
            },
          },
          next: {
            text: "Next",
            click() {
              //window.calendar.next();
              //window.calendar.refetchResources();
            },
          },
        }}
        height="850px"
        selectMirror={true}
        /*scrollTime=@todo*/
        initialView="resourceTimelineDay"
        duration="days: 3"
        /*initialDate=""*/
        /*selectConstraint="businessHours"*/
        nowIndicator={true}
        navLinks={true}
        slotDuration="00:15:00"
        selectable={true}
        unselectAuto={false}
        schedulerLicenseKey="0245891543-fcs-1654684785"
        slotMinTime= "07:00:00"
        slotMaxTime= "21:00:00"
        slotLabelFormat= {{hour: '2-digit', minute: '2-digit'}}
        selectOverlap={false}
        nextDayThreshold="21:00:00"
        editable={false}
        dayMaxEvents={true}
        locale={daLocale}
        select={handleDateSelect}
        validRange={getValidRange(dateNow)}
        datesSet={setDate}
        loading={false}
        resources={[
          { id: 'a', building: '460 Bryant', title: 'Auditorium A' },
          { id: 'b', building: '460 Bryant', title: 'Auditorium B' }
        ]}
        events={[
          {title: 'event2', start: '2022-08-30', end: '2022-09-01', resourceId: 'a'},
          {title: 'event3', start: '2022-01-09T12:30:00',allDay : false}
        ]}
      />
    </div>
  );
}

export default Calendar;

function handleDateSelect(selectionInfo) {
  console.log(selectionInfo);
}

function getValidRange(dateNow) {
  return {start: dateNow}
}

function setDate(info) {
  console.log(info);
}

function getResources(info, successCallback, failureCallback) {
  console.log(info);
  console.log(successCallback);
  console.log(failureCallback)
}
