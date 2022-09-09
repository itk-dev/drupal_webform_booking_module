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
      location,
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
    const dateEnd = dayjs(date).endOf("day");

    // Setup query parameters.
    const urlSearchParams = new URLSearchParams({
      resources: resources.map((resource) => resource.resourceMail),
      dateStart: date.toISOString(),
      dateEnd: dateEnd.toISOString(),
      page: 1,
    });

    // Events on resource.
    return fetch(
      `${apiEndpoint}itkdev_booking/busy_intervals?${urlSearchParams}`
    )
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
    return fetch(`${apiEndpoint}itkdev_booking/resources/${resourceId}`)
      .then((response) => response.json())
      .then((data) => {
        const newDate = { ...data };

        // TODO: Remove and handle this in ResourceDetails.

        newDate.facilities = {
          ...(data.monitorequipment && {
            monitorequipment: {
              title: "Projektor / Skærm",
              icon: "/assets/images/icons/Projector.svg",
            },
          }),
          ...(data.wheelchairaccessible && {
            wheelchairaccessible: {
              title: "Handicapvenligt",
              icon: "/assets/images/icons/Wheelchair.svg",
            },
          }),
          ...(data.videoconferenceequipment && {
            videoconferenceequipment: {
              title: "Videoconference",
              icon: "/assets/images/icons/Video-camera.svg",
            },
          }),
          ...(data.catering && {
            catering: {
              title: "Forplejning",
              icon: "/assets/images/icons/Food.svg",
            },
          }),
          ...(data.holidayOpeningHours && {
            holidayOpeningHours: {
              title: "Tilgængelig på helligdag",
              icon: "/assets/images/icons/Candles.svg",
            },
          }),
        };

        return newDate;
      });
  }

  static async fetchUserBookings(apiEndpoint) {
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

  static async deleteBooking(apiEndpoint, bookingId) {
    return fetch(`${apiEndpoint}itkdev_booking/user-booking/${bookingId}`, {
      method: "DELETE",
    })
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
