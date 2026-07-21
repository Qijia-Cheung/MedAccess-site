$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$homepage = Get-Content -Raw -LiteralPath (Join-Path $root 'index.html')
$styles = Get-Content -Raw -LiteralPath (Join-Path $root 'styles.css')
$failures = [System.Collections.Generic.List[string]]::new()

function Assert-GradientSection {
  param([bool]$Condition, [string]$Message)
  if (-not $Condition) { $failures.Add($Message) }
}

$policiesMatch = [regex]::Match($homepage, '(?s)<section id="policies".*?</section>')
$policies = if ($policiesMatch.Success) { $policiesMatch.Value } else { '' }

Assert-GradientSection ($policiesMatch.Success) 'Special Pathways section is missing.'
Assert-GradientSection ($policies -match 'class="section policies-gradient-section"') 'Special Pathways section must use the approved gradient class.'
Assert-GradientSection ($policies -match 'class="policies-gradient-content"') 'Special Pathways content container is missing.'
Assert-GradientSection ($policies -notmatch 'class="image-panel"|<img') 'Old inline laboratory image panel must be removed.'
Assert-GradientSection (([regex]::Matches($policies, 'class="policy-card"')).Count -eq 4) 'All four approved policy cards must remain.'
Assert-GradientSection ($styles -match 'background-image:\s*url\(assets/hainan-seed-laboratory\.png') 'Laboratory image must become the Special Pathways background.'
Assert-GradientSection (([regex]::Matches($styles, '(?s)\.policies-gradient-section::(?:before|after)\s*\{[^}]*linear-gradient\(')).Count -ge 2) 'Special Pathways must use layered scoped gradient overlays.'
Assert-GradientSection ($styles -match '(?s)\.policies-gradient-section\s+\.policy-card\s*\{[^}]*background:\s*rgba\(') 'Policy cards must use the approved translucent surface.'
Assert-GradientSection ($styles -match '(?s)\.policies-gradient-content\s*\{[^}]*var\(--content-max\)') 'Special Pathways content must align to the website grid.'
Assert-GradientSection ($styles -match '(?s)@media\s*\(max-width:\s*760px\)[\s\S]*?\.policies-gradient-section\s+\.policy-grid\s*\{[^}]*grid-template-columns:\s*1fr') 'Policy cards must stack on small screens.'

if ($failures.Count -gt 0) {
  $failures | ForEach-Object { Write-Error $_ -ErrorAction Continue }
  exit 1
}

Write-Output 'Special Pathways gradient section checks passed (10 assertions).'
