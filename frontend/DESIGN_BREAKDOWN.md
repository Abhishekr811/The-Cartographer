# RSE Design Breakdown (Extracted From Inspiration)

## 1) Layout Patterns
- Structured asymmetry using editorial-style columns instead of centered dashboard cards.
- Repeated 12-column grids with wide reading columns and narrow metadata rails.
- Strong section rhythm: page header -> separator hairline -> stacked sections.
- Generous whitespace with consistent large vertical intervals.
- Sharp edges and hairline borders instead of rounded floating cards.
- Focus mode uses full-surface takeover panel instead of small modal.

## 2) Typography System
- Headline font: Newsreader (serif) for display and section titles.
- Body/UI font: Work Sans for body text, controls, metadata.
- Clear hierarchy found repeatedly:
  - Display: 48px / 1.1 / 600
  - Headline LG: 32px / 1.2 / 500
  - Headline MD: 24px / 1.3 / 500
  - Body LG: 18px / 1.6 / 400
  - Body MD: 16px / 1.6 / 400
  - Label caps: 12px / 1.0 / 600 / 0.08em letter-spacing
  - Meta: 13px / 1.4 / 400
- Labels and metadata are often uppercase with expanded tracking.

## 3) Color Usage
- Core editorial neutrals:
  - Background paper: #fdf8f8
  - Text ink: #1c1b1b
  - Secondary text: #444748
  - Hairline/outline: #c4c7c7
- Functional state accents:
  - Established: muted green family
  - Debated: soft amber family
  - Unknown: cool blue family
- State colors are applied as subtle signals: left bars, chips, dots, thin accents.

## 4) Component Patterns
- Repeated primitives across pages:
  - state cards/panels with left status bar and minimal framing
  - claim/evidence rows with title + metadata + confidence tag
  - summary strips with compact status metrics
  - action controls with primary filled and understated text/line variants
  - separators via 0.5px to 1px hairlines
- Composition pattern: content sections are built from text primitives + structural wrappers.

## 5) Interaction Patterns
- Hover: gentle surface tint shifts, thin border emphasis, subtle elevation.
- Focus: strong high-contrast outline for active elements.
- Motion: restrained transitions around 150-200ms.
- Focus mode behavior: context dimming + foreground concentration panel.

## System Extraction Decisions
- Keep inspiration's editorial asymmetry and crisp geometry.
- Implement reusable React primitives for layout, typography, state, claims, and interactions.
- Centralize tokens in CSS custom properties for color, spacing, and typography scale.
- Use modular CSS for scoped, maintainable component styling.
