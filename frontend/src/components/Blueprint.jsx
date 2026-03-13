import { useState, useEffect } from "react";

const pipeline = [
  {
    id: 1,
    stage: "$match",
    color: "#f97316",
    glow: "#f9731660",
    icon: "🎯",
    table: "PostLikes",
    tableColor: "#ec4899",
    description: "Find all PostLike docs where likedBy === userId",
    detail:
      "Scans the postLikes collection and picks only the rows belonging to this specific user.",
    rows: [
      { postId: "abc123", likedBy: "USER_ID ✓", createdAt: "..." },
      { postId: "def456", likedBy: "USER_ID ✓", createdAt: "..." },
      { postId: "xyz789", likedBy: "USER_ID ✓", createdAt: "..." },
    ],
    outputLabel: "3 PostLike docs matched",
  },
  {
    id: 2,
    stage: "$lookup",
    color: "#8b5cf6",
    glow: "#8b5cf660",
    icon: "🔗",
    table: "Posts",
    tableColor: "#f59e0b",
    description: "Join each PostLike → its Post using postId → _id",
    detail:
      "For each matched PostLike, MongoDB fetches the full Post document and runs the sub-pipeline to trim down fields.",
    rows: [
      {
        title: "My First Post",
        slug: "my-first-post",
        category: "Tech",
        likesCount: 42,
      },
      {
        title: "React Tips",
        slug: "react-tips",
        category: "Dev",
        likesCount: 18,
      },
      {
        title: "MongoDB Deep Dive",
        slug: "mongo-deep",
        category: "DB",
        likesCount: 99,
      },
    ],
    outputLabel: "Posts attached as array: userLikedPosts[ ]",
  },
  {
    id: 3,
    stage: "$unwind",
    color: "#06b6d4",
    glow: "#06b6d460",
    icon: "📦→📄",
    table: "Flatten",
    tableColor: "#06b6d4",
    description: "Flatten the array — one doc per liked post",
    detail:
      "The $lookup returns an array. $unwind breaks it apart so each document is a single flat object.",
    rows: [
      { doc: "{ userLikedPosts: { title: 'My First Post', ... } }" },
      { doc: "{ userLikedPosts: { title: 'React Tips', ... } }" },
      { doc: "{ userLikedPosts: { title: 'MongoDB Deep Dive', ... } }" },
    ],
    outputLabel: "3 separate flat documents",
  },
  {
    id: 4,
    stage: "$project",
    color: "#10b981",
    glow: "#10b98160",
    icon: "✂️",
    table: "Output",
    tableColor: "#10b981",
    description: "Strip away the wrapper, surface only userLikedPosts",
    detail:
      "Hides _id, exposes only the userLikedPosts object. Result is a clean array of post objects.",
    rows: [
      {
        title: "My First Post",
        slug: "my-first-post",
        category: "Tech",
        createdAt: "01 Jan 2025",
      },
      {
        title: "React Tips",
        slug: "react-tips",
        category: "Dev",
        createdAt: "15 Feb 2025",
      },
      {
        title: "MongoDB Deep Dive",
        slug: "mongo-deep",
        category: "DB",
        createdAt: "10 Mar 2025",
      },
    ],
    outputLabel: "✅ Final result returned",
  },
];

export default function Blueprint() {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);

  const step = pipeline[active];

  const go = (idx) => {
    if (idx === active) return;
    setAnimating(true);
    setTimeout(() => {
      setActive(idx);
      setAnimating(false);
    }, 200);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        fontFamily: "'Courier New', monospace",
        color: "#e2e8f0",
        padding: "32px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: "11px",
            letterSpacing: "4px",
            color: "#64748b",
            marginBottom: "8px",
          }}
        >
          MONGODB AGGREGATION BLUEPRINT
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: "22px",
            fontWeight: 700,
            color: "#f8fafc",
          }}
        >
          getUserLikedPosts Pipeline
        </h1>
        <div style={{ fontSize: "12px", color: "#475569", marginTop: "6px" }}>
          PostLikes → Posts → flatten → clean output
        </div>
      </div>

      {/* Pipeline Steps */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {pipeline.map((p, i) => (
          <div
            key={p.id}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <button
              onClick={() => go(i)}
              style={{
                background: active === i ? p.color : "#1e293b",
                border: `2px solid ${active === i ? p.color : "#334155"}`,
                borderRadius: "8px",
                padding: "10px 16px",
                color: active === i ? "#000" : "#94a3b8",
                fontFamily: "'Courier New', monospace",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: active === i ? `0 0 20px ${p.glow}` : "none",
                whiteSpace: "nowrap",
              }}
            >
              {p.stage}
            </button>
            {i < pipeline.length - 1 && (
              <div style={{ color: "#334155", fontSize: "18px" }}>→</div>
            )}
          </div>
        ))}
      </div>

      {/* Main Card */}
      <div
        style={{
          opacity: animating ? 0 : 1,
          transform: animating ? "translateY(8px)" : "translateY(0)",
          transition: "all 0.2s ease",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          maxWidth: "900px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Stage Header */}
        <div
          style={{
            background: "#0f172a",
            border: `1px solid ${step.color}40`,
            borderLeft: `4px solid ${step.color}`,
            borderRadius: "12px",
            padding: "20px 24px",
            boxShadow: `0 0 40px ${step.glow}30`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontSize: "24px" }}>{step.icon}</span>
            <span
              style={{ fontSize: "22px", fontWeight: 700, color: step.color }}
            >
              {step.stage}
            </span>
            <span
              style={{
                background: step.color + "20",
                border: `1px solid ${step.color}50`,
                borderRadius: "6px",
                padding: "2px 10px",
                fontSize: "11px",
                color: step.color,
                letterSpacing: "1px",
              }}
            >
              STAGE {step.id} / 4
            </span>
          </div>
          <div
            style={{ fontSize: "15px", color: "#cbd5e1", marginBottom: "6px" }}
          >
            {step.description}
          </div>
          <div
            style={{ fontSize: "12px", color: "#64748b", lineHeight: "1.6" }}
          >
            {step.detail}
          </div>
        </div>

        {/* Two-panel: collection + output */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          {/* Collection Visualization */}
          <div
            style={{
              background: "#0f172a",
              border: `1px solid #1e293b`,
              borderRadius: "12px",
              padding: "16px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                letterSpacing: "3px",
                color: "#475569",
                marginBottom: "12px",
              }}
            >
              {active === 0
                ? "SCANNING: postLikes"
                : active === 1
                  ? "JOINING: posts"
                  : active === 2
                    ? "UNWINDING: array"
                    : "PROJECTING: result"}
            </div>
            {step.rows.map((row, i) => (
              <div
                key={i}
                style={{
                  background: "#1e293b",
                  border: `1px solid ${step.color}30`,
                  borderRadius: "6px",
                  padding: "10px 12px",
                  marginBottom: "8px",
                  fontSize: "11px",
                  color: "#94a3b8",
                  lineHeight: "1.8",
                  animation: `fadeIn 0.3s ease ${i * 0.1}s both`,
                }}
              >
                {row.doc ? (
                  <span style={{ color: "#64748b" }}>{row.doc}</span>
                ) : (
                  Object.entries(row).map(([k, v]) => (
                    <div key={k}>
                      <span style={{ color: "#475569" }}>{k}: </span>
                      <span
                        style={{
                          color:
                            k === "likedBy"
                              ? "#4ade80"
                              : k === "title"
                                ? step.color
                                : "#cbd5e1",
                        }}
                      >
                        {String(v)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            ))}
          </div>

          {/* Output Panel */}
          <div
            style={{
              background: "#0f172a",
              border: `1px solid ${step.color}40`,
              borderRadius: "12px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "10px",
                  letterSpacing: "3px",
                  color: "#475569",
                  marginBottom: "12px",
                }}
              >
                PIPELINE FLOW
              </div>

              {/* Flow viz */}
              {pipeline.map((p, i) => (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "10px",
                    opacity: i > active ? 0.3 : 1,
                    transition: "opacity 0.3s",
                  }}
                >
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background:
                        i === active
                          ? p.color
                          : i < active
                            ? p.color + "50"
                            : "#1e293b",
                      border: `2px solid ${i <= active ? p.color : "#334155"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: i === active ? "#000" : "#64748b",
                      flexShrink: 0,
                      boxShadow: i === active ? `0 0 12px ${p.glow}` : "none",
                    }}
                  >
                    {i < active ? "✓" : i + 1}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: i <= active ? p.color : "#475569",
                        fontWeight: 600,
                      }}
                    >
                      {p.stage}
                    </div>
                    <div style={{ fontSize: "10px", color: "#475569" }}>
                      {p.description.slice(0, 40)}...
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: "16px",
                padding: "12px",
                background: step.color + "15",
                border: `1px solid ${step.color}40`,
                borderRadius: "8px",
                fontSize: "12px",
                color: step.color,
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              {step.outputLabel}
            </div>
          </div>
        </div>

        {/* Nav */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <button
            onClick={() => go(Math.max(0, active - 1))}
            disabled={active === 0}
            style={{
              flex: 1,
              padding: "12px",
              background: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: active === 0 ? "#334155" : "#94a3b8",
              fontFamily: "'Courier New', monospace",
              fontSize: "13px",
              cursor: active === 0 ? "not-allowed" : "pointer",
            }}
          >
            ← prev stage
          </button>
          <button
            onClick={() => go(Math.min(pipeline.length - 1, active + 1))}
            disabled={active === pipeline.length - 1}
            style={{
              flex: 1,
              padding: "12px",
              background:
                active === pipeline.length - 1 ? "#1e293b" : step.color,
              border: `1px solid ${step.color}`,
              borderRadius: "8px",
              color: active === pipeline.length - 1 ? "#334155" : "#000",
              fontFamily: "'Courier New', monospace",
              fontSize: "13px",
              fontWeight: 700,
              cursor:
                active === pipeline.length - 1 ? "not-allowed" : "pointer",
            }}
          >
            next stage →
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
