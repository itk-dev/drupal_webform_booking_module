/** Config loader. */
export default class ConfigLoader {
  static async loadConfig() {
    return fetch("config.json")
      .then((response) => response.json())
      .catch(() => {
        // Defaults.
        return {
          "api_endpoint": "https://selvbetjening.local.itkdev.dk/",
          "element_id": "booking",
          "front_page_url": "https://selvbetjening.local.itkdev.dk/",
          "license_key": "",
          "enable_booking": true,
          "enable_resource_tooltips": true
        }
      });
  }
}
