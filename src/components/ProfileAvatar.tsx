import React from "react";
import { getLevelFromXP } from "../utils/levels";

interface Props {
  xp: number;
  size?: number;
  animate?: boolean;
  userName?: string;
}

const ProfileAvatar: React.FC<Props> = ({
  xp,
  size = 52,
  animate = false,
  userName = "User",
}) => {
  const level = getLevelFromXP(xp);

  // Get initials from user name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };

  // Professional gradient colors based on level
  const getGradient = (levelNum: number) => {
    const gradients = {
      1: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", // Purple-Blue
      2: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", // Pink-Red
      3: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", // Blue-Cyan
      4: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", // Green-Teal
      5: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", // Pink-Yellow
    };
    return gradients[levelNum as keyof typeof gradients] || gradients[1];
  };

  // Level badge icon
  const getLevelIcon = (levelNum: number) => {
    const icons = {
      1: "🌱", // Seed
      2: "⭐", // Star
      3: "🔥", // Fire
      4: "💎", // Diamond
      5: "👑", // Crown
    };
    return icons[levelNum as keyof typeof icons] || icons[1];
  };

  const initials = getInitials(userName);
  const gradient = getGradient(level.level);
  const levelIcon = getLevelIcon(level.level);

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        background: gradient,
        color: "#fff",
        fontSize: size * 0.35,
        fontWeight: 800,
        fontFamily: '"Nunito", sans-serif',
        border: `2px solid ${level.color}`,
        boxShadow: `0 4px 12px ${level.color}40`,
        animation: animate ? "profilePulse 2s ease-in-out infinite" : "none",
        transition: "all 0.3s ease",
      }}
    >
      {initials}

      {/* Level badge */}
      <div
        style={{
          position: "absolute",
          bottom: -3,
          right: -3,
          width: size * 0.4,
          height: size * 0.4,
          borderRadius: "50%",
          background: level.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.22,
          border: "3px solid #0F1117",
          boxShadow: `0 2px 8px rgba(0,0,0,0.4), 0 0 0 1px ${level.color}40`,
        }}
      >
        {levelIcon}
      </div>
    </div>
  );
};

export default ProfileAvatar;
