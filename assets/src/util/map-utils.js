import Proj4 from "proj4";

/**
 * @param {number} lat Latitude coordinate
 * @param {number} long Longitude coordinate
 * @returns {object} Proj object containing converted coordinates
 */
export function latlngToUTM(lat, long) {
  // Convert latitude, longitude to UTM formatted easting, northing.
  // Not working correctly yet.
  // TODO: Find the correct proj config for this to work from Google Maps lat,long to UTM
  const utm = "+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs";
  const wgs84 = "+proj=longlat +zone=32 +ellps=GRS80 +units=m +no_defs ";

  return Proj4(wgs84, utm, [lat, long]);
}

/**
 * @param {object} resources Resources array
 * @returns {Array} Containing openLayer features and tooltip content
 */
export function getFeatures(resources) {
  // Loop resources and build coordinates and tooltip content
  const featureObj = [];

  if (resources) {
    Object.values(resources).forEach((resource) => {
      featureObj.push({
        id: resource.id,
        coordinates: {
          easting: 575427 + Math.floor(Math.random() * 30) + 50,
          northing: 6223823 + Math.floor(Math.random() * 30) + 50,
          // 'easting': 575427.19,
          // 'northing': 6223823.10
        },
        name: resource.resourceName,
      });
    });
  }

  return featureObj;
}
