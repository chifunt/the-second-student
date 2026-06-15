# Ubiquitous Language

## Story People

| Term                 | Definition                                                                                   | Aliases to avoid                       |
| -------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------- |
| **Arman A.**         | The recurring student identity for the anxious, unsupported AI-use path.                     | student_047, dark student, bad student |
| **Ben C.**           | The recurring student identity for the structured, supported AI-use path.                    | d.sim, light student, good student     |
| **Reactive Path**    | The story path where AI use begins from panic, uncertainty, and dependence risk.             | dark side, bad path, Arman side        |
| **Deliberate Path**  | The story path where AI use is bounded by planning, source checking, and retained judgement. | light side, good path, Ben side        |
| **Ambiguous Window** | A final or unresolved interface state that could belong to either student or the reader.     | neutral user, unknown user             |

## Story Structure

| Term                | Definition                                                                                 | Aliases to avoid                         |
| ------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------- |
| **Scene**           | A full-viewport story unit with one narrative action and one primary data role.            | page, slide, screen                      |
| **Title Scene**     | The opening scene that establishes population-level AI use before focusing on individuals. | main menu, scene 00 menu                 |
| **Mirror Scene**    | The split experience scene where one chart is read through both student perspectives.      | scene 07, split scene, convergence scene |
| **Session Handoff** | A transitional cue that signals a change in whose screen-world the reader is entering.     | perspective popup, slate, interstitial   |
| **Screen-World**    | The fictional software environment that expresses a student's mood, habits, and context.   | UI mockup, app clone, interface skin     |
| **Narrative Beat**  | The specific human action or realization a scene is built around.                          | feature, section, animation moment       |

## Data And Evidence

| Term                         | Definition                                                                                                | Aliases to avoid                     |
| ---------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **Workbook Statistic**       | A displayed percentage derived from the weighted HEPI/Kortext survey workbook.                            | data point, number, stat             |
| **Survey Quote**             | A real free-text excerpt from HEPI Report 199 shown with source labeling.                                 | AI quote, student line, real quote   |
| **Fictional Interface Copy** | Written interface text created for the story rather than quoted from the report.                          | quote, source quote, survey response |
| **Evidence Card**            | The detail-on-demand card that exposes source table, wording, base, and interpretation for a visual mark. | tooltip, popup, detail box           |
| **Primary Read**             | The first data message the reader should understand before scene action continues.                        | headline, data first, main number    |
| **Grouped Distribution**     | A simplified percentage grouping that still represents one complete survey response distribution.         | stacked chunks, summary bars         |
| **Detailed Breakdown**       | The original finer-grained response categories available behind a grouped visual.                         | tooltip detail, hidden data          |

## Visualization Forms

| Term                     | Definition                                                                                           | Aliases to avoid                 |
| ------------------------ | ---------------------------------------------------------------------------------------------------- | -------------------------------- |
| **Density Strip**        | A 100-unit prevalence visual used when the point is near-universal adoption.                         | mini pictogram, tick grid        |
| **Pictogram**            | A people/icon array used to make a percentage read as students rather than abstraction.              | icon grid, user icons            |
| **Concern Dial**         | A circular concern mark used in Scene 01 to make barrier percentages feel like alerts.               | donut chart, gauge               |
| **Support Signal Chart** | The Scene 03 motivation visual that emphasizes why AI becomes attractive in a panic moment.          | motivation cards, support bars   |
| **Workflow Risk Map**    | The Scene 04 visualization that groups AI assessment uses by retained judgement and authorship risk. | ranked bar, risk chart           |
| **Authorship Ladder**    | The Scene 05 ordered visual that shows support sliding toward substitution.                          | boundary ladder, threshold chart |
| **Gap Chart**            | A paired-point visual that shows distance between needed skills and felt support.                    | dumbbell chart, comparison bars  |
| **Stacked Bar**          | A 100% whole-distribution bar reserved for compact part-of-whole readings.                           | generic bar, percentage bar      |
| **Diverging Bar**        | A mixed-impact distribution visual that separates less, no-impact, and more outcomes.                | split bar, loneliness bar        |
| **Ghost Recap Stat**     | A final-scene stat card that keeps evidence present behind the paywall interruption.                 | recap card, ghost stat           |

## Motion And Navigation

| Term                       | Definition                                                                                              | Aliases to avoid                  |
| -------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------- |
| **Native Snap Navigation** | Browser-owned scrolling plus CSS snap for main scene travel.                                            | guided navigation, scroll hijack  |
| **Scene Stop**             | A stable snap-aligned resting position for a main story scene.                                          | anchor, scroll target             |
| **Internal Stop**          | A sub-state inside the Mirror Scene's pinned scrub range.                                               | split step, scene 07 step         |
| **Entry Overlay**          | The pauseable full-screen identity/session introduction shown before selected scenes begin.             | data overlay, focus wash, popup   |
| **Data Focus Wash**        | The blur, tint, or darkening treatment that spotlights a scene's primary chart before action continues. | entry overlay, filter, blur thing |
| **Continue Hint**          | The bottom cue that appears only when a scene is ready to leave.                                        | down arrow, continue text         |
| **Progress Dots**          | The fixed navigation indicators for the 11 main scenes, excluding internal stops.                       | pagination dots, nav dots         |
| **Performance Lite**       | A reduced-paint mode that preserves content while lowering blur, glow, and shadow cost.                 | low power mode, reduced motion    |

## Relationships

- **Arman A.** travels mainly through the **Reactive Path**.
- **Ben C.** travels mainly through the **Deliberate Path**.
- A **Scene** has one **Narrative Beat** and should have one **Primary Read** when it contains data.
- A **Workbook Statistic** can drive a **Density Strip**, **Pictogram**, **Concern Dial**, **Gap Chart**, **Stacked Bar**, or **Diverging Bar**.
- A **Survey Quote** must use source labeling, while **Fictional Interface Copy** must not pretend to be survey evidence.
- An **Evidence Card** belongs to a chart mark or stat card, not to the whole scene.
- **Native Snap Navigation** moves between **Scene Stops**, while native scroll drives the Mirror Scene's pinned **Internal Stops**.
- An **Entry Overlay** introduces a session, while a **Data Focus Wash** prioritizes a chart.
- **Progress Dots** represent only main **Scenes**, not **Internal Stops**.

## Example Dialogue

> **Dev:** "When Scene 04 starts, should the **Entry Overlay** and the **Data Focus Wash** appear together?"
>
> **Domain expert:** "Yes. The **Entry Overlay** introduces **Ben C.**, but the **Data Focus Wash** should already be prepared behind it so the **Primary Read** does not pop in late."
>
> **Dev:** "Should the **Continue Hint** show during the chat typing?"
>
> **Domain expert:** "No. The **Continue Hint** appears only when the **Narrative Beat** is complete and the reader can move to the next **Scene Stop**."
>
> **Dev:** "Can I call the worse-side quote an AI line?"
>
> **Domain expert:** "No. If it comes from HEPI Report 199, call it a **Survey Quote**; if we wrote it for the screen-world, call it **Fictional Interface Copy**."

## Flagged Ambiguities

- "Overlay" has meant both **Entry Overlay** and **Data Focus Wash**; use the former for the full-screen session introduction and the latter for the chart spotlight treatment.
- "Snap" has meant native CSS snapping, abrupt hard snapping, and JS-guided movement; use **Native Snap Navigation** for the current movement model and **Scene Stop** for a resting position.
- "Scene 07" is too implementation-specific for discussion; use **Mirror Scene** when talking about the narrative role and **Internal Stop** when talking about its pinned sub-states.
- "Dark side" and "light side" make the students sound morally ranked; use **Reactive Path** and **Deliberate Path** in code/docs, and use the student identities in visible copy.
- "Quote" is overloaded; use **Survey Quote** for report excerpts and **Fictional Interface Copy** for invented chat, email, and assistant text.
- "Data point" is too vague; use **Workbook Statistic** for survey percentages and **Primary Read** for the intended first data message.
- "Progress bar" can mean an entry countdown, a chart fill, or a navigation indicator; name the specific artifact instead.
