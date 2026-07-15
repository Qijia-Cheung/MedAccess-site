# About Hainan Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Compact the About Hainan right-column paragraphs and align the right map panel with the left city image on desktop without changing images, font sizes, copy, or other text stacks.

**Architecture:** Add section-scoped CSS overrides for the existing About Hainan two-column grid. The right column becomes a full-height flex column with a compact text stack and bottom-anchored map, while the existing mobile breakpoint restores normal block flow.

**Tech Stack:** HTML, CSS Grid/Flexbox, PowerShell structural tests, browser geometry verification, GitHub Pages.

---

### Task 1: Add a failing About Hainan alignment safeguard

**Files:**
- Create: `tests/about-hainan-alignment.test.ps1`
- Test: `tests/about-hainan-alignment.test.ps1`

- [ ] **Step 1: Create the focused CSS test**

```powershell
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
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tests\about-hainan-alignment.test.ps1
```

Expected: FAIL because the scoped alignment rules and cache key do not yet exist.

### Task 2: Apply compact spacing and desktop alignment

**Files:**
- Modify: `styles.css:1028-1125`
- Modify: `index.html:8`
- Test: `tests/about-hainan-alignment.test.ps1`

- [ ] **Step 1: Add desktop alignment rules**

Add these rules near the existing About Hainan styles:

```css
#about-hainan .two-column {
  align-items: stretch;
}

.about-hainan-content {
  display: flex;
  flex-direction: column;
  align-self: stretch;
}

.about-hainan-content .text-stack {
  gap: 8px;
  margin-bottom: 0;
  padding-bottom: 8px;
}

.about-hainan-content .text-stack p {
  line-height: 1.5;
}
```

Replace the existing map margin with:

```css
.about-hainan-map {
  margin: auto 0 0;
}
```

- [ ] **Step 2: Restore normal stacked flow below 980px**

Add inside the existing `@media (max-width: 980px)` block:

```css
#about-hainan .two-column {
  align-items: start;
}

.about-hainan-content {
  display: block;
}

.about-hainan-content .text-stack {
  padding-bottom: 0;
}

.about-hainan-map {
  margin: 20px 0 0;
}
```

- [ ] **Step 3: Update the stylesheet cache key**

Change the stylesheet reference to:

```html
<link rel="stylesheet" href="styles.css?v=20260716-about-hainan-align">
```

- [ ] **Step 4: Run the focused test**

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tests\about-hainan-alignment.test.ps1
```

Expected: PASS with 9 assertions.

### Task 3: Verify geometry and publish

**Files:**
- Verify: `index.html`
- Verify: `styles.css`
- Verify: `tests/about-hainan-alignment.test.ps1`

- [ ] **Step 1: Run all test scripts**

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tests\about-hainan-alignment.test.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File .\tests\english-form-validation.test.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File .\tests\full-homepage-structure.test.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File .\tests\special-pathways-dropdown.test.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File .\tests\special-pathways-structure.test.ps1
```

Expected: all scripts exit 0 with 67 total assertions.

- [ ] **Step 2: Verify desktop geometry at 1440 x 900**

Measure the left city figure and right map figure:

- Both columns start on the same grid row.
- The right paragraph line height computes to `25.5px` (`17px × 1.50`).
- The paragraph gap computes to `8px`.
- The map and city-image bottom coordinates differ by no more than `15px`.
- There is no horizontal overflow.

- [ ] **Step 3: Verify mobile layout at 390 x 844**

- The section uses one column.
- The right content uses normal block flow.
- The map has a `20px` top margin.
- Text and images fit without clipping or horizontal overflow.

- [ ] **Step 4: Check, commit, and publish**

Run:

```powershell
git diff --check
git add -- index.html styles.css tests/about-hainan-alignment.test.ps1
git commit -m "Align About Hainan content columns"
git push origin main
```

Expected: only the scoped website files and test are included in the implementation commit; GitHub Pages deploys successfully.

- [ ] **Step 5: Verify the public page**

Confirm the public homepage returns HTTP 200, loads `styles.css?v=20260716-about-hainan-align`, and serves the scoped About Hainan alignment rules.
