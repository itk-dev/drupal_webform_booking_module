import React, { useEffect, useRef } from "react";
import dayjs from "dayjs";

function calendarSelectionBox({ calendarSelection }) {
    useEffect(() => {
        
    }, []);

    /**
     * @param {Date} dateObj Date for format.
     * @returns {string} Date formatted as string.
     */
    function getFormattedDate(startStr) {
        const formattedDate = dayjs(startStr).format("dddd [d.] D. MMMM YYYY");
        return formattedDate;
    }
    function getFormattedTime(startStr, endStr) {
        const formattedTimeStart = dayjs(startStr).format("HH:mm");
        const formattedTimeEnd = dayjs(endStr).format("HH:mm");

        return `kl. ${formattedTimeStart} til ${formattedTimeEnd}`
    }
    return (
            <div id='calendar-selection-dot'>
                <div id='calendar-selection-line'>
                    <div className="testhest" id="calendar-selection-container">
                        <button id="calendar-selection-close">x</button>
                        <span id="calendar-selection-choice">Dit valg</span>
                        <span id="calendar-selection-choice-title"><b>{calendarSelection.resource._resource.title}</b></span>
                        <span><b>{getFormattedDate(calendarSelection.startStr)}</b></span>
                        <span><b>{getFormattedTime(calendarSelection.startStr, calendarSelection.endStr)}</b></span>
                        <button id="calendar-selection-choice-confirm" type="button" >Fortsæt med dette valg</button>
                    </div>
                </div>
            </div>
    );
    
}
export default calendarSelectionBox;