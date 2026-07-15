$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$homepage = Get-Content -Raw -LiteralPath (Join-Path $root 'index.html')
$styles = Get-Content -Raw -LiteralPath (Join-Path $root 'styles.css')
$failures = [System.Collections.Generic.List[string]]::new()

function Assert-AboutHainanAlignment {
  param([bool]$Condition, [string]$Message)
  if (-not $Condition) { $failures.Add($Message) }
}

Assert-AboutHainanAlignment ($styles -match '(?s)#about-hainan \.two-column\s*\{[^}]*align-items:\s*stretch') 'About Hainan columns must stretch to one row height.'
Assert-AboutHainanAlignment ($styles -match '(?s)\.about-hainan-content\s*\{[^}]*display:\s*flex[^}]*flex-direction:\s*column[^}]*align-self:\s*stretch') 'Right column flex alignment is missing.'
Assert-AboutHainanAlignment ($styles -match '(?s)\.about-hainan-content \.text-stack\s*\{[^}]*gap:\s*8px[^}]*margin-bottom:\s*0[^}]*padding-bottom:\s*8px') 'Scoped paragraph spacing is missing.'
Assert-AboutHainanAlignment ($styles -match '(?s)\.about-hainan-content \.text-stack p\s*\{[^}]*line-height:\s*1\.5') 'Scoped line-height reduction is missing.'
Assert-AboutHainanAlignment ($styles -match '(?s)\.about-hainan-map\s*\{[^}]*margin:\s*auto 0 0') 'Desktop map bottom anchoring is missing.'
Assert-AboutHainanAlignment ($styles -match '(?s)@media \(max-width: 980px\).*\.about-hainan-content\s*\{[^}]*display:\s*block') 'Mobile block-flow reset is missing.'
Assert-AboutHainanAlignment ($styles -match '(?s)@media \(max-width: 980px\).*\.about-hainan-map\s*\{[^}]*margin:\s*20px 0 0') 'Mobile map spacing reset is missing.'
Assert-AboutHainanAlignment ($styles -match '(?s)\.text-stack p\s*\{[^}]*line-height:\s*1\.65') 'Shared text-stack line height must remain unchanged.'
Assert-AboutHainanAlignment ($homepage -match 'styles\.css\?v=20260716-about-hainan-align') 'About Hainan stylesheet cache key is missing.'

if ($failures.Count -gt 0) {
  $failures | ForEach-Object { Write-Error $_ -ErrorAction Continue }
  exit 1
}

Write-Output 'About Hainan alignment checks passed (9 assertions).'
