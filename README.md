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
  data/site.ts              all copy, links and prices (to be replaced by Sanity)
  layouts/Base.astro        html shell, fonts, global css
  components/
    Stage.astro             16:9 canvas section, scales with viewport width
    Layer.astro             absolutely positioned responsive image
    sections/               Home, Portfolio, Prices
  assets/                   images exported from the Canva design
docs/design/                reference screenshots of the Canva pages
```

Sections are anchored (`#home`, `#portfolio`, `#prices`) and the nav scrolls to them.

## Development

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # type-check + static build to dist/
npm run preview
```

Requires Node 22.12+.
