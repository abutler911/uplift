import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { adminGetPost, adminCreatePost, adminUpdatePost } from "../api";

const CATEGORIES = [
  "Small Wins",
  "The Big Picture",
  "Silver Linings",
  "The Helpers",
  "Humanity 101",
];

export default function AdminEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: "",
    type: "original",
    category: "Small Wins",
    excerpt: "",
    body: "",
    sourceUrl: "",
    sourceLabel: "",
    status: "draft",
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [saved, setSaved] = useState(false);

  // Check auth
  useEffect(() => {
    const token = localStorage.getItem("uplift_token");
    if (!token) navigate("/admin/login");
  }, []);

  // Load existing post
  useEffect(() => {
    if (!isEdit) return;
    adminGetPost(id)
      .then((res) => {
        const p = res.data;
        setForm({
          title: p.title || "",
          type: p.type || "original",
          category: p.category || "Small Wins",
          excerpt: p.excerpt || "",
          body: p.body || "",
          sourceUrl: p.sourceUrl || "",
          sourceLabel: p.sourceLabel || "",
          status: p.status || "draft",
        });
      })
      .catch(() => navigate("/admin"))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = async (status) => {
    if (!form.title.trim()) return alert("Title is required");
    if (!form.body.trim()) return alert("Body is required");
    setSaving(true);
    try {
      const data = { ...form, status };
      if (isEdit) {
        await adminUpdatePost(id, data);
      } else {
        const res = await adminCreatePost(data);
        navigate(`/admin/edit/${res.data._id}`, { replace: true });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      setForm((f) => ({ ...f, status }));
    } catch (err) {
      alert("Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          padding: 60,
          textAlign: "center",
          fontFamily: "var(--serif)",
          color: "var(--text-muted)",
          fontSize: "1.2rem",
          fontStyle: "italic",
        }}
      >
        Loading…
      </div>
    );
  }

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontFamily: "var(--serif)",
              fontSize: "1.4rem",
              fontWeight: 600,
              color: "var(--text-primary)",
              lineHeight: 1,
              marginBottom: 4,
            }}
          >
            <span style={{ color: "var(--accent)" }}>U</span>plift
          </div>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: "0.5rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            {isEdit ? "Edit Post" : "New Post"}
          </div>
        </div>

        <div
          style={{
            width: "100%",
            height: 1,
            background: "var(--border)",
            marginBottom: 16,
          }}
        />

        {/* Post settings */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Status */}
          <div className="form-group">
            <label className="form-label">Status</label>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                className={`status-badge status-badge--${form.status}`}
                style={{ fontSize: "0.6rem", padding: "3px 8px" }}
              >
                {form.status}
              </span>
            </div>
          </div>

          {/* Type */}
          <div className="form-group">
            <label className="form-label">Type</label>
            <select
              className="form-control"
              value={form.type}
              onChange={set("type")}
              style={{ fontSize: "0.82rem", padding: "7px 10px" }}
            >
              <option value="original">Original Writing</option>
              <option value="curated">Curated Link</option>
            </select>
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-control"
              value={form.category}
              onChange={set("category")}
              style={{ fontSize: "0.82rem", padding: "7px 10px" }}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Source (curated only) */}
          {form.type === "curated" && (
            <>
              <div className="form-group">
                <label className="form-label">Source URL</label>
                <input
                  type="url"
                  className="form-control"
                  value={form.sourceUrl}
                  onChange={set("sourceUrl")}
                  placeholder="https://…"
                  style={{ fontSize: "0.82rem", padding: "7px 10px" }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Source Label</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.sourceLabel}
                  onChange={set("sourceLabel")}
                  placeholder="e.g. BBC News"
                  style={{ fontSize: "0.82rem", padding: "7px 10px" }}
                />
              </div>
            </>
          )}
        </div>

        <div
          style={{
            marginTop: "auto",
            paddingTop: 16,
            borderTop: "1px solid var(--border)",
          }}
        >
          <Link
            to="/admin"
            className="admin-nav-link"
            style={{ display: "flex" }}
          >
            ← All Posts
          </Link>
        </div>
      </aside>

      {/* Editor */}
      <main className="admin-main">
        {/* Toolbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 32,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <h1
            style={{
              fontFamily: "var(--serif)",
              fontSize: "1.6rem",
              fontWeight: 300,
              color: "var(--text-primary)",
            }}
          >
            {isEdit ? "Edit Post" : "New Post"}
          </h1>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {saved && (
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "0.58rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#4a7a51",
                }}
              >
                ✓ Saved
              </span>
            )}
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => handleSave("draft")}
              disabled={saving}
            >
              {saving ? "…" : "Save Draft"}
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => handleSave("published")}
              disabled={saving}
            >
              {saving
                ? "Publishing…"
                : form.status === "published"
                  ? "Update"
                  : "Publish"}
            </button>
          </div>
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Title */}
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              value={form.title}
              onChange={set("title")}
              placeholder="A good thing happened…"
              style={{
                fontFamily: "var(--serif)",
                fontSize: "1.4rem",
                padding: "12px 16px",
                fontWeight: 400,
              }}
            />
          </div>

          {/* Excerpt */}
          <div className="form-group">
            <label className="form-label">
              Excerpt{" "}
              <span style={{ color: "var(--text-muted)", fontWeight: 300 }}>
                (optional — shown in card preview)
              </span>
            </label>
            <textarea
              className="form-control"
              value={form.excerpt}
              onChange={set("excerpt")}
              placeholder="A short summary or hook…"
              rows={2}
              style={{ minHeight: 70 }}
            />
          </div>

          {/* Body */}
          <div className="form-group">
            <label className="form-label">Body</label>
            <textarea
              className="form-control"
              value={form.body}
              onChange={set("body")}
              placeholder="Write your story here. Use double line breaks for new paragraphs."
              rows={16}
              style={{
                minHeight: 360,
                fontFamily: "var(--body-serif)",
                fontSize: "1rem",
                lineHeight: 1.8,
              }}
            />
          </div>

          {/* Mobile save */}
          <div style={{ display: "flex", gap: 8, paddingTop: 8 }}>
            <button
              className="btn btn-ghost"
              onClick={() => handleSave("draft")}
              disabled={saving}
              style={{ flex: 1 }}
            >
              Save Draft
            </button>
            <button
              className="btn btn-primary"
              onClick={() => handleSave("published")}
              disabled={saving}
              style={{ flex: 1 }}
            >
              {form.status === "published" ? "Update" : "Publish"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
