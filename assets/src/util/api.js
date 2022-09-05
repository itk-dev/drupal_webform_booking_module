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
      resourceId: resourceId,
    });

    return fetch(`${apiEndpoint}itkdev_booking/resources/${resourceId}`)
      .then((response) => response.json())
      .then((data) => {
        data['facilities'] = {
          ...data.monitorequipment && { monitorequipment: { title: 'Projektor / Skærm', icon: '/assets/images/icons/Projector.svg' } },
          ...data.wheelchairaccessible && { wheelchairaccessible: { title: 'Handicapvenligt', icon: '/assets/images/icons/Wheelchair.svg' } },
          ...data.videoconferenceequipment && { videoconferenceequipment: { 'videoconferenceequipment': '/assets/images/icons/Video-camera.svg' } },
          ...data.catering && { catering: { 'catering': '/assets/images/icons/Food.svg' } },
          ...data.holidayOpeningHours && { holidayOpeningHours: { 'holidayOpeningHours': '/assets/images/icons/Candles.svg' } },
        }
        return data;
      })
  }

  static async fetchUserBookings(apiEndpoint, userId) {
    // Setup query parameters.
    const urlSearchParams = new URLSearchParams({
      userId: " ",
      page: 1
    });
    return fetch(`${apiEndpoint}itkdev_booking/user-bookings?${urlSearchParams}`)
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

  static async deleteBooking(apiEndpoint, bookingId) {
    return fetch(`${apiEndpoint}itkdev_booking/user-bookings/${bookingId}`)
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
