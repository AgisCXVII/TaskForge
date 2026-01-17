# CrossPostTool Codex Entry 001: Intent and Plan

## What we are trying to do

- Publish the same media to multiple platforms with minimal repeated work.
- Keep the creator in control of wording and final send.
- Reduce mistakes: wrong caption, wrong file, wrong platform, wrong format.
- Make posting consistent enough to become habit.

## What the tool must handle

A single “post” is: media file + title + description + hashtags + target platforms.

Each platform has different constraints:

- Character limits.
- Hashtag behavior.
- Allowed formats and aspect ratios.
- Upload flows.

We need a repeatable workflow that survives platform UI changes.

## Core workflow we want

- Choose a template or start blank.
- Choose media file.
- Enter title and description once.
- Generate platform specific outputs.
- Open the right upload pages.
- Present a checklist view.
- Creator confirms and posts manually.

Manual posting is a feature, not a failure. It keeps accounts safe and avoids brittle automation.

## Solutions and how we achieve them

1) Templates and rules engine

   - Templates define structure: title format, description blocks, default hashtags, defaults per platform.
   - Rules modify the output per platform:
     - Truncate or adapt to limits.
     - Remove hashtags where they harm reach.
     - Swap links or calls to action based on platform.

2) Single source of truth for a post

   - One input form creates a “post object.”
   - Everything else is derived from that.
   - Save a local copy for reuse and rollback.

3) Platform profiles

   A profile for each platform defines:
   - Character limit.
   - Preferred hashtag count.
   - Link handling rules.
   - Required manual steps checklist.

   If the platform changes, we update one profile, not the whole tool.

4) Safety and reliability

   - No auto posting on day one.
   - Open tabs and prep text, then stop.
   - Use confirmations and clear “you are about to do X” prompts.
   - Keep logs: what was generated, when, and for which platforms.

5) Minimum viable milestones

   - Milestone 1: generate outputs correctly for each platform.
   - Milestone 2: open upload pages and copy the right text per platform.
   - Milestone 3: remember last post and allow reuse.
   - Milestone 4: optional advanced automation, only if it stays stable.

## Definition of done for the first usable version

I can take one finished video and reliably prep posts for 3 to 6 platforms in under 2 minutes, without retyping anything, without confusion, without losing control.
