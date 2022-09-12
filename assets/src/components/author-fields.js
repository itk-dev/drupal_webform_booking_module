import React from "react";
import * as PropTypes from "prop-types";
import "./author-fields.scss";

/**
 * Author fields component.
 *
 * @param {object} props Props.
 * @param {object} props.authorFields Author fields.
 * @param {Function} props.setAuthorFields Set author fields function.
 * @returns {string} Author fields component.
 */
function AuthorFields({ authorFields, setAuthorFields }) {
  const onChangeEmail = (event) => {
    setAuthorFields({ email: event.target.value });
  };

  return (
    <div className="col-md-12">
      <div className="form-item">
        <label htmlFor="email-input" className="form-item__label">
          <span className="form-item-label">Email</span>
          <input
            id="email-input"
            type="email"
            autoComplete="email"
            placeholder="Email"
            required
            value={authorFields.email}
            onChange={(e) => onChangeEmail(e)}
            className="form-element"
          />
        </label>
      </div>
    </div>
  );
}

AuthorFields.propTypes = {
  authorFields: PropTypes.shape({
    email: PropTypes.string.isRequired,
  }).isRequired,
  setAuthorFields: PropTypes.func.isRequired,
};

export default AuthorFields;
