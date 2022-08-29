/**
 * Validate that all fields are populated before allowing submission.
 *
 * @param {object} inputValue : The hidden input field values.
 */
export default function validateHiddenInput(inputValue) {
  const submitInput = document.getElementById("edit-submit");
  let valid = true;
  Object.keys(inputValue).forEach((key) => {
    if (!inputValue[key]) {
      valid = false;
    }
  });

  submitInput.disabled = valid !== true;
}
