$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$html = Get-Content -Raw -LiteralPath (Join-Path $root 'pathways.html')
$failures = [System.Collections.Generic.List[string]]::new()

function Assert-SpecialPathways {
  param(
    [bool]$Condition,
    [string]$Message
  )

  if (-not $Condition) {
    $failures.Add($Message)
  }
}

$policies = [regex]::Match($html, '(?s)<section id="policies".*?</section>').Value

Assert-SpecialPathways ($policies.Length -gt 0) 'The policies section is missing.'
Assert-SpecialPathways (([regex]::Matches($policies, 'class="policy-card"')).Count -eq 4) 'The policies section must contain exactly four cards.'
Assert-SpecialPathways ($policies -match 'Special Access &amp; Market Entry') 'Special Access card is missing.'
Assert-SpecialPathways ($policies -match 'Real-World Evidence &amp; Registration Support') 'Real-World Evidence card is missing.'
Assert-SpecialPathways ($policies -match 'New Biomedical Technology Pilot') 'New Biomedical Technology Pilot card is missing.'
Assert-SpecialPathways ($policies -match 'Industrial Landing &amp; Source-Based Guidance') 'Industrial Landing card is missing.'
Assert-SpecialPathways ($policies -notmatch 'policy-table-wrap') 'The policy table must be removed.'
Assert-SpecialPathways ($policies -notmatch 'POLICY SNAPSHOT') 'The redundant policy snapshot must be removed.'
Assert-SpecialPathways ($policies -notmatch 'policy-contact-note') 'The policy contact note must be removed.'

if ($failures.Count -gt 0) {
  $failures | ForEach-Object { Write-Error $_ -ErrorAction Continue }
  exit 1
}

Write-Output 'Special Pathways structure checks passed (9 assertions).'
