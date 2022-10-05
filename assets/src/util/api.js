import dayjs from "dayjs";
import { ReactComponent as IconProjector } from "../assets/projector.svg";
import { ReactComponent as IconWheelchair } from "../assets/wheelchair.svg";
import { ReactComponent as IconVideocamera } from "../assets/videocamera.svg";
import { ReactComponent as IconFood } from "../assets/food.svg";
import { ReactComponent as IconCandles } from "../assets/candles.svg";

export default class Api {
  static async fetchLocations(apiEndpoint) {
    return fetch(`${apiEndpoint}itkdev_booking/locations`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`This is an HTTP error: The status is ${response.status}`);
        }

        return response.json();
      })
      .then((data) => data["hydra:member"]);
  }

  static async fetchResources(apiEndpoint, urlSearchParams) {
    return fetch(`${apiEndpoint}itkdev_booking/resources?${urlSearchParams}`)
    .then((response) => response.json())
    .then((data) => {
      let resourcesObj = [];
      data = data["hydra:member"];
      data.forEach((res) => {
        const resourceData = { ...res };
        resourceData.facilities = {
          ...(!res.monitorequipment && {
            monitorequipment: {
              title: "Projektor / Skærm",
              icon: <IconProjector />,
            },
          }),
          ...(!res.wheelchairaccessible && {
            wheelchairaccessible: {
              title: "Handicapvenligt",
              icon: <IconWheelchair />,
            },
          }),
          ...(!res.videoconferenceequipment && {
            videoconferenceequipment: {
              title: "Videoconference",
              icon: <IconVideocamera />,
            },
          }),
          ...(!res.catering && {
            catering: {
              title: "Forplejning",
              icon: <IconFood />,
            },
          }),
          ...(!res.holidayOpeningHours && {
            holidayOpeningHours: {
              title: "Tilgængelig på helligdag",
              icon: <IconCandles />,
            },
          }),
        };
        resourcesObj.push(resourceData);
      })
      console.log(resourcesObj);
      return resourcesObj;
    });
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
    return fetch(`${apiEndpoint}itkdev_booking/busy_intervals?${urlSearchParams}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`This is an HTTP error: The status is ${response.status}`);
        }

        return response.json();
      })
      .then((data) => data["hydra:member"]);
  }

  static async fetchResource(apiEndpoint, resourceId) {
    return fetch(`${apiEndpoint}itkdev_booking/resources/${resourceId}`).then((response) => response.json());
  }

  static async fetchUserBookings(apiEndpoint) {
    return fetch(`${apiEndpoint}itkdev_booking/user-bookings`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`This is an HTTP error: The status is ${response.status}`);
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
          throw new Error(`This is an HTTP error: The status is ${response.status}`);
        }

        return response.json();
      })
      .then((data) => data["hydra:member"]);
  }
}
