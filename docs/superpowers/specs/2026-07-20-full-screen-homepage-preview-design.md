# Full-Screen Homepage Preview Design

## Goal

Create a separate local preview of the homepage hero that fills the visible desktop screen beneath the fixed header. The production homepage and live site remain unchanged until the preview is approved.

## Approved Direction

Use a viewport-fit hero with vertically rebalanced content.

- The fixed header retains its current height and navigation layout.
- The hero occupies at least the remaining visible viewport height: `100dvh - header height`, with a `100vh` fallback.
- The heading, CTA buttons, and credibility cards stay grouped on the left and move slightly upward within the hero.
- The coastline image remains full-bleed with the current left-to-right fade and visual emphasis.
- The bottom of the hero aligns with the bottom of the first viewport, so the "Who This Is For" section begins only after scrolling.
- The preview does not change homepage copy, navigation, image assets, or CTA destinations.

## Responsive Behavior

- Desktop and wide tablet: the hero fills the remaining viewport below the header.
- Short desktop windows: the hero grows beyond the viewport if required to prevent content clipping.
- Mobile: content determines the minimum height; buttons and credibility cards can wrap without overlap.
- Dynamic viewport units are used where supported to avoid browser chrome producing visible gaps.

## Preview Isolation

The preview will be served from a separate local page or preview-only stylesheet. Existing production files will not be modified during preview creation. After approval, the selected CSS will be applied to the production homepage in a separate step.

## Acceptance Criteria

1. No portion of "Who This Is For" is visible at the bottom of a standard desktop first viewport.
2. The hero background reaches the bottom edge of that viewport.
3. Heading, buttons, and credibility cards remain visible and do not overlap.
4. The coastline and forest remain clearly framed.
5. Mobile layouts have no horizontal overflow or clipped text.
6. The current live site remains unchanged while the preview is under review.
