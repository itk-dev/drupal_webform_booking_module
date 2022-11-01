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
    // Set all tables in fullcalendar to be presentation tables.
    const selections = document.querySelectorAll('.fc table');
    selections.forEach((selection) => {
        //selection.setAttribute('role','presentation')
        selection.setAttribute('summary','layout table')
        selection.setAttribute('aria-describedby','calendar-caption')
    });
    // Set table scroller to not be tab indexed.
    const scrollers = document.querySelectorAll('.fc-scroller');
    scrollers.forEach((selection) => {
        selection.setAttribute('style','tabindex:-1')
    });
}

export function setAriaLabelFilters() {
    const filters = document.querySelectorAll('.filters-wrapper .filter');
    filters.forEach((filter) => {
        const id = filter.getAttribute('id')
        const inputs = document.querySelectorAll('#'  + id + ' input');
        inputs.forEach((input) => {
            input.setAttribute('aria-label',id)
            input.setAttribute('aria-controls',id)
        });
    });
}