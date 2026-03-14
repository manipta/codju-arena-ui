import React from "react";
import { useTheme } from "../context/ThemeContext";

interface Props {
  active: string;
  onNavigate: (screen: string) => void;
}

const TABS = [
  { id: "practice", icon: "📚", label: "Practice" },
  { id: "arena", icon: "⚔️", label: "Arena" },
  { id: "home", icon: "🏠", label: "Home" },
  { id: "progress", icon: "📊", label: "Progress" },
  { id: "leaderboard", icon: "🏆", label: "Ranks" },
];

const TabBar: React.FC<Props> = ({ active, onNavigate }) => {
  const { colors } = useTheme();

  return (
    <div
      style={{
        display: "flex",
        background: colors.navBackground,
        borderTop: `1px solid ${colors.border}`,
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
            color: active === tab.id ? colors.accent : colors.textMuted,
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
};

export default TabBar;
