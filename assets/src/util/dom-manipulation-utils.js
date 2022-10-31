/**
 * Remove empty aria-labelledby from empty selector.
 */
export function removeEmptyAriaLabelled() {
    const selections = document.querySelectorAll(".fc > .fc-view-harness");

    selections.forEach((selection) => {
        if (!selection.getAttribute('aria-labelledby')) {
            selection.removeAttribute('aria-labelledby');
        }
    });
}

/**
 * Mark tables in fullcalendar as presentation for accessibility tools to ignore it.
 */
export function presentationTables() {
    const selections = document.querySelectorAll('.fc table');
    selections.forEach((selection) => {
        selection.setAttribute('role','presentation')
    });
    const selections2 = document.querySelectorAll('.fc-scroller');
    selections2.forEach((selection) => {
        selection.setAttribute('style','tabindex:-1')
    });
}
