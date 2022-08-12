/** Class representing a modal */
export default class Modal {
  /**
   * @param {string} from - Start-time
   * @param {string} to - End-time
   * @param {string} resourceId - Resouce identifier
   * @param {string} resourceTitle - Resource title
   * @param {object} calendarInstance - Instance of the calendar object
   */
  constructor(from, to,  resourceId, resourceTitle, calendarInstance) {
    this.from = from;
    this.to = to;
    this.resourceId = resourceId;
    this.resourceTitle = resourceTitle;
    this.calendarInstance = calendarInstance;
  }

  buildModal() {
    let date = `${this.from.getDate()}/${this.from.getMonth() + 1}-${this.from.getFullYear()}`;
    let from = `${(this.from.getHours() < 10 ? "0" : "") + this.from.getHours()}:${
      this.from.getMinutes() < 10 ? "0" : ""
    }${this.from.getMinutes()}`;
    let to = `${(this.to.getHours() < 10 ? "0" : "") + this.to.getHours()}:${
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
        self.closeModal();
      }
      if (e.target.classList.contains("booking-close")) {
        self.closeModal();
        if (e.target.classList.contains("calendar-add-selection")) {
          self.addSelection();
        }
        else {
          self.calendarInstance.unselect();
          self.clearValues();
        }
      }
    });
    document.addEventListener("keyup", function (e) {
      if (e.key === "Escape" || e.keyCode === 27) {
        self.closeModal();
      }
    });
  }

  closeModal() {
    const modal = document.getElementById("modal");
    if (modal.classList.contains("open")) {
      modal.classList.remove("open");
      modal.classList.add("closing");
      setTimeout(function () {
        modal.classList.remove("closing");
      }, 200);
    }
  }

  addSelection() {
    // @todo move booking title and author out of modal, and set hidden element on submit instead.
    const self = this;
    // Get booking element for the drupal form field.
    let formFieldId = self.calendarInstance.el.getAttribute('booking-element-id');
    let titleElement = document.getElementById('booking-title-' + formFieldId);
    let authorNameElement = document.getElementById('booking-author-' + formFieldId);
    let authorEmailElement = document.getElementById('booking-email-' + formFieldId);

    const booking = {
      subject: titleElement.value,
      resourceEmail: self.resourceId,
      startTime: self.from.toISOString(),
      endTime: self.to.toISOString(),
      authorName: authorNameElement.value,
      authorEmail: authorEmailElement.value,
      userId: '1111aaaa11',
      formElement: 'booking_element'
    };

    let elements = document.getElementsByName(formFieldId);
    elements.forEach((element) => {
      if(element instanceof HTMLInputElement && element.getAttribute('type') === 'hidden') {
        element.setAttribute('value', JSON.stringify(booking));
      }
    });

  }

  clearValues() {
    const self = this;
    let formFieldId = self.calendarInstance.el.getAttribute('booking-element-id');
    let elements = document.getElementsByName(formFieldId);
    elements.forEach((element) => {
      if(element instanceof HTMLInputElement && element.getAttribute('type') === 'hidden') {
        element.setAttribute('value', '');
      }
    });
  }
}
