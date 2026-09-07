"use client";

import { useEffect, useState } from "react";
import { apiFetch, clearSession, getStoredUser } from "../../lib/api";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalTasks: 0, unassigned: 0, doing: 0, done: 0 });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const current = getStoredUser();
    if (!current) { router.replace("/login"); return; }
    if (current.role !== "admin") { router.replace("/dashboard"); return; }
    setUser(current);
    load();
  }, [router]);

  async function load() {
    try {
      const [u, s, t] = await Promise.all([apiFetch("/admin/users"), apiFetch("/admin/stats"), apiFetch("/tasks")]);
      setUsers(u.users || []); setStats(s); setTasks(t.tasks || []);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  async function assign(taskId, assigneeId) {
    try {
      const data = await apiFetch(`/tasks/${taskId}/assign`, { method: "PATCH", body: JSON.stringify({ assigneeId: assigneeId || null }) });
      setTasks(current => current.map(t => t._id === taskId ? data.task : t));
      const s = await apiFetch("/admin/stats"); setStats(s);
    } catch (err) { setError(err.message); }
  }

  function logout() { clearSession(); router.replace("/login"); }
  if (loading || !user) return <main className="app-shell"><div className="workspace"><div className="p-5 text-muted">Loading admin workspace...</div></div></main>;

  return <main className="app-shell">
    <aside className="sidebar"><div className="brand-mark sidebar-brand"><span className="brand-dot" />TaskFlow</div><nav className="sidebar-nav"><button className="sidebar-link active"><span>▦</span> Overview</button><button className="sidebar-link"><span>◉</span> All tasks</button><button className="sidebar-link"><span>◎</span> Users</button></nav><div className="sidebar-bottom"><div className="workspace-card"><div className="workspace-icon">AD</div><div><strong>Admin workspace</strong><small>Administrator</small></div></div><button className="sidebar-link"><span>⚙</span> Settings</button><button className="sidebar-link" onClick={logout}><span>↪</span> Log out</button></div></aside>
    <section className="workspace">
      <header className="workspace-header"><div><div className="breadcrumb">Administration / Overview</div><h1>Command center</h1><p>See the whole system, manage assignments, and keep work balanced.</p></div><div className="header-actions"><div className="admin-badge">ADMIN ACCESS</div><span className="avatar avatar-large">{user.name?.[0]?.toUpperCase() || "A"}</span></div></header>
      {error && <div className="alert alert-danger mt-4 mx-auto" style={{maxWidth:1500}}>{error}</div>}
      <div className="stats-row admin-stats"><div className="stat-card"><span>TOTAL USERS</span><strong>{stats.totalUsers}</strong><small>Registered users</small></div><div className="stat-card"><span>TOTAL TASKS</span><strong>{stats.totalTasks}</strong><small>Across the system</small></div><div className="stat-card"><span>UNASSIGNED</span><strong>{stats.unassigned}</strong><small>Need an owner</small></div><div className="quote-card"><span>Admin focus</span><strong>Keep ownership clear.</strong><small>Assign the right task to the right person.</small></div></div>
      <div className="admin-grid">
        <section className="panel-modern"><div className="panel-head"><div><span className="board-label">TEAM</span><h2>People</h2></div></div><div className="user-list">{users.map(u => <div className="user-row" key={u.id}><span className="avatar">{u.name?.[0]?.toUpperCase()}</span><div className="user-main"><strong>{u.name}</strong><small>{u.email}</small></div><span className="role-label">Normal user</span><strong className="task-count">{u.taskCount} tasks</strong></div>)}</div></section>
        <section className="panel-modern"><div className="panel-head"><div><span className="board-label">WORK</span><h2>All tasks</h2></div></div><div className="admin-table"><div className="admin-table-head"><span>TASK</span><span>ASSIGNEE</span><span>STATUS</span><span>CHANGE OWNER</span></div>{tasks.map(task => <div className="admin-table-row" key={task._id}><strong>{task.title}</strong><span>{task.assignee?.name || "Unassigned"}</span><span className="status-pill-table">{task.status}</span><select value={task.assignee?._id || ""} onChange={e => assign(task._id, e.target.value)} className="form-select form-select-sm"><option value="">Unassigned</option>{users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}</select></div>)}</div></section>
      </div>
    </section>
  </main>;
}
