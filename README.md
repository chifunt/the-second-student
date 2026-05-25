# The Second Student

An interactive scrollytelling prototype about student generative AI use, based on the HEPI / Kortext Student Generative AI Survey 2026.

The experience is deliberately framework-free. Scenes own their DOM, D3 owns chart calculation/rendering, and GSAP/ScrollTrigger owns scroll choreography.

Live site: https://chifunt.github.io/the-second-student/

## Stack

- Vite
- TypeScript
- D3
- GSAP + ScrollTrigger
- SCSS
- ESLint
- Prettier

## Commands

```bash
npm install
npm run dev
npm run lint
npm run format:check
npm run build
```

Use `npm run format` for a project-wide Prettier write.

## Deployment

GitHub Pages serves the built site from the `gh-pages` branch root. The Vite base path is configured in `vite.config.ts` for the project-page URL.

Until the GitHub CLI token is re-authenticated with `workflow` scope, deploy by building locally and publishing `dist/` to `gh-pages`.

## Data Source

Displayed survey values are centralized in `src/data/surveyStats.ts`.

Source metadata points to HEPI Report 199, `Student Generative Artificial Intelligence Survey 2026`, sponsored by Kortext. The local workbook reference is `Third-version-of-2026-weighted-data.xlsx`.

## Project Map

- `src/main.ts`: app bootstrap.
- `src/scenes/`: scene registry and scene markup modules.
- `src/data/`: survey stats, named lookups, evidence metadata, and narrative copy.
- `src/charts/`: chart helpers that render reusable chart markup/SVG.
- `src/animation/`: GSAP setup, scene timelines, and focused interaction helpers.
- `src/ui/`: small shared HTML helpers for quotes and repeated screen chrome.
- `src/styles/base/`: tokens, base layout, responsive rules, accessibility.
- `src/styles/chrome/`: shared window, chat, drawer, and navigation chrome.
- `src/styles/scenes/`: scene-specific layouts.
- `src/styles/charts/`: chart-specific visual systems.
- `docs/`: architecture, visualization, and working notes.
