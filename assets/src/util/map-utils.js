import Proj4 from "proj4";

/**
 * @param {number} lat Latitude coordinate
 * @param {number} long Longitude coordinate
 * @returns {object} Proj object containing converted coordinates
 */
export function latlngToUTM(lat, long) {
  const wgs84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
  const utm = "+proj=utm +zone=32";

  return Proj4(wgs84, utm, [long, lat]);
}

/**
 * @param {object} resources Resources array
 * @returns {Array} Containing openLayer features and tooltip content
 */
export function getFeatures(resources) {
  // Loop resources and build coordinates and tooltip content
  // TODO: Add actual coordinates from API
  const featureObj = [];

  if (resources) {
    Object.values(resources).forEach((resource) => {
      const utmCoordinates = latlngToUTM(56.153574168437295, 10.214342775668902);

      featureObj.push({
        id: resource.id,
        coordinates: {
          easting: utmCoordinates[0],
          northing: utmCoordinates[1],
        },
        name: resource.resourceName,
      });
    });
  }

  return featureObj;
}
