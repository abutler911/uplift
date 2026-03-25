import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminGetPosts, adminDeletePost } from "../api";
import adminApi from "../api";
import CategoryBadge from "../components/CategoryBadge";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";
import SourceLinks from "../components/SourceLinks";

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const SLOT_LABELS = ["⭐ Featured", "2nd", "3rd", "4th"];

function getSlotLabel(index) {
  return SLOT_LABELS[index] || null;
}

export default function Admin() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  // Drag state
  const dragIndex = useRef(null);
  const [dragOver, setDragOver] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("uplift_token");
    if (!token) navigate("/admin/login");
  }, []);

  const load = () => {
    setLoading(true);
    const params = {};
    if (filter !== "all") params.status = filter;
    adminGetPosts(params)
      .then((res) => {
        // Sort by position then publishedAt
        const sorted = res.data.sort((a, b) => {
          if (a.position !== b.position) return a.position - b.position;
          return new Date(b.publishedAt) - new Date(a.publishedAt);
        });
        setPosts(sorted);
      })
      .catch(() => navigate("/admin/login"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [filter]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this post?")) return;
    setDeleting(id);
    try {
      await adminDeletePost(id);
      setPosts((p) => p.filter((post) => post._id !== id));
      showToast("Post deleted", "info");
    } catch {
      showToast("Delete failed", "error");
    } finally {
      setDeleting(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("uplift_token");
    navigate("/admin/login");
  };

  // ─── Drag handlers ───
  const handleDragStart = (e, index) => {
    dragIndex.current = index;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(index);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (dragIndex.current === null || dragIndex.current === index) return;

    const reordered = [...posts];
    const [moved] = reordered.splice(dragIndex.current, 1);
    reordered.splice(index, 0, moved);
    setPosts(reordered);
    dragIndex.current = null;
    setDragOver(null);
  };

  const handleDragEnd = () => {
    dragIndex.current = null;
    setDragOver(null);
  };

  const saveOrder = async () => {
    setSaving(true);
    try {
      const publishedPosts = posts.filter((p) => p.status === "published");
      const ids = publishedPosts.map((p) => p._id);
      await adminApi.post("/posts/reorder", { ids });
      showToast("Order saved!", "success");
    } catch {
      showToast("Failed to save order", "error");
    } finally {
      setSaving(false);
    }
  };

  const published = posts.filter((p) => p.status === "published").length;
  const drafts = posts.filter((p) => p.status === "draft").length;
  const publishedPosts = posts.filter((p) => p.status === "published");

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
            Admin
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

        <Link
          to="/admin/new"
          className="btn btn-primary btn-sm"
          style={{ width: "100%", marginBottom: 16 }}
        >
          + New Post
        </Link>

        <button
          className={`admin-nav-link${filter === "all" ? " active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All Posts
          <span
            style={{
              marginLeft: "auto",
              fontFamily: "var(--mono)",
              fontSize: "0.6rem",
              background: "var(--bg-elevated)",
              padding: "1px 6px",
              borderRadius: 3,
            }}
          >
            {posts.length}
          </span>
        </button>
        <button
          className={`admin-nav-link${filter === "published" ? " active" : ""}`}
          onClick={() => setFilter("published")}
        >
          Published
          <span
            style={{
              marginLeft: "auto",
              fontFamily: "var(--mono)",
              fontSize: "0.6rem",
              background: "var(--bg-elevated)",
              padding: "1px 6px",
              borderRadius: 3,
            }}
          >
            {published}
          </span>
        </button>
        <button
          className={`admin-nav-link${filter === "draft" ? " active" : ""}`}
          onClick={() => setFilter("draft")}
        >
          Drafts
          <span
            style={{
              marginLeft: "auto",
              fontFamily: "var(--mono)",
              fontSize: "0.6rem",
              background: "var(--bg-elevated)",
              padding: "1px 6px",
              borderRadius: 3,
            }}
          >
            {drafts}
          </span>
        </button>

        <div
          style={{
            marginTop: "auto",
            paddingTop: 16,
            borderTop: "1px solid var(--border)",
          }}
        >
          <Link to="/" className="admin-nav-link" style={{ display: "flex" }}>
            ← View Site
          </Link>
          <button className="admin-nav-link" onClick={handleLogout}>
            Lock
          </button>
          <SourceLinks />
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
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
          <div>
            <h1
              style={{
                fontFamily: "var(--serif)",
                fontSize: "2rem",
                fontWeight: 300,
                color: "var(--text-primary)",
                marginBottom: 4,
              }}
            >
              {filter === "all"
                ? "All Posts"
                : filter === "published"
                  ? "Published"
                  : "Drafts"}
            </h1>
            <p
              style={{
                fontFamily: "var(--mono)",
                fontSize: "0.58rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
              }}
            >
              {posts.length} {posts.length === 1 ? "post" : "posts"}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {filter !== "draft" && publishedPosts.length > 1 && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={saveOrder}
                disabled={saving}
              >
                {saving ? "Saving…" : "💾 Save Order"}
              </button>
            )}
            <Link to="/admin/new" className="btn btn-primary btn-sm">
              + New Post
            </Link>
          </div>
        </div>

        {/* Drag hint */}
        {filter !== "draft" && publishedPosts.length > 1 && (
          <div
            style={{
              background: "var(--accent-dim)",
              border: "1px solid var(--accent-mid)",
              borderRadius: 6,
              padding: "10px 14px",
              marginBottom: 20,
              fontFamily: "var(--mono)",
              fontSize: "0.58rem",
              letterSpacing: "0.08em",
              color: "var(--accent)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20" />
            </svg>
            Drag published posts to reorder. Top post = Featured hero on
            homepage. Hit "Save Order" when done.
          </div>
        )}

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: 20,
                }}
              >
                <div
                  className="skeleton"
                  style={{ height: 18, width: "40%", marginBottom: 10 }}
                />
                <div
                  className="skeleton"
                  style={{ height: 14, width: "60%" }}
                />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <h3>No posts yet.</h3>
            <p>Create your first post to get started.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {posts.map((post, index) => {
              const isDraggable = post.status === "published";
              const publishedIndex = publishedPosts.findIndex(
                (p) => p._id === post._id,
              );
              const slotLabel = isDraggable
                ? getSlotLabel(publishedIndex)
                : null;
              const isOver = dragOver === index;

              return (
                <div
                  key={post._id}
                  draggable={isDraggable}
                  onDragStart={
                    isDraggable ? (e) => handleDragStart(e, index) : undefined
                  }
                  onDragOver={
                    isDraggable ? (e) => handleDragOver(e, index) : undefined
                  }
                  onDrop={isDraggable ? (e) => handleDrop(e, index) : undefined}
                  onDragEnd={isDraggable ? handleDragEnd : undefined}
                  style={{
                    background: "var(--bg-card)",
                    border: `1px solid ${isOver ? "var(--accent)" : "var(--border)"}`,
                    borderRadius: 8,
                    padding: "14px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    flexWrap: "wrap",
                    cursor: isDraggable ? "grab" : "default",
                    transform: isOver ? "scale(1.01)" : "scale(1)",
                    boxShadow: isOver
                      ? "0 4px 20px rgba(193,122,60,0.15)"
                      : "none",
                    transition:
                      "border-color 0.15s, transform 0.15s, box-shadow 0.15s",
                    opacity: dragIndex.current === index ? 0.5 : 1,
                  }}
                >
                  {/* Drag handle */}
                  {isDraggable && (
                    <div
                      style={{
                        color: "var(--text-muted)",
                        flexShrink: 0,
                        cursor: "grab",
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <circle cx="9" cy="5" r="1.5" />
                        <circle cx="15" cy="5" r="1.5" />
                        <circle cx="9" cy="12" r="1.5" />
                        <circle cx="15" cy="12" r="1.5" />
                        <circle cx="9" cy="19" r="1.5" />
                        <circle cx="15" cy="19" r="1.5" />
                      </svg>
                    </div>
                  )}

                  {/* Slot label */}
                  {slotLabel && (
                    <div
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "0.48rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color:
                          publishedIndex === 0
                            ? "var(--accent)"
                            : "var(--text-muted)",
                        background:
                          publishedIndex === 0
                            ? "var(--accent-dim)"
                            : "var(--bg-elevated)",
                        border: `1px solid ${publishedIndex === 0 ? "var(--accent-mid)" : "var(--border)"}`,
                        padding: "2px 7px",
                        borderRadius: 3,
                        flexShrink: 0,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {slotLabel}
                    </div>
                  )}

                  {/* Post info */}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 5,
                        flexWrap: "wrap",
                      }}
                    >
                      <CategoryBadge category={post.category} />
                      <span
                        className={`status-badge status-badge--${post.status}`}
                      >
                        {post.status}
                      </span>
                      {post.type === "curated" && (
                        <span
                          style={{
                            fontFamily: "var(--mono)",
                            fontSize: "0.46rem",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: "var(--text-muted)",
                          }}
                        >
                          Curated
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--serif)",
                        fontSize: "1.05rem",
                        color: "var(--text-primary)",
                        marginBottom: 3,
                      }}
                    >
                      {post.title}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "0.5rem",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "var(--text-muted)",
                      }}
                    >
                      {post.status === "published"
                        ? `Published ${formatDate(post.publishedAt)}`
                        : `Updated ${formatDate(post.updatedAt)}`}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <Link
                      to={`/admin/edit/${post._id}`}
                      className="btn btn-ghost btn-sm"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(post._id)}
                      disabled={deleting === post._id}
                    >
                      {deleting === post._id ? "…" : "Delete"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
