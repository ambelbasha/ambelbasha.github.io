import { useState, useEffect, useCallback, useRef } from "react";

const API = "https://api.github.com";

const fetcher = async (token, path, opts = {}) => {
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(opts.body ? { "Content-Type": "application/json" } : {}),
      ...opts.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
};

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const fmtTime = (d) =>
  d ? new Date(d).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

const Toast = ({ msg, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  const colors = { success: "#22c55e", error: "#ef4444", info: "#3b82f6" };
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      background: "#1a1a2e", border: `1px solid ${colors[type] || colors.info}`,
      color: "#e2e8f0", padding: "12px 18px", borderRadius: 8, fontSize: 13,
      maxWidth: 340, boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", gap: 10,
    }}>
      <span style={{ color: colors[type] || colors.info, fontSize: 16 }}>
        {type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}
      </span>
      {msg}
    </div>
  );
};

const Modal = ({ title, onClose, children, width = 540 }) => {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.7)", display: "flex",
      alignItems: "center", justifyContent: "center",
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: "#0f0f23", border: "1px solid #2d2d5e",
        borderRadius: 12, width, maxWidth: "95vw", maxHeight: "85vh",
        overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px", borderBottom: "1px solid #2d2d5e",
          position: "sticky", top: 0, background: "#0f0f23", zIndex: 1,
        }}>
          <span style={{ fontWeight: 600, fontSize: 15, color: "#c9d1ff" }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: 2 }}>✕</button>
        </div>
        <div style={{ padding: 20 }}>{children}</div>
      </div>
    </div>
  );
};

const Inp = ({ label, ...props }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <label style={{ display: "block", fontSize: 12, color: "#8b9dc3", marginBottom: 6, fontWeight: 500 }}>{label}</label>}
    <input {...props} style={{
      width: "100%", background: "#1a1a3e", border: "1px solid #3d3d7a",
      borderRadius: 6, color: "#e2e8f0", padding: "8px 12px", fontSize: 13,
      outline: "none", boxSizing: "border-box", ...props.style,
    }} />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <label style={{ display: "block", fontSize: 12, color: "#8b9dc3", marginBottom: 6, fontWeight: 500 }}>{label}</label>}
    <textarea {...props} style={{
      width: "100%", background: "#1a1a3e", border: "1px solid #3d3d7a",
      borderRadius: 6, color: "#e2e8f0", padding: "8px 12px", fontSize: 13,
      outline: "none", boxSizing: "border-box", resize: "vertical", minHeight: 80,
      fontFamily: "inherit", ...props.style,
    }} />
  </div>
);

const Btn = ({ children, variant = "primary", ...props }) => {
  const styles = {
    primary: { background: "#4f46e5", color: "#fff", border: "1px solid #4f46e5" },
    secondary: { background: "transparent", color: "#8b9dc3", border: "1px solid #3d3d7a" },
    danger: { background: "#7f1d1d", color: "#fca5a5", border: "1px solid #991b1b" },
    ghost: { background: "transparent", color: "#6366f1", border: "none" },
    success: { background: "#14532d", color: "#86efac", border: "1px solid #166534" },
    purple: { background: "#4c1d95", color: "#c4b5fd", border: "1px solid #5b21b6" },
  };
  return (
    <button {...props} style={{
      padding: "7px 14px", borderRadius: 6, fontSize: 13, cursor: "pointer",
      fontWeight: 500, transition: "opacity 0.15s", outline: "none",
      display: "inline-flex", alignItems: "center", gap: 6,
      ...styles[variant], opacity: props.disabled ? 0.5 : 1, ...props.style,
    }}>
      {children}
    </button>
  );
};

const Badge = ({ children, color = "#4f46e5" }) => (
  <span style={{
    background: color + "22", color, border: `1px solid ${color}44`,
    borderRadius: 20, padding: "2px 8px", fontSize: 11, fontWeight: 600,
  }}>{children}</span>
);

const Spinner = () => (
  <div style={{
    width: 14, height: 14, border: "2px solid #3d3d7a",
    borderTop: "2px solid #6366f1", borderRadius: "50%",
    animation: "spin 0.7s linear infinite", display: "inline-block",
  }} />
);

const Select = ({ label, value, onChange, children, style }) => (
  <div style={{ marginBottom: label ? 14 : 0 }}>
    {label && <label style={{ display: "block", fontSize: 12, color: "#8b9dc3", marginBottom: 6, fontWeight: 500 }}>{label}</label>}
    <select value={value} onChange={onChange} style={{
      width: "100%", background: "#1a1a3e", border: "1px solid #3d3d7a",
      borderRadius: 6, color: "#e2e8f0", padding: "8px 12px", fontSize: 13,
      outline: "none", boxSizing: "border-box", ...style,
    }}>{children}</select>
  </div>
);

// ── LOGIN ────────────────────────────────────────────────────────────────────
const Login = ({ onLogin }) => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async () => {
    if (!token.trim()) return;
    setLoading(true); setErr("");
    try {
      const user = await fetcher(token.trim(), "/user");
      onLogin(token.trim(), user);
    } catch (e) { setErr(e.message || "Invalid token"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080818", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'SF Mono', 'Fira Code', monospace" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
      <div style={{ background: "#0f0f23", border: "1px solid #2d2d5e", borderRadius: 16, padding: 40, width: 420, boxShadow: "0 20px 80px rgba(79,70,229,0.2)" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="#6366f1">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </div>
          <h1 style={{ color: "#c9d1ff", fontSize: 22, fontWeight: 700, margin: 0 }}>GitHub Manager</h1>
          <p style={{ color: "#6b7280", fontSize: 13, marginTop: 8 }}>Enter your Personal Access Token to connect</p>
        </div>
        <Inp label="Personal Access Token" type="password" placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" value={token} onChange={(e) => setToken(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
        {err && <p style={{ color: "#f87171", fontSize: 12, marginBottom: 12 }}>{err}</p>}
        <Btn style={{ width: "100%", padding: "10px 0", justifyContent: "center" }} onClick={submit} disabled={loading}>{loading ? <Spinner /> : "Connect to GitHub"}</Btn>
        <p style={{ color: "#4b5563", fontSize: 11, textAlign: "center", marginTop: 16, lineHeight: 1.6 }}>
          Needs scopes: <code style={{ color: "#8b9dc3" }}>repo, read:user, workflow</code>
        </p>
      </div>
    </div>
  );
};

// ── REPO LIST ────────────────────────────────────────────────────────────────
const RepoList = ({ token, user, onSelect, onLogout }) => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("updated");
  const [showCreate, setShowCreate] = useState(false);
  const [newRepo, setNewRepo] = useState({ name: "", description: "", private: false, auto_init: true });
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState(1);

  const notify = (msg, type = "info") => setToast({ msg, type });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetcher(token, `/user/repos?per_page=100&sort=${sort}&type=${filter}`);
      setRepos(data || []);
    } catch (e) { notify(e.message, "error"); }
    finally { setLoading(false); }
  }, [token, sort, filter]);

  useEffect(() => { load(); }, [load]);

  const createRepo = async () => {
    if (!newRepo.name.trim()) return;
    setCreating(true);
    try {
      const created = await fetcher(token, "/user/repos", { method: "POST", body: JSON.stringify(newRepo) });
      notify("Repository created!", "success");
      setShowCreate(false);
      setNewRepo({ name: "", description: "", private: false, auto_init: true });
      load();
    } catch (e) { notify(e.message, "error"); }
    finally { setCreating(false); }
  };

  const deleteRepo = async (repo, e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete ${repo.full_name}? This cannot be undone.`)) return;
    try {
      await fetcher(token, `/repos/${repo.full_name}`, { method: "DELETE" });
      notify("Repository deleted", "success");
      load();
    } catch (e) { notify(e.message, "error"); }
  };

  const toggleStar = async (repo, e) => {
    e.stopPropagation();
    try {
      if (repo.starred) {
        await fetcher(token, `/user/starred/${repo.full_name}`, { method: "DELETE" });
      } else {
        await fetcher(token, `/user/starred/${repo.full_name}`, { method: "PUT", headers: { "Content-Length": "0" } });
      }
      setRepos(prev => prev.map(r => r.id === repo.id ? { ...r, starred: !r.starred, stargazers_count: r.stargazers_count + (r.starred ? -1 : 1) } : r));
    } catch (e) { notify(e.message, "error"); }
  };

  const filtered = repos.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    (r.description || "").toLowerCase().includes(search.toLowerCase())
  );

  const PER = 20;
  const pages = Math.ceil(filtered.length / PER);
  const visible = filtered.slice((page - 1) * PER, page * PER);

  const langColor = { JavaScript: "#f1e05a", TypeScript: "#2b7489", Python: "#3572A5", HTML: "#e34c26", CSS: "#563d7c", Go: "#00ADD8", Rust: "#dea584", Java: "#b07219", "C++": "#f34b7d", Ruby: "#701516", Shell: "#89e051", PHP: "#4F5D95" };

  return (
    <div style={{ minHeight: "100vh", background: "#080818", fontFamily: "'SF Mono','Fira Code',monospace" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} *::-webkit-scrollbar{width:6px} *::-webkit-scrollbar-track{background:#0f0f23} *::-webkit-scrollbar-thumb{background:#3d3d7a;border-radius:3px}`}</style>
      <div style={{ background: "#0f0f23", borderBottom: "1px solid #2d2d5e", padding: "12px 24px", display: "flex", alignItems: "center", gap: 16, position: "sticky", top: 0, zIndex: 100 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#6366f1"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
        <span style={{ color: "#c9d1ff", fontWeight: 700, fontSize: 15 }}>GitHub Manager</span>
        <div style={{ flex: 1 }} />
        <img src={user.avatar_url} alt="" style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid #4f46e5" }} />
        <span style={{ color: "#8b9dc3", fontSize: 13 }}>{user.login}</span>
        <Btn variant="secondary" onClick={onLogout} style={{ padding: "5px 10px", fontSize: 12 }}>Sign out</Btn>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <input placeholder="🔍  Search repositories…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} style={{ flex: 1, minWidth: 200, background: "#1a1a3e", border: "1px solid #3d3d7a", borderRadius: 6, color: "#e2e8f0", padding: "8px 14px", fontSize: 13, outline: "none" }} />
          <select value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }} style={{ background: "#1a1a3e", border: "1px solid #3d3d7a", borderRadius: 6, color: "#8b9dc3", padding: "8px 10px", fontSize: 13, outline: "none" }}>
            <option value="all">All</option><option value="owner">Mine</option><option value="public">Public</option><option value="private">Private</option><option value="forks">Forks</option>
          </select>
          <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} style={{ background: "#1a1a3e", border: "1px solid #3d3d7a", borderRadius: 6, color: "#8b9dc3", padding: "8px 10px", fontSize: 13, outline: "none" }}>
            <option value="updated">Last updated</option><option value="created">Created</option><option value="pushed">Last pushed</option><option value="full_name">Name</option>
          </select>
          <Btn onClick={() => setShowCreate(true)}>＋ New repo</Btn>
          <Btn variant="secondary" onClick={load} style={{ padding: "8px 12px" }}>↻</Btn>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          {[{ label: "Total", value: repos.length }, { label: "Public", value: repos.filter(r => !r.private).length }, { label: "Private", value: repos.filter(r => r.private).length }, { label: "Forks", value: repos.filter(r => r.fork).length }, { label: "Stars", value: repos.reduce((a, r) => a + r.stargazers_count, 0) }].map(s => (
            <div key={s.label} style={{ flex: 1, background: "#0f0f23", border: "1px solid #2d2d5e", borderRadius: 8, padding: "10px 14px", textAlign: "center", minWidth: 70 }}>
              <div style={{ color: "#6366f1", fontWeight: 700, fontSize: 18 }}>{s.value}</div>
              <div style={{ color: "#6b7280", fontSize: 11 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 60 }}><Spinner /></div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
              {visible.map((repo) => (
                <div key={repo.id} onClick={() => onSelect(repo)} style={{ background: "#0f0f23", border: "1px solid #2d2d5e", borderRadius: 10, padding: 16, cursor: "pointer", transition: "border-color 0.15s, transform 0.1s", position: "relative" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#4f46e5"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2d2d5e"; e.currentTarget.style.transform = "none"; }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
                      <span style={{ color: "#6366f1", fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{repo.name}</span>
                      {repo.private && <Badge color="#f59e0b">private</Badge>}
                      {repo.fork && <Badge color="#6b7280">fork</Badge>}
                      {repo.archived && <Badge color="#4b5563">archived</Badge>}
                    </div>
                    <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                      <button onClick={(e) => toggleStar(repo, e)} title={repo.starred ? "Unstar" : "Star"} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: repo.starred ? "#f59e0b" : "#4b5563", padding: "2px 4px" }}>
                        {repo.starred ? "★" : "☆"}
                      </button>
                      <button onClick={(e) => deleteRepo(repo, e)} title="Delete" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#4b5563", padding: "2px 4px" }}>🗑</button>
                    </div>
                  </div>
                  <p style={{ color: "#6b7280", fontSize: 12, margin: "0 0 12px", lineHeight: 1.5, minHeight: 18, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {repo.description || <em>No description</em>}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 11, color: "#4b5563" }}>
                    {repo.language && (
                      <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: langColor[repo.language] || "#6b7280", display: "inline-block" }} />
                        <span style={{ color: "#6b7280" }}>{repo.language}</span>
                      </span>
                    )}
                    {repo.stargazers_count > 0 && <span>★ {repo.stargazers_count}</span>}
                    {repo.forks_count > 0 && <span>⑂ {repo.forks_count}</span>}
                    {repo.open_issues_count > 0 && <span>● {repo.open_issues_count} issues</span>}
                    <span style={{ marginLeft: "auto" }}>{fmt(repo.updated_at)}</span>
                  </div>
                </div>
              ))}
            </div>
            {pages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
                {Array.from({ length: pages }, (_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)} style={{ background: page === i + 1 ? "#4f46e5" : "#1a1a3e", border: "1px solid #3d3d7a", borderRadius: 6, color: "#e2e8f0", padding: "6px 12px", cursor: "pointer", fontSize: 13 }}>{i + 1}</button>
                ))}
              </div>
            )}
            {visible.length === 0 && <div style={{ textAlign: "center", padding: 60, color: "#4b5563", fontSize: 14 }}>No repositories found</div>}
          </>
        )}
      </div>

      {showCreate && (
        <Modal title="Create new repository" onClose={() => setShowCreate(false)}>
          <Inp label="Repository name *" value={newRepo.name} onChange={(e) => setNewRepo(p => ({ ...p, name: e.target.value }))} placeholder="my-awesome-project" />
          <Inp label="Description" value={newRepo.description} onChange={(e) => setNewRepo(p => ({ ...p, description: e.target.value }))} placeholder="Optional description" />
          <div style={{ display: "flex", gap: 20, marginBottom: 16 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#8b9dc3" }}>
              <input type="checkbox" checked={newRepo.private} onChange={(e) => setNewRepo(p => ({ ...p, private: e.target.checked }))} /> Private
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#8b9dc3" }}>
              <input type="checkbox" checked={newRepo.auto_init} onChange={(e) => setNewRepo(p => ({ ...p, auto_init: e.target.checked }))} /> Initialize with README
            </label>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <Btn variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Btn>
            <Btn onClick={createRepo} disabled={creating}>{creating ? <Spinner /> : "Create repository"}</Btn>
          </div>
        </Modal>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

// ── REPO DETAIL ──────────────────────────────────────────────────────────────
const RepoDetail = ({ token, repo: initialRepo, onBack }) => {
  const [repo, setRepo] = useState(initialRepo);
  const [tab, setTab] = useState("files");
  const [toast, setToast] = useState(null);

  const notify = (msg, type = "info") => setToast({ msg, type });

  const tabs = [
    { id: "files", label: "📁 Files" },
    { id: "commits", label: "📜 Commits" },
    { id: "issues", label: `🐛 Issues` },
    { id: "prs", label: "🔀 Pull Requests" },
    { id: "branches", label: "🌿 Branches" },
    { id: "actions", label: "⚡ Actions" },
    { id: "releases", label: "🏷 Releases" },
    { id: "labels", label: "🔖 Labels" },
    { id: "settings", label: "⚙️ Settings" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#080818", fontFamily: "'SF Mono','Fira Code',monospace" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} *::-webkit-scrollbar{width:6px} *::-webkit-scrollbar-track{background:#0f0f23} *::-webkit-scrollbar-thumb{background:#3d3d7a;border-radius:3px}`}</style>

      {/* HEADER */}
      <div style={{ background: "#0f0f23", borderBottom: "1px solid #2d2d5e", padding: "12px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", fontSize: 13, fontFamily: "inherit", padding: 0 }}>← Back</button>
          <span style={{ color: "#4b5563" }}>/</span>
          <span style={{ color: "#c9d1ff", fontWeight: 700, fontSize: 15 }}>{repo.name}</span>
          {repo.private && <Badge color="#f59e0b">private</Badge>}
          {repo.fork && <Badge color="#6b7280">fork</Badge>}
          {repo.archived && <Badge color="#4b5563">archived</Badge>}
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 12, color: "#6b7280" }}>
            <span>★ {repo.stargazers_count}</span>
            <span>⑂ {repo.forks_count}</span>
            <span>👁 {repo.watchers_count}</span>
          </div>
          <a href={repo.html_url} target="_blank" rel="noreferrer" style={{ color: "#6366f1", fontSize: 12, textDecoration: "none" }}>View on GitHub ↗</a>
        </div>
        {repo.description && <p style={{ color: "#6b7280", fontSize: 12, margin: "8px 0 0" }}>{repo.description}</p>}
      </div>

      {/* TABS */}
      <div style={{ background: "#0f0f23", borderBottom: "1px solid #2d2d5e", display: "flex", padding: "0 24px", gap: 4, overflowX: "auto" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ background: "none", border: "none", borderBottom: tab === t.id ? "2px solid #6366f1" : "2px solid transparent", color: tab === t.id ? "#c9d1ff" : "#6b7280", cursor: "pointer", padding: "12px 14px", fontSize: 12, fontFamily: "inherit", whiteSpace: "nowrap" }}>{t.label}</button>
        ))}
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px" }}>
        {tab === "files" && <FileBrowser token={token} repo={repo} notify={notify} />}
        {tab === "commits" && <Commits token={token} repo={repo} notify={notify} />}
        {tab === "issues" && <Issues token={token} repo={repo} notify={notify} />}
        {tab === "prs" && <PullRequests token={token} repo={repo} notify={notify} />}
        {tab === "branches" && <Branches token={token} repo={repo} notify={notify} />}
        {tab === "actions" && <Actions token={token} repo={repo} notify={notify} />}
        {tab === "releases" && <Releases token={token} repo={repo} notify={notify} />}
        {tab === "labels" && <Labels token={token} repo={repo} notify={notify} />}
        {tab === "settings" && <Settings token={token} repo={repo} notify={notify} onRepoUpdate={setRepo} onDelete={onBack} />}
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

// ── FILE BROWSER ─────────────────────────────────────────────────────────────
const FileBrowser = ({ token, repo, notify }) => {
  const [path, setPath] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [commitMsg, setCommitMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newFile, setNewFile] = useState({ name: "", content: "", message: "Add file" });
  const [creating, setCreating] = useState(false);
  const [branch, setBranch] = useState(repo.default_branch || "main");
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    fetcher(token, `/repos/${repo.full_name}/branches?per_page=100`).then(b => setBranches(b || [])).catch(() => {});
  }, [token, repo]);

  useEffect(() => { loadPath(); }, [path, branch]);

  const loadPath = async () => {
    setLoading(true);
    try {
      const url = `/repos/${repo.full_name}/contents/${path}?ref=${branch}`;
      const data = await fetcher(token, url);
      const arr = Array.isArray(data) ? data : [data];
      setItems(arr.sort((a, b) => {
        if (a.type === "dir" && b.type !== "dir") return -1;
        if (a.type !== "dir" && b.type === "dir") return 1;
        return a.name.localeCompare(b.name);
      }));
    } catch (e) { notify(e.message, "error"); setItems([]); }
    finally { setLoading(false); }
  };

  const viewFile = async (item) => {
    if (item.type === "dir") { setPath(item.path); return; }
    try {
      const data = await fetcher(token, `/repos/${repo.full_name}/contents/${item.path}?ref=${branch}`);
      const content = atob(data.content.replace(/\n/g, ""));
      setViewing({ ...item, decoded: content, sha: data.sha });
    } catch (e) { notify(e.message, "error"); }
  };

  const startEdit = () => { setEditContent(viewing.decoded); setCommitMsg(`Update ${viewing.name}`); setEditing(viewing); setViewing(null); };

  const saveEdit = async () => {
    setSaving(true);
    try {
      const encoded = btoa(unescape(encodeURIComponent(editContent)));
      await fetcher(token, `/repos/${repo.full_name}/contents/${editing.path}`, { method: "PUT", body: JSON.stringify({ message: commitMsg, content: encoded, sha: editing.sha, branch }) });
      notify("File saved & committed!", "success");
      setEditing(null);
      loadPath();
    } catch (e) { notify(e.message, "error"); }
    finally { setSaving(false); }
  };

  const deleteFile = async (item, e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete ${item.name}?`)) return;
    try {
      const data = await fetcher(token, `/repos/${repo.full_name}/contents/${item.path}?ref=${branch}`);
      await fetcher(token, `/repos/${repo.full_name}/contents/${item.path}`, { method: "DELETE", body: JSON.stringify({ message: `Delete ${item.name}`, sha: data.sha, branch }) });
      notify("File deleted", "success");
      loadPath();
    } catch (e) { notify(e.message, "error"); }
  };

  const createFile = async () => {
    if (!newFile.name.trim()) return;
    setCreating(true);
    try {
      const filePath = path ? `${path}/${newFile.name}` : newFile.name;
      const encoded = btoa(unescape(encodeURIComponent(newFile.content)));
      await fetcher(token, `/repos/${repo.full_name}/contents/${filePath}`, { method: "PUT", body: JSON.stringify({ message: newFile.message, content: encoded, branch }) });
      notify("File created!", "success");
      setShowCreate(false);
      setNewFile({ name: "", content: "", message: "Add file" });
      loadPath();
    } catch (e) { notify(e.message, "error"); }
    finally { setCreating(false); }
  };

  const downloadFile = (item) => { window.open(item.download_url, "_blank"); };

  const breadcrumbs = ["root", ...path.split("/").filter(Boolean)];
  const fileIcon = (item) => {
    if (item.type === "dir") return "📁";
    const ext = item.name.split(".").pop().toLowerCase();
    const icons = { js: "🟨", ts: "🔷", jsx: "⚛️", tsx: "⚛️", py: "🐍", md: "📝", json: "📋", html: "🌐", css: "🎨", sh: "⚙️", yml: "⚙️", yaml: "⚙️", gitignore: "🚫", rs: "🦀", go: "🐹", java: "☕", php: "🐘", rb: "💎", sql: "🗃️", env: "🔐" };
    return icons[ext] || "📄";
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, flexWrap: "wrap" }}>
          {breadcrumbs.map((crumb, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {i > 0 && <span style={{ color: "#4b5563" }}>/</span>}
              <button onClick={() => setPath(breadcrumbs.slice(1, i + 1).join("/"))} style={{ background: "none", border: "none", color: i === breadcrumbs.length - 1 ? "#c9d1ff" : "#6366f1", cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: i === breadcrumbs.length - 1 ? 600 : 400 }}>{crumb}</button>
            </span>
          ))}
        </div>
        <select value={branch} onChange={(e) => setBranch(e.target.value)} style={{ background: "#1a1a3e", border: "1px solid #3d3d7a", borderRadius: 6, color: "#8b9dc3", padding: "6px 10px", fontSize: 12, outline: "none" }}>
          {branches.map(b => <option key={b.name}>{b.name}</option>)}
        </select>
        <Btn onClick={() => setShowCreate(true)} style={{ fontSize: 12 }}>＋ New file</Btn>
        <Btn variant="secondary" onClick={loadPath} style={{ fontSize: 12, padding: "6px 10px" }}>↻</Btn>
      </div>

      {loading ? <div style={{ textAlign: "center", padding: 40 }}><Spinner /></div> : (
        <div style={{ background: "#0f0f23", border: "1px solid #2d2d5e", borderRadius: 10, overflow: "hidden" }}>
          {path && <div onClick={() => setPath(path.split("/").slice(0, -1).join("/"))} style={{ padding: "10px 16px", borderBottom: "1px solid #2d2d5e", cursor: "pointer", color: "#6366f1", fontSize: 13 }}>← ..</div>}
          {items.map((item, i) => (
            <div key={item.sha + i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderBottom: i < items.length - 1 ? "1px solid #1a1a3e" : "none", cursor: "pointer", transition: "background 0.15s" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#1a1a3e"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
              <span>{fileIcon(item)}</span>
              <span onClick={() => viewFile(item)} style={{ flex: 1, color: item.type === "dir" ? "#6366f1" : "#c9d1ff", fontSize: 13 }}>{item.name}</span>
              <span style={{ color: "#4b5563", fontSize: 11 }}>{item.size ? `${(item.size / 1024).toFixed(1)} KB` : ""}</span>
              {item.type === "file" && <>
                <button onClick={() => downloadFile(item)} title="Download" style={{ background: "none", border: "none", color: "#4b5563", cursor: "pointer", fontSize: 13 }}>⬇</button>
                <button onClick={(e) => deleteFile(item, e)} title="Delete" style={{ background: "none", border: "none", color: "#4b5563", cursor: "pointer", fontSize: 13 }}>🗑</button>
              </>}
            </div>
          ))}
          {items.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "#4b5563", fontSize: 13 }}>This directory is empty</div>}
        </div>
      )}

      {viewing && (
        <Modal title={viewing.name} onClose={() => setViewing(null)} width={800}>
          <div style={{ background: "#080818", borderRadius: 8, padding: 16, marginBottom: 14, overflowX: "auto" }}>
            <pre style={{ color: "#e2e8f0", fontSize: 12, margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-all", maxHeight: 450, overflowY: "auto", lineHeight: 1.7 }}>{viewing.decoded}</pre>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <a href={viewing.download_url} target="_blank" rel="noreferrer" style={{ color: "#6366f1", fontSize: 13, textDecoration: "none" }}>⬇ Download</a>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn variant="secondary" onClick={() => setViewing(null)}>Close</Btn>
              <Btn onClick={startEdit}>✏️ Edit</Btn>
            </div>
          </div>
        </Modal>
      )}

      {editing && (
        <Modal title={`Editing: ${editing.name}`} onClose={() => setEditing(null)} width={800}>
          <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} style={{ width: "100%", background: "#080818", border: "1px solid #3d3d7a", borderRadius: 8, color: "#e2e8f0", padding: 14, fontSize: 12, fontFamily: "monospace", boxSizing: "border-box", minHeight: 380, resize: "vertical", outline: "none" }} />
          <Inp label="Commit message" value={commitMsg} onChange={(e) => setCommitMsg(e.target.value)} style={{ marginTop: 12 }} />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <Btn variant="secondary" onClick={() => setEditing(null)}>Cancel</Btn>
            <Btn onClick={saveEdit} disabled={saving}>{saving ? <Spinner /> : "💾 Save & commit"}</Btn>
          </div>
        </Modal>
      )}

      {showCreate && (
        <Modal title="Create new file" onClose={() => setShowCreate(false)}>
          <Inp label="File name" value={newFile.name} onChange={(e) => setNewFile(p => ({ ...p, name: e.target.value }))} placeholder="README.md" />
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, color: "#8b9dc3", marginBottom: 6 }}>Content</label>
            <textarea value={newFile.content} onChange={(e) => setNewFile(p => ({ ...p, content: e.target.value }))} placeholder="File content here…" style={{ width: "100%", background: "#1a1a3e", border: "1px solid #3d3d7a", borderRadius: 6, color: "#e2e8f0", padding: "8px 12px", fontSize: 12, fontFamily: "monospace", boxSizing: "border-box", minHeight: 160, resize: "vertical", outline: "none" }} />
          </div>
          <Inp label="Commit message" value={newFile.message} onChange={(e) => setNewFile(p => ({ ...p, message: e.target.value }))} />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <Btn variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Btn>
            <Btn onClick={createFile} disabled={creating}>{creating ? <Spinner /> : "Create & commit"}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ── COMMITS ──────────────────────────────────────────────────────────────────
const Commits = ({ token, repo, notify }) => {
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [branch, setBranch] = useState(repo.default_branch || "main");
  const [branches, setBranches] = useState([]);
  const [selected, setSelected] = useState(null);
  const [diff, setDiff] = useState(null);
  const [diffLoading, setDiffLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetcher(token, `/repos/${repo.full_name}/branches?per_page=100`).then(b => setBranches(b || [])).catch(() => {});
  }, [token, repo]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ sha: branch, per_page: 50, page });
      if (search) params.set("q", search);
      const data = await fetcher(token, `/repos/${repo.full_name}/commits?${params}`);
      setCommits(data || []);
    } catch (e) { notify(e.message, "error"); }
    finally { setLoading(false); }
  }, [token, repo, branch, page]);

  useEffect(() => { load(); }, [load]);

  const openCommit = async (commit) => {
    setSelected(commit);
    setDiff(null);
    setDiffLoading(true);
    try {
      const data = await fetcher(token, `/repos/${repo.full_name}/commits/${commit.sha}`);
      setDiff(data);
    } catch (e) { notify(e.message, "error"); }
    finally { setDiffLoading(false); }
  };

  const diffColor = (line) => {
    if (line.startsWith("+") && !line.startsWith("+++")) return "#14532d";
    if (line.startsWith("-") && !line.startsWith("---")) return "#7f1d1d";
    if (line.startsWith("@@")) return "#1e3a5f";
    return "transparent";
  };

  const diffTextColor = (line) => {
    if (line.startsWith("+") && !line.startsWith("+++")) return "#86efac";
    if (line.startsWith("-") && !line.startsWith("---")) return "#fca5a5";
    if (line.startsWith("@@")) return "#93c5fd";
    return "#c9d1ff";
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <select value={branch} onChange={(e) => { setBranch(e.target.value); setPage(1); }} style={{ background: "#1a1a3e", border: "1px solid #3d3d7a", borderRadius: 6, color: "#8b9dc3", padding: "8px 10px", fontSize: 13, outline: "none" }}>
          {branches.map(b => <option key={b.name}>{b.name}</option>)}
        </select>
        <input placeholder="🔍 Filter commits…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1, background: "#1a1a3e", border: "1px solid #3d3d7a", borderRadius: 6, color: "#e2e8f0", padding: "8px 14px", fontSize: 13, outline: "none" }} />
        <Btn variant="secondary" onClick={load} style={{ padding: "7px 12px" }}>↻</Btn>
      </div>

      {loading ? <div style={{ textAlign: "center", padding: 40 }}><Spinner /></div> : (
        <div style={{ background: "#0f0f23", border: "1px solid #2d2d5e", borderRadius: 10, overflow: "hidden" }}>
          {commits.filter(c => !search || c.commit.message.toLowerCase().includes(search.toLowerCase()) || c.author?.login?.toLowerCase().includes(search.toLowerCase())).map((commit, i) => (
            <div key={commit.sha} onClick={() => openCommit(commit)} style={{ padding: "12px 16px", borderBottom: i < commits.length - 1 ? "1px solid #1a1a3e" : "none", cursor: "pointer", transition: "background 0.15s" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#1a1a3e"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                {commit.author?.avatar_url && <img src={commit.author.avatar_url} alt="" style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0 }} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: "#c9d1ff", fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{commit.commit.message.split("\n")[0]}</div>
                  <div style={{ color: "#6b7280", fontSize: 12, marginTop: 4 }}>
                    <span style={{ color: "#8b9dc3" }}>{commit.author?.login || commit.commit.author.name}</span>
                    <span style={{ margin: "0 8px" }}>·</span>
                    {fmtTime(commit.commit.author.date)}
                  </div>
                </div>
                <span style={{ color: "#6366f1", fontSize: 11, fontFamily: "monospace", flexShrink: 0 }}>{commit.sha.slice(0, 7)}</span>
              </div>
            </div>
          ))}
          {commits.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "#4b5563" }}>No commits found</div>}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "center" }}>
        <Btn variant="secondary" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</Btn>
        <span style={{ color: "#6b7280", padding: "7px 12px", fontSize: 13 }}>Page {page}</span>
        <Btn variant="secondary" onClick={() => setPage(p => p + 1)} disabled={commits.length < 50}>Next →</Btn>
      </div>

      {selected && (
        <Modal title={`Commit ${selected.sha.slice(0, 7)}`} onClose={() => { setSelected(null); setDiff(null); }} width={900}>
          {diffLoading ? <div style={{ textAlign: "center", padding: 40 }}><Spinner /></div> : diff ? (
            <>
              <div style={{ background: "#1a1a3e", borderRadius: 8, padding: 14, marginBottom: 14 }}>
                <div style={{ color: "#c9d1ff", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{diff.commit.message}</div>
                <div style={{ color: "#6b7280", fontSize: 12 }}>
                  {diff.commit.author.name} · {fmtTime(diff.commit.author.date)}
                  {diff.stats && <span style={{ marginLeft: 16 }}><span style={{ color: "#22c55e" }}>+{diff.stats.additions}</span> <span style={{ color: "#ef4444" }}>-{diff.stats.deletions}</span> in {diff.stats.total} changes across {diff.files?.length} files</span>}
                </div>
              </div>
              {diff.files?.map((file, fi) => (
                <div key={fi} style={{ marginBottom: 16, border: "1px solid #2d2d5e", borderRadius: 8, overflow: "hidden" }}>
                  <div style={{ background: "#1a1a3e", padding: "8px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#c9d1ff", fontSize: 12, fontFamily: "monospace" }}>{file.filename}</span>
                    <span style={{ fontSize: 11 }}><span style={{ color: "#22c55e" }}>+{file.additions}</span> <span style={{ color: "#ef4444" }}>-{file.deletions}</span></span>
                  </div>
                  {file.patch && (
                    <pre style={{ margin: 0, padding: "8px 0", fontSize: 11, fontFamily: "monospace", maxHeight: 300, overflowY: "auto", lineHeight: 1.6 }}>
                      {file.patch.split("\n").map((line, li) => (
                        <div key={li} style={{ background: diffColor(line), padding: "0 14px", color: diffTextColor(line) }}>{line}</div>
                      ))}
                    </pre>
                  )}
                </div>
              ))}
            </>
          ) : null}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <a href={selected.html_url} target="_blank" rel="noreferrer" style={{ color: "#6366f1", fontSize: 13, textDecoration: "none" }}>View on GitHub ↗</a>
            <Btn variant="secondary" onClick={() => { setSelected(null); setDiff(null); }}>Close</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ── ISSUES ───────────────────────────────────────────────────────────────────
const Issues = ({ token, repo, notify }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState("open");
  const [showCreate, setShowCreate] = useState(false);
  const [newIssue, setNewIssue] = useState({ title: "", body: "", labels: "", assignees: "" });
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState(null);
  const [comment, setComment] = useState("");
  const [commenting, setCommenting] = useState(false);
  const [comments, setComments] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    fetcher(token, `/repos/${repo.full_name}/labels?per_page=100`).then(d => setLabels(d || [])).catch(() => {});
  }, [token, repo]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetcher(token, `/repos/${repo.full_name}/issues?state=${state}&per_page=50`);
      setIssues((data || []).filter(i => !i.pull_request));
    } catch (e) { notify(e.message, "error"); }
    finally { setLoading(false); }
  }, [token, repo, state]);

  useEffect(() => { load(); }, [load]);

  const openIssue = async (issue) => {
    setSelected(issue);
    try {
      const data = await fetcher(token, `/repos/${repo.full_name}/issues/${issue.number}/comments`);
      setComments(data || []);
    } catch (e) { setComments([]); }
  };

  const createIssue = async () => {
    if (!newIssue.title.trim()) return;
    setCreating(true);
    try {
      const labels = newIssue.labels.split(",").map(l => l.trim()).filter(Boolean);
      const assignees = newIssue.assignees.split(",").map(a => a.trim()).filter(Boolean);
      await fetcher(token, `/repos/${repo.full_name}/issues`, { method: "POST", body: JSON.stringify({ title: newIssue.title, body: newIssue.body, labels, assignees }) });
      notify("Issue created!", "success");
      setShowCreate(false);
      setNewIssue({ title: "", body: "", labels: "", assignees: "" });
      load();
    } catch (e) { notify(e.message, "error"); }
    finally { setCreating(false); }
  };

  const toggleIssue = async (issue) => {
    try {
      const newState = issue.state === "open" ? "closed" : "open";
      await fetcher(token, `/repos/${repo.full_name}/issues/${issue.number}`, { method: "PATCH", body: JSON.stringify({ state: newState }) });
      notify(`Issue ${newState === "open" ? "reopened" : "closed"}`, "success");
      load();
      setSelected(null);
    } catch (e) { notify(e.message, "error"); }
  };

  const addComment = async () => {
    if (!comment.trim()) return;
    setCommenting(true);
    try {
      await fetcher(token, `/repos/${repo.full_name}/issues/${selected.number}/comments`, { method: "POST", body: JSON.stringify({ body: comment }) });
      notify("Comment added!", "success");
      setComment("");
      const data = await fetcher(token, `/repos/${repo.full_name}/issues/${selected.number}/comments`);
      setComments(data || []);
    } catch (e) { notify(e.message, "error"); }
    finally { setCommenting(false); }
  };

  const deleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await fetcher(token, `/repos/${repo.full_name}/issues/comments/${commentId}`, { method: "DELETE" });
      setComments(prev => prev.filter(c => c.id !== commentId));
      notify("Comment deleted", "success");
    } catch (e) { notify(e.message, "error"); }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <div style={{ background: "#0f0f23", border: "1px solid #2d2d5e", borderRadius: 6, display: "flex" }}>
          {["open", "closed", "all"].map(s => (
            <button key={s} onClick={() => setState(s)} style={{ background: state === s ? "#4f46e5" : "none", border: "none", color: state === s ? "#fff" : "#6b7280", padding: "7px 14px", cursor: "pointer", fontSize: 12, fontFamily: "inherit", borderRadius: 6, textTransform: "capitalize" }}>{s}</button>
          ))}
        </div>
        <Btn onClick={() => setShowCreate(true)} style={{ marginLeft: "auto" }}>＋ New issue</Btn>
        <Btn variant="secondary" onClick={load} style={{ padding: "7px 12px" }}>↻</Btn>
      </div>

      {loading ? <div style={{ textAlign: "center", padding: 40 }}><Spinner /></div> : (
        <div style={{ background: "#0f0f23", border: "1px solid #2d2d5e", borderRadius: 10, overflow: "hidden" }}>
          {issues.map((issue, i) => (
            <div key={issue.id} onClick={() => openIssue(issue)} style={{ padding: "14px 16px", borderBottom: i < issues.length - 1 ? "1px solid #1a1a3e" : "none", cursor: "pointer", transition: "background 0.15s" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#1a1a3e"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{issue.state === "open" ? "🟢" : "🔴"}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#c9d1ff", fontWeight: 600, fontSize: 13, marginBottom: 4 }}>
                    {issue.title}
                    {issue.labels?.map(l => <span key={l.id} style={{ marginLeft: 6, background: `#${l.color}33`, color: `#${l.color}`, border: `1px solid #${l.color}66`, borderRadius: 20, padding: "1px 7px", fontSize: 10, fontWeight: 600 }}>{l.name}</span>)}
                  </div>
                  <div style={{ color: "#6b7280", fontSize: 12 }}>
                    #{issue.number} by {issue.user?.login} · {fmt(issue.created_at)}
                    {issue.assignees?.length > 0 && <span> · assigned to {issue.assignees.map(a => a.login).join(", ")}</span>}
                    {issue.comments > 0 && <span> · 💬 {issue.comments}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {issues.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "#4b5563", fontSize: 13 }}>No {state} issues</div>}
        </div>
      )}

      {selected && (
        <Modal title={`#${selected.number}: ${selected.title}`} onClose={() => setSelected(null)} width={720}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            <Badge color={selected.state === "open" ? "#22c55e" : "#ef4444"}>{selected.state}</Badge>
            {selected.labels?.map(l => <span key={l.id} style={{ background: `#${l.color}33`, color: `#${l.color}`, border: `1px solid #${l.color}66`, borderRadius: 20, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>{l.name}</span>)}
          </div>
          <div style={{ background: "#1a1a3e", borderRadius: 8, padding: 14, fontSize: 13, color: "#c9d1ff", lineHeight: 1.7, whiteSpace: "pre-wrap", marginBottom: 14, minHeight: 40 }}>
            {selected.body || <em style={{ color: "#4b5563" }}>No description</em>}
          </div>
          {comments.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: "#8b9dc3", fontSize: 12, marginBottom: 10 }}>💬 {comments.length} comment{comments.length !== 1 ? "s" : ""}</div>
              {comments.map(c => (
                <div key={c.id} style={{ background: "#0f0f23", border: "1px solid #2d2d5e", borderRadius: 8, padding: 12, marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <img src={c.user.avatar_url} alt="" style={{ width: 22, height: 22, borderRadius: "50%" }} />
                      <span style={{ color: "#8b9dc3", fontSize: 12, fontWeight: 600 }}>{c.user.login}</span>
                      <span style={{ color: "#4b5563", fontSize: 11 }}>{fmtTime(c.created_at)}</span>
                    </div>
                    <button onClick={() => deleteComment(c.id)} style={{ background: "none", border: "none", color: "#4b5563", cursor: "pointer", fontSize: 12 }}>🗑</button>
                  </div>
                  <div style={{ color: "#c9d1ff", fontSize: 12, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{c.body}</div>
                </div>
              ))}
            </div>
          )}
          <Textarea label="Add comment" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Leave a comment…" style={{ minHeight: 80 }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Btn variant={selected.state === "open" ? "danger" : "success"} onClick={() => toggleIssue(selected)}>
              {selected.state === "open" ? "✕ Close issue" : "✓ Reopen issue"}
            </Btn>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn variant="secondary" onClick={() => setSelected(null)}>Close</Btn>
              <Btn onClick={addComment} disabled={commenting}>{commenting ? <Spinner /> : "💬 Comment"}</Btn>
            </div>
          </div>
        </Modal>
      )}

      {showCreate && (
        <Modal title="Create new issue" onClose={() => setShowCreate(false)}>
          <Inp label="Title *" value={newIssue.title} onChange={(e) => setNewIssue(p => ({ ...p, title: e.target.value }))} placeholder="Issue title" />
          <Textarea label="Description" value={newIssue.body} onChange={(e) => setNewIssue(p => ({ ...p, body: e.target.value }))} placeholder="Describe the issue…" style={{ minHeight: 120 }} />
          <Inp label="Labels (comma-separated)" value={newIssue.labels} onChange={(e) => setNewIssue(p => ({ ...p, labels: e.target.value }))} placeholder="bug, enhancement, help wanted" />
          <Inp label="Assignees (comma-separated usernames)" value={newIssue.assignees} onChange={(e) => setNewIssue(p => ({ ...p, assignees: e.target.value }))} placeholder="username1, username2" />
          {labels.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: "#8b9dc3", marginBottom: 8 }}>Available labels:</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {labels.map(l => (
                  <span key={l.id} onClick={() => setNewIssue(p => ({ ...p, labels: p.labels ? `${p.labels}, ${l.name}` : l.name }))} style={{ background: `#${l.color}33`, color: `#${l.color}`, border: `1px solid #${l.color}66`, borderRadius: 20, padding: "2px 8px", fontSize: 11, cursor: "pointer" }}>{l.name}</span>
                ))}
              </div>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <Btn variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Btn>
            <Btn onClick={createIssue} disabled={creating}>{creating ? <Spinner /> : "Create issue"}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ── PULL REQUESTS ─────────────────────────────────────────────────────────────
const PullRequests = ({ token, repo, notify }) => {
  const [prs, setPrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState("open");
  const [selected, setSelected] = useState(null);
  const [merging, setMerging] = useState(false);
  const [mergeMethod, setMergeMethod] = useState("merge");
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [commenting, setCommenting] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [branches, setBranches] = useState([]);
  const [newPR, setNewPR] = useState({ title: "", body: "", head: "", base: repo.default_branch || "main" });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetcher(token, `/repos/${repo.full_name}/branches?per_page=100`).then(b => setBranches(b || [])).catch(() => {});
  }, [token, repo]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetcher(token, `/repos/${repo.full_name}/pulls?state=${state}&per_page=50`);
      setPrs(data || []);
    } catch (e) { notify(e.message, "error"); }
    finally { setLoading(false); }
  }, [token, repo, state]);

  useEffect(() => { load(); }, [load]);

  const openPR = async (pr) => {
    setSelected(pr);
    try {
      const data = await fetcher(token, `/repos/${repo.full_name}/issues/${pr.number}/comments`);
      setComments(data || []);
    } catch (e) { setComments([]); }
  };

  const mergePR = async () => {
    if (!window.confirm(`Merge PR #${selected.number} using "${mergeMethod}"?`)) return;
    setMerging(true);
    try {
      await fetcher(token, `/repos/${repo.full_name}/pulls/${selected.number}/merge`, { method: "PUT", body: JSON.stringify({ merge_method: mergeMethod }) });
      notify("PR merged!", "success");
      setSelected(null);
      load();
    } catch (e) { notify(e.message, "error"); }
    finally { setMerging(false); }
  };

  const closePR = async (pr) => {
    try {
      await fetcher(token, `/repos/${repo.full_name}/pulls/${pr.number}`, { method: "PATCH", body: JSON.stringify({ state: pr.state === "open" ? "closed" : "open" }) });
      notify(`PR ${pr.state === "open" ? "closed" : "reopened"}`, "success");
      setSelected(null);
      load();
    } catch (e) { notify(e.message, "error"); }
  };

  const addComment = async () => {
    if (!comment.trim()) return;
    setCommenting(true);
    try {
      await fetcher(token, `/repos/${repo.full_name}/issues/${selected.number}/comments`, { method: "POST", body: JSON.stringify({ body: comment }) });
      notify("Comment added!", "success");
      setComment("");
      const data = await fetcher(token, `/repos/${repo.full_name}/issues/${selected.number}/comments`);
      setComments(data || []);
    } catch (e) { notify(e.message, "error"); }
    finally { setCommenting(false); }
  };

  const createPR = async () => {
    if (!newPR.title.trim() || !newPR.head) return;
    setCreating(true);
    try {
      await fetcher(token, `/repos/${repo.full_name}/pulls`, { method: "POST", body: JSON.stringify(newPR) });
      notify("Pull request created!", "success");
      setShowCreate(false);
      setNewPR({ title: "", body: "", head: "", base: repo.default_branch || "main" });
      load();
    } catch (e) { notify(e.message, "error"); }
    finally { setCreating(false); }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <div style={{ background: "#0f0f23", border: "1px solid #2d2d5e", borderRadius: 6, display: "flex" }}>
          {["open", "closed", "all"].map(s => (
            <button key={s} onClick={() => setState(s)} style={{ background: state === s ? "#4f46e5" : "none", border: "none", color: state === s ? "#fff" : "#6b7280", padding: "7px 14px", cursor: "pointer", fontSize: 12, fontFamily: "inherit", borderRadius: 6, textTransform: "capitalize" }}>{s}</button>
          ))}
        </div>
        <Btn onClick={() => setShowCreate(true)} style={{ marginLeft: "auto" }}>＋ New PR</Btn>
        <Btn variant="secondary" onClick={load} style={{ padding: "7px 12px" }}>↻</Btn>
      </div>

      {loading ? <div style={{ textAlign: "center", padding: 40 }}><Spinner /></div> : (
        <div style={{ background: "#0f0f23", border: "1px solid #2d2d5e", borderRadius: 10, overflow: "hidden" }}>
          {prs.map((pr, i) => (
            <div key={pr.id} onClick={() => openPR(pr)} style={{ padding: "14px 16px", borderBottom: i < prs.length - 1 ? "1px solid #1a1a3e" : "none", cursor: "pointer", transition: "background 0.15s" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#1a1a3e"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{pr.state === "open" ? "🟢" : pr.merged_at ? "🟣" : "🔴"}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#c9d1ff", fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{pr.title}</div>
                  <div style={{ color: "#6b7280", fontSize: 12 }}>
                    #{pr.number} by {pr.user?.login} · {fmt(pr.created_at)}
                    <span style={{ margin: "0 8px", color: "#4b5563" }}>·</span>
                    <span style={{ color: "#22c55e" }}>+{pr.additions || 0}</span> <span style={{ color: "#ef4444" }}>−{pr.deletions || 0}</span>
                    <span style={{ margin: "0 6px", color: "#4b5563" }}>·</span>
                    <span style={{ color: "#6366f1" }}>{pr.head?.ref}</span> → <span style={{ color: "#8b9dc3" }}>{pr.base?.ref}</span>
                    {pr.comments > 0 && <span style={{ marginLeft: 8 }}>· 💬 {pr.comments}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {prs.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "#4b5563", fontSize: 13 }}>No {state} pull requests</div>}
        </div>
      )}

      {selected && (
        <Modal title={`PR #${selected.number}: ${selected.title}`} onClose={() => setSelected(null)} width={780}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            <Badge color={selected.state === "open" ? "#22c55e" : selected.merged_at ? "#8b5cf6" : "#ef4444"}>{selected.merged_at ? "merged" : selected.state}</Badge>
            <span style={{ color: "#8b9dc3", fontSize: 12 }}><span style={{ color: "#6366f1" }}>{selected.head?.ref}</span> → {selected.base?.ref}</span>
          </div>
          <div style={{ background: "#1a1a3e", borderRadius: 8, padding: 14, fontSize: 13, color: "#c9d1ff", lineHeight: 1.7, whiteSpace: "pre-wrap", marginBottom: 14, minHeight: 40 }}>
            {selected.body || <em style={{ color: "#4b5563" }}>No description</em>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
            {[{ label: "Commits", value: selected.commits }, { label: "Files changed", value: selected.changed_files }, { label: "Additions", value: `+${selected.additions || 0}` }, { label: "Deletions", value: `-${selected.deletions || 0}` }].map(s => (
              <div key={s.label} style={{ background: "#080818", borderRadius: 8, padding: "10px 14px", textAlign: "center" }}>
                <div style={{ color: "#6366f1", fontWeight: 700, fontSize: 16 }}>{s.value ?? "—"}</div>
                <div style={{ color: "#6b7280", fontSize: 11 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {comments.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: "#8b9dc3", fontSize: 12, marginBottom: 10 }}>💬 {comments.length} comment{comments.length !== 1 ? "s" : ""}</div>
              {comments.map(c => (
                <div key={c.id} style={{ background: "#0f0f23", border: "1px solid #2d2d5e", borderRadius: 8, padding: 12, marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <img src={c.user.avatar_url} alt="" style={{ width: 22, height: 22, borderRadius: "50%" }} />
                    <span style={{ color: "#8b9dc3", fontSize: 12, fontWeight: 600 }}>{c.user.login}</span>
                    <span style={{ color: "#4b5563", fontSize: 11 }}>{fmtTime(c.created_at)}</span>
                  </div>
                  <div style={{ color: "#c9d1ff", fontSize: 12, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{c.body}</div>
                </div>
              ))}
            </div>
          )}

          <Textarea label="Add comment" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Leave a comment…" style={{ minHeight: 70 }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <a href={selected.html_url} target="_blank" rel="noreferrer" style={{ color: "#6366f1", fontSize: 13, textDecoration: "none" }}>View on GitHub ↗</a>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Btn variant="secondary" onClick={() => setSelected(null)}>Close</Btn>
              <Btn onClick={addComment} disabled={commenting}>{commenting ? <Spinner /> : "💬 Comment"}</Btn>
              {selected.state === "open" && <Btn variant="secondary" onClick={() => closePR(selected)}>✕ Close PR</Btn>}
              {selected.state === "open" && !selected.merged_at && (
                <div style={{ display: "flex", gap: 0 }}>
                  <select value={mergeMethod} onChange={(e) => setMergeMethod(e.target.value)} style={{ background: "#4c1d95", border: "1px solid #5b21b6", borderRight: "none", borderRadius: "6px 0 0 6px", color: "#c4b5fd", padding: "7px 10px", fontSize: 12, outline: "none", cursor: "pointer" }}>
                    <option value="merge">Merge commit</option>
                    <option value="squash">Squash & merge</option>
                    <option value="rebase">Rebase & merge</option>
                  </select>
                  <Btn variant="purple" onClick={mergePR} disabled={merging} style={{ borderRadius: "0 6px 6px 0" }}>{merging ? <Spinner /> : "🟣 Merge"}</Btn>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {showCreate && (
        <Modal title="Create pull request" onClose={() => setShowCreate(false)}>
          <Inp label="Title *" value={newPR.title} onChange={(e) => setNewPR(p => ({ ...p, title: e.target.value }))} placeholder="PR title" />
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, color: "#8b9dc3", marginBottom: 6 }}>Head branch (source) *</label>
            <select value={newPR.head} onChange={(e) => setNewPR(p => ({ ...p, head: e.target.value }))} style={{ width: "100%", background: "#1a1a3e", border: "1px solid #3d3d7a", borderRadius: 6, color: "#e2e8f0", padding: "8px 12px", fontSize: 13, outline: "none" }}>
              <option value="">Select branch…</option>
              {branches.filter(b => b.name !== newPR.base).map(b => <option key={b.name}>{b.name}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, color: "#8b9dc3", marginBottom: 6 }}>Base branch (target)</label>
            <select value={newPR.base} onChange={(e) => setNewPR(p => ({ ...p, base: e.target.value }))} style={{ width: "100%", background: "#1a1a3e", border: "1px solid #3d3d7a", borderRadius: 6, color: "#e2e8f0", padding: "8px 12px", fontSize: 13, outline: "none" }}>
              {branches.map(b => <option key={b.name}>{b.name}</option>)}
            </select>
          </div>
          <Textarea label="Description" value={newPR.body} onChange={(e) => setNewPR(p => ({ ...p, body: e.target.value }))} placeholder="Describe what this PR does…" style={{ minHeight: 100 }} />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <Btn variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Btn>
            <Btn onClick={createPR} disabled={creating}>{creating ? <Spinner /> : "Create pull request"}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ── BRANCHES ─────────────────────────────────────────────────────────────────
const Branches = ({ token, repo, notify }) => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newBranch, setNewBranch] = useState({ name: "", from: repo.default_branch || "main" });
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetcher(token, `/repos/${repo.full_name}/branches?per_page=100`);
      setBranches(data || []);
    } catch (e) { notify(e.message, "error"); }
    finally { setLoading(false); }
  }, [token, repo]);

  useEffect(() => { load(); }, [load]);

  const createBranch = async () => {
    if (!newBranch.name.trim()) return;
    setCreating(true);
    try {
      const ref = await fetcher(token, `/repos/${repo.full_name}/git/refs/heads/${newBranch.from}`);
      const sha = ref.object?.sha;
      await fetcher(token, `/repos/${repo.full_name}/git/refs`, { method: "POST", body: JSON.stringify({ ref: `refs/heads/${newBranch.name}`, sha }) });
      notify("Branch created!", "success");
      setShowCreate(false);
      setNewBranch({ name: "", from: repo.default_branch || "main" });
      load();
    } catch (e) { notify(e.message, "error"); }
    finally { setCreating(false); }
  };

  const deleteBranch = async (branch) => {
    if (branch.name === repo.default_branch) { notify("Cannot delete default branch", "error"); return; }
    if (!window.confirm(`Delete branch "${branch.name}"?`)) return;
    try {
      await fetcher(token, `/repos/${repo.full_name}/git/refs/heads/${branch.name}`, { method: "DELETE" });
      notify("Branch deleted", "success");
      load();
    } catch (e) { notify(e.message, "error"); }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginBottom: 16 }}>
        <Btn onClick={() => setShowCreate(true)}>🌿 New branch</Btn>
        <Btn variant="secondary" onClick={load} style={{ padding: "7px 12px" }}>↻</Btn>
      </div>

      {loading ? <div style={{ textAlign: "center", padding: 40 }}><Spinner /></div> : (
        <div style={{ background: "#0f0f23", border: "1px solid #2d2d5e", borderRadius: 10, overflow: "hidden" }}>
          {branches.map((b, i) => (
            <div key={b.name} style={{ padding: "12px 16px", borderBottom: i < branches.length - 1 ? "1px solid #1a1a3e" : "none", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 14 }}>🌿</span>
              <span style={{ flex: 1, color: "#c9d1ff", fontSize: 13, fontWeight: b.name === repo.default_branch ? 700 : 400 }}>{b.name}</span>
              {b.name === repo.default_branch && <Badge color="#22c55e">default</Badge>}
              {b.protected && <Badge color="#f59e0b">protected</Badge>}
              <span style={{ color: "#4b5563", fontSize: 11, fontFamily: "monospace" }}>{b.commit?.sha?.slice(0, 7)}</span>
              {b.name !== repo.default_branch && (
                <button onClick={() => deleteBranch(b)} style={{ background: "none", border: "none", color: "#4b5563", cursor: "pointer", fontSize: 13 }} title="Delete branch">🗑</button>
              )}
            </div>
          ))}
          {branches.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "#4b5563" }}>No branches found</div>}
        </div>
      )}

      {showCreate && (
        <Modal title="Create branch" onClose={() => setShowCreate(false)}>
          <Inp label="Branch name" value={newBranch.name} onChange={(e) => setNewBranch(p => ({ ...p, name: e.target.value }))} placeholder="feature/my-new-feature" />
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, color: "#8b9dc3", marginBottom: 6 }}>Branch from</label>
            <select value={newBranch.from} onChange={(e) => setNewBranch(p => ({ ...p, from: e.target.value }))} style={{ width: "100%", background: "#1a1a3e", border: "1px solid #3d3d7a", borderRadius: 6, color: "#e2e8f0", padding: "8px 12px", fontSize: 13, outline: "none" }}>
              {branches.map(b => <option key={b.name}>{b.name}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <Btn variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Btn>
            <Btn onClick={createBranch} disabled={creating}>{creating ? <Spinner /> : "Create branch"}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ── ACTIONS ──────────────────────────────────────────────────────────────────
const Actions = ({ token, repo, notify }) => {
  const [runs, setRuns] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRun, setSelectedRun] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [workflow, setWorkflow] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [runsData, wfData] = await Promise.all([
        fetcher(token, `/repos/${repo.full_name}/actions/runs?per_page=30`),
        fetcher(token, `/repos/${repo.full_name}/actions/workflows`),
      ]);
      setRuns(runsData?.workflow_runs || []);
      setWorkflows(wfData?.workflows || []);
    } catch (e) { notify(e.message, "error"); }
    finally { setLoading(false); }
  }, [token, repo]);

  useEffect(() => { load(); }, [load]);

  const openRun = async (run) => {
    setSelectedRun(run);
    setJobs([]);
    setJobsLoading(true);
    try {
      const data = await fetcher(token, `/repos/${repo.full_name}/actions/runs/${run.id}/jobs`);
      setJobs(data?.jobs || []);
    } catch (e) { notify(e.message, "error"); }
    finally { setJobsLoading(false); }
  };

  const rerunWorkflow = async (run) => {
    try {
      await fetcher(token, `/repos/${repo.full_name}/actions/runs/${run.id}/rerun`, { method: "POST" });
      notify("Workflow re-triggered!", "success");
      load();
    } catch (e) { notify(e.message, "error"); }
  };

  const cancelRun = async (run) => {
    try {
      await fetcher(token, `/repos/${repo.full_name}/actions/runs/${run.id}/cancel`, { method: "POST" });
      notify("Workflow cancelled", "success");
      load();
    } catch (e) { notify(e.message, "error"); }
  };

  const statusIcon = (status, conclusion) => {
    if (status === "in_progress") return { icon: "⏳", color: "#f59e0b" };
    if (status === "queued") return { icon: "⏸", color: "#6b7280" };
    if (conclusion === "success") return { icon: "✅", color: "#22c55e" };
    if (conclusion === "failure") return { icon: "❌", color: "#ef4444" };
    if (conclusion === "cancelled") return { icon: "⊘", color: "#6b7280" };
    if (conclusion === "skipped") return { icon: "⊝", color: "#6b7280" };
    return { icon: "○", color: "#6b7280" };
  };

  const filtered = workflow === "all" ? runs : runs.filter(r => r.workflow_id === parseInt(workflow));

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <select value={workflow} onChange={(e) => setWorkflow(e.target.value)} style={{ background: "#1a1a3e", border: "1px solid #3d3d7a", borderRadius: 6, color: "#8b9dc3", padding: "8px 10px", fontSize: 13, outline: "none" }}>
          <option value="all">All workflows</option>
          {workflows.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
        <Btn variant="secondary" onClick={load} style={{ marginLeft: "auto", padding: "7px 12px" }}>↻</Btn>
      </div>

      {loading ? <div style={{ textAlign: "center", padding: 40 }}><Spinner /></div> : (
        <div style={{ background: "#0f0f23", border: "1px solid #2d2d5e", borderRadius: 10, overflow: "hidden" }}>
          {filtered.map((run, i) => {
            const { icon, color } = statusIcon(run.status, run.conclusion);
            return (
              <div key={run.id} style={{ padding: "12px 16px", borderBottom: i < filtered.length - 1 ? "1px solid #1a1a3e" : "none", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
                <div style={{ flex: 1, minWidth: 0, cursor: "pointer" }} onClick={() => openRun(run)}>
                  <div style={{ color: "#c9d1ff", fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{run.name || run.display_title}</div>
                  <div style={{ color: "#6b7280", fontSize: 12, marginTop: 3 }}>
                    {run.head_branch} · {run.event} · {fmtTime(run.created_at)}
                    {run.run_number && <span style={{ marginLeft: 8, color: "#4b5563" }}>#{run.run_number}</span>}
                  </div>
                </div>
                <Badge color={color}>{run.conclusion || run.status}</Badge>
                <div style={{ display: "flex", gap: 6 }}>
                  {run.status === "in_progress" && <button onClick={() => cancelRun(run)} title="Cancel" style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 13 }}>⊘</button>}
                  {run.status !== "in_progress" && <button onClick={() => rerunWorkflow(run)} title="Re-run" style={{ background: "none", border: "none", cursor: "pointer", color: "#6366f1", fontSize: 13 }}>↻</button>}
                  <a href={run.html_url} target="_blank" rel="noreferrer" style={{ color: "#4b5563", fontSize: 13, textDecoration: "none" }}>↗</a>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "#4b5563" }}>No workflow runs found</div>}
        </div>
      )}

      {selectedRun && (
        <Modal title={`Run #${selectedRun.run_number}: ${selectedRun.name}`} onClose={() => setSelectedRun(null)} width={720}>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            <Badge color={statusIcon(selectedRun.status, selectedRun.conclusion).color}>{selectedRun.conclusion || selectedRun.status}</Badge>
            <span style={{ color: "#8b9dc3", fontSize: 12 }}>{selectedRun.event} · {selectedRun.head_branch}</span>
          </div>
          {jobsLoading ? <div style={{ textAlign: "center", padding: 30 }}><Spinner /></div> : (
            <div>
              {jobs.map(job => {
                const { icon, color } = statusIcon(job.status, job.conclusion);
                return (
                  <div key={job.id} style={{ background: "#1a1a3e", borderRadius: 8, padding: 12, marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: job.steps?.length ? 10 : 0 }}>
                      <span>{icon}</span>
                      <span style={{ color: "#c9d1ff", fontSize: 13, fontWeight: 600, flex: 1 }}>{job.name}</span>
                      <Badge color={color}>{job.conclusion || job.status}</Badge>
                      {job.runner_name && <span style={{ color: "#6b7280", fontSize: 11 }}>{job.runner_name}</span>}
                    </div>
                    {job.steps?.length > 0 && (
                      <div style={{ marginTop: 8 }}>
                        {job.steps.map(step => {
                          const s = statusIcon(step.status, step.conclusion);
                          return (
                            <div key={step.number} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", borderTop: "1px solid #2d2d5e" }}>
                              <span style={{ fontSize: 12 }}>{s.icon}</span>
                              <span style={{ color: step.conclusion === "success" ? "#6b7280" : "#c9d1ff", fontSize: 12, flex: 1 }}>{step.name}</span>
                              <span style={{ color: "#4b5563", fontSize: 11 }}>
                                {step.completed_at && step.started_at ? `${Math.round((new Date(step.completed_at) - new Date(step.started_at)) / 1000)}s` : ""}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
              {jobs.length === 0 && <div style={{ textAlign: "center", color: "#4b5563", padding: 20 }}>No jobs found</div>}
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <a href={selectedRun.html_url} target="_blank" rel="noreferrer" style={{ color: "#6366f1", fontSize: 13, textDecoration: "none" }}>View full logs ↗</a>
            <Btn variant="secondary" onClick={() => setSelectedRun(null)}>Close</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ── RELEASES ─────────────────────────────────────────────────────────────────
const Releases = ({ token, repo, notify }) => {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newRelease, setNewRelease] = useState({ tag_name: "", name: "", body: "", draft: false, prerelease: false, target_commitish: repo.default_branch || "main" });
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetcher(token, `/repos/${repo.full_name}/releases?per_page=30`);
      setReleases(data || []);
    } catch (e) { notify(e.message, "error"); }
    finally { setLoading(false); }
  }, [token, repo]);

  useEffect(() => { load(); }, [load]);

  const createRelease = async () => {
    if (!newRelease.tag_name.trim()) return;
    setCreating(true);
    try {
      await fetcher(token, `/repos/${repo.full_name}/releases`, { method: "POST", body: JSON.stringify(newRelease) });
      notify("Release created!", "success");
      setShowCreate(false);
      load();
    } catch (e) { notify(e.message, "error"); }
    finally { setCreating(false); }
  };

  const deleteRelease = async (release) => {
    if (!window.confirm(`Delete release ${release.tag_name}?`)) return;
    try {
      await fetcher(token, `/repos/${repo.full_name}/releases/${release.id}`, { method: "DELETE" });
      notify("Release deleted", "success");
      load();
    } catch (e) { notify(e.message, "error"); }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginBottom: 16 }}>
        <Btn onClick={() => setShowCreate(true)}>🏷 New release</Btn>
        <Btn variant="secondary" onClick={load} style={{ padding: "7px 12px" }}>↻</Btn>
      </div>

      {loading ? <div style={{ textAlign: "center", padding: 40 }}><Spinner /></div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {releases.map(r => (
            <div key={r.id} style={{ background: "#0f0f23", border: "1px solid #2d2d5e", borderRadius: 10, padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>🏷</span>
                <span style={{ color: "#c9d1ff", fontWeight: 700, fontSize: 15 }}>{r.tag_name}</span>
                {r.name && <span style={{ color: "#8b9dc3", fontSize: 13 }}>{r.name}</span>}
                {r.draft && <Badge color="#6b7280">draft</Badge>}
                {r.prerelease && <Badge color="#f59e0b">pre-release</Badge>}
                <div style={{ flex: 1 }} />
                <span style={{ color: "#6b7280", fontSize: 12 }}>{fmt(r.published_at)}</span>
                <button onClick={() => deleteRelease(r)} style={{ background: "none", border: "none", color: "#4b5563", cursor: "pointer", fontSize: 13 }}>🗑</button>
                <a href={r.html_url} target="_blank" rel="noreferrer" style={{ color: "#6366f1", fontSize: 12, textDecoration: "none" }}>↗</a>
              </div>
              {r.body && <p style={{ color: "#8b9dc3", fontSize: 12, margin: 0, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{r.body.slice(0, 300)}{r.body.length > 300 ? "…" : ""}</p>}
              {r.assets?.length > 0 && (
                <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {r.assets.map(a => (
                    <a key={a.id} href={a.browser_download_url} target="_blank" rel="noreferrer" style={{ background: "#1a1a3e", color: "#6366f1", border: "1px solid #3d3d7a", borderRadius: 6, padding: "4px 10px", fontSize: 11, textDecoration: "none" }}>
                      ⬇ {a.name} ({(a.size / 1024).toFixed(0)} KB)
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          {releases.length === 0 && <div style={{ textAlign: "center", padding: 60, color: "#4b5563", fontSize: 14 }}>No releases yet</div>}
        </div>
      )}

      {showCreate && (
        <Modal title="Create release" onClose={() => setShowCreate(false)}>
          <Inp label="Tag name *" value={newRelease.tag_name} onChange={(e) => setNewRelease(p => ({ ...p, tag_name: e.target.value }))} placeholder="v1.0.0" />
          <Inp label="Release title" value={newRelease.name} onChange={(e) => setNewRelease(p => ({ ...p, name: e.target.value }))} placeholder="Version 1.0.0" />
          <Inp label="Target branch/commit" value={newRelease.target_commitish} onChange={(e) => setNewRelease(p => ({ ...p, target_commitish: e.target.value }))} />
          <Textarea label="Release notes" value={newRelease.body} onChange={(e) => setNewRelease(p => ({ ...p, body: e.target.value }))} placeholder="What's changed in this release…" style={{ minHeight: 120 }} />
          <div style={{ display: "flex", gap: 20, marginBottom: 16 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#8b9dc3" }}>
              <input type="checkbox" checked={newRelease.draft} onChange={(e) => setNewRelease(p => ({ ...p, draft: e.target.checked }))} /> Draft
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#8b9dc3" }}>
              <input type="checkbox" checked={newRelease.prerelease} onChange={(e) => setNewRelease(p => ({ ...p, prerelease: e.target.checked }))} /> Pre-release
            </label>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <Btn variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Btn>
            <Btn onClick={createRelease} disabled={creating}>{creating ? <Spinner /> : "Create release"}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ── LABELS ───────────────────────────────────────────────────────────────────
const Labels = ({ token, repo, notify }) => {
  const [labelsList, setLabelsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newLabel, setNewLabel] = useState({ name: "", color: "0075ca", description: "" });
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetcher(token, `/repos/${repo.full_name}/labels?per_page=100`);
      setLabelsList(data || []);
    } catch (e) { notify(e.message, "error"); }
    finally { setLoading(false); }
  }, [token, repo]);

  useEffect(() => { load(); }, [load]);

  const createLabel = async () => {
    if (!newLabel.name.trim()) return;
    setCreating(true);
    try {
      await fetcher(token, `/repos/${repo.full_name}/labels`, { method: "POST", body: JSON.stringify({ name: newLabel.name, color: newLabel.color.replace("#", ""), description: newLabel.description }) });
      notify("Label created!", "success");
      setShowCreate(false);
      setNewLabel({ name: "", color: "0075ca", description: "" });
      load();
    } catch (e) { notify(e.message, "error"); }
    finally { setCreating(false); }
  };

  const updateLabel = async () => {
    try {
      await fetcher(token, `/repos/${repo.full_name}/labels/${editing.original_name}`, { method: "PATCH", body: JSON.stringify({ name: editing.name, color: editing.color.replace("#", ""), description: editing.description }) });
      notify("Label updated!", "success");
      setEditing(null);
      load();
    } catch (e) { notify(e.message, "error"); }
  };

  const deleteLabel = async (label) => {
    if (!window.confirm(`Delete label "${label.name}"?`)) return;
    try {
      await fetcher(token, `/repos/${repo.full_name}/labels/${label.name}`, { method: "DELETE" });
      notify("Label deleted", "success");
      load();
    } catch (e) { notify(e.message, "error"); }
  };

  const presets = [
    { name: "bug", color: "d73a4a" }, { name: "enhancement", color: "a2eeef" },
    { name: "good first issue", color: "7057ff" }, { name: "help wanted", color: "008672" },
    { name: "question", color: "d876e3" }, { name: "documentation", color: "0075ca" },
    { name: "wontfix", color: "ffffff" }, { name: "duplicate", color: "cfd3d7" },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ color: "#8b9dc3", fontSize: 13 }}>{labelsList.length} labels</span>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn onClick={() => setShowCreate(true)}>🔖 New label</Btn>
          <Btn variant="secondary" onClick={load} style={{ padding: "7px 12px" }}>↻</Btn>
        </div>
      </div>

      {loading ? <div style={{ textAlign: "center", padding: 40 }}><Spinner /></div> : (
        <div style={{ background: "#0f0f23", border: "1px solid #2d2d5e", borderRadius: 10, overflow: "hidden" }}>
          {labelsList.map((label, i) => (
            <div key={label.id} style={{ padding: "12px 16px", borderBottom: i < labelsList.length - 1 ? "1px solid #1a1a3e" : "none", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ background: `#${label.color}33`, color: `#${label.color}`, border: `1px solid #${label.color}66`, borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 600, minWidth: 80, textAlign: "center" }}>{label.name}</span>
              <span style={{ color: "#6b7280", fontSize: 12, flex: 1 }}>{label.description || ""}</span>
              <span style={{ width: 18, height: 18, borderRadius: "50%", background: `#${label.color}`, border: "1px solid #3d3d7a", display: "inline-block", flexShrink: 0 }} />
              <span style={{ color: "#4b5563", fontSize: 11 }}>#{label.color}</span>
              <button onClick={() => setEditing({ ...label, original_name: label.name, color: `#${label.color}` })} style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", fontSize: 13 }}>✏️</button>
              <button onClick={() => deleteLabel(label)} style={{ background: "none", border: "none", color: "#4b5563", cursor: "pointer", fontSize: 13 }}>🗑</button>
            </div>
          ))}
          {labelsList.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "#4b5563" }}>No labels yet</div>}
        </div>
      )}

      {showCreate && (
        <Modal title="Create label" onClose={() => setShowCreate(false)}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: "#8b9dc3", marginBottom: 8 }}>Presets:</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {presets.map(p => (
                <span key={p.name} onClick={() => setNewLabel(prev => ({ ...prev, name: p.name, color: p.color }))} style={{ background: `#${p.color}33`, color: `#${p.color}`, border: `1px solid #${p.color}66`, borderRadius: 20, padding: "2px 10px", fontSize: 11, cursor: "pointer" }}>{p.name}</span>
              ))}
            </div>
          </div>
          <Inp label="Label name *" value={newLabel.name} onChange={(e) => setNewLabel(p => ({ ...p, name: e.target.value }))} placeholder="e.g. bug" />
          <Inp label="Description" value={newLabel.description} onChange={(e) => setNewLabel(p => ({ ...p, description: e.target.value }))} placeholder="Optional description" />
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, color: "#8b9dc3", marginBottom: 6 }}>Color</label>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input type="color" value={`#${newLabel.color}`} onChange={(e) => setNewLabel(p => ({ ...p, color: e.target.value.replace("#", "") }))} style={{ width: 40, height: 34, borderRadius: 6, border: "1px solid #3d3d7a", cursor: "pointer", background: "none" }} />
              <Inp value={newLabel.color} onChange={(e) => setNewLabel(p => ({ ...p, color: e.target.value.replace("#", "") }))} style={{ marginBottom: 0 }} placeholder="hex color" />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <Btn variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Btn>
            <Btn onClick={createLabel} disabled={creating}>{creating ? <Spinner /> : "Create label"}</Btn>
          </div>
        </Modal>
      )}

      {editing && (
        <Modal title="Edit label" onClose={() => setEditing(null)}>
          <Inp label="Label name *" value={editing.name} onChange={(e) => setEditing(p => ({ ...p, name: e.target.value }))} />
          <Inp label="Description" value={editing.description || ""} onChange={(e) => setEditing(p => ({ ...p, description: e.target.value }))} />
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, color: "#8b9dc3", marginBottom: 6 }}>Color</label>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input type="color" value={editing.color.startsWith("#") ? editing.color : `#${editing.color}`} onChange={(e) => setEditing(p => ({ ...p, color: e.target.value }))} style={{ width: 40, height: 34, borderRadius: 6, border: "1px solid #3d3d7a", cursor: "pointer", background: "none" }} />
              <span style={{ color: "#8b9dc3", fontSize: 13 }}>{editing.color}</span>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <Btn variant="secondary" onClick={() => setEditing(null)}>Cancel</Btn>
            <Btn onClick={updateLabel}>Save changes</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ── SETTINGS ─────────────────────────────────────────────────────────────────
const Settings = ({ token, repo, notify, onRepoUpdate, onDelete }) => {
  const [form, setForm] = useState({
    name: repo.name,
    description: repo.description || "",
    homepage: repo.homepage || "",
    private: repo.private,
    has_issues: repo.has_issues,
    has_wiki: repo.has_wiki,
    has_projects: repo.has_projects,
    allow_squash_merge: repo.allow_squash_merge !== false,
    allow_merge_commit: repo.allow_merge_commit !== false,
    allow_rebase_merge: repo.allow_rebase_merge !== false,
    delete_branch_on_merge: repo.delete_branch_on_merge || false,
  });
  const [saving, setSaving] = useState(false);
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState("");
  const [topiсsLoading, setTopicsLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  useEffect(() => {
    fetcher(token, `/repos/${repo.full_name}/topics`, { headers: { Accept: "application/vnd.github.mercy-preview+json" } })
      .then(d => setTopics(d?.names || []))
      .catch(() => {});
  }, [token, repo]);

  const saveSettings = async () => {
    setSaving(true);
    try {
      const updated = await fetcher(token, `/repos/${repo.full_name}`, { method: "PATCH", body: JSON.stringify(form) });
      notify("Repository settings saved!", "success");
      onRepoUpdate(updated);
    } catch (e) { notify(e.message, "error"); }
    finally { setSaving(false); }
  };

  const saveTopics = async () => {
    setTopicsLoading(true);
    try {
      await fetcher(token, `/repos/${repo.full_name}/topics`, { method: "PUT", body: JSON.stringify({ names: topics }), headers: { Accept: "application/vnd.github.mercy-preview+json" } });
      notify("Topics saved!", "success");
    } catch (e) { notify(e.message, "error"); }
    finally { setTopicsLoading(false); }
  };

  const addTopic = () => {
    const t = newTopic.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
    if (t && !topics.includes(t)) { setTopics(prev => [...prev, t]); }
    setNewTopic("");
  };

  const deleteRepo = async () => {
    if (deleteConfirm !== repo.name) { notify("Repository name doesn't match", "error"); return; }
    if (!window.confirm(`Permanently delete ${repo.full_name}? This CANNOT be undone.`)) return;
    try {
      await fetcher(token, `/repos/${repo.full_name}`, { method: "DELETE" });
      notify("Repository deleted", "success");
      onDelete();
    } catch (e) { notify(e.message, "error"); }
  };

  const Toggle = ({ label, field, desc }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #1a1a3e" }}>
      <div>
        <div style={{ color: "#c9d1ff", fontSize: 13 }}>{label}</div>
        {desc && <div style={{ color: "#6b7280", fontSize: 11, marginTop: 3 }}>{desc}</div>}
      </div>
      <label style={{ position: "relative", display: "inline-block", width: 42, height: 22, cursor: "pointer", flexShrink: 0 }}>
        <input type="checkbox" checked={form[field]} onChange={(e) => setForm(p => ({ ...p, [field]: e.target.checked }))} style={{ opacity: 0, width: 0, height: 0 }} />
        <span style={{ position: "absolute", inset: 0, background: form[field] ? "#4f46e5" : "#3d3d7a", borderRadius: 22, transition: "0.2s" }}>
          <span style={{ position: "absolute", width: 16, height: 16, background: "#fff", borderRadius: "50%", top: 3, left: form[field] ? 23 : 3, transition: "0.2s" }} />
        </span>
      </label>
    </div>
  );

  return (
    <div style={{ maxWidth: 700 }}>
      {/* GENERAL */}
      <div style={{ background: "#0f0f23", border: "1px solid #2d2d5e", borderRadius: 10, padding: 20, marginBottom: 20 }}>
        <h3 style={{ color: "#c9d1ff", fontSize: 14, margin: "0 0 16px" }}>General</h3>
        <Inp label="Repository name" value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} />
        <Textarea label="Description" value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Short description of this repo" style={{ minHeight: 60 }} />
        <Inp label="Website" value={form.homepage} onChange={(e) => setForm(p => ({ ...p, homepage: e.target.value }))} placeholder="https://example.com" />
        <Toggle label="Private repository" field="private" desc="Restrict access to this repository" />
        <div style={{ marginTop: 16 }}>
          <Btn onClick={saveSettings} disabled={saving}>{saving ? <Spinner /> : "💾 Save changes"}</Btn>
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ background: "#0f0f23", border: "1px solid #2d2d5e", borderRadius: 10, padding: 20, marginBottom: 20 }}>
        <h3 style={{ color: "#c9d1ff", fontSize: 14, margin: "0 0 16px" }}>Features</h3>
        <Toggle label="Issues" field="has_issues" />
        <Toggle label="Wiki" field="has_wiki" />
        <Toggle label="Projects" field="has_projects" />
        <div style={{ marginTop: 16 }}>
          <Btn onClick={saveSettings} disabled={saving}>{saving ? <Spinner /> : "💾 Save"}</Btn>
        </div>
      </div>

      {/* MERGE OPTIONS */}
      <div style={{ background: "#0f0f23", border: "1px solid #2d2d5e", borderRadius: 10, padding: 20, marginBottom: 20 }}>
        <h3 style={{ color: "#c9d1ff", fontSize: 14, margin: "0 0 16px" }}>Merge options</h3>
        <Toggle label="Allow merge commits" field="allow_merge_commit" />
        <Toggle label="Allow squash merging" field="allow_squash_merge" />
        <Toggle label="Allow rebase merging" field="allow_rebase_merge" />
        <Toggle label="Auto-delete head branches" field="delete_branch_on_merge" desc="Automatically delete branches after merge" />
        <div style={{ marginTop: 16 }}>
          <Btn onClick={saveSettings} disabled={saving}>{saving ? <Spinner /> : "💾 Save"}</Btn>
        </div>
      </div>

      {/* TOPICS */}
      <div style={{ background: "#0f0f23", border: "1px solid #2d2d5e", borderRadius: 10, padding: 20, marginBottom: 20 }}>
        <h3 style={{ color: "#c9d1ff", fontSize: 14, margin: "0 0 16px" }}>Topics</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
          {topics.map(t => (
            <span key={t} style={{ background: "#1e3a5f", color: "#93c5fd", border: "1px solid #1e40af", borderRadius: 20, padding: "3px 10px", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
              {t}
              <button onClick={() => setTopics(prev => prev.filter(x => x !== t))} style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: 12, lineHeight: 1, padding: 0 }}>✕</button>
            </span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={newTopic} onChange={(e) => setNewTopic(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTopic()} placeholder="Add topic…" style={{ flex: 1, background: "#1a1a3e", border: "1px solid #3d3d7a", borderRadius: 6, color: "#e2e8f0", padding: "8px 12px", fontSize: 13, outline: "none" }} />
          <Btn onClick={addTopic}>Add</Btn>
          <Btn variant="secondary" onClick={saveTopics} disabled={topiсsLoading}>{topiсsLoading ? <Spinner /> : "Save topics"}</Btn>
        </div>
      </div>

      {/* DANGER ZONE */}
      <div style={{ background: "#0f0f23", border: "1px solid #991b1b", borderRadius: 10, padding: 20 }}>
        <h3 style={{ color: "#fca5a5", fontSize: 14, margin: "0 0 16px" }}>⚠️ Danger Zone</h3>
        <p style={{ color: "#8b9dc3", fontSize: 13, marginBottom: 16 }}>Once you delete a repository, there is no going back. Please be certain.</p>
        <Inp label={`Type "${repo.name}" to confirm deletion`} value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} placeholder={repo.name} />
        <Btn variant="danger" onClick={deleteRepo} disabled={deleteConfirm !== repo.name}>🗑 Delete this repository</Btn>
      </div>
    </div>
  );
};

// ── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [auth, setAuth] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);

  const handleLogin = (token, user) => setAuth({ token, user });
  const handleLogout = () => { setAuth(null); setSelectedRepo(null); };

  if (!auth) return <Login onLogin={handleLogin} />;
  if (selectedRepo) return <RepoDetail token={auth.token} repo={selectedRepo} onBack={() => setSelectedRepo(null)} />;
  return <RepoList token={auth.token} user={auth.user} onSelect={setSelectedRepo} onLogout={handleLogout} />;
}
