# Het is maar haar

One-page site for freelance hairdresser "Het is maar haar", rebuilt from the Canva design (`docs/design/page-1..4.webp`).

## Tech stack

- **Astro** (static output)
- `astro:assets` for responsive, optimised images
- Fonts via Fontsource:
  - **MuseoModerno SemiBold**: title
  - **Azeret Mono Medium**: body and nav
  - **Fraunces Variable (Black, soft)**: headings, as a free stand-in for the licensed Roca One

## Structure

```
src/
  data/site.ts              all copy, links, prices and portfolio items (to be replaced by Sanity)
  data/frames.ts            fixed set of hand-drawn frames with their photo window
  layouts/Base.astro        html shell, fonts, global css
  components/
    Stage.astro             canvas section, 16:9 on desktop, own ratio on mobile
    Layer.astro             absolutely positioned responsive image, optional mobile position
    Framed.astro            portfolio photo masked into a frame
    PillBar.astro           fixed bottom nav on mobile
    sections/               Home, Portfolio, Prices
  assets/                   images exported from the Canva design
docs/design/                reference screenshots of the Canva pages
```

Sections are anchored (`#home`, `#portfolio`, `#prices`, `#contact`) and the nav scrolls to them.

Below 760px each section switches to a portrait layout: positions come from the `m` prop on `Layer` or the second box passed to `place()`. The portfolio becomes a two-row swipeable gallery and a pill bar replaces the in-hero nav.

A portfolio item is a photo plus a frame key (`site.portfolio.items`). Optional `position` and `zoom` control the crop inside the frame.

## Development

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # type-check + static build to dist/
npm run preview
```

Requires Node 22.12+.
