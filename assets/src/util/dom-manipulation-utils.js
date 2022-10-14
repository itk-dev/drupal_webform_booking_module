/**
 * Show hide os2forms fields that are not part of the React app.
 *
 * @param {boolean} show Set true to show form fields.
 */
export default function showFormFields(show) {
  const formFields = document.querySelectorAll(".webform-submission-form > div:not(#react-booking-app)");

  formFields.forEach((field) => {
    if (show) {
      field.classList.remove("hidden");
    } else {
      field.classList.add("hidden");
    }
  });

  // Also hide show author fields in react app.
  const authorFieldsWrappers = document.querySelectorAll("#react-booking-app .author-fields-wrapper");

  authorFieldsWrappers.forEach((authorFieldsWrapper) => {
    if (show) {
      authorFieldsWrapper.classList.remove("hidden");
    } else {
      authorFieldsWrapper.classList.add("hidden");
    }
  });
}
