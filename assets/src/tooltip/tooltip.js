/** Class representing a tooltip */
export default class Tooltip {
  /**
   * @param {number} delay - Delay in ms until tooltip is hidden
   * @param {number} distance - Distance in px from parent to tooltip
   */
  constructor(delay, distance) {
    this.delay = delay;
    this.distance = distance;
  }

  /** @param {object} self - Instance of the tooltip class */
  renderTooltip = (self) => {
    document.body.addEventListener("mouseover", function (e) {
      if (!e.target.hasAttribute("data-tooltip")) return;
      const tooltip = document.createElement("div");
      tooltip.className = "b-tooltip";
      tooltip.innerHTML = e.target.getAttribute("data-tooltip");
      document.body.appendChild(tooltip);

      const pos = e.target.getAttribute("data-position") || "center top";
      const posHorizontal = pos.split(" ")[0];
      const posVertical = pos.split(" ")[1];
      positionAt(e.target, tooltip, posHorizontal, posVertical, self);
    });
    document.body.addEventListener("mouseout", function (e) {
      if (e.target.hasAttribute("data-tooltip")) {
        setTimeout(function () {
          try {
            document.body.removeChild(
              document.querySelector(".b-tooltip:not(.hovered)")
            );
          } catch (error) {
            throw new Error(error);
          }
        }, this.delay);
      }
    });
  }
}



/**
 * Positions the tooltip
 *
 * @param {object} parent - Tooltip parent
 * @param {object} tooltip - Tooltip
 * @param {string} posHorizontal - Left/right/center
 * @param {string} posVertical - Center/bottom/top
 * @param {object} self - Instance of the tooltip class
 */
function positionAt(parent, tooltip, posHorizontal, posVertical, self) {
  const parentCoords = parent.getBoundingClientRect();

  let left;
  let top;
  switch (posHorizontal) {
    case "left":
      left =
        parseInt(parentCoords.left, 10) - self.distance - tooltip.offsetWidth;
      if (parseInt(parentCoords.left, 10) - tooltip.offsetWidth < 0) {
        left = self.distance;
      }
      break;

    case "right":
      left = parentCoords.right + self.distance;
      if (
        parseInt(parentCoords.right, 10) + tooltip.offsetWidth >
        document.documentElement.clientWidth
      ) {
        left =
          document.documentElement.clientWidth -
          tooltip.offsetWidth -
          self.distance;
      }
      break;

    case "center":
    default:
      left =
        parseInt(parentCoords.left, 10) +
        (parent.offsetWidth - tooltip.offsetWidth) / 2;
  }

  switch (posVertical) {
    case "center":
      top =
        (parseInt(parentCoords.top, 10) + parseInt(parentCoords.bottom, 10)) /
        2 -
        tooltip.offsetHeight / 2;
      break;

    case "bottom":
      top = parseInt(parentCoords.bottom, 10) + self.distance;
      break;

    case "top":
    default:
      top =
        parseInt(parentCoords.top, 10) - tooltip.offsetHeight - self.distance;
  }

  left = left < 0 ? parseInt(parentCoords.left, 10) : left;
  top = top < 0 ? parseInt(parentCoords.bottom, 10) + self.distance : top;

  tooltip.style.left = `${left}px`;

  tooltip.style.top = `${top + window.pageYOffset}px`;
}
