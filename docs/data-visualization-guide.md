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

Visual: `renderHeroConcernChart` with semantic concern dials for academic risk, information risk, and system cost.

Why: the scene is about panic, so the leading concern should dominate while the supporting concerns still feel like part of the same anxious screen world.

### 02 Panic Button

Primary point: 94% is a population-scale behavior, not an abstract percentage.

Visual: pictogram/icon array for assessed-work AI use.

Why: student icons make the prevalence legible as people in the same environment as the protagonist.

### 03 Panic Chat

Primary point: students reach for AI because it is immediate, efficient, and reassuring.

Visual: `renderSupportSignalChart`, with 38% instant support as the hero stat, 28% after-hours use as a secondary beat, and true 0-100 tracks for the remaining motivations.

Why: this scene is about why the chat opens in a panic moment, so immediacy and availability should lead rather than a generic ranked list.

### 04 Deliberate Workflow

Primary point: the same tool changes meaning depending on where judgement remains.

Visual: `renderWorkflowRiskMap`, grouping assessed-work uses into understanding, drafting-boundary, and authorship-risk zones.

Why: the story needs a boundary map more than another ranked chart.

### 05 Boundary

Primary point: support can slide toward substitution.

Visual: authorship-threshold ladder using true-scale meters for measured survey values, with a separate non-survey boundary marker for writing voice.

Why: this scene is not another distribution chart; it shows the moment the workflow crosses from support into generated words entering the draft.

### 06 Skill Gap

Primary point: institutions say skills matter more than students feel supported.

Visual: paired dumbbell/gap charts for 68 vs 48 and 50 vs 38.

Why: gaps are the story; paired points communicate distance more directly than separate bars.

### 07 Split Experience

Primary point: the same population distribution can read as support or harm depending on the student's conditions.

Visual: theatrical 100% stacked bar for 49 better, 35 no impact, 16 worse.

Why: this is the mirror moment; the chart belongs to both student worlds and should sit between them.

### 08 Dependency

Primary point: help can become dependence when the student asks the tool to carry judgement.

Visual: dependent prompt sequence, refusal beat, risk chips, and 100% stacked source-balance chart for 37 AI-first, 29 balanced, 34 traditional-first.

Why: the experience-impact distribution has already been established, so this scene should show the mechanism: AI becoming the first place the work starts.

### 09 Companion

Primary point: companionship use is smaller, but emotionally loaded.

Visual: compact student pictogram for 15% plus diverging loneliness bar for less/no impact/more lonely.

Why: the pictogram makes the companionship group feel human and intimate, while the diverging bar shows the mixed emotional effect.

### 10 Final Paywall

Primary point: the survey recap collapses into one unresolved question.

Visual: ghosted recap stat cards behind the paywall.

Why: data should feel present but interrupted, matching the final interaction beat.
