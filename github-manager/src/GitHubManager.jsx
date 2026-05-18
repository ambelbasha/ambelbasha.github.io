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
        }}>
          <span style={{ fontWeight: 600, fontSize: 15, color: "#c9d1ff" }}>{title}</span>
          <button onClick={onClose} style={{
            background: "none", border: "none", color: "#6b7280",
            cursor: "pointer", fontSize: 18, lineHeight: 1, padding: 2,
          }}>✕</button>
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
      outline: "none", boxSizing: "border-box",
      ...props.style,
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
  };
  return (
    <button {...props} style={{
      padding: "7px 14px", borderRadius: 6, fontSize: 13, cursor: "pointer",
      fontWeight: 500, transition: "opacity 0.15s", outline: "none",
      ...styles[variant], opacity: props.disabled ? 0.5 : 1,
      ...props.style,
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
    width: 18, height: 18, border: "2px solid #3d3d7a",
    borderTop: "2px solid #6366f1", borderRadius: "50%",
    animation: "spin 0.7s linear infinite", display: "inline-block",
  }} />
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
    } catch (e) {
      setErr(e.message || "Invalid token");
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#080818",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'SF Mono', 'Fira Code', monospace",
    }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
      <div style={{
        background: "#0f0f23", border: "1px solid #2d2d5e", borderRadius: 16,
        padding: 40, width: 420, boxShadow: "0 20px 80px rgba(79,70,229,0.2)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="#6366f1">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </div>
          <h1 style={{ color: "#c9d1ff", fontSize: 22, fontWeight: 700, margin: 0 }}>GitHub Manager</h1>
          <p style={{ color: "#6b7280", fontSize: 13, marginTop: 8 }}>Enter your Personal Access Token to connect</p>
        </div>
        <Inp
          label="Personal Access Token"
          type="password"
          placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        {err && <p style={{ color: "#f87171", fontSize: 12, marginBottom: 12 }}>{err}</p>}
        <Btn style={{ width: "100%", padding: "10px 0", justifyContent: "center" }} onClick={submit} disabled={loading}>
          {loading ? <Spinner /> : "Connect to GitHub"}
        </Btn>
        <p style={{ color: "#4b5563", fontSize: 11, textAlign: "center", marginTop: 16, lineHeight: 1.6 }}>
          Needs scopes: <code style={{ color: "#8b9dc3" }}>repo, read:user, read:org</code><br />
          Press <kbd style={{ background: "#1a1a3e", border: "1px solid #3d3d7a", padding: "1px 5px", borderRadius: 3, color: "#8b9dc3" }}>ESC</kbd> at any time to close modals
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
  const [newRepo, setNewRepo] = useState({ name: "", description: "", private: false });
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
      await fetcher(token, "/user/repos", { method: "POST", body: JSON.stringify(newRepo) });
      notify("Repository created!", "success");
      setShowCreate(false);
      setNewRepo({ name: "", description: "", private: false });
      load();
    } catch (e) { notify(e.message, "error"); }
    finally { setCreating(false); }
  };

  const deleteRepo = async (repo) => {
    if (!window.confirm(`Delete ${repo.full_name}? This cannot be undone.`)) return;
    try {
      await fetcher(token, `/repos/${repo.full_name}`, { method: "DELETE" });
      notify("Repository deleted", "success");
      load();
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

      {/* NAV */}
      <div style={{
        background: "#0f0f23", borderBottom: "1px solid #2d2d5e",
        padding: "12px 24px", display: "flex", alignItems: "center", gap: 16,
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#6366f1"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
        <span style={{ color: "#c9d1ff", fontWeight: 700, fontSize: 15 }}>GitHub Manager</span>
        <div style={{ flex: 1 }} />
        <img src={user.avatar_url} alt="" style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid #4f46e5" }} />
        <span style={{ color: "#8b9dc3", fontSize: 13 }}>{user.login}</span>
        <Btn variant="secondary" onClick={onLogout} style={{ padding: "5px 10px", fontSize: 12 }}>Sign out</Btn>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }}>
        {/* TOOLBAR */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <input
            placeholder="🔍  Search repositories…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{
              flex: 1, minWidth: 200, background: "#1a1a3e", border: "1px solid #3d3d7a",
              borderRadius: 6, color: "#e2e8f0", padding: "8px 14px", fontSize: 13, outline: "none",
            }}
          />
          <select value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }} style={{ background: "#1a1a3e", border: "1px solid #3d3d7a", borderRadius: 6, color: "#8b9dc3", padding: "8px 10px", fontSize: 13, outline: "none" }}>
            <option value="all">All</option>
            <option value="owner">Mine</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="forks">Forks</option>
          </select>
          <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} style={{ background: "#1a1a3e", border: "1px solid #3d3d7a", borderRadius: 6, color: "#8b9dc3", padding: "8px 10px", fontSize: 13, outline: "none" }}>
            <option value="updated">Last updated</option>
            <option value="created">Created</option>
            <option value="pushed">Last pushed</option>
            <option value="full_name">Name</option>
          </select>
          <Btn onClick={() => setShowCreate(true)}>＋ New repo</Btn>
          <Btn variant="secondary" onClick={load} style={{ padding: "8px 12px" }}>↻</Btn>
        </div>

        {/* STATS ROW */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Total", value: repos.length },
            { label: "Public", value: repos.filter(r => !r.private).length },
            { label: "Private", value: repos.filter(r => r.private).length },
            { label: "Forks", value: repos.filter(r => r.fork).length },
            { label: "Stars", value: repos.reduce((a, r) => a + r.stargazers_count, 0) },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, background: "#0f0f23", border: "1px solid #2d2d5e", borderRadius: 8, padding: "10px 14px", textAlign: "center", minWidth: 70 }}>
              <div style={{ color: "#6366f1", fontWeight: 700, fontSize: 18 }}>{s.value}</div>
              <div style={{ color: "#6b7280", fontSize: 11 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* REPO GRID */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 60 }}><Spinner /></div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
              {visible.map((repo) => (
                <div key={repo.id} style={{
                  background: "#0f0f23", border: "1px solid #2d2d5e", borderRadius: 10,
                  padding: 16, cursor: "pointer", transition: "border-color 0.2s",
                  display: "flex", flexDirection: "column", gap: 8,
                }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "#4f46e5"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "#2d2d5e"}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <div onClick={() => onSelect(repo)} style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ color: "#6366f1", fontWeight: 700, fontSize: 14 }}>{repo.name}</span>
                        {repo.private && <Badge color="#f59e0b">private</Badge>}
                        {repo.fork && <Badge color="#8b5cf6">fork</Badge>}
                        {repo.archived && <Badge color="#6b7280">archived</Badge>}
                      </div>
                      <p style={{ color: "#6b7280", fontSize: 12, margin: 0, lineHeight: 1.5 }}>
                        {repo.description || <em>No description</em>}
                      </p>
                    </div>
                    <button onClick={() => deleteRepo(repo)} style={{
                      background: "none", border: "none", color: "#4b5563",
                      cursor: "pointer", fontSize: 14, padding: "2px 6px",
                    }} title="Delete repo">🗑</button>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 12, color: "#6b7280" }} onClick={() => onSelect(repo)}>
                    {repo.language && (
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: langColor[repo.language] || "#8b9dc3", display: "inline-block" }} />
                        {repo.language}
                      </span>
                    )}
                    <span>⭐ {repo.stargazers_count}</span>
                    <span>🍴 {repo.forks_count}</span>
                    <span style={{ marginLeft: "auto" }}>Updated {fmt(repo.updated_at)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            {pages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} style={{
                    background: p === page ? "#4f46e5" : "#1a1a3e",
                    border: "1px solid #3d3d7a", borderRadius: 6, color: p === page ? "#fff" : "#8b9dc3",
                    padding: "5px 10px", fontSize: 12, cursor: "pointer",
                  }}>{p}</button>
                ))}
              </div>
            )}

            {visible.length === 0 && (
              <div style={{ textAlign: "center", padding: 60, color: "#4b5563", fontSize: 14 }}>
                No repositories match your search.
              </div>
            )}
          </>
        )}
      </div>

      {/* CREATE MODAL */}
      {showCreate && (
        <Modal title="Create new repository" onClose={() => setShowCreate(false)}>
          <Inp label="Repository name *" value={newRepo.name} onChange={(e) => setNewRepo(p => ({ ...p, name: e.target.value }))} placeholder="my-awesome-project" />
          <Inp label="Description" value={newRepo.description} onChange={(e) => setNewRepo(p => ({ ...p, description: e.target.value }))} placeholder="What is this repository about?" />
          <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, cursor: "pointer", fontSize: 13, color: "#8b9dc3" }}>
            <input type="checkbox" checked={newRepo.private} onChange={(e) => setNewRepo(p => ({ ...p, private: e.target.checked }))} />
            Make repository private
          </label>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
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
const RepoDetail = ({ token, repo, onBack }) => {
  const [tab, setTab] = useState("files");
  const [toast, setToast] = useState(null);
  const notify = (msg, type = "info") => setToast({ msg, type });

  const tabs = [
    { id: "files", label: "📁 Files" },
    { id: "issues", label: "🐛 Issues" },
    { id: "prs", label: "🔀 Pull Requests" },
    { id: "branches", label: "🌿 Branches" },
    { id: "releases", label: "🏷 Releases" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#080818", fontFamily: "'SF Mono','Fira Code',monospace" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} *::-webkit-scrollbar{width:6px} *::-webkit-scrollbar-track{background:#0f0f23} *::-webkit-scrollbar-thumb{background:#3d3d7a;border-radius:3px}`}</style>

      {/* NAV */}
      <div style={{
        background: "#0f0f23", borderBottom: "1px solid #2d2d5e",
        padding: "12px 24px", display: "flex", alignItems: "center", gap: 12,
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", fontSize: 18 }}>←</button>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#6366f1"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
        <span style={{ color: "#8b9dc3", fontSize: 13 }}>{repo.owner.login}</span>
        <span style={{ color: "#4b5563" }}>/</span>
        <span style={{ color: "#c9d1ff", fontWeight: 700, fontSize: 14 }}>{repo.name}</span>
        {repo.private && <Badge color="#f59e0b">private</Badge>}
        <div style={{ flex: 1 }} />
        <a href={repo.html_url} target="_blank" rel="noreferrer" style={{ color: "#6366f1", fontSize: 12, textDecoration: "none" }}>Open on GitHub ↗</a>
      </div>

      {/* TABS */}
      <div style={{
        background: "#0f0f23", borderBottom: "1px solid #2d2d5e",
        display: "flex", padding: "0 24px", gap: 4, overflowX: "auto",
      }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: "none", border: "none", borderBottom: tab === t.id ? "2px solid #6366f1" : "2px solid transparent",
            color: tab === t.id ? "#c9d1ff" : "#6b7280", cursor: "pointer",
            padding: "12px 16px", fontSize: 13, fontFamily: "inherit", whiteSpace: "nowrap",
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px" }}>
        {tab === "files" && <FileBrowser token={token} repo={repo} notify={notify} />}
        {tab === "issues" && <Issues token={token} repo={repo} notify={notify} />}
        {tab === "prs" && <PullRequests token={token} repo={repo} notify={notify} />}
        {tab === "branches" && <Branches token={token} repo={repo} notify={notify} />}
        {tab === "releases" && <Releases token={token} repo={repo} notify={notify} />}
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
    } catch (e) {
      notify(e.message, "error");
      setItems([]);
    } finally { setLoading(false); }
  };

  const viewFile = async (item) => {
    if (item.type === "dir") {
      setPath(item.path);
      return;
    }
    try {
      const data = await fetcher(token, `/repos/${repo.full_name}/contents/${item.path}?ref=${branch}`);
      const content = atob(data.content.replace(/\n/g, ""));
      setViewing({ ...item, decoded: content, sha: data.sha });
    } catch (e) { notify(e.message, "error"); }
  };

  const startEdit = () => {
    setEditContent(viewing.decoded);
    setCommitMsg(`Update ${viewing.name}`);
    setEditing(viewing);
    setViewing(null);
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      const encoded = btoa(unescape(encodeURIComponent(editContent)));
      await fetcher(token, `/repos/${repo.full_name}/contents/${editing.path}`, {
        method: "PUT",
        body: JSON.stringify({ message: commitMsg, content: encoded, sha: editing.sha, branch }),
      });
      notify("File saved!", "success");
      setEditing(null);
      loadPath();
    } catch (e) { notify(e.message, "error"); }
    finally { setSaving(false); }
  };

  const deleteFile = async (item) => {
    if (!window.confirm(`Delete ${item.name}?`)) return;
    try {
      const data = await fetcher(token, `/repos/${repo.full_name}/contents/${item.path}?ref=${branch}`);
      await fetcher(token, `/repos/${repo.full_name}/contents/${item.path}`, {
        method: "DELETE",
        body: JSON.stringify({ message: `Delete ${item.name}`, sha: data.sha, branch }),
      });
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
      await fetcher(token, `/repos/${repo.full_name}/contents/${filePath}`, {
        method: "PUT",
        body: JSON.stringify({ message: newFile.message, content: encoded, branch }),
      });
      notify("File created!", "success");
      setShowCreate(false);
      setNewFile({ name: "", content: "", message: "Add file" });
      loadPath();
    } catch (e) { notify(e.message, "error"); }
    finally { setCreating(false); }
  };

  const breadcrumbs = ["root", ...path.split("/").filter(Boolean)];

  const fileIcon = (item) => {
    if (item.type === "dir") return "📁";
    const ext = item.name.split(".").pop().toLowerCase();
    const icons = { js: "🟨", ts: "🔷", jsx: "⚛️", tsx: "⚛️", py: "🐍", md: "📝", json: "📋", html: "🌐", css: "🎨", sh: "⚙️", yml: "⚙️", yaml: "⚙️", gitignore: "🚫", rs: "🦀", go: "🐹", java: "☕" };
    return icons[ext] || "📄";
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, flexWrap: "wrap" }}>
          {breadcrumbs.map((crumb, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {i > 0 && <span style={{ color: "#4b5563" }}>/</span>}
              <button onClick={() => setPath(breadcrumbs.slice(1, i + 1).join("/"))} style={{
                background: "none", border: "none", color: i === breadcrumbs.length - 1 ? "#c9d1ff" : "#6366f1",
                cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: i === breadcrumbs.length - 1 ? 600 : 400,
              }}>{crumb}</button>
            </span>
          ))}
        </div>
        <select value={branch} onChange={(e) => setBranch(e.target.value)} style={{ background: "#1a1a3e", border: "1px solid #3d3d7a", borderRadius: 6, color: "#8b9dc3", padding: "6px 10px", fontSize: 12, outline: "none" }}>
          {branches.map(b => <option key={b.name}>{b.name}</option>)}
        </select>
        <Btn onClick={() => setShowCreate(true)} style={{ fontSize: 12 }}>＋ New file</Btn>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}><Spinner /></div>
      ) : (
        <div style={{ background: "#0f0f23", border: "1px solid #2d2d5e", borderRadius: 10, overflow: "hidden" }}>
          {path && (
            <div onClick={() => setPath(path.split("/").slice(0, -1).join("/"))}
              style={{ padding: "10px 16px", borderBottom: "1px solid #2d2d5e", cursor: "pointer", color: "#6366f1", fontSize: 13 }}>
              ← ..
            </div>
          )}
          {items.map((item, i) => (
            <div key={item.sha + i} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 16px", borderBottom: i < items.length - 1 ? "1px solid #1a1a3e" : "none",
              cursor: "pointer", transition: "background 0.15s",
            }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#1a1a3e"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <span>{fileIcon(item)}</span>
              <span onClick={() => viewFile(item)} style={{ flex: 1, color: item.type === "dir" ? "#6366f1" : "#c9d1ff", fontSize: 13 }}>
                {item.name}
              </span>
              <span style={{ color: "#4b5563", fontSize: 11 }}>{item.size ? `${(item.size / 1024).toFixed(1)} KB` : ""}</span>
              {item.type === "file" && (
                <button onClick={() => deleteFile(item)} style={{ background: "none", border: "none", color: "#4b5563", cursor: "pointer", fontSize: 13 }} title="Delete">🗑</button>
              )}
            </div>
          ))}
          {items.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", color: "#4b5563", fontSize: 13 }}>This directory is empty</div>
          )}
        </div>
      )}

      {/* VIEW FILE MODAL */}
      {viewing && (
        <Modal title={viewing.name} onClose={() => setViewing(null)} width={720}>
          <div style={{ background: "#080818", borderRadius: 8, padding: 16, marginBottom: 14, overflowX: "auto" }}>
            <pre style={{ color: "#e2e8f0", fontSize: 12, margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-all", maxHeight: 400, overflowY: "auto", lineHeight: 1.7 }}>{viewing.decoded}</pre>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <Btn variant="secondary" onClick={() => setViewing(null)}>Close</Btn>
            <Btn onClick={startEdit}>✏️ Edit</Btn>
          </div>
        </Modal>
      )}

      {/* EDIT FILE MODAL */}
      {editing && (
        <Modal title={`Editing: ${editing.name}`} onClose={() => setEditing(null)} width={800}>
          <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} style={{
            width: "100%", background: "#080818", border: "1px solid #3d3d7a", borderRadius: 8,
            color: "#e2e8f0", padding: 14, fontSize: 12, fontFamily: "monospace",
            boxSizing: "border-box", minHeight: 380, resize: "vertical", outline: "none",
          }} />
          <Inp label="Commit message" value={commitMsg} onChange={(e) => setCommitMsg(e.target.value)} style={{ marginTop: 12 }} />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <Btn variant="secondary" onClick={() => setEditing(null)}>Cancel</Btn>
            <Btn onClick={saveEdit} disabled={saving}>{saving ? <Spinner /> : "Save & commit"}</Btn>
          </div>
        </Modal>
      )}

      {/* CREATE FILE MODAL */}
      {showCreate && (
        <Modal title="Create new file" onClose={() => setShowCreate(false)}>
          <Inp label="File name" value={newFile.name} onChange={(e) => setNewFile(p => ({ ...p, name: e.target.value }))} placeholder="README.md" />
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, color: "#8b9dc3", marginBottom: 6 }}>Content</label>
            <textarea value={newFile.content} onChange={(e) => setNewFile(p => ({ ...p, content: e.target.value }))}
              placeholder="File content here…"
              style={{ width: "100%", background: "#1a1a3e", border: "1px solid #3d3d7a", borderRadius: 6, color: "#e2e8f0", padding: "8px 12px", fontSize: 12, fontFamily: "monospace", boxSizing: "border-box", minHeight: 160, resize: "vertical", outline: "none" }} />
          </div>
          <Inp label="Commit message" value={newFile.message} onChange={(e) => setNewFile(p => ({ ...p, message: e.target.value }))} />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <Btn variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Btn>
            <Btn onClick={createFile} disabled={creating}>{creating ? <Spinner /> : "Create file"}</Btn>
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
  const [newIssue, setNewIssue] = useState({ title: "", body: "", labels: "" });
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState(null);
  const [comment, setComment] = useState("");
  const [commenting, setCommenting] = useState(false);
  const [comments, setComments] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetcher(token, `/repos/${repo.full_name}/issues?state=${state}&per_page=50&pulls=false`);
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
      await fetcher(token, `/repos/${repo.full_name}/issues`, {
        method: "POST",
        body: JSON.stringify({ title: newIssue.title, body: newIssue.body, labels }),
      });
      notify("Issue created!", "success");
      setShowCreate(false);
      setNewIssue({ title: "", body: "", labels: "" });
      load();
    } catch (e) { notify(e.message, "error"); }
    finally { setCreating(false); }
  };

  const closeIssue = async (issue) => {
    try {
      await fetcher(token, `/repos/${repo.full_name}/issues/${issue.number}`, {
        method: "PATCH", body: JSON.stringify({ state: issue.state === "open" ? "closed" : "open" }),
      });
      notify(`Issue ${issue.state === "open" ? "closed" : "reopened"}`, "success");
      load();
      setSelected(null);
    } catch (e) { notify(e.message, "error"); }
  };

  const addComment = async () => {
    if (!comment.trim()) return;
    setCommenting(true);
    try {
      await fetcher(token, `/repos/${repo.full_name}/issues/${selected.number}/comments`, {
        method: "POST", body: JSON.stringify({ body: comment }),
      });
      notify("Comment added!", "success");
      setComment("");
      const data = await fetcher(token, `/repos/${repo.full_name}/issues/${selected.number}/comments`);
      setComments(data || []);
    } catch (e) { notify(e.message, "error"); }
    finally { setCommenting(false); }
  };

  const labelColor = (label) => `#${label.color}`;

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <div style={{ background: "#0f0f23", border: "1px solid #2d2d5e", borderRadius: 6, display: "flex" }}>
          {["open", "closed", "all"].map(s => (
            <button key={s} onClick={() => setState(s)} style={{
              background: state === s ? "#4f46e5" : "none", border: "none", color: state === s ? "#fff" : "#6b7280",
              padding: "7px 14px", cursor: "pointer", fontSize: 12, fontFamily: "inherit",
              borderRadius: 6,
            }}>{s}</button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <Btn onClick={() => setShowCreate(true)}>＋ New issue</Btn>
        <Btn variant="secondary" onClick={load} style={{ padding: "7px 12px" }}>↻</Btn>
      </div>

      {loading ? <div style={{ textAlign: "center", padding: 40 }}><Spinner /></div> : (
        <div style={{ background: "#0f0f23", border: "1px solid #2d2d5e", borderRadius: 10, overflow: "hidden" }}>
          {issues.map((issue, i) => (
            <div key={issue.id} onClick={() => openIssue(issue)} style={{
              padding: "14px 16px", borderBottom: i < issues.length - 1 ? "1px solid #1a1a3e" : "none",
              cursor: "pointer", transition: "background 0.15s", display: "flex", gap: 12, alignItems: "flex-start",
            }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#1a1a3e"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ fontSize: 16, marginTop: 1 }}>{issue.state === "open" ? "🟢" : "🔴"}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                  <span style={{ color: "#c9d1ff", fontWeight: 600, fontSize: 13 }}>{issue.title}</span>
                  {(issue.labels || []).map(l => (
                    <span key={l.id} style={{ background: `#${l.color}33`, color: `#${l.color}`, border: `1px solid #${l.color}66`, borderRadius: 20, padding: "1px 7px", fontSize: 11 }}>{l.name}</span>
                  ))}
                </div>
                <span style={{ color: "#6b7280", fontSize: 12 }}>#{issue.number} by {issue.user?.login} · {fmt(issue.created_at)} · 💬 {issue.comments}</span>
              </div>
            </div>
          ))}
          {issues.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "#4b5563", fontSize: 13 }}>No {state} issues</div>}
        </div>
      )}

      {/* ISSUE DETAIL */}
      {selected && (
        <Modal title={`#${selected.number}: ${selected.title}`} onClose={() => setSelected(null)} width={700}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <Badge color={selected.state === "open" ? "#22c55e" : "#ef4444"}>{selected.state}</Badge>
              <span style={{ color: "#6b7280", fontSize: 12 }}>by {selected.user?.login} on {fmt(selected.created_at)}</span>
            </div>
            <div style={{ background: "#1a1a3e", borderRadius: 8, padding: 14, fontSize: 13, color: "#c9d1ff", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
              {selected.body || <em style={{ color: "#4b5563" }}>No description</em>}
            </div>
          </div>

          {comments.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 10 }}>💬 {comments.length} comment{comments.length !== 1 ? "s" : ""}</div>
              {comments.map(c => (
                <div key={c.id} style={{ background: "#1a1a3e", borderRadius: 8, padding: 12, marginBottom: 10, fontSize: 12 }}>
                  <div style={{ color: "#6366f1", fontWeight: 600, marginBottom: 6 }}>{c.user?.login} · {fmt(c.created_at)}</div>
                  <div style={{ color: "#c9d1ff", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{c.body}</div>
                </div>
              ))}
            </div>
          )}

          <Textarea label="Add comment" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Leave a comment…" style={{ minHeight: 100 }} />
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <Btn variant={selected.state === "open" ? "danger" : "secondary"} onClick={() => closeIssue(selected)}>
              {selected.state === "open" ? "Close issue" : "Reopen issue"}
            </Btn>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn variant="secondary" onClick={() => setSelected(null)}>Close</Btn>
              <Btn onClick={addComment} disabled={commenting || !comment.trim()}>{commenting ? <Spinner /> : "Comment"}</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* CREATE ISSUE */}
      {showCreate && (
        <Modal title="Create new issue" onClose={() => setShowCreate(false)}>
          <Inp label="Title *" value={newIssue.title} onChange={(e) => setNewIssue(p => ({ ...p, title: e.target.value }))} placeholder="Issue title" />
          <Textarea label="Description" value={newIssue.body} onChange={(e) => setNewIssue(p => ({ ...p, body: e.target.value }))} placeholder="Describe the issue…" style={{ minHeight: 140 }} />
          <Inp label="Labels (comma-separated)" value={newIssue.labels} onChange={(e) => setNewIssue(p => ({ ...p, labels: e.target.value }))} placeholder="bug, enhancement" />
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

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetcher(token, `/repos/${repo.full_name}/pulls?state=${state}&per_page=50`);
      setPrs(data || []);
    } catch (e) { notify(e.message, "error"); }
    finally { setLoading(false); }
  }, [token, repo, state]);

  useEffect(() => { load(); }, [load]);

  const mergePR = async (pr) => {
    if (!window.confirm(`Merge PR #${pr.number}?`)) return;
    setMerging(true);
    try {
      await fetcher(token, `/repos/${repo.full_name}/pulls/${pr.number}/merge`, { method: "PUT", body: JSON.stringify({ merge_method: "merge" }) });
      notify("PR merged!", "success");
      setSelected(null);
      load();
    } catch (e) { notify(e.message, "error"); }
    finally { setMerging(false); }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <div style={{ background: "#0f0f23", border: "1px solid #2d2d5e", borderRadius: 6, display: "flex" }}>
          {["open", "closed", "all"].map(s => (
            <button key={s} onClick={() => setState(s)} style={{ background: state === s ? "#4f46e5" : "none", border: "none", color: state === s ? "#fff" : "#6b7280", padding: "7px 14px", cursor: "pointer", fontSize: 12, fontFamily: "inherit", borderRadius: 6 }}>{s}</button>
          ))}
        </div>
        <Btn variant="secondary" onClick={load} style={{ marginLeft: "auto", padding: "7px 12px" }}>↻</Btn>
      </div>

      {loading ? <div style={{ textAlign: "center", padding: 40 }}><Spinner /></div> : (
        <div style={{ background: "#0f0f23", border: "1px solid #2d2d5e", borderRadius: 10, overflow: "hidden" }}>
          {prs.map((pr, i) => (
            <div key={pr.id} onClick={() => setSelected(pr)} style={{
              padding: "14px 16px", borderBottom: i < prs.length - 1 ? "1px solid #1a1a3e" : "none",
              cursor: "pointer", transition: "background 0.15s",
            }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#1a1a3e"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 16 }}>{pr.state === "open" ? "🟢" : pr.merged_at ? "🟣" : "🔴"}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#c9d1ff", fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{pr.title}</div>
                  <div style={{ color: "#6b7280", fontSize: 12 }}>
                    #{pr.number} by {pr.user?.login} · {fmt(pr.created_at)}
                    <span style={{ margin: "0 8px", color: "#4b5563" }}>·</span>
                    <span style={{ color: "#22c55e" }}>+{pr.additions || 0}</span>
                    <span style={{ color: "#ef4444" }}> −{pr.deletions || 0}</span>
                    <span style={{ margin: "0 8px", color: "#4b5563" }}>·</span>
                    {pr.head?.ref} → {pr.base?.ref}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {prs.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "#4b5563", fontSize: 13 }}>No {state} pull requests</div>}
        </div>
      )}

      {selected && (
        <Modal title={`PR #${selected.number}: ${selected.title}`} onClose={() => setSelected(null)} width={700}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
              <Badge color={selected.state === "open" ? "#22c55e" : selected.merged_at ? "#8b5cf6" : "#ef4444"}>{selected.merged_at ? "merged" : selected.state}</Badge>
              <span style={{ color: "#8b9dc3", fontSize: 12 }}>{selected.head?.ref} → {selected.base?.ref}</span>
            </div>
            <div style={{ background: "#1a1a3e", borderRadius: 8, padding: 14, fontSize: 13, color: "#c9d1ff", lineHeight: 1.7, whiteSpace: "pre-wrap", marginBottom: 14 }}>
              {selected.body || <em style={{ color: "#4b5563" }}>No description</em>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[{ label: "Commits", value: selected.commits }, { label: "Changed files", value: selected.changed_files }, { label: "Comments", value: selected.comments }].map(s => (
                <div key={s.label} style={{ background: "#080818", borderRadius: 8, padding: "10px 14px", textAlign: "center" }}>
                  <div style={{ color: "#6366f1", fontWeight: 700, fontSize: 18 }}>{s.value ?? "—"}</div>
                  <div style={{ color: "#6b7280", fontSize: 11 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <a href={selected.html_url} target="_blank" rel="noreferrer" style={{ color: "#6366f1", fontSize: 13, textDecoration: "none" }}>View on GitHub ↗</a>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn variant="secondary" onClick={() => setSelected(null)}>Close</Btn>
              {selected.state === "open" && !selected.merged_at && (
                <Btn onClick={() => mergePR(selected)} disabled={merging} style={{ background: "#8b5cf6", borderColor: "#8b5cf6" }}>{merging ? <Spinner /> : "🟣 Merge PR"}</Btn>
              )}
            </div>
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
      await fetcher(token, `/repos/${repo.full_name}/git/refs`, {
        method: "POST",
        body: JSON.stringify({ ref: `refs/heads/${newBranch.name}`, sha }),
      });
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
            <div key={b.name} style={{
              padding: "12px 16px", borderBottom: i < branches.length - 1 ? "1px solid #1a1a3e" : "none",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <span style={{ fontSize: 14 }}>🌿</span>
              <span style={{ flex: 1, color: "#c9d1ff", fontSize: 13, fontWeight: b.name === repo.default_branch ? 700 : 400 }}>{b.name}</span>
              {b.name === repo.default_branch && <Badge color="#22c55e">default</Badge>}
              {b.protected && <Badge color="#f59e0b">protected</Badge>}
              <span style={{ color: "#4b5563", fontSize: 11, fontFamily: "monospace" }}>{b.commit?.sha?.slice(0, 7)}</span>
              <button onClick={() => deleteBranch(b)} style={{ background: "none", border: "none", color: "#4b5563", cursor: "pointer", fontSize: 13 }} title="Delete branch">🗑</button>
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
                      ⬇ {a.name}
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

// ── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [auth, setAuth] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape" && selectedRepo) setSelectedRepo(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedRepo]);

  const handleLogin = (token, user) => setAuth({ token, user });
  const handleLogout = () => { setAuth(null); setSelectedRepo(null); };

  if (!auth) return <Login onLogin={handleLogin} />;
  if (selectedRepo) return <RepoDetail token={auth.token} repo={selectedRepo} onBack={() => setSelectedRepo(null)} />;
  return <RepoList token={auth.token} user={auth.user} onSelect={setSelectedRepo} onLogout={handleLogout} />;
}
