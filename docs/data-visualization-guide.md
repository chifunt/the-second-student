# Data Visualization Guide

The visualizations should make the narrative point immediately. A chart is part of a student action, not a dashboard tile.

## Rules

- Pull survey values from `src/data/surveyStats.ts`.
- Put labels, visible values, source notes, and zone metadata in data/copy files.
- Use D3 for scale calculations or SVG structure when a chart needs quantitative layout.
- Use GSAP only after the chart structure exists.
- Do not rely on color alone; every visual needs text labels or positional encoding.

## Scene-By-Scene Intent

### 00 Title

Primary point: AI use is already normal.

Visual: headline stat density strips for 95% AI use and 94% assessed-work use.

Why: the first screen should communicate prevalence before the story narrows to individual screen-worlds.

### 01 Email Accusation

Primary point: fear of being accused is the leading barrier.

Visual: `renderHeroConcernChart` with a dominant 42% concern dial and supporting ranked concern strips.

Why: the scene is about panic, so one large concern should dominate rather than presenting five equal dashboard rows.

### 02 Panic Button

Primary point: 94% is a population-scale behavior, not an abstract percentage.

Visual: pictogram/icon array for assessed-work AI use.

Why: student icons make the prevalence legible as people in the same environment as the protagonist.

### 03 Panic Chat

Primary point: students reach for AI because it is immediate, efficient, and reassuring.

Visual: ranked motivation bars.

Why: motivations compare well as a compact ranked list beside the chat stream.

### 04 Deliberate Workflow

Primary point: the same tool changes meaning depending on where judgement remains.

Visual: `renderWorkflowRiskMap`, grouping assessed-work uses into support, amber, and authorship-risk zones.

Why: the story needs a boundary map more than another ranked chart.

### 05 Boundary

Primary point: support can slide toward substitution.

Visual: support-to-substitution ladder using the same assessment-use values and zones.

Why: a ladder makes escalation visible and ties directly to the document editor action.

### 06 Skill Gap

Primary point: institutions say skills matter more than students feel supported.

Visual: paired dumbbell/gap charts for 68 vs 48 and 50 vs 38.

Why: gaps are the story; paired points communicate distance more directly than separate bars.

### 07 Dependency

Primary point: AI can improve or worsen the student experience.

Visual: 100% stacked bar for 49 better, 35 no impact, 16 worse.

Why: the scene needs a whole-population split that sits behind the dependent prompt sequence.

### 08 Companion

Primary point: companionship use is smaller, but emotionally loaded.

Visual: companion anchor for 15% plus diverging loneliness bar for less/no impact/more lonely.

Why: the anchor shows scale, while the diverging bar shows the mixed emotional effect.

### 09 Final Paywall

Primary point: the survey recap collapses into one unresolved question.

Visual: ghosted recap stat cards behind the paywall.

Why: data should feel present but interrupted, matching the final interaction beat.
