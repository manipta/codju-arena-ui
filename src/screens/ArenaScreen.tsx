import React, { useState } from "react";

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

  return (
    <div
      style={{
        fontFamily: '"Nunito", sans-serif',
        color: "#F0EEE8",
        paddingBottom: 80,
      }}
    >
      <nav style={navStyle}>
        <button onClick={() => onNavigate("home")} style={backBtnStyle}>
          ←
        </button>
        <div style={logoStyle}>⚔️ Arena</div>
        <div style={{ fontSize: 13, color: "#8A8FA8" }}>Choose mode</div>
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
          <div style={{ fontSize: 13, color: "#8A8FA8" }}>
            Pick a mode and prove what you know
          </div>
        </div>

        {/* Topic selection */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            color: "#8A8FA8",
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
                border: `1.5px solid ${selectedTopic === t.key ? "#5DCAA5" : "rgba(255,255,255,0.08)"}`,
                background:
                  selectedTopic === t.key
                    ? "rgba(93,202,165,0.1)"
                    : "transparent",
                color: selectedTopic === t.key ? "#5DCAA5" : "#8A8FA8",
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
                ? "linear-gradient(135deg,rgba(239,159,39,0.1),rgba(216,90,48,0.1))"
                : "#1E2333",
              border: `1px solid ${m.featured ? "rgba(239,159,39,0.3)" : "rgba(255,255,255,0.08)"}`,
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
                  ? "rgba(239,159,39,0.15)"
                  : "rgba(255,255,255,0.05)",
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
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 3 }}>
                {m.label}
              </div>
              <div style={{ fontSize: 12, color: "#8A8FA8" }}>{m.desc}</div>
            </div>
            {m.badge && (
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  padding: "3px 10px",
                  borderRadius: 20,
                  background: "rgba(239,159,39,0.15)",
                  color: "#EF9F27",
                  border: "1px solid rgba(239,159,39,0.3)",
                }}
              >
                {m.badge}
              </div>
            )}
            <span style={{ color: "#8A8FA8", fontSize: 18 }}>›</span>
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

  return (
    <div
      style={{
        fontFamily: '"Nunito", sans-serif',
        color: "#F0EEE8",
        paddingBottom: 80,
      }}
    >
      <nav style={navStyle}>
        <button onClick={() => onNavigate("arena")} style={backBtnStyle}>
          ←
        </button>
        <div style={logoStyle}>Room Setup</div>
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
                  color: "#8A8FA8",
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
                      border: `1.5px solid ${selectedTopic === t.key ? "#5DCAA5" : "rgba(255,255,255,0.08)"}`,
                      background:
                        selectedTopic === t.key
                          ? "rgba(93,202,165,0.1)"
                          : "transparent",
                      color: selectedTopic === t.key ? "#5DCAA5" : "#8A8FA8",
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
            <div style={boxStyle}>
              <div style={sectionTitleStyle}>Create a Room</div>
              <div
                style={{
                  fontFamily: '"Fredoka One", cursive',
                  fontSize: 38,
                  letterSpacing: 8,
                  textAlign: "center",
                  color: "#5DCAA5",
                  marginBottom: 6,
                }}
              >
                {roomCode || "——————"}
              </div>
              <div
                style={{
                  textAlign: "center",
                  fontSize: 11,
                  color: "#8A8FA8",
                  marginBottom: 16,
                }}
              >
                Share this code with your opponent
              </div>
              <button
                onClick={() => onCreate(selectedTopic)}
                style={btnPrimary}
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
                  background: "rgba(255,255,255,0.07)",
                }}
              />
              <span style={{ fontSize: 11, color: "#8A8FA8", fontWeight: 800 }}>
                OR
              </span>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(255,255,255,0.07)",
                }}
              />
            </div>

            {/* Join room */}
            <div style={boxStyle}>
              <div style={sectionTitleStyle}>Join a Room</div>
              <input
                style={codeInputStyle}
                placeholder="ENTER CODE"
                maxLength={6}
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              />
              <button
                onClick={() => joinCode.length >= 4 && onJoin(joinCode)}
                style={btnPrimary}
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
                border: "3px solid rgba(93,202,165,0.25)",
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
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>
              Waiting for opponent
            </div>
            <div style={{ fontSize: 13, color: "#8A8FA8", marginBottom: 16 }}>
              Room code:{" "}
              <span style={{ color: "#5DCAA5", fontWeight: 800, fontSize: 18 }}>
                {roomCode}
              </span>
            </div>
            <div style={{ fontSize: 12, color: "#8A8FA8" }}>
              Share the code with your friend to start
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Shared styles ─────────────────────────────────────────────────────────────
const navStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "14px 20px",
  background: "#181C27",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  position: "sticky",
  top: 0,
  zIndex: 100,
};
const backBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#F0EEE8",
  fontSize: 22,
  cursor: "pointer",
  padding: 0,
};
const logoStyle: React.CSSProperties = {
  fontFamily: '"Fredoka One", cursive',
  fontSize: 20,
  background: "linear-gradient(90deg,#5DCAA5,#378ADD)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};
const boxStyle: React.CSSProperties = {
  background: "#1E2333",
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.08)",
  padding: 20,
  marginBottom: 12,
};
const sectionTitleStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  color: "#8A8FA8",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: 16,
};
const btnPrimary: React.CSSProperties = {
  width: "100%",
  padding: 14,
  borderRadius: 12,
  border: "none",
  background: "#1D9E75",
  color: "#fff",
  fontFamily: '"Nunito", sans-serif',
  fontSize: 14,
  fontWeight: 800,
  cursor: "pointer",
};
const codeInputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  padding: "12px 16px",
  fontSize: 20,
  color: "#F0EEE8",
  fontFamily: '"Fredoka One", cursive',
  letterSpacing: 8,
  textAlign: "center",
  outline: "none",
  marginBottom: 12,
  boxSizing: "border-box",
};
