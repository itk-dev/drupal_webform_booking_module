import validateHiddenInput from "../validation";

/** Class representing a modal */
export default class Modal {
  /**
   * @param {string} from - Start-time
   * @param {string} to - End-time
   * @param {string} resourceId - Resouce identifier
   * @param {string} resourceTitle - Resource title
   * @param {object} calendarInstance - Instance of the calendar object
   */
  constructor(from, to, resourceId, resourceTitle, calendarInstance) {
    this.from = from;
    this.to = to;
    this.resourceId = resourceId;
    this.resourceTitle = resourceTitle;
    this.calendarInstance = calendarInstance;
  }

  buildModal() {
    const date = `${this.from.getDate()}/${
      this.from.getMonth() + 1
    }-${this.from.getFullYear()}`;
    const from = `${
      (this.from.getHours() < 10 ? "0" : "") + this.from.getHours()
    }:${this.from.getMinutes() < 10 ? "0" : ""}${this.from.getMinutes()}`;
    const to = `${(this.to.getHours() < 10 ? "0" : "") + this.to.getHours()}:${
      this.to.getMinutes() < 10 ? "0" : ""
    }${this.to.getMinutes()}`;

    document.getElementById("bookingHeader").innerHTML = `${Drupal.t(
      "Booking confirmation"
    )} - ${this.resourceTitle}`;
    document.getElementById("bookingResourceId").innerHTML = `<b>${Drupal.t(
      "Room ID"
    )}:</b> ${this.resourceId}`;
    document.getElementById("bookingResourceTitle").innerHTML = `<b>${Drupal.t(
      "Room title"
    )}:</b> ${this.resourceTitle}`;
    document.getElementById("bookingResourceTitle").innerHTML = `<b>${Drupal.t(
      "Date"
    )}:</b> ${date}`;
    document.getElementById("bookingFrom").innerHTML = `<b>${Drupal.t(
      "Timeframe"
    )}:</b> ${from} - ${to}`;

    const modal = document.getElementById("modal");
    const self = this;

    if (modal.classList.contains("open")) {
      modal.classList.remove("open");
    } else {
      modal.classList.add("open");
    }

    document.addEventListener("click", function (e) {
      if (e.target === modal) {
        closeModal();
      }
      if (e.target.classList.contains("booking-close")) {
        closeModal();
        // Only add selection to input field if active element contains the right class.
        if (e.target.classList.contains("calendar-add-selection")) {
          self.setSelection();
        } else {
          self.calendarInstance.unselect();
          self.setSelection(true);
        }
      }
    });
    document.addEventListener("keyup", function (e) {
      if (e.key === "Escape" || e.keyCode === 27) {
        closeModal();
      }
    });
  }

  /**
   * Add booking info to hidden input field.
   *
   * @param {boolean} clear : Whether we clear input field or populate it.
   */
  setSelection(clear = false) {
    const self = this;
    // Get booking element for the drupal form field.
    const formFieldId =
      self.calendarInstance.el.getAttribute("booking-element-id");

    const booking = clear
      ? {
          resourceEmail: "",
          startTime: "",
          endTime: "",
        }
      : {
          resourceEmail: self.resourceId,
          startTime: self.from.toISOString(),
          endTime: self.to.toISOString(),
        };

    const elements = document.getElementsByName(formFieldId);
    elements.forEach((element) => {
      if (
        element instanceof HTMLInputElement &&
        element.getAttribute("type") === "hidden"
      ) {
        const inputValue = JSON.parse(element.value);
        Object.keys(booking).forEach((key) => {
          inputValue[key] = booking[key];
        });

        element.setAttribute("value", JSON.stringify(inputValue));
        validateHiddenInput(inputValue);
      }
    });
  }
}

/** Close modal box. */
function closeModal() {
  const modal = document.getElementById("modal");
  if (modal.classList.contains("open")) {
    modal.classList.remove("open");
    modal.classList.add("closing");
    setTimeout(function () {
      modal.classList.remove("closing");
    }, 200);
  }
}
