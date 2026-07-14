$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$homepage = Get-Content -Raw -LiteralPath (Join-Path $root 'index.html')
$legacyPage = Get-Content -Raw -LiteralPath (Join-Path $root 'pathways.html')
$failures = [System.Collections.Generic.List[string]]::new()

function Assert-FullHomepage {
  param([bool]$Condition, [string]$Message)
  if (-not $Condition) { $failures.Add($Message) }
}

foreach ($sectionId in @('home', 'audience', 'assessment', 'pathway', 'policies', 'parks', 'innovators', 'about-hainan', 'about-us')) {
  Assert-FullHomepage ($homepage -match "id=`"$sectionId`"") "Homepage section #$sectionId is missing."
}

Assert-FullHomepage ($homepage -match 'styles\.css\?v=') 'Full website stylesheet is missing from the homepage.'
Assert-FullHomepage ($homepage -match 'script\.js\?v=') 'Full website script is missing from the homepage.'
Assert-FullHomepage ($homepage -notmatch 'homepage\.css|homepage\.js') 'Old image-based homepage assets must not be loaded.'
Assert-FullHomepage ($homepage -notmatch 'Start with the right') 'Old image-based homepage headline must be removed.'
Assert-FullHomepage ($homepage -notmatch 'class="gateway-link"') 'Old homepage gateway links must be removed.'
Assert-FullHomepage ($homepage -match 'data-nav-dropdown-toggle') 'Special Pathways dropdown must remain on the new homepage.'
Assert-FullHomepage ($legacyPage -match "location\.replace\('index\.html' \+ window\.location\.search \+ window\.location\.hash\)") 'Legacy pathways page must preserve query strings and anchors when redirecting.'

if ($failures.Count -gt 0) {
  $failures | ForEach-Object { Write-Error $_ -ErrorAction Continue }
  exit 1
}

Write-Output 'Full homepage structure checks passed (16 assertions).'
