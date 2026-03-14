import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";

interface ArenaProps {
  onNavigate: (screen: string) => void;
  onStartBattle: (
    topic: string,
    mode: "create" | "join",
    code?: string,
  ) => void;
}

const TOPICS = [
  { key: "general", label: "🌍 General" },
  { key: "science", label: "🔬 Science" },
  { key: "math", label: "➕ Math" },
  { key: "history", label: "📖 History" },
  { key: "tech", label: "💻 Tech" },
];

export const ArenaScreen: React.FC<ArenaProps> = ({
  onNavigate,
  onStartBattle,
}) => {
  const [selectedTopic, setSelectedTopic] = useState("general");
  const { colors, theme } = useTheme();

  const navStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 20px",
    background: colors.navBackground,
    borderBottom: `1px solid ${colors.border}`,
    position: "sticky" as const,
    top: 0,
    zIndex: 100,
  };

  const backBtnStyle = {
    background: "none",
    border: "none",
    color: colors.text,
    fontSize: 18,
    cursor: "pointer",
    padding: "4px 8px",
    fontFamily: '"Nunito", sans-serif',
  };

  const logoStyle = {
    fontFamily: '"Fredoka One", cursive',
    fontSize: 20,
    background: colors.gradient,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  return (
    <div
      style={{
        fontFamily: '"Nunito", sans-serif',
        color: colors.text,
        paddingBottom: 80,
        background: colors.background,
        minHeight: "100vh",
      }}
    >
      <nav style={navStyle}>
        <button onClick={() => onNavigate("home")} style={backBtnStyle}>
          ←
        </button>
        <div style={logoStyle}>⚔️ Arena</div>
        <div style={{ fontSize: 13, color: colors.textMuted }}>Choose mode</div>
      </nav>

      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            style={{
              fontFamily: '"Fredoka One", cursive',
              fontSize: 28,
              background: "linear-gradient(90deg,#EF9F27,#D85A30)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: 4,
            }}
          >
            Choose Your Battle
          </div>
          <div style={{ fontSize: 13, color: colors.textMuted }}>
            Pick a mode and prove what you know
          </div>
        </div>

        {/* Topic selection */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            color: colors.textMuted,
            letterSpacing: "0.1em",
            marginBottom: 10,
          }}
        >
          TOPIC
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 20,
          }}
        >
          {TOPICS.map((t) => (
            <button
              key={t.key}
              onClick={() => setSelectedTopic(t.key)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 800,
                border: `1.5px solid ${selectedTopic === t.key ? colors.accent : colors.border}`,
                background:
                  selectedTopic === t.key
                    ? theme === "dark"
                      ? "rgba(93,202,165,0.1)"
                      : "rgba(16,185,129,0.1)"
                    : "transparent",
                color:
                  selectedTopic === t.key ? colors.accent : colors.textMuted,
                cursor: "pointer",
                fontFamily: '"Nunito", sans-serif',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Modes */}
        {[
          {
            icon: "⚡",
            label: "1v1 Live Battle",
            desc: "Real-time race. Speed + accuracy wins.",
            badge: "HOT",
            featured: true,
            action: () => onStartBattle(selectedTopic, "create"),
          },
          {
            icon: "🔗",
            label: "Join Room",
            desc: "Enter a room code to join a friend's battle.",
            badge: null,
            featured: false,
            action: () => onNavigate("join-room"),
          },
          {
            icon: "🎯",
            label: "Daily Challenge",
            desc: "Complete today's special challenge for bonus rewards.",
            badge: "DAILY",
            featured: false,
            action: () => onNavigate("daily-challenge"),
          },
          {
            icon: "👥",
            label: "Challenge a Friend",
            desc: "Create a room and share the code.",
            badge: null,
            featured: false,
            action: () => onNavigate("lobby"),
          },
        ].map((m) => (
          <div
            key={m.label}
            onClick={m.action}
            style={{
              background: m.featured
                ? theme === "dark"
                  ? "linear-gradient(135deg,rgba(239,159,39,0.1),rgba(216,90,48,0.1))"
                  : "linear-gradient(135deg,rgba(245,158,11,0.1),rgba(239,68,68,0.1))"
                : colors.cardBackground,
              border: `1px solid ${
                m.featured
                  ? theme === "dark"
                    ? "rgba(239,159,39,0.3)"
                    : "rgba(245,158,11,0.3)"
                  : colors.border
              }`,
              borderRadius: 16,
              padding: 18,
              marginBottom: 10,
              display: "flex",
              alignItems: "center",
              gap: 14,
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: 14,
                background: m.featured
                  ? theme === "dark"
                    ? "rgba(239,159,39,0.15)"
                    : "rgba(245,158,11,0.15)"
                  : theme === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                flexShrink: 0,
              }}
            >
              {m.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  marginBottom: 3,
                  color: colors.text,
                }}
              >
                {m.label}
              </div>
              <div style={{ fontSize: 12, color: colors.textMuted }}>
                {m.desc}
              </div>
            </div>
            {m.badge && (
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  padding: "3px 10px",
                  borderRadius: 20,
                  background:
                    theme === "dark"
                      ? "rgba(239,159,39,0.15)"
                      : "rgba(245,158,11,0.15)",
                  color: theme === "dark" ? "#EF9F27" : "#F59E0B",
                  border:
                    theme === "dark"
                      ? "1px solid rgba(239,159,39,0.3)"
                      : "1px solid rgba(245,158,11,0.3)",
                }}
              >
                {m.badge}
              </div>
            )}
            <span style={{ color: colors.textMuted, fontSize: 18 }}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── LOBBY ──────────────────────────────────────────────────────────────────

interface LobbyProps {
  onNavigate: (screen: string) => void;
  onCreate: (topic: string) => void;
  onJoin: (code: string) => void;
  roomCode: string | null;
  isWaiting: boolean;
}

export const LobbyScreen: React.FC<LobbyProps> = ({
  onNavigate,
  onCreate,
  onJoin,
  roomCode,
  isWaiting,
}) => {
  const [joinCode, setJoinCode] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("general");
  const { colors, theme } = useTheme();

  return (
    <div
      style={{
        fontFamily: '"Nunito", sans-serif',
        color: colors.text,
        paddingBottom: 80,
        background: colors.background,
        minHeight: "100vh",
      }}
    >
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          background: colors.navBackground,
          borderBottom: `1px solid ${colors.border}`,
          position: "sticky" as const,
          top: 0,
          zIndex: 100,
        }}
      >
        <button
          onClick={() => onNavigate("arena")}
          style={{
            background: "none",
            border: "none",
            color: colors.text,
            fontSize: 22,
            cursor: "pointer",
            padding: 0,
          }}
        >
          ←
        </button>
        <div
          style={{
            fontFamily: '"Fredoka One", cursive',
            fontSize: 20,
            background: colors.gradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Room Setup
        </div>
        <div />
      </nav>

      <div style={{ padding: 20 }}>
        {!isWaiting ? (
          <>
            {/* Topic */}
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: colors.textMuted,
                  letterSpacing: "0.1em",
                  marginBottom: 8,
                }}
              >
                TOPIC
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {TOPICS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setSelectedTopic(t.key)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 800,
                      border: `1.5px solid ${selectedTopic === t.key ? colors.accent : colors.border}`,
                      background:
                        selectedTopic === t.key
                          ? theme === "dark"
                            ? "rgba(93,202,165,0.1)"
                            : "rgba(16,185,129,0.1)"
                          : "transparent",
                      color:
                        selectedTopic === t.key
                          ? colors.accent
                          : colors.textMuted,
                      cursor: "pointer",
                      fontFamily: '"Nunito", sans-serif',
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Create room */}
            <div
              style={{
                background: colors.cardBackground,
                borderRadius: 16,
                border: `1px solid ${colors.border}`,
                padding: 20,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: colors.textMuted,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase" as const,
                  marginBottom: 16,
                }}
              >
                Create a Room
              </div>
              <div
                style={{
                  fontFamily: '"Fredoka One", cursive',
                  fontSize: 38,
                  letterSpacing: 8,
                  textAlign: "center" as const,
                  color: colors.accent,
                  marginBottom: 6,
                }}
              >
                {roomCode || "——————"}
              </div>
              <div
                style={{
                  textAlign: "center" as const,
                  fontSize: 11,
                  color: colors.textMuted,
                  marginBottom: 16,
                }}
              >
                Share this code with your opponent
              </div>
              <button
                onClick={() => onCreate(selectedTopic)}
                style={{
                  width: "100%",
                  padding: 14,
                  borderRadius: 12,
                  border: "none",
                  background: colors.accent,
                  color: "#fff",
                  fontFamily: '"Nunito", sans-serif',
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Generate Room Code
              </button>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                margin: "6px 0",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: colors.border,
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  color: colors.textMuted,
                  fontWeight: 800,
                }}
              >
                OR
              </span>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: colors.border,
                }}
              />
            </div>

            {/* Join room */}
            <div
              style={{
                background: colors.cardBackground,
                borderRadius: 16,
                border: `1px solid ${colors.border}`,
                padding: 20,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: colors.textMuted,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase" as const,
                  marginBottom: 16,
                }}
              >
                Join a Room
              </div>
              <input
                style={{
                  width: "100%",
                  background:
                    theme === "dark"
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(0,0,0,0.06)",
                  border: `1px solid ${colors.border}`,
                  borderRadius: 10,
                  padding: "12px 16px",
                  fontSize: 20,
                  color: colors.text,
                  fontFamily: '"Fredoka One", cursive',
                  letterSpacing: 8,
                  textAlign: "center" as const,
                  outline: "none",
                  marginBottom: 12,
                  boxSizing: "border-box" as const,
                }}
                placeholder="ENTER CODE"
                maxLength={6}
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              />
              <button
                onClick={() => joinCode.length >= 4 && onJoin(joinCode)}
                style={{
                  width: "100%",
                  padding: 14,
                  borderRadius: 12,
                  border: "none",
                  background: colors.accent,
                  color: "#fff",
                  fontFamily: '"Nunito", sans-serif',
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Join Battle
              </button>
            </div>
          </>
        ) : (
          /* Waiting state */
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                border: `3px solid ${
                  theme === "dark"
                    ? "rgba(93,202,165,0.25)"
                    : "rgba(16,185,129,0.25)"
                }`,
                margin: "0 auto 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                animation: "pulseRing 2s ease-in-out infinite",
              }}
            >
              🧑
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                marginBottom: 6,
                color: colors.text,
              }}
            >
              Waiting for opponent
            </div>
            <div
              style={{
                fontSize: 13,
                color: colors.textMuted,
                marginBottom: 16,
              }}
            >
              Room code:{" "}
              <span
                style={{ color: colors.accent, fontWeight: 800, fontSize: 18 }}
              >
                {roomCode}
              </span>
            </div>
            <div style={{ fontSize: 12, color: colors.textMuted }}>
              Share the code with your friend to start
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
