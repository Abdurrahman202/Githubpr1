"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch, clearSession, getStoredUser } from "../../lib/api";
import { useRouter } from "next/navigation";

const columns = [
  { key: "todo", title: "To Do", note: "Ready to start" },
  { key: "doing", title: "Doing", note: "Currently in progress" },
  { key: "done", title: "Done", note: "Completed work" }
];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [draggedId, setDraggedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const current = getStoredUser();
    if (!current) { router.replace("/login"); return; }
    setUser(current);
    loadTasks();
  }, [router]);

  async function loadTasks() {
    try {
      const data = await apiFetch("/tasks");
      setTasks(data.tasks || []);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  }

  async function moveTask(taskId, status) {
    const previous = tasks;
    setTasks(current => current.map(t => t._id === taskId ? { ...t, status } : t));
    try { await apiFetch(`/tasks/${taskId}/status`, { method: "PATCH", body: JSON.stringify({ status }) }); }
    catch (err) { setTasks(previous); setError(err.message); }
  }

  async function createTask(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    try {
      const data = await apiFetch("/tasks", { method: "POST", body: JSON.stringify(form) });
      setTasks(current => [data.task, ...current]);
      setForm({ title: "", description: "" });
      setShowModal(false);
      setError("");
    } catch (err) { setError(err.message); }
  }

  function logout() { clearSession(); router.replace("/login"); }

  const grouped = useMemo(() => columns.map(c => ({ ...c, tasks: tasks.filter(t => t.status === c.key) })), [tasks]);

  if (loading || !user) return <main className="app-shell"><div className="workspace"><div className="text-muted p-5">Loading workspace...</div></div></main>;

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark sidebar-brand"><span className="brand-dot" />TaskFlow</div>
        <nav className="sidebar-nav">
          <button className="sidebar-link active"><span>▦</span> My board</button>
          <button className="sidebar-link" onClick={() => document.getElementById("board")?.scrollIntoView()}><span>✓</span> My tasks</button>
        </nav>
        <div className="sidebar-bottom">
          <div className="workspace-card"><div className="workspace-icon">TF</div><div><strong>Personal workspace</strong><small>Normal user</small></div></div>
          <button className="sidebar-link"><span>⚙</span> Settings</button>
          <button className="sidebar-link" onClick={logout}><span>↪</span> Log out</button>
        </div>
      </aside>

      <section className="workspace">
        <header className="workspace-header">
          <div><div className="breadcrumb">Workspace / Board</div><h1>My task board</h1><p>Keep momentum. Move one important task at a time.</p></div>
          <div className="header-actions"><div className="user-chip"><span className="avatar avatar-large">{user.name?.[0]?.toUpperCase() || "U"}</span><div><strong>{user.name}</strong><small>{user.role === "admin" ? "Administrator" : "Normal user"}</small></div></div><button className="btn btn-brand px-4" onClick={() => setShowModal(true)}>+ New task</button></div>
        </header>

        {error && <div className="alert alert-danger mt-4 mx-auto" style={{maxWidth:1500}}>{error}</div>}

        <div className="stats-row">
          <div className="stat-card"><span>ALL TASKS</span><strong>{tasks.length}</strong><small>Your visible tasks</small></div>
          <div className="stat-card"><span>IN PROGRESS</span><strong>{tasks.filter(t => t.status === "doing").length}</strong><small>Keep them moving</small></div>
          <div className="stat-card"><span>COMPLETED</span><strong>{tasks.filter(t => t.status === "done").length}</strong><small>Nice progress</small></div>
          <div className="quote-card"><span>Today&apos;s focus</span><strong>Finish what matters most.</strong><small>Small progress is still progress.</small></div>
        </div>

        <div className="board-toolbar" id="board"><div><span className="board-label">YOUR WORKFLOW</span><h2>Active board</h2></div><div className="board-filters"><button className="filter-chip active">All</button><button className="filter-chip">High priority</button><button className="filter-chip">Mine</button></div></div>

        <div className="kanban-grid">
          {grouped.map(column => <section key={column.key} className="kanban-column" onDragOver={e => e.preventDefault()} onDrop={() => draggedId && moveTask(draggedId, column.key)}>
            <div className="column-head"><div><div className="column-name"><span className={`status-dot status-${column.key}`} />{column.title}<b>{column.tasks.length}</b></div><small>{column.note}</small></div><button className="column-menu">•••</button></div>
            <div className="task-stack">
              {column.tasks.map(task => <article key={task._id} className={`task-card ${draggedId === task._id ? "is-dragging" : ""}`} draggable onDragStart={() => setDraggedId(task._id)} onDragEnd={() => setDraggedId(null)}>
                <div className="task-top"><span className="priority priority-medium">TASK</span><button className="task-more">•••</button></div>
                <h3>{task.title}</h3><p>{task.description || "No description added."}</p>
                <div className="task-footer"><div className="task-person"><span className="avatar">{task.assignee?.name?.[0]?.toUpperCase() || "U"}</span><small>{task.assignee?.name || "Unassigned"}</small></div><span className="move-hint">↕ Drag</span></div>
              </article>)}
              <button className="add-inline" onClick={() => setShowModal(true)}>+ Add a task</button>
            </div>
          </section>)}
        </div>
      </section>

      {showModal && <div className="modal-backdrop-modern" onClick={() => setShowModal(false)}><div className="modern-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-kicker">NEW TASK</div><h2>Create something useful.</h2><p>This task will be saved in MongoDB and immediately appear on your board.</p>
        <form onSubmit={createTask}><label>Task title</label><input required autoFocus value={form.title} onChange={e => setForm({...form,title:e.target.value})} placeholder="e.g. Prepare deployment checklist" className="form-control form-control-modern" /><label className="mt-3">Description</label><textarea rows="4" value={form.description} onChange={e => setForm({...form,description:e.target.value})} className="form-control form-control-modern" placeholder="What needs to be done?"></textarea><div className="d-flex justify-content-end gap-2 mt-4"><button type="button" className="btn btn-soft px-4" onClick={() => setShowModal(false)}>Cancel</button><button className="btn btn-brand px-4">Create task</button></div></form>
      </div></div>}
    </main>
  );
}
