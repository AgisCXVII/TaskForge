# CrossPostTool Codex Entry 002: Structure and Boundaries

## The Post Object

CrossPostTool is built around a single post object. This object is the only editable source of truth.

The post object contains:

- Title.
- Description.
- Media file path.
- Base hashtags.
- Target platforms.
- Created timestamp.
- Last modified timestamp.

If a piece of data does not exist in the post object, it cannot influence generated output.

## Base Content vs Platform Drafts

Base content is authored once and edited directly by the creator.

Platform drafts are generated from base content using platform specific constraints. Platform drafts are read only. They are disposable and may be regenerated at any time.

Edits to a platform draft must never modify the base post.

## Platform Profiles

Each platform is represented as a profile, not custom logic.

A platform profile defines:

- Character limits.
- Hashtag limits.
- Hashtag policy.
- Supported media types.
- Manual posting checklist.

Platforms are data, not behavior.

## Manual Posting as a Safety Boundary

CrossPostTool does not publish content automatically by default.

The tool prepares content, opens upload pages, and presents a checklist for human confirmation. This intentional friction protects accounts, preserves creator judgment, and reduces brittle automation.

Manual posting is a design choice, not a limitation.

## Definition of Success

A post is successful when the same content can be prepared for multiple platforms without retyping, confusion, or loss of intent.
