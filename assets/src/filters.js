/**
 * Add filter values from booking filters.
 *
 * @param {NodeList} bookingFilterElements : A list of nodes.
 * @returns {{ object }} : A list of filters and their current values.
 */
export function bookingFilterValues(bookingFilterElements) {
  const filters = {};
  bookingFilterElements.forEach((bookingFilter) => {
    switch (bookingFilter.getAttribute("id")) {
      case "booking-date-picker-booking":
        filters.bookingDate = bookingFilter.value;
        break;
      case "booking-room-select-booking":
        if (bookingFilter.value === "_empty") {
          filters.resource = null;
        } else {
          filters.resource = bookingFilter.value;
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
