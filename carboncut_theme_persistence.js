// CARBONCUT Dark/Light Mode Switcher (matchMedia + localStorage), Carbon Calculator & CRUD Array

const THEME_STORAGE_KEY = "carboncut_preferred_theme_v1";

function applyTheme(themeName, sourceNote = "Saved in localStorage") {
  const htmlEl = document.documentElement;
  htmlEl.setAttribute("data-theme", themeName);

  const iconEl = document.getElementById("themeIcon");
  const labelEl = document.getElementById("themeLabel");
  const noteEl = document.getElementById("themePersistenceNote");

  if (themeName === "dark") {
    iconEl.innerHTML = "&#9790;"; // Crescent Moon
    labelEl.textContent = "Dark Mode";
    noteEl.innerHTML = `Active Theme: <strong>Dark Mode</strong> &bull; ${sourceNote}`;
  } else {
    iconEl.innerHTML = "&#9728;"; // Sun
    labelEl.textContent = "Light Mode";
    noteEl.innerHTML = `Active Theme: <strong>Light Mode</strong> &bull; ${sourceNote}`;
  }
}

function toggleThemeMode() {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  const nextTheme = current === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  applyTheme(nextTheme, "Saved in <code>localStorage</code>");
}

function syncWithSystemTheme() {
  localStorage.removeItem(THEME_STORAGE_KEY);
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const osTheme = prefersDark ? "dark" : "light";
  applyTheme(osTheme, "Synced via <code>window.matchMedia()</code>");
}

function initializeTheme() {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === "dark" || saved === "light") {
    applyTheme(saved, "Restored from <code>localStorage</code>");
  } else {
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light", "Detected via <code>window.matchMedia()</code>");
  }
}

// Listen for OS-level theme changes when no manual override is stored
if (window.matchMedia) {
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem(THEME_STORAGE_KEY)) {
      applyTheme(e.matches ? "dark" : "light", "Updated via OS <code>matchMedia</code>");
    }
  });
}

// Carbon Footprint Calculator
function recomputeCarbon() {
  const kwh = Number(document.getElementById("kwhInput").value);
  const km = Number(document.getElementById("kmInput").value);
  const ops = Number(document.getElementById("opsSelect").value);

  document.getElementById("kwhReadout").textContent = kwh;
  document.getElementById("kmReadout").textContent = km;

  const monthly = Math.round((kwh * 0.72) + (km * 4.33 * 0.21) + ops);
  const annual = ((monthly * 12) / 1000).toFixed(2);

  document.getElementById("monthKgVal").textContent = monthly;
  document.getElementById("annualTonnesVal").textContent = annual;

  const pill = document.getElementById("advisorBadge");
  if (monthly < 450) {
    pill.textContent = "Low Impact — Aligned with 1.5°C Net-Zero pathway";
  } else if (monthly <= 750) {
    pill.textContent = "Moderate — 22% reduction achievable via Solar PPA";
  } else {
    pill.textContent = "High Footprint — Immediate clean energy & fleet audit advised";
  }
}

function addCalcMilestone() {
  const annual = document.getElementById("annualTonnesVal").textContent;
  reductionTasks.unshift({
    id: Date.now(),
    text: `Offset ${annual} tonnes CO₂e/year via CARBONCUT verified ledger`,
    done: false
  });
  saveTasks();
  renderTasks();
  document.getElementById("action-checklist").scrollIntoView({ behavior: "smooth" });
}

// CRUD Action Checklist
const SAMPLE_TASKS = [
  { id: 1, text: "Verify baseline Scope 1–2 electricity & fleet emissions", done: true },
  { id: 2, text: "Transition 65% of facility power to rooftop Solar PPA", done: false },
  { id: 3, text: "Retire 4.0 tonnes CO₂e Blue Carbon Mangrove offsets", done: false }
];

let reductionTasks = JSON.parse(localStorage.getItem("carboncut_theme_tasks_v1")) || [...SAMPLE_TASKS];

function saveTasks() {
  localStorage.setItem("carboncut_theme_tasks_v1", JSON.stringify(reductionTasks));
}

// READ
function renderTasks() {
  const ul = document.getElementById("taskUlList");
  const stats = document.getElementById("taskStatsText");
  ul.innerHTML = "";

  const doneCount = reductionTasks.filter(t => t.done).length;
  stats.textContent = `${doneCount} of ${reductionTasks.length} reduction milestones completed`;

  if (reductionTasks.length === 0) {
    ul.innerHTML = `<li class="cc-task-row"><span>No reduction tasks yet. Add one above!</span></li>`;
    return;
  }

  reductionTasks.forEach((task, idx) => {
    const li = document.createElement("li");
    li.className = "cc-task-row";
    li.innerHTML = `
      <div class="cc-task-left">
        <input type="checkbox" ${task.done ? "checked" : ""} onchange="toggleTask(${idx})" />
        <span class="${task.done ? "cc-done" : ""}">${escapeHtml(task.text)}</span>
      </div>
      <div class="cc-row-btns">
        <button type="button" class="cc-mini-btn" onclick="editTask(${idx})">Edit</button>
        <button type="button" class="cc-mini-btn del" onclick="deleteTask(${idx})">Delete</button>
      </div>
    `;
    ul.appendChild(li);
  });
}

// CREATE (onclick="addTask()")
function addTask() {
  const input = document.getElementById("taskTextBox");
  const text = input.value.trim();
  if (!text) {
    input.focus();
    return;
  }
  reductionTasks.unshift({ id: Date.now(), text, done: false });
  input.value = "";
  saveTasks();
  renderTasks();
}

// UPDATE
function toggleTask(idx) {
  reductionTasks[idx].done = !reductionTasks[idx].done;
  saveTasks();
  renderTasks();
}

function editTask(idx) {
  const updated = prompt("Update carbon reduction milestone:", reductionTasks[idx].text);
  if (updated !== null && updated.trim() !== "") {
    reductionTasks[idx].text = updated.trim();
    saveTasks();
    renderTasks();
  }
}

// DELETE
function deleteTask(idx) {
  reductionTasks.splice(idx, 1);
  saveTasks();
  renderTasks();
}

function resetSampleTasks() {
  reductionTasks = [...SAMPLE_TASKS];
  saveTasks();
  renderTasks();
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, m => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[m]));
}

document.getElementById("taskTextBox").addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

initializeTheme();
recomputeCarbon();
renderTasks();
