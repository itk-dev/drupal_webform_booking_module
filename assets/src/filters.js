/**
 * Add filter values from booking filters.
 *
 * @param {NodeList} bookingFilterElements : A list of nodes.
 * @returns {{ object }} : A list of filters and their current values.
 */
export function bookingFilterValues(bookingFilterElements) {
  const filters = {};
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  bookingFilterElements.forEach((bookingFilter) => {
    switch (bookingFilter.getAttribute("id")) {
      case "booking-room-select-booking":
        if (bookingFilter.value === "_empty") {
          filters.resources ='';
          Object.keys(bookingFilter.options).forEach((key) => {
            if (bookingFilter.options[key].value !== "_empty") {
              filters.resources += bookingFilter.options[key].value + ',';
            }
          });
          filters.resources = filters.resources.slice(0, -1);
        }
        else {
          filters.resources = bookingFilter.value;
        }
        break;
      case "booking-date-picker-booking":
        if (bookingFilter.value) {
          const selectedDate = new Date(bookingFilter.value);
          const dayAfter = new Date(selectedDate);
          dayAfter.setDate(selectedDate.getDate() + 1);
          filters.dateStart = selectedDate.toISOString().split("T")[0];
          filters.dateEnd = dayAfter.toISOString().split("T")[0]
        }
        else {
          filters.dateStart = now.toISOString().split("T")[0];
          filters.dateEnd = tomorrow.toISOString().split("T")[0]
        }
        break;
      default:
    }
  });
  return filters;
}

/**
 * Add resources to resource dropdown, defined by drupal config.
 *
 * @param {HTMLElement} resourceDropdownNode : A list of nodes.
 * @param {object} drupalSettings : Settings provided by Drupal
 */
export function initializeResourceDropdown(
  resourceDropdownNode,
  drupalSettings
) {
  Object.keys(drupalSettings.rooms).forEach((key) => {
    if (drupalSettings.rooms[key] !== 0) {
      resourceDropdownNode.options[resourceDropdownNode.options.length] =
        new Option(drupalSettings.rooms[key], key);
    }
  });
}
