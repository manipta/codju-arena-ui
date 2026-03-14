import React from "react";

interface Props {
  active: string;
  onNavigate: (screen: string) => void;
}

const TABS = [
  { id: "home", icon: "🏠", label: "Home" },
  { id: "arena", icon: "⚔️", label: "Arena" },
  { id: "practice", icon: "📚", label: "Practice" },
  { id: "leaderboard", icon: "🏆", label: "Ranks" },
];

const TabBar: React.FC<Props> = ({ active, onNavigate }) => (
  <div
    style={{
      display: "flex",
      background: "#181C27",
      borderTop: "1px solid rgba(255,255,255,0.08)",
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 100,
    }}
  >
    {TABS.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onNavigate(tab.id)}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "10px 0 8px",
          cursor: "pointer",
          border: "none",
          background: "none",
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: "0.03em",
          color: active === tab.id ? "#5DCAA5" : "#8A8FA8",
          fontFamily: '"Nunito", sans-serif',
          transition: "color 0.2s",
        }}
      >
        <span style={{ fontSize: 20, marginBottom: 2, lineHeight: 1 }}>
          {tab.icon}
        </span>
        {tab.label}
      </button>
    ))}
  </div>
);

export default TabBar;
