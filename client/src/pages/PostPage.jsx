import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getPost } from "../api";
import CategoryBadge from "../components/CategoryBadge";

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function PostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPost(slug)
      .then((res) => setPost(res.data))
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <Link to="/" className="nav-brand">
            <span className="nav-brand-name">
              <span>U</span>plift
            </span>
            <span className="nav-tagline">The news they don't lead with.</span>
          </Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">
              ← All Stories
            </Link>
          </div>
        </div>
      </nav>

      {loading ? (
        <div className="container--narrow" style={{ paddingTop: 60 }}>
          <div
            className="skeleton"
            style={{ height: 20, width: 120, marginBottom: 20 }}
          />
          <div
            className="skeleton"
            style={{ height: 48, width: "80%", marginBottom: 12 }}
          />
          <div
            className="skeleton"
            style={{ height: 48, width: "60%", marginBottom: 32 }}
          />
          <div
            className="skeleton"
            style={{ height: 16, width: "100%", marginBottom: 8 }}
          />
          <div
            className="skeleton"
            style={{ height: 16, width: "100%", marginBottom: 8 }}
          />
          <div
            className="skeleton"
            style={{ height: 16, width: "75%", marginBottom: 8 }}
          />
        </div>
      ) : post ? (
        <article
          className="container--narrow"
          style={{ paddingTop: 52, paddingBottom: 80 }}
        >
          {/* Meta */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 24,
              flexWrap: "wrap",
            }}
          >
            <CategoryBadge category={post.category} />
            {post.type === "curated" && (
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "0.5rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                }}
              >
                Curated
              </span>
            )}
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: "0.5rem",
                letterSpacing: "0.08em",
                color: "var(--text-muted)",
                textTransform: "uppercase",
              }}
            >
              {formatDate(post.publishedAt)}
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
              color: "var(--text-primary)",
              marginBottom: 20,
            }}
          >
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p
              style={{
                fontFamily: "var(--body-serif)",
                fontSize: "1.15rem",
                fontStyle: "italic",
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                marginBottom: 28,
                paddingBottom: 28,
                borderBottom: "1px solid var(--border)",
              }}
            >
              {post.excerpt}
            </p>
          )}

          {/* Source link for curated */}
          {post.type === "curated" && post.sourceUrl && (
            <a
              href={post.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "var(--accent-dim)",
                border: "1px solid var(--accent-mid)",
                borderRadius: 6,
                padding: "10px 16px",
                marginBottom: 28,
                fontFamily: "var(--mono)",
                fontSize: "0.6rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--accent)",
                textDecoration: "none",
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
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              {post.sourceLabel || "Read Original"} ↗
            </a>
          )}

          {/* Body */}
          <div
            style={{
              fontFamily: "var(--body-serif)",
              fontSize: "1.05rem",
              lineHeight: 1.85,
              color: "var(--text-secondary)",
            }}
          >
            {post.body.split("\n\n").map((para, i) => (
              <p key={i} style={{ marginBottom: "1.4em" }}>
                {para}
              </p>
            ))}
          </div>

          {/* Back */}
          <div
            style={{
              marginTop: 48,
              paddingTop: 32,
              borderTop: "1px solid var(--border)",
            }}
          >
            <Link to="/" className="btn btn-ghost btn-sm">
              ← Back to all stories
            </Link>
          </div>
        </article>
      ) : null}
    </>
  );
}
