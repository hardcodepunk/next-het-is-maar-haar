# Het is maar haar

A minimal, brand-focused landing page for freelance hairdresser 'Het is maar haar'.

The site features:

- a custom animated “hair-like” background built in ThreeJS
- a centered logo and primary call-to-action
- a booking modal (UI only, booking flow coming later)
- a bottom widget bar with Instagram, location, and contact links

Built as a single-page experience with a strong visual identity and mobile-first layout.

---

## Tech Stack

- **Next.js (App Router)**
- **React**
- **Tailwind CSS**
- **@react-three/fiber + drei** for the animated background
- Deployed-ready for **Vercel**

---

## Getting Started (Local Development)

### 1. Install dependencies

```bash
npm install
```

(or `yarn`, `pnpm`, or `bun` if you prefer)

### 2. Start the development server

```bash
npm run dev
```

### 3. Open in your browser

```
http://localhost:3000
```

The app will hot-reload as you edit files.

---

## Project Structure (Key Files)

```txt
app/
  page.tsx              # Main landing page
components/
  FluidBackground.tsx   # Animated background
  BookingModal.tsx      # Booking modal UI
  WidgetBar.tsx         # Bottom action bar
public/
  logo.png              # Brand logo
```

---

## Styling & Design Notes

- Styling is done entirely with **Tailwind CSS**
- Colors are based on a fixed pastel palette
- UI elements are intentionally flat (no heavy shadows or blur)
- The background animation is purely decorative and runs independently of UI

---

## Deployment

The project is ready to deploy on **Vercel**.

From the Vercel dashboard:

- Import the GitHub repository
- No special configuration required
- Default build settings work out of the box

---

## Roadmap / Future Improvements

- Integrate a real booking system
- Add opening hours
- SEO + metadata pass
- Optional CMS for content updates
