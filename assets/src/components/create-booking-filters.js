import React, { useEffect, useState } from "react";
import Select, { createFilter } from "react-select";
import * as PropTypes from "prop-types";
import "react-toastify/dist/ReactToastify.css";
import { capacityOptions, facilityOptions } from "../util/filter-utils";
import { setAriaLabelFilters } from "../util/dom-manipulation-utils";

/**
 * CreateBooking component.
 *
 * @param {object} props The props
 * @param {object} props.filterParams Filter parameters.
 * @param {Function} props.setFilterParams Set filter parameters.
 * @param {Array} props.allResources All resources.
 * @param {boolean} props.disabled Disable filters.
 * @param {Array} props.locationFilter Location filters.
 * @param {Function} props.setLocationFilter Set Location filters.
 * @param {Array} props.resourceFilter Resource filters.
 * @param {Function} props.setResourceFilter Set resource filters.
 * @param {string} props.userType User type: citizen or businessPartner.
 * @returns {JSX.Element} Component.
 */
function CreateBookingFilters({
  filterParams,
  setFilterParams,
  allResources,
  disabled,
  locationFilter,
  setLocationFilter,
  resourceFilter,
  setResourceFilter,
  userType,
}) {
  const [capacityFilter, setCapacityFilter] = useState([]);
  const [facilityFilter, setFacilityFilter] = useState([]);
  const [hasWhitelist, setHasWhitelist] = useState(false);
  const [locationOptions, setLocationOptions] = useState([]);
  const [resourcesOptions, setResourcesOptions] = useState([]);

  // TODO: Describe.
  setAriaLabelFilters();

  // Loop all resources and set filter options
  useEffect(() => {
    if (resourcesOptions.length === allResources.length) {
      return;
    }

    const locations = [
      ...new Set(allResources.filter((resource) => resource.location !== "").map((resource) => resource.location)),
    ];

    setLocationOptions(
      locations
        .map((value) => {
          return {
            value,
            label: value,
          };
        })
        .sort()
    );

    setResourcesOptions(
      allResources.map((value) => {
        return {
          value: value.resourceMail,
          label: value.resourceName,
        };
      })
    );
  }, [allResources]);

  // Set location filter and resource dropdown options.
  useEffect(() => {
    const locationValues = locationFilter.map(({ value }) => value);

    setFilterParams({ ...filterParams, ...{ "location[]": locationValues } });
  }, [locationFilter]);

  // Set resource filter.
  useEffect(() => {
    const resourceValues = resourceFilter.map(({ value }) => value);

    setFilterParams({
      ...filterParams,
      ...{ "resourceMail[]": resourceValues },
    });
  }, [resourceFilter]);

  // Set only whitelisted filter.
  useEffect(() => {
    setFilterParams({
      ...filterParams,
      ...{ hasWhitelist },
    });
  }, [hasWhitelist]);

  // Set capacity filter.
  useEffect(() => {
    const newFilterParams = { ...filterParams };
    const capacityType = capacityFilter.type ?? null;
    const capacityValue = capacityFilter.value ?? 0;

    // Delete opposite entry to prevent both capacity[between] and capacity[gt] being set, causing a dead end.
    delete newFilterParams["capacity[between]"];

    delete newFilterParams["capacity[gt]"];

    // Set capacity filter according to capacityType.
    let capacity;

    switch (capacityType) {
      case "between":
        capacity = { "capacity[between]": capacityValue };

        break;
      case "gt":
        capacity = { "capacity[gt]": capacityValue };

        break;
      default:
        break;
    }

    setFilterParams({ ...newFilterParams, ...capacity });
  }, [capacityFilter]);

  // Set facility filter.
  useEffect(() => {
    const filterParamsObj = { ...filterParams };

    delete filterParamsObj.monitorEquipment;

    delete filterParamsObj.wheelchairAccessible;

    delete filterParamsObj.videoConferenceEquipment;

    delete filterParamsObj.catering;

    const facilitiesObj = {};

    facilityFilter.forEach((value) => {
      facilitiesObj[value.value] = "true";
    });

    setFilterParams({ ...filterParamsObj, ...facilitiesObj });
  }, [facilityFilter]);

  return (
    <div className={`row filters-wrapper ${disabled ? "disable-filters" : ""}`}>
      <div className="col-md-3 col-xs-12 small-padding">
        <label htmlFor="location-filter">
          Filtrér på lokationer
          {/* Dropdown with locations */}
          <Select
            styles={{}}
            id="location-filter"
            className="filter"
            defaultValue={locationFilter}
            value={locationFilter}
            placeholder="lokationer..."
            placeholderClassName="dropdown-placeholder"
            closeMenuOnSelect={false}
            options={locationOptions}
            onChange={(selectedLocations) => {
              setLocationFilter(selectedLocations);
            }}
            isLoading={Object.values(locationOptions).length === 0}
            loadingMessage={() => "Henter lokationer.."}
            filterOption={createFilter({ ignoreAccents: false })} // Improved performance with large datasets
            isMulti
          />
        </label>
      </div>
      <div className="col-md-3 col-xs-12 small-padding">
        <label htmlFor="resource-filter">
          Filtrér på lokaler/resource
          {/* Dropdown with resources */}
          <Select
            styles={{}}
            id="resource-filter"
            className="filter"
            defaultValue={resourceFilter}
            placeholder="ressourcer..."
            placeholderClassName="dropdown-placeholder"
            closeMenuOnSelect={false}
            options={resourcesOptions}
            onChange={(selectedResources) => {
              setResourceFilter(selectedResources);
            }}
            isLoading={Object.values(resourcesOptions).length === 0}
            loadingMessage={() => "Henter ressourcer.."}
            filterOption={createFilter({ ignoreAccents: false })} // Improved performance with large datasets
            isMulti
          />
        </label>
      </div>
      <div className="col-md-3 col-xs-12 small-padding">
        <label htmlFor="facility-filter">
          Filtrér på faciliteter
          {/* Dropdown with facilities */}
          <Select
            styles={{}}
            id="facility-filter"
            className="filter"
            defaultValue={facilityFilter}
            placeholder="Facilitieter..."
            placeholderClassName="dropdown-placeholder"
            closeMenuOnSelect={false}
            options={facilityOptions}
            onChange={(selectedFacilities) => {
              setFacilityFilter(selectedFacilities);
            }}
            isMulti
          />
        </label>
      </div>
      <div className="col-md-3 col-xs-12 small-padding">
        <label htmlFor="capacity-filter">
          Filtrér på kapacitet
          {/* Dropdown with capacity */}
          <Select
            styles={{}}
            id="capacity-filter"
            className="filter"
            defaultValue={{ value: "0", label: "Alle", type: "gt" }}
            placeholder="Siddepladser..."
            placeholderClassName="dropdown-placeholder"
            closeMenuOnSelect
            options={capacityOptions}
            onChange={(selectedCapacity) => {
              setCapacityFilter(selectedCapacity);
            }}
          />
        </label>
      </div>
      {userType === "businessPartner" && (
        <div className="col-md-3 col-xs-12 small-padding">
          <label htmlFor="capacity-filter">
            Hent kun whitelisted resurser
            <input
              type="checkbox"
              value={hasWhitelist}
              onChange={({ target }) => {
                setHasWhitelist(!!target.checked);
              }}
            />
          </label>
        </div>
      )}
    </div>
  );
}

CreateBookingFilters.defaultProps = {
  userType: "",
};

CreateBookingFilters.propTypes = {
  filterParams: PropTypes.shape({}).isRequired,
  setFilterParams: PropTypes.func.isRequired,
  allResources: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  disabled: PropTypes.bool.isRequired,
  locationFilter: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setLocationFilter: PropTypes.func.isRequired,
  resourceFilter: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setResourceFilter: PropTypes.func.isRequired,
  userType: PropTypes.string,
};

export default CreateBookingFilters;
