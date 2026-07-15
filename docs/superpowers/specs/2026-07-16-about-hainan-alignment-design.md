# About Hainan Alignment Design

## Goal

Make the About Hainan right-column text slightly more compact and align the bottom of the right map panel horizontally with the bottom of the left city image on desktop.

## Approved Direction

Use the selected balanced-spacing approach. Scope every change to the About Hainan section so other `.text-stack` components remain unchanged.

## Desktop Layout

- Keep the existing two-column proportions, heading, images, text, and font sizes.
- Stretch the two About Hainan columns to the same grid-row height.
- Make `.about-hainan-content` a vertical flex container that fills the available row height.
- Anchor the map panel to the bottom of the right column with automatic top spacing after the text block.
- Keep the left heading and city image unchanged.

## Text Spacing

- Reduce the right-column paragraph line height from the shared `1.65` value to `1.50` only inside `.about-hainan-content`.
- Reduce the gap between the three paragraphs from `16px` to `12px`.
- Remove the generic text-stack bottom margin inside this section so it does not combine with the map's top margin.
- Retain a minimum `20px` separation between the final paragraph and the map.

## Responsive Behavior

- At widths below `980px`, retain the existing single-column layout.
- Disable forced equal-height behavior in the stacked layout.
- Keep normal document flow and a `20px` gap between text and map.
- Preserve the existing image widths, aspect ratios, captions, and rounded corners.

## Verification

- Add a focused test for the scoped line height, paragraph gap, flex-column layout, and automatic map alignment.
- Confirm the generic `.text-stack` styles remain unchanged for the About Us section.
- Verify desktop at 1440 x 900: both visual columns share the same bottom coordinate within a small rendering tolerance.
- Verify tablet/mobile stacking has no overlap, clipping, or horizontal overflow.
- Update the stylesheet cache key before GitHub Pages deployment.

## Out of Scope

- Rewriting About Hainan copy.
- Changing font size or column widths.
- Cropping or replacing either image.
- Changing About Us or other two-column sections.
