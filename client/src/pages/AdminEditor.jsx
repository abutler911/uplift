import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { adminGetPost, adminCreatePost, adminUpdatePost } from "../api";
import RichTextEditor from "../components/RichTextEditor";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";
import SourceLinks from "../components/SourceLinks";

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
  const { toast, showToast, hideToast } = useToast();

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

  useEffect(() => {
    const token = localStorage.getItem("uplift_token");
    if (!token) navigate("/admin/login");
  }, []);

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
    if (!form.title.trim()) return showToast("Title is required", "error");
    if (!form.body.trim() || form.body === "<p></p>")
      return showToast("Body is required", "error");
    setSaving(true);
    try {
      const data = { ...form, status };
      if (isEdit) {
        await adminUpdatePost(id, data);
        showToast(
          status === "published" ? "Published!" : "Draft saved",
          "success",
        );
      } else {
        const res = await adminCreatePost(data);
        showToast(
          status === "published" ? "Published!" : "Draft saved",
          "success",
        );
        navigate(`/admin/edit/${res.data._id}`, { replace: true });
      }
      setForm((f) => ({ ...f, status }));
    } catch (err) {
      showToast("Save failed — try again", "error");
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
          <div className="form-group">
            <label className="form-label">Status</label>
            <span
              className={`status-badge status-badge--${form.status}`}
              style={{ fontSize: "0.6rem", padding: "3px 8px" }}
            >
              {form.status}
            </span>
          </div>

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

        {/* Nav links */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: 16,
            borderTop: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <Link
            to="/admin"
            className="admin-nav-link"
            style={{ display: "flex" }}
          >
            ← All Posts
          </Link>
          <Link
            to="/"
            className="admin-nav-link"
            style={{ display: "flex" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            ↗ View Site
          </Link>
          {isEdit && form.status === "published" && (
            <Link
              to={`/post/${id}`}
              className="admin-nav-link"
              style={{ display: "flex" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              ↗ View Post
            </Link>
          )}
        </div>
        <SourceLinks />
      </aside>

      {/* Editor */}
      <main className="admin-main">
        {/* Toolbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 28,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => navigate("/admin")}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                fontFamily: "var(--mono)",
                fontSize: "0.6rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: 0,
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Posts
            </button>
            <span style={{ color: "var(--border-bright)" }}>/</span>
            <h1
              style={{
                fontFamily: "var(--serif)",
                fontSize: "1.4rem",
                fontWeight: 300,
                color: "var(--text-primary)",
              }}
            >
              {isEdit ? form.title || "Edit Post" : "New Post"}
            </h1>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
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
              style={{ minWidth: 100 }}
            >
              {saving
                ? "Saving…"
                : form.status === "published"
                  ? "Update"
                  : "Publish →"}
            </button>
          </div>
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
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
                fontSize: "1.5rem",
                padding: "12px 16px",
                fontWeight: 400,
              }}
            />
          </div>

          {/* Excerpt */}
          <div className="form-group">
            <label className="form-label">
              Excerpt{" "}
              <span
                style={{
                  color: "var(--text-muted)",
                  fontWeight: 300,
                  textTransform: "none",
                  letterSpacing: 0,
                }}
              >
                — shown in card preview
              </span>
            </label>
            <textarea
              className="form-control"
              value={form.excerpt}
              onChange={set("excerpt")}
              placeholder="A short hook or summary…"
              rows={2}
              style={{ minHeight: 68 }}
            />
          </div>

          {/* Body */}
          <div className="form-group">
            <label className="form-label">Body</label>
            <RichTextEditor
              value={form.body}
              onChange={(html) => setForm((f) => ({ ...f, body: html }))}
            />
          </div>

          {/* Mobile save buttons */}
          <div
            style={{
              display: "flex",
              gap: 8,
              paddingTop: 8,
              paddingBottom: 32,
            }}
          >
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
              {form.status === "published" ? "Update" : "Publish →"}
            </button>
          </div>
        </div>
      </main>

      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}
