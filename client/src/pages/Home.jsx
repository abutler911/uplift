import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPosts } from "../api";
import CategoryBadge from "../components/CategoryBadge";

const CATEGORIES = [
  "Small Wins",
  "The Big Picture",
  "Silver Linings",
  "The Helpers",
  "Humanity 101",
];

const CAT_COLORS = {
  "Small Wins": "var(--cat-small-wins)",
  "The Big Picture": "var(--cat-big-picture)",
  "Silver Linings": "var(--cat-silver-linings)",
  "The Helpers": "var(--cat-helpers)",
  "Humanity 101": "var(--cat-humanity)",
};

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateShort(d) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// ─── Hero Post ───
function HeroPost({ post }) {
  const navigate = useNavigate();
  if (!post) return null;
  return (
    <div
      onClick={() => navigate(`/post/${post.slug}`)}
      style={{
        cursor: "pointer",
        borderBottom: "2px solid var(--border-bright)",
        paddingBottom: 40,
        marginBottom: 40,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: "0.52rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}
        >
          Featured
        </span>
        <span style={{ color: "var(--border-bright)" }}>·</span>
        <CategoryBadge category={post.category} />
        {post.type === "curated" && (
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: "0.48rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            Curated
          </span>
        )}
      </div>

      <h1
        style={{
          fontFamily: "var(--serif)",
          fontSize: "clamp(2rem, 5vw, 3.4rem)",
          fontWeight: 400,
          lineHeight: 1.08,
          letterSpacing: "-0.02em",
          color: "var(--text-primary)",
          marginBottom: 16,
          maxWidth: 760,
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
        onMouseLeave={(e) =>
          (e.currentTarget.style.color = "var(--text-primary)")
        }
      >
        {post.title}
      </h1>

      {post.excerpt && (
        <p
          style={{
            fontFamily: "var(--body-serif)",
            fontSize: "1.1rem",
            fontStyle: "italic",
            color: "var(--text-secondary)",
            lineHeight: 1.7,
            maxWidth: 640,
            marginBottom: 16,
          }}
        >
          {post.excerpt}
        </p>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: "0.5rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
          }}
        >
          {formatDate(post.publishedAt)}
        </span>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: "0.58rem",
            color: "var(--accent)",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          Read →
        </span>
      </div>
    </div>
  );
}

// ─── Post Card (feed) ───
function PostCard({ post }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/post/${post.slug}`)}
      style={{
        cursor: "pointer",
        paddingBottom: 20,
        marginBottom: 20,
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
          flexWrap: "wrap",
        }}
      >
        <CategoryBadge category={post.category} />
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

      <h2
        style={{
          fontFamily: "var(--serif)",
          fontSize: "1.35rem",
          fontWeight: 400,
          lineHeight: 1.2,
          color: "var(--text-primary)",
          marginBottom: 8,
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
        onMouseLeave={(e) =>
          (e.currentTarget.style.color = "var(--text-primary)")
        }
      >
        {post.title}
      </h2>

      {post.excerpt && (
        <p
          style={{
            fontFamily: "var(--body-serif)",
            fontSize: "0.88rem",
            color: "var(--text-secondary)",
            lineHeight: 1.65,
            marginBottom: 10,
          }}
        >
          {post.excerpt}
        </p>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: "0.48rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
          }}
        >
          {formatDate(post.publishedAt)}
        </span>
        {post.type === "curated" && post.sourceLabel && (
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: "0.48rem",
              color: "var(--accent)",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <svg
              width="9"
              height="9"
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

// ─── Sidebar ───
function Sidebar({ allPosts, recent, activeCategory, onCategory }) {
  // Count per category
  const counts = {};
  CATEGORIES.forEach((c) => (counts[c] = 0));
  allPosts.forEach((p) => {
    if (counts[p.category] !== undefined) counts[p.category]++;
  });
  const total = allPosts.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* Category breakdown */}
      <div>
        <div style={sidebarHeadStyle}>Categories</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <button
            onClick={() => onCategory(null)}
            style={{
              ...catBtnStyle,
              background: !activeCategory ? "var(--accent-dim)" : "transparent",
              color: !activeCategory
                ? "var(--accent)"
                : "var(--text-secondary)",
              borderColor: !activeCategory
                ? "var(--accent-mid)"
                : "transparent",
            }}
          >
            <span>All Stories</span>
            <span style={countStyle}>{total}</span>
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategory(cat)}
              style={{
                ...catBtnStyle,
                background:
                  activeCategory === cat ? "var(--accent-dim)" : "transparent",
                color:
                  activeCategory === cat
                    ? "var(--accent)"
                    : "var(--text-secondary)",
                borderColor:
                  activeCategory === cat ? "var(--accent-mid)" : "transparent",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: CAT_COLORS[cat],
                    flexShrink: 0,
                  }}
                />
                {cat}
              </span>
              <span style={countStyle}>{counts[cat]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "var(--border)" }} />

      {/* Recent posts */}
      <div>
        <div style={sidebarHeadStyle}>Recent Stories</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {recent.slice(0, 6).map((post) => (
            <Link
              key={post._id}
              to={`/post/${post.slug}`}
              style={{ textDecoration: "none", display: "block" }}
            >
              <div
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: "0.95rem",
                  color: "var(--text-primary)",
                  lineHeight: 1.3,
                  marginBottom: 3,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--accent)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--text-primary)")
                }
              >
                {post.title}
              </div>
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "0.46rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                }}
              >
                {formatDateShort(post.publishedAt)}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

const sidebarHeadStyle = {
  fontFamily: "var(--mono)",
  fontSize: "0.54rem",
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "var(--accent)",
  marginBottom: 12,
  paddingBottom: 8,
  borderBottom: "1px solid var(--border)",
};

const catBtnStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  padding: "7px 10px",
  borderRadius: 5,
  border: "1px solid transparent",
  background: "transparent",
  fontFamily: "var(--body-serif)",
  fontSize: "0.85rem",
  cursor: "pointer",
  textAlign: "left",
  transition: "all 0.15s",
};

const countStyle = {
  fontFamily: "var(--mono)",
  fontSize: "0.52rem",
  color: "var(--text-muted)",
  background: "var(--bg-elevated)",
  padding: "1px 6px",
  borderRadius: 3,
};

// ─── Quote Strip ───
function QuoteStrip() {
  return (
    <div
      style={{
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        padding: "28px 0",
        margin: "0 0 40px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: "var(--serif)",
          fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
          fontStyle: "italic",
          fontWeight: 300,
          color: "var(--text-secondary)",
          letterSpacing: "0.02em",
          lineHeight: 1.5,
        }}
      >
        "The world is kinder than your feed suggests."
      </div>
      <div
        style={{
          fontFamily: "var(--mono)",
          fontSize: "0.5rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          marginTop: 10,
        }}
      >
        — Uplift · The news they don't lead with
      </div>
    </div>
  );
}

// ─── Skeleton ───
function SkeletonPost() {
  return (
    <div
      style={{
        paddingBottom: 20,
        marginBottom: 20,
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        className="skeleton"
        style={{ height: 18, width: 90, marginBottom: 10 }}
      />
      <div
        className="skeleton"
        style={{ height: 26, width: "80%", marginBottom: 8 }}
      />
      <div
        className="skeleton"
        style={{ height: 16, width: "100%", marginBottom: 6 }}
      />
      <div className="skeleton" style={{ height: 16, width: "60%" }} />
    </div>
  );
}

// ─── Main ───
export default function Home() {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // All posts for sidebar counts + recent
  useEffect(() => {
    getPosts({ limit: 100 })
      .then((res) => setAllPosts(res.data.posts))
      .catch(console.error);
  }, []);

  // Filtered feed
  const [feedPosts, setFeedPosts] = useState([]);
  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 10 };
    if (activeCategory) params.category = activeCategory;
    getPosts(params)
      .then((res) => {
        setFeedPosts(res.data.posts);
        setTotalPages(res.data.pages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCategory, page]);

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    setPage(1);
  };

  const heroPost = !activeCategory && page === 1 ? feedPosts[0] : null;
  const feedItems =
    !activeCategory && page === 1 ? feedPosts.slice(1) : feedPosts;

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

      {/* Masthead */}
      <div
        style={{
          borderBottom: "3px double var(--border-bright)",
          padding: "32px 0 24px",
          textAlign: "center",
          marginBottom: 0,
        }}
      >
        <div className="container">
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: "0.52rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: 10,
            }}
          >
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div
            style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(3rem, 8vw, 6rem)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: 0.9,
              color: "var(--text-primary)",
              marginBottom: 10,
            }}
          >
            <span style={{ color: "var(--accent)" }}>U</span>plift
          </div>
          <div
            style={{
              fontFamily: "var(--serif)",
              fontSize: "0.95rem",
              fontStyle: "italic",
              color: "var(--text-muted)",
              letterSpacing: "0.1em",
            }}
          >
            The news they don't lead with.
          </div>
        </div>
      </div>

      {/* Quote strip */}
      <QuoteStrip />

      <div className="container" style={{ paddingBottom: 80 }}>
        {/* Hero */}
        {heroPost && <HeroPost post={heroPost} />}

        {/* Two-column layout */}
        <div
          className="two-col"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 280px",
            gap: "48px",
            alignItems: "start",
          }}
        >
          {/* Main feed */}
          <div>
            {/* Section label */}
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: "0.54rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: 20,
                paddingBottom: 10,
                borderBottom: "2px solid var(--accent)",
                display: "inline-block",
              }}
            >
              {activeCategory || "All Stories"}
            </div>

            {loading ? (
              <>
                <SkeletonPost />
                <SkeletonPost />
                <SkeletonPost />
              </>
            ) : feedItems.length === 0 && !heroPost ? (
              <div className="empty-state">
                <h3>Nothing here yet.</h3>
                <p>Check back soon — good things are coming.</p>
              </div>
            ) : (
              feedItems.map((post) => <PostCard key={post._id} post={post} />)
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: "flex", gap: 8, marginTop: 32 }}>
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
                    fontSize: "0.56rem",
                    color: "var(--text-muted)",
                    padding: "7px 12px",
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

          {/* Sidebar */}
          <aside
            style={{
              position: "sticky",
              top: 76,
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "20px 18px",
            }}
          >
            <Sidebar
              allPosts={allPosts}
              recent={allPosts.slice(0, 6)}
              activeCategory={activeCategory}
              onCategory={handleCategory}
            />
          </aside>
        </div>
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

      {/* Mobile responsive */}
      <style>{`
        @media (max-width: 768px) {
          .two-col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
