# Working Notes

This file is for fast orientation during maintenance and refactors.

## Important Files

- `src/main.ts`: renders scenes and starts scroll setup.
- `src/scenes/index.ts`: canonical scene order.
- `src/scenes/createScene.ts`: shared scene factory.
- `src/data/surveyStats.ts`: canonical survey values and source metadata.
- `src/data/statLookups.ts`: named accessors for specific survey rows used by scenes.
- `src/data/evidence.ts`: details-on-demand metadata for chart evidence cards.
- `src/data/copy.ts`: narrative copy and quotes.
- `src/ui/surveyQuote.ts`: shared treatment for real free-text excerpts.
- `src/charts/chartUtils.ts`: chart escaping, figure wrapper, SVG helper.
- `src/animation/setupScroll.ts`: orchestration only.
- `src/animation/navigation/`: guided story navigation, scene stops, input capture, hash sync, and Scene 07 internal stops.
- `src/animation/sceneTransitions.ts`: compatibility barrel for scene timeline exports.
- `src/animation/reactiveScenes.ts`: Arman/reactive-path scene timelines.
- `src/animation/deliberateScenes.ts`: title, Ben/deliberate-path, and institutional timelines.
- `src/animation/splitFinalScenes.ts`: mirror scene and final paywall timelines.
- `src/animation/evidenceDetails.ts`: shared hover/focus/tap evidence-card behavior.
- `src/styles/main.scss`: only SCSS entrypoint.

## Safe Refactor Rules

- Preserve `createVisualScene` and `SceneConfig` unless doing a deliberate architecture change.
- Keep data centralized; do not introduce duplicate visible survey values in scene files.
- Route new chart evidence through `src/data/evidence.ts` and `renderEvidenceAttributes`; do not create per-scene tooltip logic.
- Use `src/data/statLookups.ts` for specific survey rows instead of array indexes.
- Use the shared survey quote component for real student excerpts; leave fictional interface chatter untagged.
- The local Excel workbook is the canonical source for displayed percentages. It has weighted aggregate tables, not respondent-level quote text.
- Keep chart helpers reusable and typed.
- Keep GSAP focused on animation of rendered elements.
- Do not hide content by default and reveal it only with animation.
- Route scene-to-scene movement through `requestStoryNavigation()`; do not use `scrollIntoView()` in animated navigation paths.
- Entry overlays start only from the navigation-settled event. Do not add scroll, resize, or ScrollTrigger startup hooks to them.
- Do not remove `data-focus-prearmed`; it prevents entry+data scenes from showing a second data overlay pop after the entry slate dismisses.

## Verification Checklist

Run these before handing off structural changes:

```bash
npm run lint
npm run format:check
npm run build
```

Browser checks:

- All 11 scenes render in order.
- No starter Vite content appears.
- No horizontal overflow at desktop or mobile width.
- Reduced-motion mode still shows all content.
- Data scenes 01, 02, 04, 05, 06, 07, and 09 remain visually populated.

## Current Structure Notes

Styles are split by ownership:

- `base/` for tokens, shell, responsive, accessibility.
- `chrome/` for reusable interface chrome.
- `scenes/` for one-scene layouts.
- `charts/` for chart families.

Animations are split by behavior and story path. Add a new focused helper in `src/animation/` when the behavior is global or reusable; add scene timeline implementation to `reactiveScenes.ts`, `deliberateScenes.ts`, or `splitFinalScenes.ts`, then re-export from `sceneTransitions.ts`.

Guided navigation is split under `src/animation/navigation/`:

- `guidedNavigation.ts`: public setup and `requestStoryNavigation()`.
- `input.ts`: wheel, touch, and keyboard capture.
- `sceneStops.ts`: scene-stop lookup, active-scene settling, and URL hash updates.
- `splitStops.ts`: Scene 07 internal stop positions and completion state.
- `events.ts`: shared event names and payload types.

Scroll troubleshooting checklist:

- Confirm movement goes through `requestStoryNavigation()`.
- Confirm only the current scene owns an active entry overlay.
- Confirm Scene 07 is using split-step state rather than normal scene-to-scene state.
- Confirm reduced-motion mode has not intentionally bypassed guided movement.

Legacy helper files should not be kept indefinitely. If a chart or UI helper has no imports and no near-term owner, remove it and keep the guide/docs aligned with the remaining public helpers.
