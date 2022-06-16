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
    document.getElementById(
      "bookingHeader"
    ).innerHTML = `Opret booking - ${this.resourceTitle}`;
    document.getElementById(
      "bookingResourceId"
    ).innerHTML = `<b>Lokale ID:</b> ${this.resourceId}`;
    document.getElementById(
      "bookingResourceTitle"
    ).innerHTML = `<b>Lokale titel:</b> ${this.resourceTitle}`;
    document.getElementById(
      "bookingFrom"
    ).innerHTML = `<b>Fra:</b> ${this.from}`;
    document.getElementById("bookingTo").innerHTML = `<b>Til:</b> ${this.to}`;

    const modal = document.getElementById("modal");

    if (modal.classList.contains("open")) {
      modal.classList.remove("open");
    } else {
      modal.classList.add("open");
    }

    document.addEventListener("click", function (e) {
      if (e.target && e.target.id === "bookingClose") {
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
