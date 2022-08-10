/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/userbookings.css":
/*!******************************!*\
  !*** ./src/userbookings.css ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*****************************!*\
  !*** ./src/userbookings.js ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _userbookings_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./userbookings.css */ "./src/userbookings.css");


const element = document.getElementById("booking-filters-user_bookings");
const elementId = element.getAttribute("booking-element-id");
let elementSettings;
/* eslint no-underscore-dangle: 0 */
/**
 * Provide an overview of user bookings with data from Drupal.
 *
 * @param {object} Drupal : A Drupal object.
 * @param {object} drupalSettings : Drupal settings added to this js.
 * @param {Function} once : Use once function globally.
 */
(function (drupalSettings) {
  elementSettings = drupalSettings.user_bookings[elementId];
  fetch(`${elementSettings.front_page_url}/itkdev_booking/user-bookings`)
    .then((response) => response.json())
    .then((data) => handleData(data));
})(drupalSettings);

/** @param data */
function handleData(data) {
  let dataFormatted = [];
  dataFormatted = data["hydra:member"];
  dataFormatted.forEach(function (value, index) {
    let { hitId } = value;
    hitId = btoa(hitId);
    try {
      fetch(
        `${elementSettings.front_page_url}/itkdev_booking/booking-details/${hitId}`
      )
        .then((response) => response.json())
        .then((data) => {
          dataFormatted[index].displayName =
            data["hydra:member"][0].displayName;
          dataFormatted[index].eventBody = data["hydra:member"][0].body;
          appendElementToBookingContainer(dataFormatted[index]);
        });
    } catch (e) {
      console.log(e);
    }
  });
}

/** @param data */
function appendElementToBookingContainer(data) {
  const bookingContainer = element.querySelector(`div.bookings-${elementId}`);
  const loaderPresent = element.querySelector("div.loader") !== null;
  if (loaderPresent) {
    bookingContainer.innerHTML = "";
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
    if (confirm("Er du sikker på at du vil slette denne booking?") == true) {
      removeBooking(data.id);
    }
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

/** @param id */
function removeBooking(id) {
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

  return false;
}

/** @param id */
function editBooking(id) {
  alert(`edit booking - ${id}`);
}

})();

/******/ })()
;
//# sourceMappingURL=userbookings.js.map