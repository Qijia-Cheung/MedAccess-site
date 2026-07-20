# Full-Screen Homepage Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a separate local preview whose homepage hero fills the first desktop viewport below the fixed header, without modifying production homepage files.

**Architecture:** Create an isolated preview HTML page that reuses the existing site stylesheet and image assets, then layer a small preview-only stylesheet on top. A focused PowerShell regression test checks isolation and required viewport rules; browser measurements verify desktop and mobile rendering.

**Tech Stack:** Static HTML, CSS, PowerShell tests, local HTTP server, in-app browser inspection.

---

## File Structure

- Create `preview/full-screen-home.html`: isolated header, hero, and next-section marker using current homepage content and assets.
- Create `preview/full-screen-home.css`: preview-only viewport sizing and content positioning overrides.
- Create `tests/full-screen-home-preview.test.ps1`: checks isolation, fallback sizing, dynamic viewport sizing, and mobile behavior.
- Do not modify `index.html`, `styles.css`, `script.js`, or production assets.

### Task 1: Add the Failing Preview Contract Test

**Files:**
- Create: `tests/full-screen-home-preview.test.ps1`

- [ ] **Step 1: Write the failing test**

```powershell
$previewHtml = Join-Path $PSScriptRoot '..\preview\full-screen-home.html'
$previewCss = Join-Path $PSScriptRoot '..\preview\full-screen-home.css'

if (-not (Test-Path $previewHtml)) { throw 'Preview HTML is missing.' }
if (-not (Test-Path $previewCss)) { throw 'Preview CSS is missing.' }

$html = Get-Content $previewHtml -Raw
$css = Get-Content $previewCss -Raw

if ($html -notmatch 'href="\.\./styles\.css"') { throw 'Preview must reuse the production stylesheet.' }
if ($html -notmatch 'href="full-screen-home\.css"') { throw 'Preview stylesheet link is missing.' }
if ($html -notmatch 'id="audience"') { throw 'Preview must include the next-section boundary.' }
if ($css -notmatch 'min-height:\s*calc\(100vh - var\(--header-height\)\)') { throw '100vh fallback is missing.' }
if ($css -notmatch 'min-height:\s*calc\(100dvh - var\(--header-height\)\)') { throw '100dvh sizing is missing.' }
if ($css -notmatch '@media\s*\(max-width:\s*620px\)') { throw 'Mobile override is missing.' }
if ($css -notmatch 'min-height:\s*max\(640px, calc\(100dvh - var\(--header-height\)\)\)') { throw 'Mobile content-safe minimum is missing.' }

Write-Host 'Full-screen homepage preview checks passed (7 assertions).'
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tests\full-screen-home-preview.test.ps1
```

Expected: FAIL with `Preview HTML is missing.`

### Task 2: Build the Isolated Preview

**Files:**
- Create: `preview/full-screen-home.html`
- Create: `preview/full-screen-home.css`

- [ ] **Step 1: Create the preview HTML**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AsterNexis Advisory | Full-Screen Homepage Preview</title>
  <link rel="stylesheet" href="../styles.css">
  <link rel="stylesheet" href="full-screen-home.css">
</head>
<body>
  <header class="site-header">
    <a class="brand" href="#home" aria-label="AsterNexis Advisory home">
      <img class="brand-logo" src="../assets/asternexis-advisory-logo-cn.png" alt="AsterNexis Advisory">
    </a>
    <nav class="site-nav is-open" aria-label="Main navigation">
      <a href="#audience">Who It Helps</a>
      <a href="#audience">How It Works</a>
      <a href="#audience">Special Pathways</a>
      <a href="#audience">Assessment</a>
      <a href="#audience">About Hainan</a>
      <a href="#audience">About Us</a>
      <a class="nav-cta" href="#audience">Request Assessment</a>
    </nav>
  </header>
  <main>
    <section id="home" class="hero">
      <img class="hero-image" src="../assets/hainan-coastal-road.png" alt="Aerial view of Hainan's coastal highway and blue sea">
      <div class="hero-overlay"></div>
      <div class="hero-content wrap">
        <div class="hero-copy">
          <p class="eyebrow">CHINA HEALTHCARE MARKET ENTRY PATHWAYS</p>
          <h1><span class="hero-title-line">Find Your China Entry Pathway</span><span class="hero-title-line">Before Full Registration</span></h1>
          <div class="actions">
            <a class="button" href="#audience">Start Your Pathway Assessment</a>
            <a class="button button-secondary" href="#audience">Download China Entry Brief</a>
          </div>
          <div class="trust-row">
            <div><strong>Source-based</strong><span>Plain-English analysis grounded in official and publicly available policy sources.</span></div>
            <div><strong>Healthcare focused</strong><span>Built around drugs, devices, diagnostics, digital health, and clinical-use pathways.</span></div>
            <div><strong>Partner ready</strong><span>Designed to support matching with China-based clinical, commercial, and industrial resources.</span></div>
          </div>
        </div>
      </div>
    </section>
    <section id="audience" class="section section-compact">
      <div class="wrap">
        <p class="section-kicker">WHO THIS HELPS</p>
        <h2>Who This Is For</h2>
      </div>
    </section>
  </main>
</body>
</html>
```

- [ ] **Step 2: Add the viewport-fit CSS**

```css
.hero {
  min-height: calc(100vh - var(--header-height));
  min-height: calc(100dvh - var(--header-height));
  padding-top: 0;
}

.hero-content {
  min-height: inherit;
  align-items: center;
}

.hero-copy {
  padding-top: clamp(32px, 5vh, 58px);
  padding-bottom: clamp(36px, 6vh, 68px);
  transform: translateY(-1.5vh);
}

@media (max-width: 620px) {
  .hero {
    min-height: max(640px, calc(100dvh - var(--header-height)));
  }

  .hero-copy {
    transform: none;
  }
}
```

- [ ] **Step 3: Run the focused test to verify it passes**

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tests\full-screen-home-preview.test.ps1
```

Expected: `Full-screen homepage preview checks passed (7 assertions).`

### Task 3: Verify the Preview Visually

**Files:**
- Verify: `preview/full-screen-home.html`

- [ ] **Step 1: Start a local server from the preview worktree**

Run a local HTTP server on an available port and open `/preview/full-screen-home.html?preview=fullscreen-home-20260720`.

- [ ] **Step 2: Verify desktop geometry at 1440 x 900**

Measure the header, hero, viewport, and `#audience` top edge. Expected:

- `hero bottom == viewport height`, within 1 CSS pixel.
- `audience top >= viewport height`, within 1 CSS pixel.
- No horizontal overflow.
- Heading, buttons, and three credibility cards fit inside the hero.

- [ ] **Step 3: Verify mobile geometry at 390 x 844**

Expected:

- No horizontal overflow.
- No clipped or overlapping text.
- Buttons and credibility cards wrap into stable tracks.
- `#audience` begins after the hero content.

- [ ] **Step 4: Run all existing structural tests**

Run every `tests/*.test.ps1` script. Expected: all checks pass.

- [ ] **Step 5: Share the local preview URL**

Provide the preview URL and state clearly that production files and the live site remain unchanged pending user approval.
