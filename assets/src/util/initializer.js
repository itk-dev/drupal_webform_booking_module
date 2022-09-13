/**
 * Initialize the app with certain values.
 */
import UrlValidator from "./url-validator";
import dayjs from "dayjs";

/** Initializer. */
export default class Initializer {
  static initLocation(urlParams) {
    if(UrlValidator.valid(urlParams)) {
      return urlParams.get('location')
    }
  }

  static initDate(urlParams) {
    if(UrlValidator.valid(urlParams)) {
      return new Date(urlParams.get('from'))
    }
    return new Date();
  }

  static initAuthorFields(urlParams) {
    return {email: ""};
  }

  static initCalendarSelection(urlParams) {
    if(UrlValidator.valid(urlParams)) {
      return {
        from: new Date(urlParams.get('from')),
        to: new Date(urlParams.get('to')),
        allDay: false,
        resourceId: urlParams.get('location')
      }
    }
    return {};
  }
}
