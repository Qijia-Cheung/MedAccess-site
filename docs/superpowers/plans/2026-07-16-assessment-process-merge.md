# Assessment and Process Merge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing Assessment introduction and standalone Process section with one responsive, two-zone Assessment journey while preserving all question cards, process steps, navigation anchors, and the profile submission form.

**Architecture:** Keep the existing static HTML/CSS/JavaScript structure. `index.html` will contain one semantic Assessment section with a dark question zone and a light process zone; the process cards continue to render from `data/site-content.js` through the existing `data-render="pathway"` target. Focused PowerShell assertions will protect the merged hierarchy and removed content.

**Tech Stack:** HTML5, CSS Grid, vanilla JavaScript, PowerShell structural tests, GitHub Pages.

---

### Task 1: Protect the merged document structure

**Files:**
- Modify: `tests/full-homepage-structure.test.ps1`
- Test: `tests/full-homepage-structure.test.ps1`

- [ ] **Step 1: Add failing structure assertions**

Add assertions that require the `pathway` anchor and rendered process grid to occur inside the Assessment section before the Policies section, forbid the former standalone Process section, and forbid the replaced Entry Context introduction:

```powershell
Assert-FullHomepage ($homepage -match '(?s)<section id="assessment".*id="pathway".*data-render="pathway".*</section>\s*<section id="policies"') 'Assessment questions and process must be merged into one section.'
Assert-FullHomepage ($homepage -notmatch '<section id="pathway"') 'Standalone Process section must be removed.'
Assert-FullHomepage ($homepage -notmatch 'ENTRY CONTEXT') 'Replaced Assessment entry-context kicker must be removed.'
Assert-FullHomepage ($homepage -notmatch 'China Access Is Not One Pathway') 'Replaced Assessment entry-context headline must be removed.'
Assert-FullHomepage ($homepage -match '<form id="product-form"[^>]+action="https://formspree.io/f/meebnwye"') 'Profile submission form and Formspree connection must remain.'
Assert-FullHomepage ($homepage -match '<form id="product-form"[^>]+enctype="multipart/form-data"') 'Profile submission form must retain multipart file-upload support.'
Assert-FullHomepage ($homepage -match 'type="file" name="productFile"') 'Profile submission file input must remain.'
```

Update the final assertion count from 19 to 26.

- [ ] **Step 2: Run the structure test and confirm the new assertions fail**

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tests\full-homepage-structure.test.ps1
```

Expected: FAIL because the process is still a standalone `<section id="pathway">` and the old Entry Context content remains.

### Task 2: Merge Assessment and Process markup

**Files:**
- Modify: `index.html:96-145`
- Test: `tests/full-homepage-structure.test.ps1`

- [ ] **Step 1: Replace the two sections with one two-zone section**

Use this hierarchy while preserving the existing five question cards and the existing process render target:

```html
<section id="assessment" class="assessment-dark assessment-journey">
  <div class="assessment-zone">
    <div class="wrap">
      <div class="section-head section-head-stacked assessment-intro">
        <div class="section-title">
          <p class="section-kicker">ASSESSMENT QUESTIONS</p>
          <h2>Turn Policy Options Into a Practical Entry Plan</h2>
        </div>
        <p>AsterNexis Advisory helps overseas healthcare teams identify the right route, evidence requirements, partners, and next steps for entering China.</p>
      </div>
      <div class="clarify-grid">
        <article class="clarify-card">
          <span>01</span>
          <h3>Is my product a fit?</h3>
          <p>Whether Hainan, GBA, Beijing, or another pilot route may be relevant.</p>
        </article>
        <article class="clarify-card">
          <span>02</span>
          <h3>What is the access model?</h3>
          <p>Clinical use, real-world data, local partner, park landing, or commercial strategy.</p>
        </article>
        <article class="clarify-card">
          <span>03</span>
          <h3>What are the constraints?</h3>
          <p>Eligibility, institutional application, product status, evidence, import rules, and compliance.</p>
        </article>
        <article class="clarify-card">
          <span>04</span>
          <h3>Who should I talk to?</h3>
          <p>Hospitals, parks, distributors, investors, or government-facing platforms.</p>
        </article>
        <article class="clarify-card">
          <span>05</span>
          <h3>What should I prepare?</h3>
          <p>Product profile, approval status, clinical evidence, regulatory history, and China objectives.</p>
        </article>
      </div>
    </div>
  </div>
  <div id="pathway" class="assessment-process-zone">
    <div class="wrap">
      <div class="section-head section-head-wide assessment-process-head">
        <div class="section-title">
          <p class="section-kicker">ASSESSMENT PROCESS</p>
          <h2>How the Assessment Works</h2>
        </div>
      </div>
      <div class="steps-grid" data-render="pathway"></div>
    </div>
  </div>
</section>
```

Remove the former Entry Context heading/copy and the standalone `<section id="pathway" class="section section-soft">`.

- [ ] **Step 2: Run the structure test**

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tests\full-homepage-structure.test.ps1
```

Expected: PASS with 26 assertions.

### Task 3: Style the Guided Journey layout

**Files:**
- Modify: `styles.css:240-275`
- Modify: `styles.css:607-690`
- Modify: `styles.css:910-965`
- Modify: `index.html:8`

- [ ] **Step 1: Add the two-zone section styling**

Add the section-level spacing, color transition, and anchor behavior:

```css
.assessment-journey {
  color: var(--color-dark-text);
  background: var(--color-dark);
}

.assessment-zone,
.assessment-process-zone {
  padding-top: clamp(72px, 9vw, 108px);
  padding-right: var(--page-gutter);
  padding-bottom: clamp(72px, 9vw, 108px);
  padding-left: var(--page-gutter);
}

.assessment-intro {
  margin-bottom: 42px;
}

.assessment-process-zone {
  scroll-margin-top: 0;
  color: var(--ink);
  background: var(--color-soft);
}

.assessment-process-zone .section-kicker {
  color: var(--teal);
}

.assessment-process-head {
  margin-bottom: 34px;
}

.assessment-process-zone .step-card {
  min-height: 190px;
  padding: 22px;
}
```

- [ ] **Step 2: Add tablet and mobile grid behavior**

Inside `@media (max-width: 980px)`, override the generic one-column rule for these two grids:

```css
.assessment-dark .clarify-grid,
.assessment-process-zone .steps-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
```

Inside `@media (max-width: 620px)`, return both grids to one column:

```css
.assessment-dark .clarify-grid,
.assessment-process-zone .steps-grid {
  grid-template-columns: 1fr;
}
```

- [ ] **Step 3: Update the stylesheet cache key**

Change the homepage stylesheet query string to a new Assessment-specific version so GitHub Pages clients receive the new CSS immediately:

```html
<link rel="stylesheet" href="styles.css?v=20260716-assessment-merge">
```

### Task 4: Verify behavior and publish

**Files:**
- Verify: `index.html`
- Verify: `styles.css`
- Verify: `script.js`
- Verify: `data/site-content.js`

- [ ] **Step 1: Run all structural tests**

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tests\full-homepage-structure.test.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File .\tests\special-pathways-dropdown.test.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File .\tests\special-pathways-structure.test.ps1
```

Expected: all scripts exit 0 with 48 total assertions.

- [ ] **Step 2: Perform desktop visual verification**

Open the local site at 1440 x 900 and verify:

- The dark Assessment zone contains one heading, supporting sentence, and five equal question cards.
- The light process band immediately follows inside the same section.
- Four process cards appear in one row.
- The `#pathway` navigation anchor lands at the light process band.
- No text overlaps and there is no horizontal overflow.

- [ ] **Step 3: Perform mobile visual verification**

Open the local site at 390 x 844 and verify:

- Both card groups use one column.
- Headings and card copy wrap without clipping.
- The dark-to-light transition remains clear.
- The navigation and profile submission form remain present and usable.
- There is no horizontal overflow.

- [ ] **Step 4: Check the final diff**

Run:

```powershell
git diff --check
git status --short
```

Expected: no whitespace errors; only `index.html`, `styles.css`, and `tests/full-homepage-structure.test.ps1` are staged for the implementation commit. Existing unrelated files remain untouched.

- [ ] **Step 5: Commit and publish**

Run:

```powershell
git add -- index.html styles.css tests/full-homepage-structure.test.ps1
git commit -m "Merge assessment questions and process"
git push origin main
```

Expected: GitHub Pages deploys the commit successfully.

- [ ] **Step 6: Verify the public page**

Confirm the public homepage returns HTTP 200, contains the merged `assessment` and nested `pathway` anchors, omits the replaced Entry Context heading, and loads `styles.css?v=20260716-assessment-merge`.
