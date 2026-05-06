---
name: Research State Engine
colors:
  surface: '#fdf8f8'
  surface-dim: '#ddd9d8'
  surface-bright: '#fdf8f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f3f2'
  surface-container: '#f1edec'
  surface-container-high: '#ebe7e6'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#444748'
  inverse-surface: '#313030'
  inverse-on-surface: '#f4f0ef'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#5e5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e4e2e2'
  on-secondary-container: '#646464'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1c1b1a'
  on-tertiary-container: '#868381'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#e4e2e2'
  secondary-fixed-dim: '#c8c6c6'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#474747'
  tertiary-fixed: '#e6e1df'
  tertiary-fixed-dim: '#cac6c3'
  on-tertiary-fixed: '#1c1b1a'
  on-tertiary-fixed-variant: '#484645'
  background: '#fdf8f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-xl:
    fontFamily: Newsreader
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Newsreader
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Work Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Work Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.08em
  meta-sm:
    fontFamily: Work Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.4'
spacing:
  unit: 4px
  gutter: 32px
  margin-page: 64px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style
The brand personality is authoritative yet quiet, designed to facilitate deep focus and intellectual rigor. It avoids the frantic "productivity" aesthetic of modern SaaS in favor of an **Editorial Minimalism** style. The UI should evoke the feeling of a premium broadsheet or a high-end academic journal—deliberate, structured, and permanent. 

The emotional response should be one of "clarity through structure." By removing visual noise like shadows and rounded corners, this design system shifts the user's attention entirely to the information architecture and the "state" of the knowledge being processed.

## Colors
The palette is rooted in a "paper and ink" philosophy. The primary background is a warm off-white, reducing eye strain during long-form reading. Charcoal and slate provide the foundation for text and structural lines.

Color is reserved strictly for functional utility. It is never used for decoration. 
- **Established (Muted Green):** Used for verified data or settled arguments.
- **Debated (Soft Amber):** Used for conflicting sources or active inquiries.
- **Unknown (Cool Blue):** Used for gaps in research or hypothetical nodes.

Use these colors primarily for typography accents, thin vertical indicators, or subtle underlines.

## Typography
Typography is the primary driver of the interface. This design system uses **Newsreader** for all headings to provide an intellectual, literary tone. The high-contrast serif nature of the font allows headlines to command attention without needing heavy weights or bright colors.

**Work Sans** is used for body content and UI labels due to its precise, technical clarity. It balances the serif’s warmth with a cold, systematic feel. 

Maintain a strict vertical rhythm. Large headlines should often sit alone with significant top-margin clearance to create an editorial "entry point" for different sections of research.

## Layout & Spacing
The layout follows a **structured asymmetry** model. While built on a 12-column grid, content should rarely be centered. Use the grid to create wide primary columns for reading and narrow "marginalia" columns for metadata, citations, and state indicators.

Generous whitespace is mandatory to prevent the "dashboard effect." Every major research node should have enough "breathable" space around it to be considered in isolation. Use spacing to group related thoughts rather than boxes or containers.

## Elevation & Depth
Depth is conveyed through **tonal layers and hairlines**, not shadows or blurs. 

- **Level 0 (Base):** The off-white paper layer.
- **Level 1 (Sub-section):** A subtle shift to a slightly cooler gray background (#F0F0EE) or a 0.5px charcoal border to denote a distinct module.
- **Interactions:** Use "high-contrast outlines" (1px solid charcoal) for active focus states. 

Avoid stacking elements. If a modal or overlay is necessary, it should be a full-screen take-over or a sharp-edged "drawer" that pushes content rather than floating over it.

## Shapes
This design system utilizes a **Sharp** shape language. All corners are 0px. This reinforces the "sharp" and intellectual tone and differentiates the interface from consumer-grade software. 

Lines should be used sparingly but decisively. When a divider is needed, it should be a 0.5px "hairline" in slate or charcoal.

## Components
- **Buttons:** Sharp-edged. Primary buttons are solid charcoal with off-white text. Secondary buttons are text-only with a 1px bottom underline that grows to 2px on hover.
- **Knowledge State Indicators:** Do not use rounded pills. Instead, use a 4px wide vertical "status bar" on the left edge of a text block or a subtle color tint on the headline of that section.
- **Input Fields:** Minimalist. A single bottom border (hairline). The label should sit above in `label-caps`. Focus state changes the bottom border to 1.5px charcoal.
- **Cards:** "Invisible cards." Use whitespace and a bold headline to define a card's boundary. If a border is required for clarity, use a 0.5px slate border with 0px radius.
- **Lists:** Use "hanging indents" for citations and research notes. Bullet points should be small, sharp squares rather than circles.
- **Additional Component - The 'Marginalia' Note:** A small text block in `meta-sm` that sits in the right-side gutter, linked to the main body text via a hairline horizontal connector.