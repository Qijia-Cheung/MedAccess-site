$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$homepage = Get-Content -Raw -LiteralPath (Join-Path $root 'index.html')
$failures = [System.Collections.Generic.List[string]]::new()

function Assert-IntegratedHero {
  param([bool]$Condition, [string]$Message)
  if (-not $Condition) { $failures.Add($Message) }
}

Assert-IntegratedHero ($homepage -match '<h1>\s*Start with the right\s*<br>\s*China pathway\.\s*</h1>') 'Approved two-line hero heading is missing.'
Assert-IntegratedHero ($homepage -match 'Independent, evidence-led guidance for overseas healthcare companies entering a complex market\.') 'Approved hero supporting text is missing.'
Assert-IntegratedHero (([regex]::Matches($homepage, 'class="hero-gateway-link"')).Count -eq 3) 'Hero must contain exactly three gateway links.'
Assert-IntegratedHero ($homepage -match 'class="hero-gateway-title">Pathway Assessment<') 'Pathway Assessment gateway is missing.'
Assert-IntegratedHero ($homepage -match 'class="hero-gateway-title">Book a Call<') 'Book a Call gateway is missing.'
Assert-IntegratedHero ($homepage -match 'class="hero-gateway-title">China Entry Brief<') 'China Entry Brief gateway is missing.'
Assert-IntegratedHero ($homepage -notmatch 'Find Your Best China Entry Pathway') 'Previous hero heading must be removed.'
Assert-IntegratedHero ($homepage -notmatch 'class="trust-row"') 'Previous credibility cards must be removed from the hero.'

if ($failures.Count -gt 0) {
  $failures | ForEach-Object { Write-Error $_ -ErrorAction Continue }
  exit 1
}

Write-Output 'Integrated hero checks passed (8 assertions).'
