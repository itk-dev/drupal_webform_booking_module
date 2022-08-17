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
  let count = 0;
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
      })
      .finally(() => {
        count += 1;

        if (count === dataFormatted.length) {
          const dataFormattedSorted = dataFormatted.sort(function compare(
            a,
            b
          ) {
            const dateA = new Date(a.start);
            const dateB = new Date(b.start);
            return dateA - dateB;
          });

          dataFormattedSorted.forEach(function (v, i) {
            appendElementToBookingContainer(dataFormattedSorted[i]);
          });
        }
      });
  });
}

/**
 * @param {object} data : Formatted and sorted data object retrieved from api endpoint
 * @returns
 */
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
  deleteButton.setAttribute("data-id", data.hitId);
  deleteButton.innerText = "Slet booking";
  deleteButton.onclick = function (e) {
    e.preventDefault();
    removeBooking(data.hitId, data.id);
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

/**
 * @param {string} hitId : hitId of the booking to be removed (API)
 * @param {string} id : unique id of the booking to be removed (DOM)
 */
function removeBooking(hitId, id) {
  hitId = btoa(hitId);
  if (
    window.confirm("Er du sikker på at du ønsker at slette denne booking?") ===
    true
  ) {
    document.querySelector(
      `div[data-id='${id}'] > div.button-container > button`
    ).innerText = "Sletter booking...";
    fetch(
      `${elementSettings.front_page_url}/itkdev_booking/booking-deletes/${hitId}`
    )
      .then(function (response) {
        return response.json();
      })
      .then(function () {
        document.querySelector(`div[data-id='${id}']`).remove();
      });
  }
}

/** @param {string} id : id of the booking to be edited */
/* function editBooking(id) {
  alert(`edit booking - ${id}`);
} */

})();

/******/ })()
;
//# sourceMappingURL=userbookings.js.map