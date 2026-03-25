import { useState } from "react";

const SOURCES = [
  {
    group: "Daily Reads",
    links: [
      { label: "Good News Network", url: "https://www.goodnewsnetwork.org" },
      { label: "Positive News", url: "https://positive.news" },
      {
        label: "Reasons to Be Cheerful",
        url: "https://reasonstobecheerful.world",
      },
      {
        label: "The Guardian — The Upside",
        url: "https://www.theguardian.com/world/series/the-upside",
      },
      {
        label: "BBC — The Optimist",
        url: "https://www.bbc.com/future/columns/the-optimist",
      },
      {
        label: "Brighter Side of News",
        url: "https://www.thebrighterside.news",
      },
      { label: "Sunny Skyz", url: "https://www.sunnyskyz.com" },
    ],
  },
  {
    group: "Science & Progress",
    links: [
      { label: "Our World in Data", url: "https://ourworldindata.org" },
      { label: "Future Crunch", url: "https://futurecrun.ch" },
      { label: "Kurzgesagt", url: "https://www.youtube.com/@kurzgesagt" },
      { label: "New Atlas", url: "https://newatlas.com" },
      { label: "ScienceAlert", url: "https://www.sciencealert.com" },
      { label: "Freethink", url: "https://www.freethink.com" },
    ],
  },
  {
    group: "Environment & Climate",
    links: [
      {
        label: "Reasons to Be Cheerful — Climate",
        url: "https://reasonstobecheerful.world/category/environment",
      },
      { label: "Carbon Brief", url: "https://www.carbonbrief.org" },
      { label: "Mongabay", url: "https://news.mongabay.com" },
      { label: "The Cool Down", url: "https://www.thecooldown.com" },
    ],
  },
  {
    group: "Humanity & Community",
    links: [
      { label: "Humans of New York", url: "https://www.humansofnewyork.com" },
      { label: "Upworthy", url: "https://www.upworthy.com" },
      { label: "Atlas Obscura", url: "https://www.atlasobscura.com" },
      { label: "The Optimist Daily", url: "https://www.theoptimistdaily.com" },
    ],
  },
  {
    group: "Reddit",
    links: [
      {
        label: "r/UpliftingNews",
        url: "https://www.reddit.com/r/UpliftingNews",
      },
      {
        label: "r/HumansBeingBros",
        url: "https://www.reddit.com/r/HumansBeingBros",
      },
      { label: "r/MadeMeSmile", url: "https://www.reddit.com/r/MadeMeSmile" },
      {
        label: "r/nextfuckinglevel",
        url: "https://www.reddit.com/r/nextfuckinglevel",
      },
      { label: "r/wholesome", url: "https://www.reddit.com/r/wholesome" },
    ],
  },
];

export default function SourceLinks() {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        borderTop: "1px solid var(--border)",
        paddingTop: 12,
        marginTop: 12,
      }}
    >
      {/* Toggle */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "6px 0",
          fontFamily: "var(--mono)",
          fontSize: "0.56rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
          </svg>
          Sources
        </span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Content */}
      {open && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            paddingTop: 10,
            animation: "fadeIn 0.2s ease",
          }}
        >
          {SOURCES.map((section) => (
            <div key={section.group}>
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "0.48rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  marginBottom: 6,
                }}
              >
                {section.group}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {section.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontFamily: "var(--body-serif)",
                      fontSize: "0.8rem",
                      color: "var(--text-secondary)",
                      textDecoration: "none",
                      padding: "4px 8px",
                      borderRadius: 4,
                      transition: "color 0.15s, background 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--accent)";
                      e.currentTarget.style.background = "var(--accent-dim)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--text-secondary)";
                      e.currentTarget.style.background = "transparent";
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
                      style={{ flexShrink: 0, opacity: 0.5 }}
                    >
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}

          <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0); } }`}</style>
        </div>
      )}
    </div>
  );
}
