# TaskFlow — Daily Productivity Workspace

> **CodSoft Frontend Development Internship — Task 2 Submission**  
> **Developer:** Prince Gupta  
> **Repository:** `CODSOFT_TASK2`  
> **Tech Stack:** Semantic HTML5, Custom Modern CSS3, Modular Vanilla JavaScript (ES6+), Zero External Libraries

---

## 1. Overview & Philosophy

**TaskFlow** is a commercial-grade, keyboard-first task workspace engineered with the tactile precision and restraint of tools like **Linear**, **Things 3**, and Apple's macOS Human Interface guidelines.

Unlike typical demo applications characterized by generic gradients and artificial neon glow, TaskFlow adheres to a strict **"Hand-Made / Zero-AI Footprint"** design philosophy:

- **Warm Carbon Charcoal & Apple Titanium**: Dark mode canvas (`#0D0E11`) paired with subtle inline SVG matte grain (`opacity: 0.025`) and frosted surfaces (`rgba(24, 25, 30, 0.78)` with `backdrop-filter: saturate(180%) blur(22px)`).
- **Light Mode Alabaster**: Warm Alabaster Stone (`#F5F4F0`) canvas with crisp white panels, hairline borders (`1px solid rgba(20, 20, 19, 0.085)`), and deep charcoal ink (`#141413`).
- **Desaturated Pastels**: Status and priority pills use muted, low-saturation hues:
  - **High Priority / Overdue**: Soft Rose (`#FECDD3` on `rgba(254, 205, 211, 0.10)`)
  - **Medium Priority / Due Today**: Warm Sand (`#FDE68A` on `rgba(253, 230, 138, 0.10)`)
  - **Low Priority / Upcoming**: Muted Sage (`#A7F3D0` on `rgba(167, 243, 208, 0.10)`)
  - **Pinned Tasks**: Warm Sand accent border & pin indicator
- **Apple Cupertino Specular Highlights**: Subtle top specular edge reflections (`inset 0 1px 0 rgba(255, 255, 255, 0.12)`) and Apple Pro Blue (`#2997FF` / `#0071E3`) focus rings.
- **Tabular Numerics**: Strict `font-variant-numeric: tabular-nums` utilizing `JetBrains Mono` for all counters, dates, and percentages to eliminate layout jitter.

---

## 2. Feature Breakdown (Core + Power User Features)

| Feature | Description | Implementation Details |
| :--- | :--- | :--- |
| **Full CRUD Architecture** | Create, Read, Update, and Delete tasks with instant feedback. | Prepending new tasks, in-place edit row hydration with cancellation, and deletion handling. |
| **5-Second Undo Toast** | Non-blocking deletion recovery window. | Bottom-right frosted glass toast with a 5000ms smooth countdown track; restores items at their exact previous index. |
| **Live Metric Strip** | Real-time workspace analytics. | 3 summary cards tracking **Total**, **Pending**, and **Completed** tasks in tabular monospace. |
| **Fluid Completion Bar** | Live completion percentage indicator. | Animated progress fill transitioning with `cubic-bezier(0.22, 1, 0.36, 1)`. |
| **Native Web Audio Haptics** | Organic synthesizer sound effects. | Pure Web Audio API harmonic dual-tone chime on complete, snap on delete, and micro-tick on actions. Includes sound toggle (<kbd>M</kbd>). |
| **Quick Date Presets** | Rapid task scheduling. | 1-click preset pills (`Today`, `Tom`, `+7d`, `× Clear`) directly in composer. |
| **Task Pinning / Star** | High-priority task hierarchy. | Pin critical tasks to float to the top of the workspace with warm titanium borders. |
| **Live Search Highlighting** | Dynamic visual feedback. | Highlights matching substrings in task titles using `<mark class="search-highlight">` with zero layout shift. |
| **Zero-Inbox Celebration** | 100% completion milestone. | Triggers a pure HTML5 Canvas micro-particle burst and celebratory banner when all tasks are complete. |
| **Markdown Export** | Seamless workflow integration. | Copies all tasks formatted cleanly as a GitHub/Notion markdown checklist to clipboard. |
| **JSON Backup & Restore** | Enterprise-grade data portability. | 1-click JSON backup download and file restore to safeguard workspace state. |
| **Keyboard Shortcuts Modal** | In-app power user cheatsheet. | Press <kbd>?</kbd> or click header button to open an Apple-style frosted shortcut guide. |
| **Validation Engine** | Strict client-side data validation without `alert()`. | Validates trimmed length (&ge; 3 chars, &le; 140 chars), char counter (`0 / 140`), and prevents duplicate active task titles. |
| **Multi-Filter & Sort** | High-density filtering toolbar. | Apple-style segmented status tabs (`All`, `Pending`, `Done`), category dropdown, priority dropdown, and 4 sort modes. |
| **Smart Due Date Badges** | Relative date calculations. | Compares task due dates against the current calendar day to render `Overdue`, `Due Today`, `Due Tomorrow`, or `Due <Date>`. |
| **Persistent Storage** | Resilient offline data retention. | `localStorage` data management wrapped in defensive `try/catch` blocks for tasks, theme, and audio settings. |
| **Seed Data for Reviewers** | Instant out-of-the-box testability. | First-run seeding with 4 realistic tasks for Prince Gupta's internship workflow. |

---

## 3. Keyboard Shortcuts Reference

| Key | Description |
| :---: | :--- |
| <kbd>N</kbd> | Jump to composer and focus Task Title input |
| <kbd>/</kbd> | Jump to search bar and select existing query |
| <kbd>?</kbd> | Open interactive Keyboard Shortcuts Cheatsheet modal |
| <kbd>T</kbd> | Toggle Visual Theme (Dark Mode / Light Mode) |
| <kbd>M</kbd> | Toggle Web Audio Haptic Effects (Sound On / Muted) |
| <kbd>Esc</kbd> | Cancel active edit mode, blur search, close modal, or dismiss undo toast |

---

## 4. Project Directory Structure

```text
CODSOFT_TASK2/
├── index.html     # Semantic HTML5 markup, SVG icons, and accessible modal dialog
├── style.css      # Custom CSS3 design tokens, theme definitions, and animations
├── script.js     # Modular Vanilla ES6+ state management, Web Audio, Canvas confetti
└── README.md      # Comprehensive engineering documentation
```

---

## 5. Getting Started & Local Preview

Because TaskFlow is crafted with zero third-party dependencies and zero build steps:

1. Clone or download this repository.
2. Open `index.html` directly in any modern browser (Chrome, Edge, Safari, Firefox).
3. Alternatively, serve via VS Code Live Server or Python local server:
   ```bash
   python -m http.server 8080
   ```
4. Access `http://localhost:8080` in your browser.

---

## 6. Author Attribution

- **Developer:** Prince Gupta
- **Internship:** CodSoft Frontend Development Internship
- **Task:** Task 2 — To-Do List Application (`CODSOFT_TASK2`)
