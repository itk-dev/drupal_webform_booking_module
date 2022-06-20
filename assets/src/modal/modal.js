/** Class representing a modal */
export default class Modal {
  /**
   * @param {string} from - Start-time
   * @param {string} to - End-time
   * @param {string} resourceId - Resouce identifier
   * @param {string} resourceTitle - Resource title
   */
  constructor(from, to, resourceId, resourceTitle) {
    this.from = from;
    this.to = to;
    this.resourceId = resourceId;
    this.resourceTitle = resourceTitle;
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
    document.getElementById("bookingFrom").innerHTML = `<b>${Drupal.t(
      "From"
    )}:</b> ${this.from}`;
    document.getElementById("bookingTo").innerHTML = `<b>${Drupal.t(
      "To"
    )}:</b> ${this.to}`;
    document.getElementById("bookingSubmit").innerHTML = `<b>${Drupal.t(
      "Booking submit"
    )}</b>`;

    const modal = document.getElementById("modal");

    if (modal.classList.contains("open")) {
      modal.classList.remove("open");
    } else {
      modal.classList.add("open");
    }

    document.addEventListener("click", function (e) {
      if (e.target && e.target.classList.contains("booking-close")) {
        modal.classList.remove("open");
      }
    });

    window.onclick = function (event) {
      if (event.target === modal) {
        if (modal.classList.contains("open")) {
          modal.classList.remove("open");
          modal.classList.add("closing");
          setTimeout(function () {
            modal.classList.remove("closing");
          }, 300);
        } else {
          modal.classList.add("open");
        }
      }
    };
  }
}
