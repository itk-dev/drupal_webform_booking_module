// import { valueTernary } from "react-select/dist/declarations/src/utils";

/**
 * @param {object} obj Object to test.
 * @param {string} propertyName Property name to test for.
 * @returns {boolean} Does the object have the given property?
 */
export function hasOwnProperty(obj, propertyName) {
  return Object.prototype.hasOwnProperty.call(obj, propertyName);
}