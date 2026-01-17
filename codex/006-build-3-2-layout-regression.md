# CrossPostTool Codex Entry 006: Build 3.2 Layout Regression for 1080p Usability

Build 3.2 is a layout regression focused on 1080p usability. No features are removed, but the main page must stop scrolling endlessly.

## Goals

- Reduce vertical page height during normal use.
- Separate configuration from execution.
- Make platform drafts scalable as platforms grow.

## Required UI changes

### Move Platform management out of the main page

Platform management must live in Settings as a modal or separate route. Main page must not include the full platform management list or add platform form.

### Convert Platform drafts into collapsible cards

Each platform draft card must have a compact header row with Copy and Open upload. Cards are collapsed by default. Expanding reveals draft preview, warnings, and checklist.

### Add filtering and grouping controls above drafts

- Toggle: show enabled only.
- Search: filter by platform name.
- Group selector: Video, Text, Community, Custom.

### Right column becomes tabs

Tabs: Templates, Readiness, Notes.

Template creation form moves into a modal or collapsible drawer. Readiness controls move into the Readiness tab.

### Add a sticky action bar

- Copy all enabled drafts.
- Dry run toggle.
- Check all readiness.
- Reset current post.

### YouTube destination compaction

Prefer one YouTube card with destination selector inside the header. Alternatively keep three destinations but ensure they are collapsed by default.

## Definition of done

On a 1080p display, the user can compose a post, generate drafts, and act on drafts without excessive scrolling. Platform management is accessible but not present on the main posting canvas. The drafts list remains usable as platforms increase.

## README Hygiene Directive

README must be concise and user facing. Codex entries must be moved into /codex as separate markdown files. README should link to /codex and include only a short overview, install, run, and core workflow.
