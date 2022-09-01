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
    return fetch(`${apiEndpoint}itkdev_booking/bookings?${urlSearchParams}`)
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

  static async fetchResource(apiEndpoint, resourceId) {
    // Setup query parameters.
    const urlSearchParams = new URLSearchParams({
      id: resourceId,
    });

    return fetch(`${apiEndpoint}itkdev_booking/resources`)
      .then((response) => response.json())
      .then((data) => {
        data['resource'] = data['hydra:member'];
        data['facilities'] = {
          ...data['resource'][0].monitorequipment && { monitorequipment: { title: 'Projektor / Skærm', icon: '/assets/images/icons/Projector.svg' } },
          ...data['resource'][0].wheelchairaccessible && { wheelchairaccessible: { title: 'Handicapvenligt', icon: '/assets/images/icons/Wheelchair.svg' } },
          ...data['resource'][0].videoconferenceequipment && { videoconferenceequipment: { 'videoconferenceequipment': '/assets/images/icons/Video-camera.svg' } },
          ...data['resource'][0].catering && { catering: { 'catering': '/assets/images/icons/Food.svg' } },
          ...data['resource'][0].holidayOpeningHours && { holidayOpeningHours: { 'holidayOpeningHours': '/assets/images/icons/Candles.svg' } },
        }
        return data;
      })
  }

  static async fetchUserBookings(apiEndpoint, userId) {
    return fetch(`${apiEndpoint}itkdev_booking/user-bookings`)
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
