import React from "react";
import * as PropTypes from "prop-types";
import List from "./list";
import NoResultOverlay from "./no-result-overlay";
import "./list-container.scss";

/**
 * @param {object} props Props.
 * @param {object} props.resources Resources object
 * @param {object} props.setShowResourceDetails Resource object to show details for
 * @param {boolean} props.userHasInteracted Has the user interacted with filters
 * @returns {JSX.Element} List element containing resources
 */
function ListContainer({ resources, setShowResourceDetails, userHasInteracted }) {
  return (
    <div className="List no-gutter col-md-12">
      {(!resources || (resources && resources.length === 0)) && !userHasInteracted && (
        <NoResultOverlay state="initial" />
      )}
      {(!resources || (resources && resources.length === 0)) && userHasInteracted && (
        <NoResultOverlay state="noresult" />
      )}
      <div className="row">
        <div className="col-md-12">
          {!resources && <span>Vælg filtre for at vise liste over resourcer..</span>}
          {resources && <List resources={resources} setShowResourceDetails={setShowResourceDetails} />}
        </div>
      </div>
    </div>
  );
}

ListContainer.propTypes = {
  resources: PropTypes.arrayOf(PropTypes.shape({})),
  setShowResourceDetails: PropTypes.func.isRequired,
  userHasInteracted: PropTypes.bool.isRequired,
};

ListContainer.defaultProps = {
  resources: {},
};

export default ListContainer;
