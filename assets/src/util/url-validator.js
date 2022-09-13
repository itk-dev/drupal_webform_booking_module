import dayjs from "dayjs";

/** Url validator. */
export default class UrlValidator {
  static valid(urlParams) {
    let invalid = false
    switch (true) {
      // Check for existing values
      case (urlParams.get("from") === null):
      case (urlParams.get("to") === null):
      case (urlParams.get("location") === null):
        invalid = true;
      default:
    }
    console.log('aa', invalid);
    for (const [key, value] of urlParams) {
      // Parameter specific validation.
      switch (key) {
        case 'from':
        case 'to':
          // @todo validate on full date string.
          if(!dayjs(value, 'YYYY-MM-DD', true).isValid()) {
            invalid = true;
          }
          break;
        case 'location':
          // @todo check that the location exists.
          break;
        default:
      }
    }

    if(invalid) {
      return null
    }
    return urlParams;
  }
}
