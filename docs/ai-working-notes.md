# AI Working Notes

This file is for fast orientation by humans and AI agents.

## Important Files

- `src/main.ts`: renders scenes and starts scroll setup.
- `src/scenes/index.ts`: canonical scene order.
- `src/scenes/createScene.ts`: shared scene factory.
- `src/data/surveyStats.ts`: canonical survey values and source metadata.
- `src/data/copy.ts`: narrative copy and quotes.
- `src/charts/chartUtils.ts`: chart escaping, figure wrapper, SVG helper.
- `src/animation/setupScroll.ts`: orchestration only.
- `src/animation/sceneTransitions.ts`: scene timeline functions.
- `src/styles/main.scss`: only SCSS entrypoint.

## Safe Refactor Rules

- Preserve `createVisualScene` and `SceneConfig` unless doing a deliberate architecture change.
- Keep data centralized; do not introduce duplicate visible survey values in scene files.
- Keep chart helpers reusable and typed.
- Keep GSAP focused on animation of rendered elements.
- Avoid edits to `claude-design_the-second-student/`; it is ignored reference material.
- Do not hide content by default and reveal it only with animation.

## Verification Checklist

Run these before handing off structural changes:

```bash
npm run lint
npm run format:check
npm run build
```

Browser checks:

- All 10 scenes render in order.
- No starter Vite content appears.
- No horizontal overflow at desktop or mobile width.
- Reduced-motion mode still shows all content.
- Data scenes 01, 02, 04, 05, 06, and 08 remain visually populated.

## Current Structure Notes

Styles are split by ownership:

- `base/` for tokens, shell, responsive, accessibility.
- `chrome/` for reusable interface chrome.
- `scenes/` for one-scene layouts.
- `charts/` for chart families.

Animations are split by behavior. Add a new focused helper in `src/animation/` when the behavior is global or reusable; add to `sceneTransitions.ts` when it belongs to one scene timeline.
