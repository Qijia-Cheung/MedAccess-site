# Assessment and Process Merge Design

## Goal

Merge the separate "How the Assessment Works" section into the Assessment section so the page presents one continuous journey from the questions AsterNexis Advisory helps answer to the four-step assessment process.

## Approved Direction

Use the selected **Guided Journey** layout. Replace the existing "China Access Is Not One Pathway" introduction entirely.

The merged section has two full-width visual zones:

1. A dark upper Assessment zone containing the section heading, supporting sentence, and five assessment-question cards.
2. A light lower Process zone containing "How the Assessment Works" and the four numbered process steps.

These zones are parts of one section, not separate floating cards. The color transition creates hierarchy while keeping the content connected.

## Content Structure

### Assessment Zone

- Kicker: `ASSESSMENT QUESTIONS`
- Heading: `Turn Policy Options Into a Practical Entry Plan`
- Supporting text: `AsterNexis Advisory helps overseas healthcare teams identify the right route, evidence requirements, partners, and next steps for entering China.`
- Preserve the existing five assessment cards and their current wording:
  - Is my product a fit?
  - What is the access model?
  - What are the constraints?
  - Who should I talk to?
  - What should I prepare?

### Process Zone

- Kicker: `ASSESSMENT PROCESS`
- Heading: `How the Assessment Works`
- Preserve the existing four process steps and their current wording:
  - Submit a non-confidential product profile
  - Receive pathway screening
  - Map China-based resources
  - Discuss practical next steps

The process zone keeps the `pathway` anchor so the existing "How It Works" navigation link continues to scroll directly to it.

## Layout and Styling

- The Assessment zone retains the site's dark teal background, light text, teal accents, and restrained card borders.
- The Process zone uses the existing soft light background, dark text, and circular teal number markers.
- Desktop: five equal columns for assessment cards and four equal columns for process steps.
- Tablet: two columns for both card groups, with the final assessment card using the available grid position without stretching across the full row.
- Mobile: one column for both card groups.
- Spacing between the heading, cards, and zone transition must remain generous without creating the appearance of two unrelated sections.
- The process zone must not be styled as a card nested inside the Assessment section.

## Navigation and Behavior

- Keep `id="assessment"` on the combined section.
- Move `id="pathway"` to the light Process zone.
- Remove the former standalone Process section from the document flow.
- Keep the existing JavaScript-rendered process cards and content source unchanged unless a minimal selector adjustment is required.

## Verification

- Add a structural test confirming that the `pathway` anchor is nested inside the Assessment section and that only one Assessment/Process container remains.
- Retain existing homepage, dropdown, and Special Pathways checks.
- Verify desktop and mobile layouts visually, including column behavior, spacing, text wrapping, anchor scrolling, and horizontal overflow.
- Confirm that other homepage sections and navigation links remain unchanged.

## Out of Scope

- Rewriting the assessment questions or process-step content.
- Changing the Special Pathways, Lecheng, GBA, forms, footer, or homepage hero.
- Introducing new images or decorative assets.
