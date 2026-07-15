# English Form Validation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every browser-style validation popup in both website forms display explicit English text regardless of browser locale.

**Architecture:** Add a small validation-message layer to the existing vanilla JavaScript form setup. Each constrained field receives an English custom-validity message on `invalid`, clears it on `input` or `change`, and continues through the existing `checkValidity()`, `reportValidity()`, and Formspree submission flow.

**Tech Stack:** HTML5 constraint validation, vanilla JavaScript, PowerShell structural tests, GitHub Pages.

---

### Task 1: Add a failing English-validation safeguard

**Files:**
- Create: `tests/english-form-validation.test.ps1`
- Test: `tests/english-form-validation.test.ps1`

- [ ] **Step 1: Create the focused test**

```powershell
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$homepage = Get-Content -Raw -LiteralPath (Join-Path $root 'index.html')
$script = Get-Content -Raw -LiteralPath (Join-Path $root 'script.js')
$failures = [System.Collections.Generic.List[string]]::new()

function Assert-EnglishValidation {
  param([bool]$Condition, [string]$Message)
  if (-not $Condition) { $failures.Add($Message) }
}

Assert-EnglishValidation ($script -match [regex]::Escape('Please fill out this field.')) 'Required-field English message is missing.'
Assert-EnglishValidation ($script -match [regex]::Escape('Please enter a valid email address.')) 'Email English message is missing.'
Assert-EnglishValidation ($script -match [regex]::Escape('Please select an option.')) 'Select English message is missing.'
Assert-EnglishValidation ($script -match [regex]::Escape('Please confirm your consent before submitting.')) 'Consent English message is missing.'
Assert-EnglishValidation ($script -match "addEventListener\('invalid'") 'Invalid-event handler is missing.'
Assert-EnglishValidation ($script -match "addEventListener\('input'") 'Input message-reset handler is missing.'
Assert-EnglishValidation ($script -match "addEventListener\('change'") 'Change message-reset handler is missing.'
Assert-EnglishValidation ($script -match "setCustomValidity\(''\)") 'Custom-validity reset is missing.'
Assert-EnglishValidation (([regex]::Matches($homepage, 'data-lead-form')).Count -eq 2) 'Both lead forms must remain enabled.'
Assert-EnglishValidation ($homepage -match 'script\.js\?v=20260716-english-validation') 'English-validation script cache key is missing.'

if ($failures.Count -gt 0) {
  $failures | ForEach-Object { Write-Error $_ -ErrorAction Continue }
  exit 1
}

Write-Output 'English form validation checks passed (10 assertions).'
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tests\english-form-validation.test.ps1
```

Expected: FAIL because the four English custom messages, event handlers, and new cache key do not yet exist.

### Task 2: Add locale-independent English validation messages

**Files:**
- Modify: `script.js:250-305`
- Modify: `index.html:10`
- Test: `tests/english-form-validation.test.ps1`

- [ ] **Step 1: Add message selection and reset helpers**

Insert these helpers before the existing `[data-lead-form]` setup:

```javascript
function getEnglishValidationMessage(field) {
  if (field.validity.valueMissing) {
    if (field instanceof HTMLInputElement && field.type === 'checkbox') {
      return 'Please confirm your consent before submitting.';
    }
    if (field instanceof HTMLSelectElement) {
      return 'Please select an option.';
    }
    return 'Please fill out this field.';
  }

  if (field.validity.typeMismatch && field instanceof HTMLInputElement && field.type === 'email') {
    return 'Please enter a valid email address.';
  }

  return '';
}

function setEnglishValidationMessage(field) {
  field.setCustomValidity('');
  field.setCustomValidity(getEnglishValidationMessage(field));
}

function clearValidationMessage(field) {
  field.setCustomValidity('');
}
```

- [ ] **Step 2: Attach validation listeners to every lead-form field**

At the beginning of the existing `[data-lead-form]` loop, add:

```javascript
form.querySelectorAll('input, select, textarea').forEach((field) => {
  field.addEventListener('invalid', () => {
    setEnglishValidationMessage(field);
  });

  field.addEventListener('input', () => {
    clearValidationMessage(field);
  });

  field.addEventListener('change', () => {
    clearValidationMessage(field);
  });
});
```

Do not change the existing submit handler, `checkValidity()`, `reportValidity()`, Formspree endpoints, modal behavior, or file-upload behavior.

- [ ] **Step 3: Update the script cache key**

Change the script reference to:

```html
<script src="script.js?v=20260716-english-validation" defer></script>
```

- [ ] **Step 4: Run the focused test**

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tests\english-form-validation.test.ps1
```

Expected: PASS with 10 assertions.

### Task 3: Verify forms and publish

**Files:**
- Verify: `index.html`
- Verify: `script.js`
- Verify: `tests/english-form-validation.test.ps1`

- [ ] **Step 1: Run all test scripts**

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tests\english-form-validation.test.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File .\tests\full-homepage-structure.test.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File .\tests\special-pathways-dropdown.test.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File .\tests\special-pathways-structure.test.ps1
```

Expected: all scripts exit 0 with 58 total assertions.

- [ ] **Step 2: Verify validation behavior in the browser**

On both forms:

- Submit an empty form and confirm the first required-field popup is `Please fill out this field.`
- Enter `invalid-email` and confirm the popup is `Please enter a valid email address.`
- On the assessment form, leave Product type unselected and confirm `Please select an option.`
- On the assessment form, leave consent unchecked and confirm `Please confirm your consent before submitting.`
- Correct each field and confirm its `validationMessage` clears.
- Confirm no request is transmitted during these validation checks.

- [ ] **Step 3: Check the final diff**

Run:

```powershell
git diff --check
git status --short
```

Expected: no whitespace errors; only `index.html`, `script.js`, and `tests/english-form-validation.test.ps1` are staged for the implementation commit. Existing unrelated files remain untouched.

- [ ] **Step 4: Commit and publish**

Run:

```powershell
git add -- index.html script.js tests/english-form-validation.test.ps1
git commit -m "Use English form validation messages"
git push origin main
```

Expected: GitHub Pages deploys the new script cache key and English validation behavior.

- [ ] **Step 5: Verify the public page**

Confirm the public homepage returns HTTP 200, loads `script.js?v=20260716-english-validation`, contains both Formspree forms, and serves the four English validation messages in `script.js`.
