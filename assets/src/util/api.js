import dayjs from "dayjs";

export default class Api {
  static async fetchLocations(apiEndpoint) {
    return fetch(`${apiEndpoint}itkdev_booking/locations`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        return response.json();
      })
      .then((data) => data["hydra:member"]);
  }

  static async fetchResources(apiEndpoint, location) {
    // Setup query parameters.
    const urlSearchParams = new URLSearchParams({
      location: location,
    });

    return fetch(`${apiEndpoint}itkdev_booking/resources?${urlSearchParams}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        return response.json();
      })
      .then((data) => data["hydra:member"]);
  }

  static async fetchEvents(apiEndpoint, resources, date) {
    const dateEnd = dayjs(date).endOf('day');

    // Setup query parameters.
    const urlSearchParams = new URLSearchParams({
      resources: resources.map((resource) => resource.resourcemail),
      dateStart: date.toISOString(),
      dateEnd: dateEnd.toISOString(),
      page: 1,
    });

    // Events on resource.
    return fetch(`${config.api_endpoint}itkdev_booking/bookings?${urlSearchParams}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        return response.json();
      })
      .then((data) => data["hydra:member"]);
  }
}