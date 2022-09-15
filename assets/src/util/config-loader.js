/** Config loader. */
export default class ConfigLoader {
  static async loadConfig() {
    // Load config from drupalSettings if available.
    if (window?.drupalSettings?.booking_app) {
      return window.drupalSettings.booking_app;
    }
    // Loading from config file in public folder.
    return fetch("config.json")
      .then((response) => response.json())
      .catch(() => {
        // Load defaults.
        return {
          api_endpoint: "https://selvbetjening.local.itkdev.dk/",
          element_id: "booking",
          front_page_url: "https://selvbetjening.local.itkdev.dk/",
          license_key: "",
          enable_booking: true,
          enable_resource_tooltips: true,
          output_field_id: "submit-values",
          step_one: false,
          redirect_url: "http://google.com/",
        };
      });
  }
}
