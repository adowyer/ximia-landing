# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server at http://localhost:5173
npm run build      # Production build → dist/
npm run preview    # Preview production build locally
npm run lint       # Run ESLint
```

## Architecture

**Single-page React + Vite marketing site** for Ximia AI (real estate sales automation). No routing — one scroll-based page.

### Key files

- `src/App.jsx` — entire UI (~928 lines, all sections in one file, no component splitting)
- `src/main.jsx` — React entry point + i18next initialization
- `src/locales/en/translation.json` / `src/locales/es/translation.json` — all copy; parallel key structure
- `public/calculator.html` — standalone cost calculator, embedded as iframe in App.jsx

### Sections in App.jsx (top to bottom)

Hero → Problem → Solution → Architecture (bento grid) → Comparison table → CTA → Footer

### Animation pattern

Each animated section uses `useRef` + `IntersectionObserver` to trigger CSS class transitions on scroll entry. Typewriter effects and animated counters are driven by `useEffect` + `setInterval`/`setTimeout`.

### Localization

i18next with browser language detection (en/es, fallback en). Language preference saved to `localStorage`. All new copy must have keys in both translation files. Some values use HTML (rendered with `dangerouslySetInnerHTML`).

### Styling

Tailwind CSS v3 utilities throughout. Brand blue: `#0092B3`. Responsive breakpoint: `md` (768px). Custom keyframes (`fadeInUp`, `slideUp`, `blink`, `slideIn`, `fadeToGray`) live in `src/index.css`.

### External integrations

- **Calendly** — loaded via CDN script tag in `index.html`; popup triggered by CTA buttons
- **Botpress webchat** — commented out in `index.html`, preserved for future re-enable
