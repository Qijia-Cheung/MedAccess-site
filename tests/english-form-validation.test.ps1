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
Assert-EnglishValidation ($homepage -match 'script\.js\?v=20260721-special-pathways-anchor') 'Current script cache key is missing.'

if ($failures.Count -gt 0) {
  $failures | ForEach-Object { Write-Error $_ -ErrorAction Continue }
  exit 1
}

Write-Output 'English form validation checks passed (10 assertions).'
