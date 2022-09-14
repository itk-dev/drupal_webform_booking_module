import dayjs from "dayjs";

/** Url validator. */
export default class UrlValidator {
  static valid(urlParams) {
    let invalid = false;
    switch (true) {
      // Check for existing values
      case urlParams.get("from") === null:
      case urlParams.get("to") === null:
      case urlParams.get("resource") === null:
        invalid = true;
        break;
      default:
    }

    Object.entries(urlParams).forEach(([key, value]) => {
      switch (key) {
        case "from":
        case "to":
          if (!dayjs(value, "YYYY-MM-DDTHH:MN:SS", true).isValid()) {
            invalid = true;
          }
          break;
        default:
      }
    });

    if (invalid) {
      return null;
    }
    return urlParams;
  }
}
