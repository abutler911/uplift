import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPosts } from "../api";
import CategoryBadge from "../components/CategoryBadge";

const CATEGORIES = [
  "All",
  "Small Wins",
  "The Big Picture",
  "Silver Linings",
  "The Helpers",
  "Humanity 101",
];

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function PostCard({ post }) {
  const navigate = useNavigate();
  return (
    <div className="post-card" onClick={() => navigate(`/post/${post.slug}`)}>
      <div className="post-card__body">
        <div className="post-card__meta">
          <CategoryBadge category={post.category} />
          {post.type === "curated" && (
            <span className="post-card__type">Curated</span>
          )}
        </div>
        <h2 className="post-card__title">{post.title}</h2>
        {post.excerpt && <p className="post-card__excerpt">{post.excerpt}</p>}
      </div>
      <div className="post-card__footer">
        <span className="post-card__date">{formatDate(post.publishedAt)}</span>
        {post.type === "curated" && post.sourceLabel && (
          <span className="post-card__source">
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            {post.sourceLabel}
          </span>
        )}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="post-card" style={{ pointerEvents: "none" }}>
      <div className="post-card__body" style={{ gap: 12 }}>
        <div className="skeleton" style={{ height: 22, width: 100 }} />
        <div className="skeleton" style={{ height: 28, width: "85%" }} />
        <div className="skeleton" style={{ height: 16, width: "100%" }} />
        <div className="skeleton" style={{ height: 16, width: "70%" }} />
      </div>
      <div className="post-card__footer">
        <div className="skeleton" style={{ height: 12, width: 100 }} />
      </div>
    </div>
  );
}

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12 };
    if (category !== "All") params.category = category;
    getPosts(params)
      .then((res) => {
        setPosts(res.data.posts);
        setTotalPages(res.data.pages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category, page]);

  const handleCategory = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  return (
    <>
      {/* Nav */}
      <nav className="nav">
        <div className="nav-inner">
          <Link to="/" className="nav-brand">
            <span className="nav-brand-name">
              <span>U</span>plift
            </span>
            <span className="nav-tagline">The news they don't lead with.</span>
          </Link>
          <div className="nav-links">
            <Link to="/admin" className="nav-link">
              Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div
        style={{ borderBottom: "1px solid var(--border)", marginBottom: 40 }}
      >
        <div className="container" style={{ padding: "56px 1.5rem 40px" }}>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: "0.56rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                width: 20,
                height: 1,
                background: "var(--accent)",
                display: "inline-block",
              }}
            />
            Good things are happening
          </div>
          <h1
            style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(2.8rem, 6vw, 5rem)",
              fontWeight: 300,
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
              color: "var(--text-primary)",
              marginBottom: 16,
            }}
          >
            The news they
            <br />
            <em style={{ fontStyle: "italic", color: "var(--accent)" }}>
              don't lead with.
            </em>
          </h1>
          <p
            style={{
              fontFamily: "var(--body-serif)",
              fontSize: "1.05rem",
              fontStyle: "italic",
              fontWeight: 300,
              color: "var(--text-secondary)",
              maxWidth: 480,
              lineHeight: 1.7,
            }}
          >
            An antidote to the doomscroll. Curated stories and original takes on
            the people, ideas, and moments quietly making the world better.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 80 }}>
        {/* Category filter */}
        <div className="filter-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-tab${category === cat ? " active" : ""}`}
              onClick={() => handleCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="post-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <h3>Nothing here yet.</h3>
            <p>Check back soon — good things are coming.</p>
          </div>
        ) : (
          <div className="post-grid">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 8,
              marginTop: 48,
            }}
          >
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
            >
              ← Prev
            </button>
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: "0.58rem",
                color: "var(--text-muted)",
                padding: "7px 14px",
                letterSpacing: "0.1em",
              }}
            >
              {page} / {totalPages}
            </span>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "24px 1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          maxWidth: 1140,
          margin: "0 auto",
        }}
      >
        <span
          style={{
            fontFamily: "var(--serif)",
            fontSize: "0.95rem",
            fontStyle: "italic",
            color: "var(--text-secondary)",
          }}
        >
          Uplift — by Andrew Butler
        </span>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: "0.5rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
          }}
        >
          © 2026
        </span>
      </footer>
    </>
  );
}
