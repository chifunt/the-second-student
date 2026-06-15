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
- `src/animation/navigation/`: native snap settling, programmatic scene requests, hash sync, and Scene 07 completion state.
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
- Let native browser scroll and CSS snap own wheel, trackpad, touch, and keyboard movement.
- Route progress dots, continue hints, and title-open clicks through `requestStoryNavigation()` instead of adding bespoke scroll code.
- Entry overlays start from settled scene alignment. Prefer the navigation-settled event, with exact-alignment fallback checks only for browser snap paths that do not emit it. They are pauseable reading cues, so do not add scroll locks, skip listeners, resize hooks, or ScrollTrigger startup hooks to them.
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

Native snap coordination lives under `src/animation/navigation/`:

- `guidedNavigation.ts`: compatibility-named setup module and `requestStoryNavigation()` for buttons/dots/hints.
- `sceneStops.ts`: scene-stop lookup, active-scene settling, and URL hash updates.
- `splitStops.ts`: Scene 07 progress helpers and completion state.
- `events.ts`: shared event names and payload types.

Scroll troubleshooting checklist:

- Confirm normal wheel, trackpad, touch, and keyboard movement is not intercepted by JavaScript.
- Confirm programmatic movement goes through `requestStoryNavigation()`.
- Confirm only the current scene owns an active entry overlay, and scrolling away pauses progress instead of dismissing the cue or trapping the page.
- Confirm Scene 07 is using native pinned ScrollTrigger scrub rather than forced internal jumps.
- Confirm reduced-motion mode has not intentionally bypassed snap-related behavior.

Legacy helper files should not be kept indefinitely. If a chart or UI helper has no imports and no near-term owner, remove it and keep the guide/docs aligned with the remaining public helpers.
