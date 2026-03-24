import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminGetPosts, adminDeletePost } from "../api";
import CategoryBadge from "../components/CategoryBadge";

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Admin() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [deleting, setDeleting] = useState(null);

  // Check auth
  useEffect(() => {
    const token = localStorage.getItem("uplift_token");
    if (!token) navigate("/admin/login");
  }, []);

  const load = () => {
    setLoading(true);
    const params = {};
    if (filter !== "all") params.status = filter;
    adminGetPosts(params)
      .then((res) => setPosts(res.data))
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
    } catch (err) {
      alert("Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("uplift_token");
    navigate("/admin/login");
  };

  const published = posts.filter((p) => p.status === "published").length;
  const drafts = posts.filter((p) => p.status === "draft").length;

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
          <Link to="/admin/new" className="btn btn-primary">
            + New Post
          </Link>
        </div>

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
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {posts.map((post) => (
              <div
                key={post._id}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  flexWrap: "wrap",
                }}
              >
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
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
