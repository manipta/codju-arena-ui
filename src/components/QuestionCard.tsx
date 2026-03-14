import React from "react";
import { useTheme } from "../context/ThemeContext";

interface Props {
  question: string;
  options: string[];
  onAnswer: (index: number) => void;
  selectedIndex: number | null;
  correctIndex: number | null;
  disabled: boolean;
}

const LETTERS = ["A", "B", "C", "D"];

const QuestionCard: React.FC<Props> = ({
  question,
  options,
  onAnswer,
  selectedIndex,
  correctIndex,
  disabled,
}) => {
  const { colors, theme } = useTheme();

  const getStyle = (i: number): React.CSSProperties => {
    const base: React.CSSProperties = {
      background: colors.cardBackground,
      border: `1.5px solid ${colors.border}`,
      borderRadius: 12,
      padding: "14px 12px",
      cursor: disabled ? "default" : "pointer",
      textAlign: "left",
      transition: "all 0.15s",
      width: "100%",
      fontFamily: '"Nunito", sans-serif',
      color: colors.text,
    };

    // After reveal
    if (correctIndex !== null) {
      if (i === correctIndex) {
        return {
          ...base,
          background:
            theme === "dark" ? "rgba(29,158,117,0.2)" : "rgba(16,185,129,0.2)",
          border: `1.5px solid ${colors.success}`,
        };
      }
      if (i === selectedIndex && i !== correctIndex) {
        return {
          ...base,
          background:
            theme === "dark" ? "rgba(226,75,74,0.2)" : "rgba(239,68,68,0.2)",
          border: `1.5px solid ${colors.error}`,
        };
      }
      return { ...base, opacity: 0.5 };
    }

    // Selected before reveal
    if (i === selectedIndex) {
      return {
        ...base,
        background:
          theme === "dark" ? "rgba(55,138,221,0.2)" : "rgba(59,130,246,0.2)",
        border: `1.5px solid ${colors.accentSecondary}`,
      };
    }

    return base;
  };

  return (
    <div>
      {/* Question text */}
      <div
        style={{
          background: colors.cardBackground,
          border: `1px solid ${colors.border}`,
          borderRadius: 14,
          padding: "18px 16px",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            color: colors.textMuted,
            letterSpacing: "0.1em",
            marginBottom: 8,
          }}
        >
          QUESTION
        </div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            lineHeight: 1.5,
            color: colors.text,
          }}
        >
          {question}
        </div>
      </div>

      {/* Options grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {options.map((opt, i) => (
          <button
            key={i}
            style={getStyle(i)}
            disabled={disabled}
            onClick={() => !disabled && onAnswer(i)}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: colors.textMuted,
                display: "block",
                marginBottom: 3,
              }}
            >
              {LETTERS[i]}
            </span>
            <span style={{ fontSize: 13, fontWeight: 700 }}>{opt}</span>
            {correctIndex !== null && i === correctIndex && (
              <span style={{ float: "right", color: colors.success }}>✓</span>
            )}
            {correctIndex !== null &&
              i === selectedIndex &&
              i !== correctIndex && (
                <span style={{ float: "right", color: colors.error }}>✗</span>
              )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
