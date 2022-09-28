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

  static async fetchResources(apiEndpoint, urlSearchParams) {
    return fetch(`${apiEndpoint}itkdev_booking/resources?${urlSearchParams}`)
    .then((response) => response.json())
    .then((data) => {
      data = data["hydra:member"];
      data.forEach((res) => {
        const resourceData = { ...res };
        resourceData.facilities = {
          ...(res.monitorequipment && {
            monitorequipment: {
              title: "Projektor / Skærm",
              icon: <IconProjector />,
            },
          }),
          ...(res.wheelchairaccessible && {
            wheelchairaccessible: {
              title: "Handicapvenligt",
              icon: <IconWheelchair />,
            },
          }),
          ...(res.videoconferenceequipment && {
            videoconferenceequipment: {
              title: "Videoconference",
              icon: <IconVideocamera />,
            },
          }),
          ...(res.catering && {
            catering: {
              title: "Forplejning",
              icon: <IconFood />,
            },
          }),
          ...(res.holidayOpeningHours && {
            holidayOpeningHours: {
              title: "Tilgængelig på helligdag",
              icon: <IconCandles />,
            },
          }),
        };
      })
    });

      // .then((response) => {
      //   console.log(response);
      //   // if (!response.ok) {
      //   //   throw new Error(
      //   //     `This is an HTTP error: The status is ${response.status}`
      //   //   );
      //   // }
      //   // response.json()
      // })
      // .then((data) => {
      //   console.log(data);
      //   return data;
      // });
      // data["hydra:member"]);
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
    return fetch(`${apiEndpoint}itkdev_booking/resources/${resourceId}`).then(
      (response) => response.json()
    );
  }

  static async fetchResourceFacilities(apiEndpoint, resourceId) {
    return fetch(`${apiEndpoint}itkdev_booking/resources/${resourceId}`).then(
         (response) => response.json())
        .then((data) => {
          const resourceData = { ...data };
          resourceData.facilities = {
            ...(data.monitorequipment && {
              monitorequipment: {
                title: "Projektor / Skærm",
                icon: <IconProjector />,
              },
            }),
            ...(data.wheelchairaccessible && {
              wheelchairaccessible: {
                title: "Handicapvenligt",
                icon: <IconWheelchair />,
              },
            }),
            ...(data.videoconferenceequipment && {
              videoconferenceequipment: {
                title: "Videoconference",
                icon: <IconVideocamera />,
              },
            }),
            ...(data.catering && {
              catering: {
                title: "Forplejning",
                icon: <IconFood />,
              },
            }),
            ...(data.holidayOpeningHours && {
              holidayOpeningHours: {
                title: "Tilgængelig på helligdag",
                icon: <IconCandles />,
              },
            }),
          };
          return resourceData;
        })
        .catch(() => {
          // TODO: Display error and retry option for user.
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
