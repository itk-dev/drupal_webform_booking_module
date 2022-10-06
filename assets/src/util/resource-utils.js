import React from "react";
import { ReactComponent as IconProjector } from "../assets/projector.svg";
import { ReactComponent as IconWheelchair } from "../assets/wheelchair.svg";
import { ReactComponent as IconVideoCamera } from "../assets/videocamera.svg";
import { ReactComponent as IconFood } from "../assets/food.svg";
import { ReactComponent as IconCandles } from "../assets/candles.svg";

/**
 * Get facilities for a resource.
 *
 * @param {object} resource The resource object to get facilities from.
 * @returns {object} Object of facility objects.
 */
export default function getResourceFacilities(resource) {
  return {
    ...(resource.monitorequipment && {
      monitorequipment: {
        title: "Projektor / Skærm",
        icon: <IconProjector />,
      },
    }),
    ...(resource.wheelchairaccessible && {
      wheelchairaccessible: {
        title: "Handicapvenligt",
        icon: <IconWheelchair />,
      },
    }),
    ...(resource.videoconferenceequipment && {
      videoconferenceequipment: {
        title: "Videoconference",
        icon: <IconVideoCamera />,
      },
    }),
    ...(resource.catering && {
      catering: {
        title: "Forplejning",
        icon: <IconFood />,
      },
    }),
    ...(resource.holidayOpeningHours && {
      holidayOpeningHours: {
        title: "Tilgængelig på helligdag",
        icon: <IconCandles />,
      },
    }),
  };
}
