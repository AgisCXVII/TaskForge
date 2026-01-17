# CrossPostTool Codex Entry 005: Build 3.1 Sharpening Workflow

Build 3.1 is a sharpening pass. The goal is to reduce friction, reduce ambiguity, and prevent mistakes before Build 004 locks implementation details. No new automation promises are introduced in this build.

## Build 3.1 Objectives

### Objective A: Improve visual hierarchy and risk awareness

- Add a risk tier to each platform profile (Low, Medium, High).
- Reflect risk visually in each platform card with a subtle label.
- Add a small “Destination” label for multi-destination platforms like YouTube.

### Objective B: Make checklists feel alive

- Checking items updates progress on the card.
- When all items are checked, the card shows a subtle “Ready to post” state.
- Add a global indicator: “Completed X of Y platforms.”

### Objective C: Reduce template workflow distraction and improve safety

- Template creation is collapsed by default.
- Template application preview shows the resulting base post before commit.
- Clearly indicate which fields are overwritten, including target platforms.
- If a template changes platform defaults, show a soft warning.

### Objective D: Clarify bulk actions and reduce copy mistakes

- Rename “Copy all drafts” to “Copy all enabled drafts.”
- Add an explanation tooltip: “Copies each enabled platform’s draft in order, separated by headers.”
- Ensure per-platform Copy remains and output formatting is consistent.

### Objective E: Clarify media requirements

- Show media requirement per platform (required, optional, none).
- Warn when media is required but missing.
- Ensure checklist includes correct media steps.

### Objective F: Add dry run mode

- Add a Dry run toggle to run generation and checks without opening upload pages.
- Dry run performs draft generation, limit checks, and readiness checks without external actions.

## Guardrails for Build 3.1

Build 3.1 must not introduce:

- Scheduling.
- Analytics.
- Auto posting.
- AI rewriting.
- OAuth or embedded logins.
- Discord posting.

## Definition of Done for Build 3.1

- Platform cards communicate risk and destination clearly.
- Checklists drive visible progress and a “Ready” state.
- Templates are safe and do not overwrite silently.
- Bulk copy behavior is obvious and consistent.
- Media requirements are clear and warn when missing.
- Dry run mode provides a full sanity check without opening tabs.
