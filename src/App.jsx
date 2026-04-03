import { useState, useEffect, useRef } from "react";

const PRIORITIES = ["Low", "Medium", "High", "Critical"];
const CATEGORIES = [
  "Work",
  "Personal",
  "Health",
  "Learning",
  "Finance",
  "Other",
];
const FILTERS = ["All", "Active", "Completed", "Overdue"];

const PRIORITY_META = {
  Low: { color: "#6ee7b7", bg: "#064e3b22", dot: "#10b981" },
  Medium: { color: "#fcd34d", bg: "#78350f22", dot: "#f59e0b" },
  High: { color: "#fb923c", bg: "#7c2d1222", dot: "#f97316" },
  Critical: { color: "#f87171", bg: "#7f1d1d22", dot: "#ef4444" },
};

const CATEGORY_ICONS = {
  Work: "💼",
  Personal: "🏠",
  Health: "💪",
  Learning: "📚",
  Finance: "💰",
  Other: "✦",
};

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function isOverdue(task) {
  if (task.completed || !task.dueDate) return false;
  return new Date(task.dueDate) < new Date();
}

const SAMPLE_TASKS = [
  {
    id: generateId(),
    title: "Design system architecture",
    description: "Plan the microservices breakdown and data flow diagrams.",
    priority: "Critical",
    category: "Work",
    dueDate: "2026-03-30",
    completed: false,
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: generateId(),
    title: "30-min morning run",
    description: "Stick to the 5k route around the park.",
    priority: "Medium",
    category: "Health",
    dueDate: "2026-04-01",
    completed: true,
    createdAt: Date.now() - 86400000,
  },
  {
    id: generateId(),
    title: "Read 'Deep Work'",
    description: "Finish chapters 3 & 4 on deep scheduling.",
    priority: "Low",
    category: "Learning",
    dueDate: "2026-04-10",
    completed: false,
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: generateId(),
    title: "Review Q1 budget",
    description: "Compare actuals vs forecast and flag variances.",
    priority: "High",
    category: "Finance",
    dueDate: "2026-04-02",
    completed: false,
    createdAt: Date.now(),
  },
];

// ── Modal ──────────────────────────────────────────────────────────────────

function TaskModal({ task, onSave, onClose }) {
  const [form, setForm] = useState(
    task || {
      title: "",
      description: "",
      priority: "Medium",
      category: "Work",
      dueDate: "",
      completed: false,
    },
  );
  const titleRef = useRef();
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.title.trim()) {
      titleRef.current?.focus();
      return;
    }
    onSave({
      ...form,
      id: task?.id || generateId(),
      createdAt: task?.createdAt || Date.now(),
    });
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{task ? "Edit Task" : "New Task"}</span>
          <button className="icon-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="field">
          <label>Title *</label>
          <input
            ref={titleRef}
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="What needs to be done?"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        <div className="field">
          <label>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Add some context…"
            rows={3}
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label>Priority</label>
            <div className="pill-group">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  className={`pill ${form.priority === p ? "pill-active" : ""}`}
                  style={
                    form.priority === p
                      ? {
                          background: PRIORITY_META[p].bg,
                          borderColor: PRIORITY_META[p].dot,
                          color: PRIORITY_META[p].color,
                        }
                      : {}
                  }
                  onClick={() => set("priority", p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label>Category</label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Due Date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => set("dueDate", e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            {task ? "Save Changes" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── TaskCard ───────────────────────────────────────────────────────────────

function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const overdue = isOverdue(task);
  const pm = PRIORITY_META[task.priority];
  const [confirm, setConfirm] = useState(false);

  return (
    <div
      className={`card ${task.completed ? "card-done" : ""} ${overdue ? "card-overdue" : ""}`}
    >
      <div className="card-left">
        <button
          className={`check ${task.completed ? "check-done" : ""}`}
          onClick={() => onToggle(task.id)}
        >
          {task.completed && <span>✓</span>}
        </button>
      </div>
      <div className="card-body">
        <div className="card-top">
          <span
            className={`card-title ${task.completed ? "line-through" : ""}`}
          >
            {task.title}
          </span>
          <div className="card-badges">
            <span
              className="badge"
              style={{
                background: pm.bg,
                color: pm.color,
                border: `1px solid ${pm.dot}33`,
              }}
            >
              <span className="dot" style={{ background: pm.dot }} />
              {task.priority}
            </span>
            <span className="badge badge-cat">
              {CATEGORY_ICONS[task.category]} {task.category}
            </span>
            {overdue && <span className="badge badge-overdue">⚠ Overdue</span>}
          </div>
        </div>
        {task.description && <p className="card-desc">{task.description}</p>}
        {task.dueDate && (
          <span className="card-due">
            📅{" "}
            {new Date(task.dueDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        )}
      </div>
      <div className="card-actions">
        <button
          className="icon-btn small"
          onClick={() => onEdit(task)}
          title="Edit"
        >
          ✎
        </button>
        {confirm ? (
          <>
            <button
              className="icon-btn small danger"
              onClick={() => onDelete(task.id)}
            >
              ✓
            </button>
            <button
              className="icon-btn small"
              onClick={() => setConfirm(false)}
            >
              ✕
            </button>
          </>
        ) : (
          <button
            className="icon-btn small"
            onClick={() => setConfirm(true)}
            title="Delete"
          >
            🗑
          </button>
        )}
      </div>
    </div>
  );
}

// ── Stats ──────────────────────────────────────────────────────────────────

function StatsBar({ tasks }) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;
  const overdue = tasks.filter(isOverdue).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="stats">
      <div className="stat">
        <span className="stat-n">{total}</span>
        <span className="stat-l">Total</span>
      </div>
      <div className="stat">
        <span className="stat-n done">{done}</span>
        <span className="stat-l">Done</span>
      </div>
      <div className="stat">
        <span className="stat-n active">{total - done}</span>
        <span className="stat-l">Active</span>
      </div>
      <div className="stat">
        <span className="stat-n overdue">{overdue}</span>
        <span className="stat-l">Overdue</span>
      </div>
      <div className="stat progress-stat">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="stat-l">{pct}% Complete</span>
      </div>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────

export default function App() {
  const [tasks, setTasks] = useState(SAMPLE_TASKS);
  const [modal, setModal] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const saveTask = (task) => {
    setTasks((ts) =>
      ts.find((t) => t.id === task.id)
        ? ts.map((t) => (t.id === task.id ? task : t))
        : [task, ...ts],
    );
    setModal(null);
  };

  const toggleTask = (id) =>
    setTasks((ts) =>
      ts.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  const deleteTask = (id) => setTasks((ts) => ts.filter((t) => t.id !== id));

  const filtered = tasks
    .filter((t) => {
      if (filter === "Active") return !t.completed;
      if (filter === "Completed") return t.completed;
      if (filter === "Overdue") return isOverdue(t);
      return true;
    })
    .filter((t) => categoryFilter === "All" || t.category === categoryFilter)
    .filter(
      (t) =>
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description?.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "priority")
        return PRIORITIES.indexOf(b.priority) - PRIORITIES.indexOf(a.priority);
      if (sortBy === "dueDate")
        return (a.dueDate || "zzz").localeCompare(b.dueDate || "zzz");
      return b.createdAt - a.createdAt;
    });

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <header className="header">
          <div className="header-inner">
            <div className="brand">
              <span className="brand-icon">◈</span>
              <span className="brand-name">Taskforge</span>
            </div>
            <button className="btn-primary" onClick={() => setModal("new")}>
              + New Task
            </button>
          </div>
        </header>

        <main className="main">
          <StatsBar tasks={tasks} />

          <div className="toolbar">
            <div className="search-wrap">
              {/* <span className="search-icon"></span> */}
              <input
                className="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks…"
              />
              {search && (
                <button
                  className="icon-btn small"
                  onClick={() => setSearch("")}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="controls">
              <div className="filter-tabs">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    className={`tab ${filter === f ? "tab-active" : ""}`}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <select
                className="select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              <select
                className="select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="createdAt">Newest First</option>
                <option value="priority">By Priority</option>
                <option value="dueDate">By Due Date</option>
              </select>
            </div>
          </div>

          <div className="task-list">
            {filtered.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">◎</div>
                <div className="empty-text">No tasks found</div>
                <div className="empty-sub">
                  Try adjusting your filters or create a new task
                </div>
              </div>
            ) : (
              filtered.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onEdit={(t) => setModal(t)}
                  onDelete={deleteTask}
                />
              ))
            )}
          </div>
        </main>

        {modal && (
          <TaskModal
            task={modal === "new" ? null : modal}
            onSave={saveTask}
            onClose={() => setModal(null)}
          />
        )}
      </div>
    </>
  );
}

// ── CSS ────────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:      #0d0f14;
  --surface: #13161e;
  --card:    #181c26;
  --border:  #ffffff0f;
  --border2: #ffffff18;
  --text:    #e8eaf0;
  --muted:   #6b7280;
  --accent:  #818cf8;
  --accent2: #c084fc;
  --green:   #34d399;
  --red:     #f87171;
  --yellow:  #fbbf24;
  --r:       12px;
}

body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; min-height: 100vh; }

.app { min-height: 100vh; background: var(--bg); }

/* Header */
.header { background: var(--surface); border-bottom: 1px solid var(--border2); position: sticky; top: 0; z-index: 50; backdrop-filter: blur(12px); }
.header-inner { max-width: 860px; margin: 0 auto; padding: 0 20px; height: 64px; display: flex; align-items: center; justify-content: space-between; }
.brand { display: flex; align-items: center; gap: 10px; }
.brand-icon { font-size: 22px; color: var(--accent); }
.brand-name { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; letter-spacing: -0.5px; background: linear-gradient(135deg, var(--accent), var(--accent2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

/* Main */
.main { max-width: 860px; margin: 0 auto; padding: 28px 20px 60px; }

/* Stats */
.stats { display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
.stat { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r); padding: 14px 20px; display: flex; flex-direction: column; gap: 4px; min-width: 90px; }
.stat-n { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; color: var(--text); }
.stat-n.done { color: var(--green); }
.stat-n.active { color: var(--accent); }
.stat-n.overdue { color: var(--red); }
.stat-l { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; }
.progress-stat { flex: 1; min-width: 180px; justify-content: center; gap: 8px; }
.progress-track { height: 6px; background: #ffffff10; border-radius: 99px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent2)); border-radius: 99px; transition: width 0.6s cubic-bezier(.4,0,.2,1); }

/* Toolbar */
.toolbar { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
.search-wrap { position: relative; display: flex; align-items: center; }
.search-icon { position: absolute; left: 12px; font-size: 18px; color: var(--muted); pointer-events: none; }
.search { width: 100%; background: var(--surface); border: 1px solid var(--border2); border-radius: var(--r); padding: 10px 12px 10px 52px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border-color .2s; }
.search:focus { border-color: var(--accent); }
.search::placeholder { color: var(--muted); }
.controls { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
.filter-tabs { display: flex; gap: 4px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--r); padding: 4px; }
.tab { background: none; border: none; color: var(--muted); padding: 6px 14px; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all .18s; }
.tab:hover { color: var(--text); }
.tab-active { background: var(--card); color: var(--text) !important; }
.select { background: var(--surface); border: 1px solid var(--border2); border-radius: var(--r); color: var(--text); padding: 8px 12px; font-family: 'DM Sans', sans-serif; font-size: 13px; outline: none; cursor: pointer; }

/* Cards */
.task-list { display: flex; flex-direction: column; gap: 10px; }
.card { background: var(--card); border: 1px solid var(--border2); border-radius: var(--r); display: flex; gap: 14px; padding: 16px; align-items: flex-start; transition: border-color .2s, transform .15s; }
.card:hover { border-color: var(--border2); transform: translateY(-1px); }
.card-done { opacity: 0.55; }
.card-overdue { border-left: 3px solid var(--red); }
.card-left { padding-top: 2px; }
.check { width: 22px; height: 22px; border-radius: 6px; border: 2px solid var(--border2); background: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: white; font-size: 13px; transition: all .18s; flex-shrink: 0; }
.check:hover { border-color: var(--green); }
.check-done { background: var(--green); border-color: var(--green); }
.card-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
.card-top { display: flex; align-items: flex-start; gap: 10px; flex-wrap: wrap; }
.card-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 600; flex: 1; min-width: 0; word-break: break-word; }
.line-through { text-decoration: line-through; color: var(--muted); }
.card-badges { display: flex; gap: 6px; flex-wrap: wrap; }
.badge { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 500; padding: 3px 9px; border-radius: 99px; border: 1px solid transparent; }
.dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.badge-cat { background: #ffffff08; color: var(--muted); border-color: var(--border); }
.badge-overdue { background: #7f1d1d30; color: var(--red); border-color: #f8717133; }
.card-desc { font-size: 13px; color: var(--muted); line-height: 1.5; }
.card-due { font-size: 12px; color: var(--muted); }
.card-actions { display: flex; flex-direction: column; gap: 6px; }

/* Buttons */
.btn-primary { background: linear-gradient(135deg, var(--accent), var(--accent2)); border: none; color: white; padding: 9px 20px; border-radius: 9px; font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; transition: opacity .18s, transform .12s; letter-spacing: 0.01em; }
.btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
.btn-ghost { background: none; border: 1px solid var(--border2); color: var(--muted); padding: 9px 18px; border-radius: 9px; font-family: 'DM Sans', sans-serif; font-size: 14px; cursor: pointer; transition: all .18s; }
.btn-ghost:hover { color: var(--text); border-color: var(--border2); }
.icon-btn { background: none; border: none; color: var(--muted); font-size: 17px; cursor: pointer; padding: 4px 6px; border-radius: 6px; transition: all .15s; line-height: 1; }
.icon-btn:hover { color: var(--text); background: var(--border); }
.icon-btn.small { font-size: 14px; }
.icon-btn.danger { color: var(--red); }

/* Empty */
.empty { text-align: center; padding: 72px 20px; color: var(--muted); }
.empty-icon { font-size: 48px; margin-bottom: 14px; opacity: .3; }
.empty-text { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; margin-bottom: 6px; color: var(--text); opacity: .4; }
.empty-sub { font-size: 13px; }

/* Modal */
.modal-backdrop { position: fixed; inset: 0; background: #00000088; z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(4px); animation: fadeIn .15s ease; }
.modal { background: var(--card); border: 1px solid var(--border2); border-radius: 16px; width: 100%; max-width: 520px; display: flex; flex-direction: column; gap: 18px; padding: 24px; animation: slideUp .2s cubic-bezier(.4,0,.2,1); }
.modal-header { display: flex; align-items: center; justify-content: space-between; }
.modal-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding-top: 4px; }

/* Fields */
.field { display: flex; flex-direction: column; gap: 7px; }
.field-row { display: flex; gap: 14px; }
.field-row .field { flex: 1; }
label { font-size: 12px; font-weight: 500; color: var(--muted); text-transform: uppercase; letter-spacing: 0.07em; }
input:not([type=date]):not([type=checkbox]), textarea, select {
  background: var(--surface); border: 1px solid var(--border2); border-radius: 9px;
  color: var(--text); padding: 10px 13px; font-family: 'DM Sans', sans-serif; font-size: 14px;
  outline: none; transition: border-color .18s; width: 100%;
}
input[type=date] { background: var(--surface); border: 1px solid var(--border2); border-radius: 9px; color: var(--text); padding: 10px 13px; font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border-color .18s; width: 100%; color-scheme: dark; }
input:focus, textarea:focus, select:focus { border-color: var(--accent); }
textarea { resize: vertical; }

/* Pill group */
.pill-group { display: flex; gap: 6px; flex-wrap: wrap; }
.pill { background: none; border: 1px solid var(--border2); color: var(--muted); padding: 6px 14px; border-radius: 99px; font-size: 13px; cursor: pointer; transition: all .15s; font-family: 'DM Sans', sans-serif; }
.pill:hover { color: var(--text); border-color: var(--muted); }

/* Animations */
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 600px) {
  .field-row { flex-direction: column; }
  .controls { flex-direction: column; align-items: stretch; }
  .filter-tabs { justify-content: space-between; }
}
`;
