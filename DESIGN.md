---
version: alpha
name: Corsair MiniV Evidence Index
description: Editorial operations index for local-AI evidence, optimized for scanability and honest state communication.
colors:
  primary: "#59E4D1"
  secondary: "#080B0D"
  tertiary: "#FFAD66"
  neutral: "#F4F7F7"
  dark-panel: "#101519"
  dark-panel-raised: "#151C21"
  dark-muted: "#91A0A7"
  dark-line: "#263238"
  semantic-success: "#B8EF72"
  semantic-warning: "#FFD166"
  light-background: "#F3F5F3"
  light-panel: "#FFFFFF"
  light-ink: "#121719"
typography:
  display:
    fontFamily: Inter, ui-sans-serif, system-ui
    fontSize: 6.5rem
    fontWeight: 700
    lineHeight: 0.91
    letterSpacing: "-0.065em"
  heading:
    fontFamily: Inter, ui-sans-serif, system-ui
    fontSize: 4.25rem
    fontWeight: 700
    lineHeight: 0.96
    letterSpacing: "-0.055em"
  body:
    fontFamily: Inter, ui-sans-serif, system-ui
    fontSize: 0.9375rem
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0em
  label:
    fontFamily: ui-monospace, SFMono-Regular, Menlo, monospace
    fontSize: 0.625rem
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: 0.16em
rounded:
  none: 0px
spacing:
  xs: 8px
  sm: 14px
  md: 22px
  lg: 40px
  xl: 78px
components:
  action-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.secondary}"
    rounded: "{rounded.none}"
    padding: 12px
  action-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.primary}"
    rounded: "{rounded.none}"
    padding: 12px
  evidence-panel:
    backgroundColor: "{colors.dark-panel}"
    textColor: "{colors.neutral}"
    rounded: "{rounded.none}"
    padding: 24px
---

## Overview

An editorial operations index rather than a decorative dashboard. The visual hierarchy answers three questions in order: what is currently trusted, how models compare, and where the underlying evidence lives. Candidate lanes remain visible without receiving production styling.

## Colors

Turquoise is the interaction and evidence color. Warm orange marks current operational attention. Lime is reserved for verified status. Yellow identifies bounded candidates and utility lanes. Large surfaces remain neutral and flat so dense metrics stay readable.

## Typography

Use oversized, tightly tracked display type only for the primary statement. Tables, labels, statuses, dates and model metadata use monospace. Body copy stays in the system sans stack; no external font runtime is required.

## Layout

The maximum content width is 1280px. Desktop uses editorial split compositions; tablet collapses to one column; mobile keeps four primary tabs and reduces ranking tables to the metric selected by the active lens. Progressive disclosure is mandatory: Overview, Rankings, Evidence, Artifacts.

## Shapes

Rectangular controls and flat panels reinforce the technical index. Statuses use a colored left rule rather than pills. Avoid decorative capsules, repeated rounded cards and nested floating surfaces.

## Components

Primary tabs expose `aria-selected`; rank lenses expose `aria-pressed`. Missing metrics render as Pending, never zero. Evidence and artifact items are entire-link targets. The data source is same-origin, version-controlled `data/gallery-v2.json`.

## Do's and Don'ts

- Do show production, candidate, benchmarking and utility as distinct states.
- Do separate quality, decode, prefill and context rankings.
- Do test 1600px, 768px and 480px without global overflow.
- Don't rank a candidate using missing metrics.
- Don't use Plotly, external fonts or Matrix-rain decoration on the index.
- Don't duplicate benchmark values inside HTML or translation dictionaries.
