/** Class representing a modal */
export default class Modal {
  /**
   * @param {string} from - Start-time
   * @param {string} to - End-time
   * @param {string} date - Date of selection
   * @param {string} resourceId - Resouce identifier
   * @param {string} resourceTitle - Resource title
   * @param {object} calendarInstance - Instance of the calendar object
   */
  constructor(from, to, date, resourceId, resourceTitle, calendarInstance) {
    this.from = from;
    this.to = to;
    this.date = date;
    this.resourceId = resourceId;
    this.resourceTitle = resourceTitle;
    this.calendarInstance = calendarInstance;
  }

  buildModal() {
    document.getElementById("bookingHeader").innerHTML = `${Drupal.t(
      "Booking submit"
    )} - ${this.resourceTitle}`;
    document.getElementById("bookingResourceId").innerHTML = `<b>${Drupal.t(
      "Room ID"
    )}:</b> ${this.resourceId}`;
    document.getElementById("bookingResourceTitle").innerHTML = `<b>${Drupal.t(
      "Room title"
    )}:</b> ${this.resourceTitle}`;
    document.getElementById("bookingResourceTitle").innerHTML = `<b>${Drupal.t(
      "Date"
    )}:</b> ${this.date}`;
    document.getElementById("bookingFrom").innerHTML = `<b>${Drupal.t(
      "Timeframe"
    )}:</b> ${this.from} - ${this.to}`;
    // document.getElementById("bookingTo").innerHTML = `<b>${Drupal.t(
    //   "To"
    // )}:</b> ${this.to} `;
    document.getElementById("bookingSubmit").innerHTML = `<b>${Drupal.t(
      "Booking submit"
    )}</b>`;

    const modal = document.getElementById("modal");
    const self = this;

    if (modal.classList.contains("open")) {
      modal.classList.remove("open");
    } else {
      modal.classList.add("open");
    }

    document.addEventListener("click", function (e) {
      if (e.target === modal) {
        self.closeModal();
      }
      if (e.target.classList.contains("booking-close")) {
        self.closeModal();
      }
    });
    document.addEventListener("keyup", function (e) {
      if (e.key === "Escape" || e.keyCode === 27) {
        self.closeModal();
      }
    });
  }

  closeModal() {
    const self = this;
    const modal = document.getElementById("modal");
    if (modal.classList.contains("open")) {
      modal.classList.remove("open");
      modal.classList.add("closing");
      self.calendarInstance.unselect();
      setTimeout(function () {
        modal.classList.remove("closing");
      }, 200);
    }
  }
}
