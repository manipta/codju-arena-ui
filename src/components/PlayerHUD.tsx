import React from "react";
import ProfileAvatar from "./ProfileAvatar";
import { getLevelFromXP } from "../utils/levels";
import { useTheme } from "../context/ThemeContext";

interface Props {
  name: string;
  xp: number;
  score: number;
  hp: number;
  isOpponent?: boolean;
  hasAnswered?: boolean;
}

const PlayerHUD: React.FC<Props> = ({
  name,
  xp,
  score,
  hp,
  isOpponent,
  hasAnswered,
}) => {
  const { colors } = useTheme();
  const level = getLevelFromXP(xp);
  const hearts = Array.from({ length: 3 }, (_, i) => (i < hp ? "❤️" : "🖤"));

  return (
    <div style={{ textAlign: "center", width: 110 }}>
      <ProfileAvatar xp={xp} size={48} userName={name} />

      <div
        style={{
          fontSize: 12,
          fontWeight: 800,
          color: colors.text,
          marginTop: 4,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: 110,
        }}
      >
        {name}
      </div>

      <div
        style={{
          display: "inline-block",
          fontSize: 9,
          fontWeight: 800,
          padding: "1px 8px",
          borderRadius: 20,
          marginTop: 2,
          marginBottom: 4,
          background: `${level.color}22`,
          border: `1px solid ${level.color}55`,
          color: level.color,
        }}
      >
        {level.name}
      </div>

      {/* Hearts */}
      <div style={{ fontSize: 13, letterSpacing: 2, marginBottom: 4 }}>
        {hearts.join("")}
      </div>

      {/* Score */}
      <div
        style={{
          fontFamily: '"Fredoka One", cursive',
          fontSize: 22,
          color: colors.text,
        }}
      >
        {score}
      </div>

      {/* Opponent status */}
      {isOpponent && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            marginTop: 4,
            fontSize: 10,
            fontWeight: 700,
            color: hasAnswered ? colors.success : colors.textMuted,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              display: "inline-block",
              background: hasAnswered ? colors.success : colors.warning,
              animation: hasAnswered ? "none" : "blink 1s ease-in-out infinite",
            }}
          />
          {hasAnswered ? "Answered!" : "Thinking..."}
        </div>
      )}
    </div>
  );
};

export default PlayerHUD;
