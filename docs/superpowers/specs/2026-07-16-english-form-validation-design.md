# English Form Validation Design

## Goal

Ensure every browser-style validation popup on the AsterNexis Advisory website appears in English, regardless of the visitor's browser or operating-system language.

## Approved Behavior

Keep the current native browser validation popups and submission flow. Add explicit English custom-validity messages to every constrained field in both lead forms.

Use these messages:

- Required text field or textarea: `Please fill out this field.`
- Required email with an invalid format: `Please enter a valid email address.`
- Required select without a choice: `Please select an option.`
- Required consent checkbox when unchecked: `Please confirm your consent before submitting.`

## Interaction Rules

- Assign the appropriate English message when a field raises the `invalid` event.
- Clear a field's custom-validity message when the user edits, selects, or checks that field so the browser can evaluate its current state again.
- Preserve the existing form-level status message: `Please complete the required fields.`
- Focus and display the first invalid field through the existing `checkValidity()` and `reportValidity()` flow.
- Do not disable native constraint validation with `novalidate`.

## Scope

Apply the behavior to all fields inside forms marked with `data-lead-form`, including:

- Product assessment form required fields.
- China Entry Brief form required fields.
- Email format validation.
- Product-type selection.
- Consent confirmation.

## Compatibility

- Keep both Formspree endpoints unchanged.
- Keep multipart file-upload behavior unchanged.
- Keep success and failure modals unchanged.
- Keep visible form labels and layout unchanged.
- Update the `script.js` cache key in `index.html` so deployed visitors receive the new validation behavior immediately.

## Verification

- Add a focused test that checks the required English messages and invalid/input/change listeners exist in `script.js`.
- Confirm both forms retain their Formspree actions and required constraints.
- In the browser, submit each empty form and confirm the first popup is English.
- Enter an invalid email and confirm the email-specific popup is English.
- Leave the product type unselected and confirm the select-specific popup is English.
- Leave consent unchecked and confirm the checkbox-specific popup is English.
- Confirm corrected fields clear the old validation message and can be submitted normally.
