import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../api";

export default function AdminLogin() {
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await adminLogin(passphrase);
      localStorage.setItem("uplift_token", passphrase);
      navigate("/admin");
    } catch {
      setError("Wrong passphrase.");
      setPassphrase("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: 380 }}>
        {/* Wordmark */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              fontFamily: "var(--serif)",
              fontSize: "3rem",
              fontWeight: 600,
              lineHeight: 1,
              marginBottom: 8,
            }}
          >
            <span style={{ color: "var(--accent)" }}>U</span>
            <span style={{ color: "var(--text-primary)" }}>plift</span>
          </div>
          <div
            style={{
              width: 40,
              height: 1,
              background:
                "linear-gradient(to right, transparent, var(--accent), transparent)",
              margin: "0 auto 10px",
            }}
          />
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: "0.55rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            Admin Access
          </div>
        </div>

        {/* Form */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-bright)",
            borderRadius: 12,
            padding: "28px 24px",
            boxShadow: "var(--shadow)",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                border: `1px solid ${error ? "rgba(193,122,60,0.5)" : "var(--border-bright)"}`,
                borderRadius: 6,
                padding: "0 14px",
                background: "var(--bg-elevated)",
                height: 46,
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--text-muted)"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <input
                type="password"
                value={passphrase}
                onChange={(e) => {
                  setPassphrase(e.target.value);
                  setError("");
                }}
                placeholder="Passphrase"
                autoFocus
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  outline: "none",
                  fontFamily: "var(--mono)",
                  fontSize: "0.9rem",
                  letterSpacing: "0.18em",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "0.6rem",
                  color: "var(--accent)",
                  letterSpacing: "0.08em",
                  textAlign: "center",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !passphrase}
              style={{ width: "100%", height: 44 }}
            >
              {loading ? "Checking…" : "Enter Admin"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
