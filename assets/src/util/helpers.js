/**
 * @param {object} obj Object to test.
 * @param {string} propertyName Property name to test for.
 * @returns {boolean} Does the object have the given property?
 */
export function hasOwnProperty(obj, propertyName) {
  return Object.prototype.hasOwnProperty.call(obj, propertyName);
}

/**
 * @param {object} allResources All Resources.
 * @param {object} filterParams Object containing filtered parameters.
 * @returns {Array} Containing resources matching given filters.
 */
export function filterAllResources(allResources, filterParams) {
  // const matchingResources = [];

  const matchingResources = allResources.filter((resource) => {
    /*
      0: no match
      1: neutral // no match
      2: match
    */
    let matchingState = 1;

    if (filterParams["location[]"] && filterParams["location[]"].length !== 0) {
      // Filtrering på location

      if (filterParams["location[]"].includes(resource.location)) {
        matchingState = 2;
      } else {
        matchingState = 0;
      }
    }

    if (filterParams["resourceMail[]"] && filterParams["resourceMail[]"].length !== 0) {
      // Filtrering på resource

      if (filterParams["resourceMail[]"].includes(resource.resourceMail)) {
        matchingState = 2;
      } else if (matchingState === 2) {
        matchingState = 2;
      } else {
        matchingState = 0;
      }
    }

    if (filterParams.videoConferenceEquipment) {
      // Filtrering på videokonference

      if (!resource.videoConferenceEquipment && matchingState === 2) {
        matchingState = 0;
      }
      if (resource.videoConferenceEquipment && matchingState === 1) {
        matchingState = 2;
      }
    }

    if (filterParams.monitorEquipment) {
      // Filtrering på projektor/skærm

      if (!resource.monitorEquipment && matchingState === 2) {
        matchingState = 0;
      }
      if (resource.monitorEquipment && matchingState === 1) {
        matchingState = 2;
      }
    }

    if (filterParams.wheelchairAccessible) {
      // Filtrering på handikapvenligt

      if (!resource.wheelchairAccessible && matchingState === 2) {
        matchingState = 0;
      }
      if (resource.wheelchairAccessible && matchingState === 1) {
        matchingState = 2;
      }
    }

    if (filterParams["capacity[between]"] && matchingState !== 0) {
      const rangeArray = filterParams["capacity[between]"].split(",");

      if (resource.capacity >= rangeArray[0] && resource.capacity <= rangeArray[1]) {
        // Vi er indenfor range
        matchingState = 2;
      } else {
        matchingState = 0;
      }
    }

    if (filterParams["capacity[gt]"] && matchingState !== 0) {
      if (resource.capacity >= filterParams["capacity[gt]"]) {
        // Vi er indenfor range
        matchingState = 2;
      } else {
        matchingState = 0;
      }
    }

    // TODO: Add catering
    if (matchingState > 1) {
      return resource;
    }

    return false;
  });

  return matchingResources;
}

/** @returns {Array} Containing options to show */
export function getFacilityOptions() {
  const facilityOptions = [
    { value: "monitorEquipment", label: "Projektor/Skærm" },
    { value: "wheelchairAccessible", label: "Handikapvenligt" },
    { value: "videoConferenceEquipment", label: "Videokonference" },
    { value: "catering", label: "Mulighed for tilkøb af mad og drikke" },
  ];

  return facilityOptions;

  // TODO: Modify options array based on available resources.
}
