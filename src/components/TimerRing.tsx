import React from "react";
import { useTheme } from "../context/ThemeContext";

interface Props {
  timeLeft: number;
  total: number;
  size?: number;
}

const TimerRing: React.FC<Props> = ({ timeLeft, total = 15, size = 68 }) => {
  const { colors, theme } = useTheme();
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / total;
  const offset = circumference * (1 - progress);

  const color =
    timeLeft <= 5
      ? colors.error
      : timeLeft <= 10
        ? colors.warning
        : colors.success;

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 68 68"
        style={{ transform: "rotate(-90deg)" }}
      >
        {/* Track */}
        <circle
          cx="34"
          cy="34"
          r={radius}
          fill="none"
          stroke={
            theme === "dark" ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"
          }
          strokeWidth="5"
        />
        {/* Progress */}
        <circle
          cx="34"
          cy="34"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 1s linear, stroke 0.3s ease",
          }}
        />
      </svg>
      {/* Number in centre */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: '"Fredoka One", cursive',
          fontSize: 22,
          color,
          transition: "color 0.3s ease",
        }}
      >
        {timeLeft}
      </div>
    </div>
  );
};

export default TimerRing;
