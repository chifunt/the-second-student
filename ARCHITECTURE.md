# Architecture

## Boot Flow

`src/main.ts` imports the public SCSS entrypoint, renders all scene configs from `src/scenes/index.ts`, creates global chrome, and calls `setupScroll(scenes)`.

Each scene becomes:

```html
<section id="{scene.id}" class="scene scene--{mode}" data-scene="{scene.id}"></section>
```

The scene module then adds its own narrative body via `createVisualScene`.

## Scene Lifecycle

The stable contract is `SceneConfig` in `src/scenes/sceneTypes.ts`:

- `id`: DOM id and navigation target.
- `title`: human-readable scene title.
- `mode`: visual/narrative mode.
- `render(container)`: creates readable static content.
- `animate(container)`: optional GSAP timeline hook.
- `destroy(container)`: reserved for future teardown.

Scene modules own narrative markup because the app is a scrollytelling piece, not a component library. Keeping markup near the story beat makes it easier to tune copy, rhythm, and data context together.

The app is intentionally framework-free. D3 and GSAP both need direct access to rendered DOM, and the current complexity lives in narrative composition, survey interpretation, and scroll timing rather than reusable application state.

## DOM Ownership

- Scene modules create scene layout and narrative interface markup.
- Chart modules render chart markup or SVG from typed data.
- GSAP animates elements that already exist.
- Interaction helpers add behavior to stable CSS hooks.

Do not let animation code create core story DOM. Do not hardcode survey values in scenes when the value belongs in `surveyStats.ts`.

## Chart And Data Flow

Survey values live in `src/data/surveyStats.ts`. Narrative copy and quotes live in `src/data/copy.ts`.

Use named lookup helpers from `src/data/statLookups.ts` when a scene needs a specific survey row. Index-based reads such as `stats.assessmentUses[5]` are fragile because survey arrays are ordered for display, not for API stability.

Chart helpers in `src/charts/` accept typed data and return markup. They may use D3 for scales, grouping, and SVG generation. Returning strings keeps scene composition simple while preserving a clear boundary: data in, chart structure out.

Animation of chart elements lives in `src/animation/chartAnimations.ts`, where GSAP targets common hooks such as `.bar-fill`, `.dial-ring`, and pictogram items.

## Evidence Details

Details-on-demand metadata lives in `src/data/evidence.ts`. Chart helpers attach the metadata with `renderEvidenceAttributes`, and `src/animation/evidenceDetails.ts` owns the hover, focus, tap, pin, outside-click, and Escape behavior.

This keeps the narrative surface clean while still exposing source table, survey wording, base, interpretation, and grouped/detailed breakdowns when the reader asks for them. Do not create per-scene tooltip code unless the shared helper cannot support the interaction.

## Animation Ownership

`src/animation/setupScroll.ts` is the orchestration entrypoint. It clears previous runtime effects, resolves reduced-motion state, initializes global interactions, then calls scene `animate()` hooks.

Focused helpers live beside it:

- `navigation/`: native snap settling, button/dot navigation requests, URL hash updates, and Scene 07 completion state.
- `timelineCore.ts`: shared scene timeline primitives.
- `reactiveScenes.ts`: Arman/reactive-path scene timelines.
- `deliberateScenes.ts`: title, Ben/deliberate-path, and institutional scene timelines.
- `splitFinalScenes.ts`: mirror-scene and final paywall timelines.
- `entryOverlays.ts`: entry slate lifecycle; it starts only from the native snap settled event.
- `densityTicks.ts`: title density strips.
- `progressNavigation.ts`: scene progress dots.
- `titleOpen.ts`: opening handoff from title to email.
- `selectionSweep.ts`: panic-selection text sweep.
- `fakeTyping.ts`: looping fake typed prompts.
- `countUp.ts`: scroll-triggered numeric count-ups.
- `storyInteractions.ts`: about drawer, ladder details, paywall buttons.
- `runtimeEffects.ts`: timers and cancelable loops.
- `motionPreference.ts`: reduced-motion and query override logic.

`sceneTransitions.ts` is a compatibility barrel that re-exports the scene timeline functions. Keep scene imports stable there, but add new implementation code to the focused modules above.

Native browser scrolling and CSS snap own wheel, trackpad, touch, and keyboard movement. JavaScript should not intercept those inputs for normal scene travel. Programmatic controls such as progress dots, continue hints, and the title open button route through `requestStoryNavigation()`, which uses native smooth scrolling to the requested scene.

Entry overlays start from settled scene alignment, usually via `second-student:navigation-settled` and with a small alignment fallback for browser snap paths that do not emit that event. Their progress cue only advances while the scene is aligned. If the reader scrolls away before the cue completes, the overlay pauses and resumes from the saved progress when that scene snaps back to the viewport top.

Scenes with both entry overlays and data focus use a prearmed data-focus state behind the entry slate. The entry overlay remains visually primary, but the data-focus wash is already prepared underneath it; `playDataFocus()` then releases that state instead of introducing a second overlay after the entry slate.

Scene 07 is intentionally special: native scroll drives its pinned ScrollTrigger scrub range. Its split completion helper belongs in `navigation/splitStops.ts`, while visual choreography remains in `splitFinalScenes.ts`.

## Styling Organization

`src/styles/main.scss` is the only public style entrypoint. It imports:

- `base/`: tokens, scene shell, responsive rules, accessibility.
- `chrome/`: reusable windows, profile badges, quote cards, progress dots, about drawer.
- `scenes/`: one SCSS partial per narrative scene.
- `charts/`: one SCSS partial per chart family.

When adding a style, prefer the narrowest file that matches ownership. Shared chrome belongs in `chrome/`; a one-scene layout belongs in `scenes/`; a reusable data graphic belongs in `charts/`.

## Accessibility And Reduced Motion

The story must remain readable without animation. Reduced-motion mode should disable choreography without hiding content.

Expectations:

- Charts need visible labels, not color-only encoding.
- Interactive-looking controls need focus states.
- Do not place essential content behind animation-only states.
- Avoid rapid flashing and intense pulsing.
- Preserve normal page scroll when motion is reduced.

## Where To Add Things

- New scene: add `src/scenes/{name}Scene.ts`, export it from `src/scenes/index.ts`, and add `src/styles/scenes/_{name}.scss`.
- New stat: add it to `src/data/surveyStats.ts` with source metadata; consume it from scenes/charts.
- New chart: add `src/charts/{chartName}.ts`, style it in `src/styles/charts/_{chartName}.scss`, and import that partial from `src/styles/charts/index.scss`.
- New evidence card: add metadata to `src/data/evidence.ts`, pass it through the chart helper, and render attributes with `renderEvidenceAttributes`.
- New global interaction: add a focused helper in `src/animation/` and call it from `setupScroll.ts`.
- New scroll/navigation behavior: add it under `src/animation/navigation/`; do not add raw wheel/touch listeners in scene modules.
- New scene animation: add or extend a function in the relevant focused animation module, then re-export it from `sceneTransitions.ts`.
