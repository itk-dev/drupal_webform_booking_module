import "./userbookings.css";

const element = document.getElementById("booking-filters-user_bookings");
const elementId = element.getAttribute("booking-element-id");
let elementSettings;
/* eslint no-underscore-dangle: 0 */
/**
 * Provide an overview of user bookings with data from Drupal.
 *
 * @param {object} drupalSettings : Drupal settings added to this js.
 */
(function (drupalSettings) {
  elementSettings = drupalSettings.user_bookings[elementId];
  fetch(`${elementSettings.front_page_url}/itkdev_booking/user-bookings`)
    .then((response) => response.json())
    .then((data) => handleData(data));
})(drupalSettings);

/** @param {object} bookingData : Data object retrieved from api endpoint */
function handleData(bookingData) {
  let dataFormatted = [];
  dataFormatted = bookingData["hydra:member"];
  dataFormatted.forEach(function (value, index) {
    let { hitId } = value;
    hitId = btoa(hitId);
    fetch(
      `${elementSettings.front_page_url}/itkdev_booking/booking-details/${hitId}`
    )
      .then((response) => response.json())
      .then((data) => {
        dataFormatted[index].displayName = data["hydra:member"][0].displayName;
        dataFormatted[index].eventBody = data["hydra:member"][0].body;
        appendElementToBookingContainer(dataFormatted[index]);
      });
  });
}

/** @param {object} data : Formatted data object retrieved from api endpoint */
function appendElementToBookingContainer(data) {
  const bookingContainer = element.querySelector(`div.bookings-${elementId}`);
  const loaderPresent = element.querySelector("div.loader") !== null;
  if (loaderPresent) {
    bookingContainer.innerHTML = "";
  }
  if (data.start === null || data.end === null) {
    return false;
  }
  const startDate = new Date(data.start).toLocaleDateString("da-dk", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const startTime = new Date(data.start).toLocaleTimeString("da-dk", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endDate = new Date(data.end).toLocaleDateString("da-dk", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const endTime = new Date(data.end).toLocaleTimeString("da-dk", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("btn");
  deleteButton.classList.add("btn-danger");
  deleteButton.innerText = "Slet booking";
  deleteButton.onclick = function (e) {
    e.preventDefault();
    // removeBooking(data.id);
  };

  const location = document.createElement("span");
  location.classList.add("location");
  location.innerHTML = `<b>${data.displayName}</b><span class='subject'>${data.subject}</span>`;

  const start = document.createElement("span");
  start.innerHTML = `${startDate} kl. ${startTime}`;

  const end = document.createElement("span");
  end.innerHTML = `${endDate} kl. ${endTime}`;

  const container = document.createElement("div");
  const dateContainer = document.createElement("div");
  dateContainer.classList.add("date-container");

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  container.setAttribute("data-id", data.id);
  container.classList.add("user-booking");
  container.append(location);
  dateContainer.append(start, "→", end);
  container.append(dateContainer);
  buttonContainer.append(deleteButton);
  container.append(buttonContainer);
  bookingContainer.append(container);
}


/** @param {string} id : unique id of the booking to be removed */
/* function removeBooking(id) {
  const params = {
    param1: "test1",
    param2: "test2",
  };
  const options = {
    method: "POST",
    body: JSON.stringify(params),
  };
  fetch(
    `${elementSettings.front_page_url}/itkdev_booking/remove-booking`,
    options
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      console.log(myJson);
    });

  document.querySelector(`div[data-id='${id}']`).remove();

  return;
} */

/** @param {string} id : id of the booking to be edited */
/* function editBooking(id) {
  alert(`edit booking - ${id}`);
} */
