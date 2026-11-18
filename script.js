// TaskFlow Application Logic — Prince Gupta (CodSoft Task 2)
// Pure Vanilla JavaScript ES6+ with zero external runtime dependencies

const STORAGE_KEY = "codsoft_taskflow_v2_tasks";
const THEME_KEY = "codsoft_taskflow_theme";
const SOUND_KEY = "codsoft_taskflow_sound";

// Helper to produce normalized YYYY-MM-DD relative to local midnight
function getLocalDateString(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Realistic initial tasks for Prince Gupta's CodSoft internship submission
const seedTasks = [
  {
    id: "task-seed-1",
    title: "Push CODSOFT_TASK2 repo to GitHub with clean documentation",
    category: "Internship",
    priority: "High",
    dueDate: getLocalDateString(0),
    completed: true,
    pinned: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 18
  },
  {
    id: "task-seed-2",
    title: "Record LinkedIn demo explanation video with #codsoft tag",
    category: "Internship",
    priority: "High",
    dueDate: getLocalDateString(1),
    completed: false,
    pinned: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 12
  },
  {
    id: "task-seed-3",
    title: "Review RGPV ADA unit notes & dynamic programming patterns",
    category: "Academics",
    priority: "Medium",
    dueDate: getLocalDateString(4),
    completed: false,
    pinned: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 6
  },
  {
    id: "task-seed-4",
    title: "Refactor Auth-Guard MFA error handling & session guard",
    category: "Development",
    priority: "Medium",
    dueDate: getLocalDateString(7),
    completed: false,
    pinned: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 2
  }
];

let tasks = [];
let activeStatusFilter = "all";
let undoBuffer = null;
let undoTimeoutId = null;
let hasCelebratedCompletion = false;

// Web Audio API Synthesizer state
let audioCtx = null;
let soundEnabled = true;

// Initialize native AudioContext on user gesture
function initAudio() {
  if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

// Organic acoustic completion chime (E5 -> B5 sine harmonics)
function playCompletionChime() {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx) return;

  try {
    const now = audioCtx.currentTime;
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(659.25, now);
    osc1.frequency.exponentialRampToValueAtTime(987.77, now + 0.08);

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(987.77, now + 0.08);

    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(audioCtx.destination);

    osc1.start(now);
    osc1.stop(now + 0.12);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.32);
  } catch (e) {}
}

// Subtle muted snap for delete action
function playDeletePop() {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx) return;

  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.1);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  } catch (e) {}
}

// Delicate micro-tick for pin / secondary clicks
function playPinTick() {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx) return;

  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now);
    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  } catch (e) {}
}

// Pure Canvas Micro-Particle Burst for 100% Zero-Inbox
function launchZeroInboxConfetti() {
  const canvas = document.getElementById("celebrationCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ["#2997FF", "#60A5FA", "#FECDD3", "#FDE68A", "#A7F3D0", "#F4F4F6"];
  const particles = [];
  const count = 48;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 80,
      y: canvas.height * 0.35,
      vx: (Math.random() - 0.5) * 12,
      vy: -Math.random() * 8 - 4,
      size: Math.random() * 5 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * Math.PI,
      vRot: (Math.random() - 0.5) * 0.2
    });
  }

  let startTime = null;

  function render(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.vx *= 0.98; // drag
      p.rotation += p.vRot;
      p.alpha = Math.max(0, 1 - elapsed / 2200);

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
      ctx.restore();
    });

    if (elapsed < 2200) {
      requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  requestAnimationFrame(render);
}

// Guard localStorage in case private mode or storage restrictions block access
function loadPersistedTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      tasks = [...seedTasks];
      savePersistedTasks();
      return;
    }
    const parsed = JSON.parse(raw);
    tasks = Array.isArray(parsed) ? parsed : [...seedTasks];
  } catch (err) {
    tasks = [...seedTasks];
  }
}

function savePersistedTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    // quota exceeded or private mode restriction
  }
}

// Theme handling (default dark mode)
function initializeTheme() {
  const toggleBtn = document.getElementById("themeToggleBtn");
  let savedTheme = "dark";

  try {
    savedTheme = localStorage.getItem(THEME_KEY) || "dark";
  } catch (e) {
    savedTheme = "dark";
  }

  document.documentElement.setAttribute("data-theme", savedTheme);

  toggleBtn.addEventListener("click", () => {
    toggleTheme();
  });
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch (e) {}
}

// Audio state initialization and toggle
function initializeSound() {
  const soundBtn = document.getElementById("soundToggleBtn");
  const iconOn = soundBtn.querySelector(".icon-sound-on");
  const iconOff = soundBtn.querySelector(".icon-sound-off");

  try {
    const saved = localStorage.getItem(SOUND_KEY);
    soundEnabled = saved !== "false";
  } catch (e) {
    soundEnabled = true;
  }

  updateSoundIcon(iconOn, iconOff);

  soundBtn.addEventListener("click", () => {
    toggleSound();
  });
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  try {
    localStorage.setItem(SOUND_KEY, String(soundEnabled));
  } catch (e) {}

  const soundBtn = document.getElementById("soundToggleBtn");
  const iconOn = soundBtn.querySelector(".icon-sound-on");
  const iconOff = soundBtn.querySelector(".icon-sound-off");
  updateSoundIcon(iconOn, iconOff);

  if (soundEnabled) {
    playPinTick();
    showUndoToast("Audio haptics enabled");
  } else {
    showUndoToast("Audio haptics muted");
  }
}

function updateSoundIcon(iconOn, iconOff) {
  if (soundEnabled) {
    iconOn.classList.remove("hidden");
    iconOff.classList.add("hidden");
  } else {
    iconOn.classList.add("hidden");
    iconOff.classList.remove("hidden");
  }
}

// Format relative date badges with human-readable calendar labels
function getDueDateBadgeHtml(dateStr) {
  if (!dateStr) return "";

  const todayStr = getLocalDateString(0);
  const tomorrowStr = getLocalDateString(1);

  let badgeClass = "badge-due-upcoming";
  let labelText = "";

  const [y, m, d] = dateStr.split("-").map(Number);
  const taskDate = new Date(y, m - 1, d);
  const shortDate = taskDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  if (dateStr < todayStr) {
    badgeClass = "badge-due-overdue";
    labelText = `Overdue &bull; ${shortDate}`;
  } else if (dateStr === todayStr) {
    badgeClass = "badge-due-today";
    labelText = "Due Today";
  } else if (dateStr === tomorrowStr) {
    badgeClass = "badge-due-upcoming";
    labelText = "Due Tomorrow";
  } else {
    badgeClass = "badge-due-upcoming";
    labelText = `Due ${shortDate}`;
  }

  return `
    <span class="badge-pill ${badgeClass}">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
      <span>${labelText}</span>
    </span>
  `;
}

// Update counters, progress bar, and segmented filter badges
function updateSummaryMetrics() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const completionPct = total === 0 ? 0 : Math.round((completed / total) * 100);

  document.getElementById("totalCount").textContent = String(total);
  document.getElementById("pendingCount").textContent = String(pending);
  document.getElementById("completedCount").textContent = String(completed);

  document.getElementById("segCountAll").textContent = String(total);
  document.getElementById("segCountPending").textContent = String(pending);
  document.getElementById("segCountDone").textContent = String(completed);

  const fillEl = document.getElementById("progressFill");
  const pctEl = document.getElementById("progressPercentage");
  fillEl.style.width = `${completionPct}%`;
  pctEl.textContent = `${completionPct}%`;

  const banner = document.getElementById("zeroInboxBanner");
  if (total > 0 && pending === 0) {
    banner.classList.remove("hidden");
    if (!hasCelebratedCompletion) {
      hasCelebratedCompletion = true;
      playCompletionChime();
      launchZeroInboxConfetti();
    }
  } else {
    banner.classList.add("hidden");
    hasCelebratedCompletion = false;
  }

  const clearBtn = document.getElementById("clearCompletedBtn");
  if (completed > 0) {
    clearBtn.classList.remove("hidden");
  } else {
    clearBtn.classList.add("hidden");
  }
}

// Sanitize user strings before DOM insertion
function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str.replace(/[&<>"']/g, match => {
    switch (match) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      case "'": return "&#39;";
      default: return match;
    }
  });
}

// Safe live search keyword highlighter
function highlightMatch(text, query) {
  const escaped = escapeHtml(text);
  if (!query) return escaped;

  const q = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (!q) return escaped;

  const regex = new RegExp(`(${q})`, "gi");
  return escaped.replace(regex, '<mark class="search-highlight">$1</mark>');
}

// Filter, sort, and render task collection
function renderWorkspace() {
  updateSummaryMetrics();

  const searchQuery = document.getElementById("searchInput").value.trim().toLowerCase();
  const categoryFilter = document.getElementById("categoryFilter").value;
  const priorityFilter = document.getElementById("priorityFilter").value;
  const sortCriterion = document.getElementById("sortSelect").value;

  const filtered = tasks.filter(task => {
    const matchesSearch = !searchQuery || 
      task.title.toLowerCase().includes(searchQuery) ||
      task.category.toLowerCase().includes(searchQuery);

    const matchesStatus = 
      activeStatusFilter === "all" ||
      (activeStatusFilter === "pending" && !task.completed) ||
      (activeStatusFilter === "completed" && task.completed);

    const matchesCategory = categoryFilter === "all" || task.category === categoryFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  // Sorting priorities: High (3), Medium (2), Low (1)
  const prioWeights = { High: 3, Medium: 2, Low: 1 };

  filtered.sort((a, b) => {
    // Pinned tasks always float to top
    if (Boolean(a.pinned) !== Boolean(b.pinned)) {
      return a.pinned ? -1 : 1;
    }

    if (sortCriterion === "dueDate") {
      if (!a.dueDate && !b.dueDate) return (b.createdAt || 0) - (a.createdAt || 0);
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    }
    if (sortCriterion === "priority") {
      const diff = (prioWeights[b.priority] || 0) - (prioWeights[a.priority] || 0);
      return diff !== 0 ? diff : (b.createdAt || 0) - (a.createdAt || 0);
    }
    if (sortCriterion === "title") {
      return a.title.localeCompare(b.title);
    }
    // Default: newest first
    return (b.createdAt || 0) - (a.createdAt || 0);
  });

  const listContainer = document.getElementById("taskList");
  const emptyState = document.getElementById("emptyState");
  const emptyTitle = document.getElementById("emptyTitle");
  const emptyDesc = document.getElementById("emptyDesc");
  const resetFiltersBtn = document.getElementById("resetFiltersBtn");
  const statusText = document.getElementById("filterStatusText");

  if (tasks.length === 0) {
    statusText.textContent = "Workspace is clear";
  } else if (filtered.length === tasks.length) {
    statusText.textContent = `Showing all ${tasks.length} tasks`;
  } else {
    statusText.textContent = `Showing ${filtered.length} of ${tasks.length} tasks`;
  }

  if (filtered.length === 0) {
    listContainer.innerHTML = "";
    emptyState.classList.remove("hidden");

    if (tasks.length === 0) {
      emptyTitle.textContent = "Workspace is completely clear";
      emptyDesc.textContent = "All caught up. Press N or use the composer above to create a new task.";
      resetFiltersBtn.classList.add("hidden");
    } else {
      emptyTitle.textContent = "No tasks match your filters";
      emptyDesc.textContent = "Try broadening your search query or reset the active filter options.";
      resetFiltersBtn.classList.remove("hidden");
    }
    return;
  }

  emptyState.classList.add("hidden");

  listContainer.innerHTML = filtered.map(task => {
    const isDone = Boolean(task.completed);
    const isPinned = Boolean(task.pinned);
    const prioClass = `badge-priority-${(task.priority || "Medium").toLowerCase()}`;
    const dueDateBadge = getDueDateBadgeHtml(task.dueDate);
    const highlightedTitle = highlightMatch(task.title, searchQuery);

    return `
      <div class="task-card ${isDone ? "is-completed" : ""} ${isPinned ? "is-pinned" : ""}" data-id="${task.id}" role="listitem">
        <div class="task-main-col">
          <button
            type="button"
            class="task-checkbox-btn"
            data-action="toggle"
            data-id="${task.id}"
            aria-label="${isDone ? 'Mark task pending' : 'Mark task completed'}"
            title="${isDone ? 'Mark pending' : 'Mark complete'}"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>

          <div class="task-content">
            <div class="task-title-text">${highlightedTitle}</div>
            <div class="task-tags-row">
              ${isPinned ? `
                <span class="badge-pill badge-pinned" title="Pinned task">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span>Pinned</span>
                </span>
              ` : ""}

              <span class="badge-pill badge-category">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                  <line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>
                <span>${escapeHtml(task.category)}</span>
              </span>

              <span class="badge-pill ${prioClass}">
                <span>${escapeHtml(task.priority)} Priority</span>
              </span>

              ${dueDateBadge}
            </div>
          </div>
        </div>

        <div class="task-actions">
          <button
            type="button"
            class="btn-task-action pin-btn ${isPinned ? 'is-active' : ''}"
            data-action="pin"
            data-id="${task.id}"
            title="${isPinned ? 'Unpin task' : 'Pin to top'}"
            aria-label="${isPinned ? 'Unpin task' : 'Pin task'}"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="${isPinned ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </button>

          <button
            type="button"
            class="btn-task-action"
            data-action="edit"
            data-id="${task.id}"
            title="Edit task"
            aria-label="Edit task"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </button>

          <button
            type="button"
            class="btn-task-action delete-btn"
            data-action="delete"
            data-id="${task.id}"
            title="Delete task"
            aria-label="Delete task"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    `;
  }).join("");
}

// 5-second undo toast controller
function showUndoToast(message, onUndo) {
  const toast = document.getElementById("undoToast");
  const msgEl = document.getElementById("toastMessage");
  const fillEl = document.getElementById("toastCountdownFill");
  const undoBtn = document.getElementById("toastUndoBtn");

  if (undoTimeoutId) clearTimeout(undoTimeoutId);

  msgEl.textContent = message;
  toast.classList.remove("hidden");

  // Reset countdown bar animation
  fillEl.style.transition = "none";
  fillEl.style.transform = "scaleX(1)";

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      fillEl.style.transition = "transform 5000ms linear";
      fillEl.style.transform = "scaleX(0)";
    });
  });

  if (typeof onUndo === "function") {
    undoBtn.classList.remove("hidden");
    const handleUndoClick = () => {
      cleanup();
      onUndo();
    };

    const cleanup = () => {
      toast.classList.add("hidden");
      undoBtn.removeEventListener("click", handleUndoClick);
      if (undoTimeoutId) clearTimeout(undoTimeoutId);
      undoBuffer = null;
    };

    undoBtn.addEventListener("click", handleUndoClick, { once: true });
  } else {
    undoBtn.classList.add("hidden");
  }

  undoTimeoutId = setTimeout(() => {
    toast.classList.add("hidden");
    undoBuffer = null;
  }, 5000);
}

function dismissUndoToast() {
  const toast = document.getElementById("undoToast");
  toast.classList.add("hidden");
  if (undoTimeoutId) clearTimeout(undoTimeoutId);
  undoBuffer = null;
}

// Copy checklist formatted as Markdown
function copyMarkdownChecklist() {
  if (tasks.length === 0) {
    showUndoToast("No tasks available to copy");
    return;
  }

  const lines = [
    `# TaskFlow Checklist — ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
    ""
  ];

  tasks.forEach(t => {
    const mark = t.completed ? "[x]" : "[ ]";
    const dueInfo = t.dueDate ? ` (Due: ${t.dueDate})` : "";
    lines.push(`- ${mark} ${t.title} *[${t.category} · ${t.priority}]*${dueInfo}`);
  });

  const markdownText = lines.join("\n");
  navigator.clipboard.writeText(markdownText).then(() => {
    playPinTick();
    showUndoToast("Copied markdown checklist to clipboard!");
  }).catch(() => {
    showUndoToast("Unable to access clipboard");
  });
}

// Export tasks data as JSON file
function exportJsonBackup() {
  const dataStr = JSON.stringify(tasks, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `taskflow-backup-${getLocalDateString(0)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  playPinTick();
  showUndoToast("Exported JSON backup file");
}

// Import tasks data from JSON file
function handleImportJson(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (Array.isArray(parsed) && parsed.every(item => item && item.title)) {
        tasks = parsed;
        savePersistedTasks();
        renderWorkspace();
        playPinTick();
        showUndoToast(`Restored ${parsed.length} tasks from backup`);
      } else {
        showUndoToast("Invalid JSON file format");
      }
    } catch (err) {
      showUndoToast("Error parsing backup JSON file");
    }
    event.target.value = "";
  };
  reader.readAsText(file);
}

// Keyboard shortcuts modal controls
function openShortcutsModal() {
  const modal = document.getElementById("shortcutsBackdrop");
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
}

function closeShortcutsModal() {
  const modal = document.getElementById("shortcutsBackdrop");
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
}

// Editing mode transitions
function enterEditMode(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  const formSection = document.getElementById("composerSection");
  const editingIdInput = document.getElementById("editingTaskId");
  const titleInput = document.getElementById("taskTitle");
  const catInput = document.getElementById("taskCategory");
  const prioInput = document.getElementById("taskPriority");
  const dateInput = document.getElementById("taskDueDate");
  const heading = document.getElementById("formHeading");
  const subtext = document.getElementById("formSubtext");
  const submitText = document.getElementById("submitBtnText");
  const iconAdd = document.querySelector(".btn-icon.icon-add");
  const iconUpdate = document.querySelector(".btn-icon.icon-update");
  const cancelBtn = document.getElementById("cancelEditBtn");
  const charCounter = document.getElementById("titleCounter");

  editingIdInput.value = task.id;
  titleInput.value = task.title;
  catInput.value = task.category;
  prioInput.value = task.priority;
  dateInput.value = task.dueDate || "";

  heading.textContent = "Edit Task";
  subtext.textContent = "Press Esc to cancel modifications";
  submitText.textContent = "Save Changes";
  iconAdd.classList.add("hidden");
  iconUpdate.classList.remove("hidden");
  cancelBtn.classList.remove("hidden");
  formSection.classList.add("is-editing");

  charCounter.textContent = `${task.title.length} / 140`;
  titleInput.focus();
  titleInput.select();
  formSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function exitEditMode() {
  const formSection = document.getElementById("composerSection");
  const form = document.getElementById("taskForm");
  const editingIdInput = document.getElementById("editingTaskId");
  const heading = document.getElementById("formHeading");
  const subtext = document.getElementById("formSubtext");
  const submitText = document.getElementById("submitBtnText");
  const iconAdd = document.querySelector(".btn-icon.icon-add");
  const iconUpdate = document.querySelector(".btn-icon.icon-update");
  const cancelBtn = document.getElementById("cancelEditBtn");
  const alertEl = document.getElementById("validationAlert");
  const charCounter = document.getElementById("titleCounter");

  form.reset();
  editingIdInput.value = "";
  heading.textContent = "New Task";
  subtext.innerHTML = 'Press <kbd>N</kbd> from anywhere to focus';
  submitText.textContent = "Add Task";
  iconAdd.classList.remove("hidden");
  iconUpdate.classList.add("hidden");
  cancelBtn.classList.add("hidden");
  formSection.classList.remove("is-editing");
  alertEl.classList.add("hidden");
  charCounter.textContent = "0 / 140";
  charCounter.classList.remove("is-warning", "is-limit");
}

function setValidationAlert(message) {
  const alertEl = document.getElementById("validationAlert");
  const textEl = document.getElementById("validationText");
  if (!message) {
    alertEl.classList.add("hidden");
    return;
  }
  textEl.textContent = message;
  alertEl.classList.remove("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  loadPersistedTasks();
  initializeTheme();
  initializeSound();
  renderWorkspace();

  const form = document.getElementById("taskForm");
  const titleInput = document.getElementById("taskTitle");
  const catInput = document.getElementById("taskCategory");
  const prioInput = document.getElementById("taskPriority");
  const dateInput = document.getElementById("taskDueDate");
  const editingIdInput = document.getElementById("editingTaskId");
  const cancelEditBtn = document.getElementById("cancelEditBtn");
  const charCounter = document.getElementById("titleCounter");
  const searchInput = document.getElementById("searchInput");
  const searchClearBtn = document.getElementById("searchClearBtn");

  // Quick Date Preset buttons
  document.querySelectorAll(".btn-preset-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.getAttribute("data-clear") === "true") {
        dateInput.value = "";
      } else {
        const offset = parseInt(btn.getAttribute("data-offset") || "0", 10);
        dateInput.value = getLocalDateString(offset);
      }
      playPinTick();
    });
  });

  // Power Utilities: Markdown Copy & JSON Export / Import
  document.getElementById("copyMarkdownBtn").addEventListener("click", copyMarkdownChecklist);
  document.getElementById("exportJsonBtn").addEventListener("click", exportJsonBackup);
  document.getElementById("importJsonInput").addEventListener("change", handleImportJson);

  // Keyboard Shortcuts modal triggers
  document.getElementById("openShortcutsBtn").addEventListener("click", openShortcutsModal);
  document.getElementById("closeShortcutsBtn").addEventListener("click", closeShortcutsModal);
  document.getElementById("shortcutsBackdrop").addEventListener("click", (e) => {
    if (e.target.id === "shortcutsBackdrop") closeShortcutsModal();
  });

  // Real-time title character counter
  titleInput.addEventListener("input", () => {
    const len = titleInput.value.length;
    charCounter.textContent = `${len} / 140`;
    charCounter.classList.toggle("is-warning", len > 120 && len < 140);
    charCounter.classList.toggle("is-limit", len >= 140);
    if (len >= 3) {
      setValidationAlert("");
    }
  });

  // Task creation and edit submission handler
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const rawTitle = titleInput.value.trim();
    const editingId = editingIdInput.value;

    if (rawTitle.length < 3) {
      setValidationAlert("Task title must be at least 3 characters long.");
      titleInput.focus();
      return;
    }
    if (rawTitle.length > 140) {
      setValidationAlert("Task title cannot exceed 140 characters.");
      titleInput.focus();
      return;
    }

    // Duplicate active title prevention
    const isDuplicate = tasks.some(t => {
      const matchName = t.title.trim().toLowerCase() === rawTitle.toLowerCase();
      if (editingId) {
        return matchName && t.id !== editingId && !t.completed;
      }
      return matchName && !t.completed;
    });

    if (isDuplicate) {
      setValidationAlert("An active task with this exact title already exists.");
      titleInput.focus();
      return;
    }

    setValidationAlert("");

    if (editingId) {
      tasks = tasks.map(t => {
        if (t.id === editingId) {
          return {
            ...t,
            title: rawTitle,
            category: catInput.value,
            priority: prioInput.value,
            dueDate: dateInput.value || null
          };
        }
        return t;
      });
      playPinTick();
      exitEditMode();
    } else {
      const newTask = {
        id: "task-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
        title: rawTitle,
        category: catInput.value,
        priority: prioInput.value,
        dueDate: dateInput.value || null,
        completed: false,
        pinned: false,
        createdAt: Date.now()
      };
      tasks.unshift(newTask);
      playPinTick();
      form.reset();
      charCounter.textContent = "0 / 140";
    }

    savePersistedTasks();
    renderWorkspace();
  });

  cancelEditBtn.addEventListener("click", exitEditMode);

  // Delegated clicks for task cards (toggle completion, pin, edit, delete)
  document.getElementById("taskList").addEventListener("click", (e) => {
    const actionBtn = e.target.closest("[data-action]");
    if (!actionBtn) return;

    const action = actionBtn.getAttribute("data-action");
    const taskId = actionBtn.getAttribute("data-id");
    if (!action || !taskId) return;

    if (action === "toggle") {
      let isNowDone = false;
      tasks = tasks.map(t => {
        if (t.id === taskId) {
          isNowDone = !t.completed;
          return { ...t, completed: isNowDone };
        }
        return t;
      });
      if (isNowDone) {
        playCompletionChime();
      } else {
        playDeletePop();
      }
      savePersistedTasks();
      renderWorkspace();
    } else if (action === "pin") {
      tasks = tasks.map(t => t.id === taskId ? { ...t, pinned: !t.pinned } : t);
      playPinTick();
      savePersistedTasks();
      renderWorkspace();
    } else if (action === "edit") {
      enterEditMode(taskId);
    } else if (action === "delete") {
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return;

      const deletedItem = tasks[taskIndex];
      tasks.splice(taskIndex, 1);
      playDeletePop();
      savePersistedTasks();
      renderWorkspace();

      // If user was editing the item being deleted, cancel edit mode
      if (editingIdInput.value === taskId) {
        exitEditMode();
      }

      // Store in memory for 5s undo window
      undoBuffer = { task: deletedItem, index: taskIndex };
      const shortTitle = deletedItem.title.length > 28 ? deletedItem.title.substring(0, 28) + "..." : deletedItem.title;
      showUndoToast(`Deleted "${shortTitle}"`, () => {
        if (undoBuffer && undoBuffer.task) {
          tasks.splice(undoBuffer.index, 0, undoBuffer.task);
          savePersistedTasks();
          renderWorkspace();
        }
      });
    }
  });

  // Batch clear completed with 5-second undo recovery
  document.getElementById("clearCompletedBtn").addEventListener("click", () => {
    const completedTasks = tasks.filter(t => t.completed);
    if (completedTasks.length === 0) return;

    const remainingTasks = tasks.filter(t => !t.completed);
    tasks = remainingTasks;
    playDeletePop();
    savePersistedTasks();
    renderWorkspace();

    const count = completedTasks.length;
    showUndoToast(`Cleared ${count} completed ${count === 1 ? 'task' : 'tasks'}`, () => {
      tasks.push(...completedTasks);
      savePersistedTasks();
      renderWorkspace();
    });
  });

  // Close toast button
  document.getElementById("toastCloseBtn").addEventListener("click", dismissUndoToast);

  // Segmented Status Filter Tabs
  document.querySelectorAll(".segment-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".segment-btn").forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      activeStatusFilter = btn.getAttribute("data-status") || "all";
      playPinTick();
      renderWorkspace();
    });
  });

  // Dropdown filter and sort listeners
  ["categoryFilter", "priorityFilter", "sortSelect"].forEach(id => {
    document.getElementById(id).addEventListener("change", () => {
      playPinTick();
      renderWorkspace();
    });
  });

  // Search input live filtering and clear button
  searchInput.addEventListener("input", () => {
    const val = searchInput.value.trim();
    searchClearBtn.classList.toggle("hidden", val.length === 0);
    renderWorkspace();
  });

  searchClearBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchClearBtn.classList.add("hidden");
    renderWorkspace();
    searchInput.focus();
  });

  // 1-Click Reset Filters
  document.getElementById("resetFiltersBtn").addEventListener("click", () => {
    searchInput.value = "";
    searchClearBtn.classList.add("hidden");
    document.getElementById("categoryFilter").value = "all";
    document.getElementById("priorityFilter").value = "all";
    document.getElementById("sortSelect").value = "newest";

    document.querySelectorAll(".segment-btn").forEach(b => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    const allSeg = document.getElementById("segAll");
    allSeg.classList.add("active");
    allSeg.setAttribute("aria-selected", "true");
    activeStatusFilter = "all";

    playPinTick();
    renderWorkspace();
  });

  // Global keyboard shortcuts (N, /, ?, T, M, Esc)
  document.addEventListener("keydown", (e) => {
    const tag = (document.activeElement && document.activeElement.tagName) || "";
    const isTyping = tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA";

    if (e.key === "Escape") {
      const modal = document.getElementById("shortcutsBackdrop");
      if (!modal.classList.contains("hidden")) {
        closeShortcutsModal();
      } else if (editingIdInput.value) {
        exitEditMode();
      } else if (document.activeElement === searchInput) {
        searchInput.blur();
      } else {
        dismissUndoToast();
      }
      return;
    }

    if (!isTyping) {
      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        titleInput.focus();
        document.getElementById("composerSection").scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (e.key === "/") {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      } else if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        const modal = document.getElementById("shortcutsBackdrop");
        if (modal.classList.contains("hidden")) {
          openShortcutsModal();
        } else {
          closeShortcutsModal();
        }
      } else if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        toggleTheme();
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        toggleSound();
      }
    }
  });
});
