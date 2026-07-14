$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$homepage = Get-Content -Raw -LiteralPath (Join-Path $root 'index.html')
$homepageScript = Get-Content -Raw -LiteralPath (Join-Path $root 'script.js')
$failures = [System.Collections.Generic.List[string]]::new()

function Assert-Dropdown {
  param([bool]$Condition, [string]$Message)
  if (-not $Condition) { $failures.Add($Message) }
}

foreach ($page in @($homepage)) {
  Assert-Dropdown (([regex]::Matches($page, ' data-nav-dropdown>')).Count -eq 1) 'Each page must contain one Special Pathways dropdown.'
  Assert-Dropdown ($page -match 'data-nav-dropdown-toggle') 'Dropdown toggle is missing.'
  Assert-Dropdown ($page -match 'aria-expanded="false"') 'Dropdown toggle must expose its collapsed state.'
  Assert-Dropdown ($page -match '>Overview<') 'Overview dropdown link is missing.'
  Assert-Dropdown ($page -match '>Boao Lecheng<') 'Boao Lecheng dropdown link is missing.'
  Assert-Dropdown ($page -match '>Greater Bay Area<') 'Greater Bay Area dropdown link is missing.'
  Assert-Dropdown ($page -match '>Compare Both Pathways<') 'Comparison dropdown link is missing.'
  Assert-Dropdown ($page -notmatch '>Lecheng &amp; GBA<|>Lecheng & GBA<') 'Standalone Lecheng & GBA navigation item must be removed.'
}

Assert-Dropdown ($homepage -match 'id="lecheng"') 'Lecheng anchor is missing.'
Assert-Dropdown ($homepage -match 'id="greater-bay-area"') 'Greater Bay Area anchor is missing.'
Assert-Dropdown ($homepage -match 'id="pathway-comparison"') 'Comparison anchor is missing.'
Assert-Dropdown ($homepageScript -match 'data-nav-dropdown-toggle') 'Homepage dropdown behavior is missing.'
Assert-Dropdown ($homepageScript -match 'scrollToRenderedAnchor') 'Post-render pathway anchor correction is missing.'

if ($failures.Count -gt 0) {
  $failures | ForEach-Object { Write-Error $_ -ErrorAction Continue }
  exit 1
}

Write-Output 'Special Pathways dropdown checks passed (13 assertions).'
