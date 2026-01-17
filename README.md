# CrossPost

CrossPostTool helps creators prepare one post and adapt it to multiple platforms with clear constraints, manual checklists, and safe defaults. The tool keeps you in control: generate drafts, review warnings, and post manually.

## Core workflow

1. Compose a base post (title, description, link, hashtags).
2. Select target platforms and generate platform drafts.
3. Review warnings, checklists, and readiness.
4. Open upload pages and post manually.

## Run locally

```bash
npm install
npm start
```

## Changelog

### v0.0.6c
- Removed Copy actions and added Post/Post all controls with posting states.
- Updated readiness flow to Unknown → Checking → Ready/Blocked with richer details panels.
- Moved media requirement metadata into Plan/Deliver details and refined destination labels.

### v0.0.6b
- Moved Prev/Next into a footer navigator with Plan gating and stateful step progression.
- Simplified Deliver with copy bundle, readiness dots, and manual-ready confirmation only.
- Humanized destination labels and removed Deliver metadata clutter.

### v0.0.6
- Simplified Deliver to a single selected-platform card list with automatic readiness checks and status dots.
- Added passive readiness summary with a manual recheck action and refined Deliver actions.
- Updated Plan → Compose → Deliver flow to version v0.0.6.

### v0.0.5
- Reordered workflow into Plan, Compose, Deliver with Prev/Next navigation and stateful mode switching.
- Expanded Plan and Compose layouts to reclaim full width and added quick presets with platform targeting summary.
- Added Compose title overrides and soft guidance plus moved drafts/readiness to Deliver.

### v3.2.2
- Added mode hint panels for Compose, Execute, and Review to guide user workflow.
- Improved active mode selector styling for clearer phase indication.
- Tightened collapsed Review card layout for better 1080p scanability.
- Added optional Single expand toggle for platform draft cards.
- Minor copy consistency improvements across UI.

### v3.2.1
- Implemented functional mode switching (Compose, Execute, Review) with mode-based panel visibility.
- Preserved form and UI state across mode switches.
- Reset now clears state across all modes and returns to Compose.

### v3.2.0
- Introduced explicit interaction modes (Compose, Execute, Review).
- Compressed Platform Drafts into collapsed accordion cards.
- Unified YouTube destinations under a single platform card.
- Moved Platform Management into Settings.
- Reduced template workflow visual footprint.
- Improved 1080p usability through layout regression.

## Codex

The product spec lives in `/codex`. Start with the index:

- [Codex index](codex/README.md)
