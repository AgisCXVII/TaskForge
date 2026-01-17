# CrossPost

**CrossPost** is a productivity application designed to help you manage your tasks effectively. Created by a coding enthusiast new to the field, this app aims to offer a practical solution for task tracking, prioritization, and real-time management. It’s particularly useful in both personal and workplace settings, where efficient task management is crucial.

## Features

- **Task Management:** Easily add and organize tasks with customizable colors and notes.
- **Real-Time Timer:** Track the time remaining for each task with a countdown timer that adjusts in real time.
- **Priority Tasking:** Assign colors to tasks to easily identify and prioritize them.
- **Notes:** Attach detailed notes to tasks for better context and reminders.
- **User-Friendly Interface:** Enjoy a clean and intuitive UI that helps you stay focused and organized.

## Installation

To get started with CrossPost on your local machine:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/username/crosspost.git
2. **Navigate to the Project Directory**
   ```bash
    cd crosspost
3. **Install Dependencies**
   *Make sure you have Node.js and npm installed. Then, run:*
   ```bash
   npm install
4. **Start the Application**
   ```bash
   npm start
## Usage

- **Add a Task:** Enter a task description, time frame (e.g., `2h`, `30m`, `120s`, `1d`), choose a color, and add notes.
- **Track Time:** Use the real-time timer to see how much time is left for each task.
- **Mark as Complete:** Use the checkbox to mark tasks as complete or delete them when done.
- **Save Tasks:** Tasks are saved automatically in your local storage.

## Planned Features

- **Checkbox for Task Completion:** Implement functionality to mark tasks as complete and archive them.
- **Task Saving and Retrieval:** Develop a way to save tasks and retrieve them upon reopening the app.
- **Mobile Responsiveness:** Ensure the app is fully functional and visually appealing on mobile devices.
- **Enhanced UI Design:** Improve the front-end design for a more polished and user-friendly experience.

## CrossPostTool Codex Entry 001: Intent and Plan

### What we are trying to do

- Publish the same media to multiple platforms with minimal repeated work.
- Keep the creator in control of wording and final send.
- Reduce mistakes: wrong caption, wrong file, wrong platform, wrong format.
- Make posting consistent enough to become habit.

### What the tool must handle

A single “post” is: media file + title + description + hashtags + target platforms.

Each platform has different constraints:

- Character limits.
- Hashtag behavior.
- Allowed formats and aspect ratios.
- Upload flows.

We need a repeatable workflow that survives platform UI changes.

### Core workflow we want

- Choose a template or start blank.
- Choose media file.
- Enter title and description once.
- Generate platform specific outputs.
- Open the right upload pages.
- Present a checklist view.
- Creator confirms and posts manually.

Manual posting is a feature, not a failure. It keeps accounts safe and avoids brittle automation.

### Solutions and how we achieve them

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

### Definition of done for the first usable version

I can take one finished video and reliably prep posts for 3 to 6 platforms in under 2 minutes, without retyping anything, without confusion, without losing control.

## Contribution

Feel free to contribute to CrossPost by submitting issues, creating pull requests, or suggesting features. Your feedback is valuable and helps improve the application.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

Special thanks to my Discord for giving me a nudge on what to build and my project manager for giving me such a task to do.
