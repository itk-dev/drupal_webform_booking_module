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
    setAuthorFields({ ...authorFields, email: event.target.value });
  };

  const onChangeSubject = (event) => {
    setAuthorFields({ ...authorFields, subject: event.target.value });
  };

  return (
    <div className="col-md-12">
      <div className="form-item">
        <label htmlFor="email-input" className="form-item__label">
          <span className="form-item-label">Booking subject</span>
          <input
            id="subject-input"
            type="text"
            placeholder="Booking title"
            required
            value={authorFields.subject}
            onChange={onChangeSubject}
            className="form-element"
          />
          <span className="form-item-label">Email</span>
          <input
            id="email-input"
            type="email"
            autoComplete="email"
            placeholder="Email"
            required
            value={authorFields.email}
            onChange={onChangeEmail}
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
