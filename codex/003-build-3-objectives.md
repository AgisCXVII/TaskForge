# CrossPostTool Codex Entry 003: Build 3 Objectives

## Where we are now

We have a post builder that produces platform drafts, each with constraints and a manual checklist. The core philosophy remains: one source of truth, platform drafts are derived.

## Build 3 goals

1) User templates (must ship in Build 3)

   Users need to save and reuse multiple templates. Templates are not decoration, they are the workflow.

   A template is a structured text recipe that produces the base post fields.

   Minimum template fields:

   - Template name.
   - Title pattern.
   - Body pattern.
   - Default hashtags (optional).
   - Default target platforms (optional).
   - Notes (optional).

   Template variables:

   - {TITLE}
   - {BODY}
   - {LINK}
   - {HASHTAGS}

   Example template intent:

   Title pattern:
   🜂 Streamer {TITLE}

   Body pattern:
   {BODY}

   Come hang.

   {LINK}

   Default link:
   https://twitch.tv/agis_cxvii

   The UI must support:

   - Save template.
   - Load template.
   - Duplicate template.
   - Delete template.
   - Set default template.

2) Platform management (extensibility without a rebuild)

   Users must be able to add platforms beyond the defaults, including BlueSky and Reddit.

   A platform is defined by a profile, not code.

   Minimum platform profile fields:

   - Platform name.
   - Upload URL.
   - Character limit.
   - Hashtag limit.
   - Hashtag policy (allowed, limited, avoided).
   - Checklist steps.
   - Enabled state.

   The UI must support:

   - Add platform.
   - Edit platform.
   - Disable platform (hide from targets without deleting).
   - Restore defaults.

3) Output controls (trust and clarity)

   Right now we have platform blocks, we also need basic controls that reduce mistakes.

   Additions:

   - Copy button per platform draft.
   - Copy all drafts button.
   - Warnings when a draft exceeds limits.
   - Clear indicator when a draft differs from base due to truncation or hashtag rules.

4) Buttons must be proven

   The “Open upload” buttons must have a verifiable behavior. If they do not work, they are ornamental.

   Build 3 requirement:

   - Clicking “Open upload” opens the correct URL in a new tab.
   - If no URL exists, show a clear error state and a path to set it.

5) Discord integration is intentionally deferred

   Discord posting is a later phase. It will be treated as a CTA delivery mechanism, not a primary social publish target.

   When it arrives, it should work like this:

   - Select a Discord server and channel.
   - Generate a CTA message from a template.
   - Post only after explicit confirmation.

   Discord is not a Build 3 commitment.

## Definition of done for Build 3

Build 3 is done when a user can:

- Save a reusable template.
- Load it to generate a base post.
- Add a custom platform profile.
- Generate drafts and open upload pages reliably.
- Copy the right draft without guessing.

## Template example mapping

Title pattern:
🜂 Streamer {TITLE}

Body pattern:
{BODY}

Come hang.

{LINK}

Defaults:
LINK = https://twitch.tv/agis_cxvii

Now you can fill:
TITLE = is helping allies.
BODY = Still got Tali, and the boy. The myth, Legion to unlock, also completing all loyalty missions today. ME 2 on Insanity, playing as an infiltrator.

That produces a base post that can feed TikTok, Instagram, YouTube Community, BlueSky, Reddit, whatever is enabled.
