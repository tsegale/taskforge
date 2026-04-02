# ◈ Taskforge

> task management app built with React, featuring full CRUD, smart filtering, priority levels, and overdue detection.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-818cf8?style=flat-square)
![Status](https://img.shields.io/badge/Status-Active-34d399?style=flat-square)

---

## ✦ Features

### Core CRUD

- **Create** tasks with title, description, priority, category, and due date
- **Read** all tasks with a responsive card-based layout
- **Update** any task via pre-filled edit modal
- **Delete** tasks with a two-step confirmation to prevent accidents

### Smart Filtering & Sorting

| Feature         | Options                                               |
| --------------- | ----------------------------------------------------- |
| Status Filter   | All · Active · Completed · Overdue                    |
| Category Filter | Work · Personal · Health · Learning · Finance · Other |
| Sort By         | Newest First · Priority · Due Date                    |
| Live Search     | Searches across title and description                 |

### Priority System

| Level       | Color  |
| ----------- | ------ |
| 🟢 Low      | Green  |
| 🟡 Medium   | Amber  |
| 🟠 High     | Orange |
| 🔴 Critical | Red    |

### Automatic Overdue Detection

Tasks past their due date are flagged automatically with a red left border and ⚠ badge — no manual intervention needed.

### Stats Dashboard

A persistent stats bar shows **Total**, **Done**, **Active**, and **Overdue** counts alongside an animated **progress bar**.

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/taskforge.git
cd taskforge

# Install dependencies
npm install

# Start development server
npm run dev
```

### Running with Vite (recommended)

```bash
npm create vite@latest taskforge -- --template react
cd taskforge
npm install
# Replace src/App.jsx with TaskManager.jsx
npm run dev
```

---

## 🗂 Project Structure

```
taskforge/
├── src/
│   ├── App.jsx          # Root component (TaskManager)
│   ├── main.jsx         # Entry point
│   └── index.css        # Global resets (optional)
├── public/
├── index.html
├── vite.config.js
└── package.json
```

The entire app lives in a **single file** (`App.jsx`) using React hooks — no external state library required.

---

## 🧱 Component Architecture

```
App
├── StatsBar          — live counts + progress bar
├── Toolbar
│   ├── SearchInput   — live full-text search
│   ├── FilterTabs    — All / Active / Completed / Overdue
│   ├── CategorySelect
│   └── SortSelect
├── TaskList
│   └── TaskCard[]    — individual task with actions
└── TaskModal         — create / edit form (portal-style)
```

---

## ⚙️ State Management

All state is managed with React's built-in `useState` hook — no Redux or Zustand needed.

| State            | Type                    | Description                        |
| ---------------- | ----------------------- | ---------------------------------- |
| `tasks`          | `Task[]`                | Source of truth for all tasks      |
| `modal`          | `null \| "new" \| Task` | Controls modal visibility and mode |
| `filter`         | `string`                | Active status filter               |
| `search`         | `string`                | Live search query                  |
| `sortBy`         | `string`                | Current sort key                   |
| `categoryFilter` | `string`                | Active category filter             |

---

## 🎨 Design System

| Token      | Value              |
| ---------- | ------------------ |
| Background | `#0d0f14`          |
| Surface    | `#13161e`          |
| Card       | `#181c26`          |
| Accent     | `#818cf8` (indigo) |
| Accent 2   | `#c084fc` (purple) |
| Success    | `#34d399`          |
| Danger     | `#f87171`          |

**Fonts:** [Syne](https://fonts.google.com/specimen/Syne) (headings, 800 weight) + [DM Sans](https://fonts.google.com/specimen/DM+Sans) (body)

---

## 📦 Dependencies

| Package     | Purpose       |
| ----------- | ------------- |
| `react`     | UI framework  |
| `react-dom` | DOM rendering |

No additional runtime dependencies. All styling is vanilla CSS-in-JS via a single `CSS` constant.

---

## 🛣 Roadmap

- [ ] LocalStorage / IndexedDB persistence
- [ ] Drag-and-drop reordering
- [ ] Subtasks / checklists
- [ ] Tag system
- [ ] Dark / light theme toggle
- [ ] Export to CSV / JSON
- [ ] Notifications for upcoming due dates

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request

---

## 📄 License

MIT © 2026 — free to use, fork, and build upon.
