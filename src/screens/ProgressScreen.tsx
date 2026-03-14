import React from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useUserProfile } from "../hooks/useUserProfile";
import { useUserStats } from "../hooks/useUserStats";
import { useLevels } from "../hooks/useLevels";
import ProfileAvatar from "../components/ProfileAvatar";
import {
  getLevelFromXP,
  getXPProgress,
  getXPToNext,
  LEVELS,
} from "../utils/levels";

interface Props {
  onNavigate: (screen: string) => void;
}

const EDUCATION_LEVELS = [
  {
    label: "Foundation",
    icon: "●",
    minXP: 0,
    color: "#8A8FA8",
    description: "Starting your journey",
  },
  {
    label: "Elementary",
    icon: "●",
    minXP: 0,
    color: "#5DCAA5",
    description: "Building basics",
  },
  {
    label: "Intermediate",
    icon: "●",
    minXP: 700,
    color: "#378ADD",
    description: "Expanding knowledge",
  },
  {
    label: "Advanced",
    icon: "●",
    minXP: 1500,
    color: "#EF9F27",
    description: "Mastering concepts",
  },
  {
    label: "Expert",
    icon: "●",
    minXP: 2000,
    color: "#D85A30",
    description: "Specialized learning",
  },
  {
    label: "Master",
    icon: "●",
    minXP: 5000,
    color: "#8B5CF6",
    description: "Peak performance",
  },
];

const ProgressScreen: React.FC<Props> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { theme, colors } = useTheme();
  const { profile, loading: profileLoading } = useUserProfile();
  const { stats, loading: statsLoading } = useUserStats();
  const { levels, calculateUserLevel } = useLevels();

  if (!user) return null;

  // Use detailed profile data if available, fallback to basic user data
  const detailedProfile = profile?.user || user;
  const currentLevel = profile?.currentLevel || getLevelFromXP(user.xp);
  const nextLevel = profile?.nextLevel;
  const progress = profile?.levelProgress?.percentage || getXPProgress(user.xp);
  const xpToNext = nextLevel?.xpRequired || getXPToNext(user.xp);

  // Use dynamic levels for progression timeline if available
  const progressionLevels = levels.length > 0 ? levels : EDUCATION_LEVELS;

  // Helper function to safely filter levels
  const filterLevelsByXP = (xp: number) => {
    if (levels.length > 0) {
      return levels.filter((level) => xp >= level.minXP);
    } else {
      return EDUCATION_LEVELS.filter((level) => xp >= level.minXP);
    }
  };

  // Build 7-day streak display
  const today = new Date();
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const dayLabels = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return {
      label: days[d.getDay()],
      done: i < user.streakCount,
      isToday: i === 6,
    };
  });

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
      {/* Header */}
      <div
        style={{
          background: colors.navBackground,
          borderBottom: `1px solid ${colors.border}`,
          padding: "20px",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            fontFamily: '"Fredoka One", cursive',
            fontSize: 24,
            background: colors.gradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textAlign: "center",
          }}
        >
          📊 Your Progress
        </div>
      </div>

      <div style={{ padding: "20px" }}>
        {/* Learning Progression */}
        <div
          style={{
            background: colors.cardBackground,
            borderRadius: 16,
            border: `1px solid ${colors.border}`,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: colors.text,
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            🎓 Learning Progression
          </div>

          {/* Current Level Highlight */}
          <div style={{ marginBottom: 24 }}>
            {progressionLevels.map((level, i) => {
              const isCurrent = i === filterLevelsByXP(user.xp).length - 1;

              if (!isCurrent) return null;

              return (
                <div
                  key={i}
                  style={{
                    background: `linear-gradient(135deg, ${level.color}20, ${level.color}05)`,
                    border: `1px solid ${level.color}40`,
                    borderRadius: 12,
                    padding: 18,
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: level.color,
                      boxShadow: `0 0 16px ${level.color}60`,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 800,
                        color: level.color,
                        marginBottom: 4,
                      }}
                    >
                      {(level as any).name || (level as any).label} Level
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: colors.textMuted,
                      }}
                    >
                      {level.description}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: colors.text,
                    }}
                  >
                    {user.xp} XP
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress Timeline */}
          <div style={{ position: "relative" }}>
            {/* Background line */}
            <div
              style={{
                position: "absolute",
                top: 20,
                left: 12,
                right: 12,
                height: 3,
                background:
                  theme === "dark"
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.08)",
                borderRadius: 2,
              }}
            />

            {/* Progress line */}
            <div
              style={{
                position: "absolute",
                top: 20,
                left: 12,
                width: `${Math.min(
                  100,
                  (user.xp /
                    (progressionLevels[progressionLevels.length - 1]?.minXP ||
                      5000)) *
                    100,
                )}%`,
                height: 3,
                background: colors.gradient,
                borderRadius: 2,
                transition: "width 1s ease",
              }}
            />

            {/* Level markers */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                position: "relative",
              }}
            >
              {progressionLevels.map((level, i) => {
                const reached = user.xp >= level.minXP;
                const isCurrent = i === filterLevelsByXP(user.xp).length - 1;

                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      flex: 1,
                      position: "relative",
                    }}
                  >
                    {/* Marker dot */}
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: reached
                          ? level.color
                          : theme === "dark"
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.1)",
                        border: `3px solid ${
                          reached
                            ? level.color
                            : theme === "dark"
                              ? "rgba(255,255,255,0.2)"
                              : "rgba(0,0,0,0.2)"
                        }`,
                        marginBottom: 12,
                        transition: "all 0.3s ease",
                        boxShadow: isCurrent
                          ? `0 0 20px ${level.color}60`
                          : "none",
                        transform: isCurrent ? "scale(1.2)" : "scale(1)",
                      }}
                    >
                      {reached && (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            background: level.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {isCurrent && (
                            <div
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: "#fff",
                                animation: "pulseRing 2s ease-in-out infinite",
                              }}
                            />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Label */}
                    <div
                      style={{
                        fontSize: 8,
                        fontWeight: 700,
                        textAlign: "center",
                        color: isCurrent
                          ? level.color
                          : reached
                            ? colors.text
                            : colors.textMuted,
                        lineHeight: 1.2,
                        maxWidth: 70,
                      }}
                    >
                      {(level as any).name || (level as any).label}
                    </div>

                    {/* XP requirement */}
                    {level.minXP > 0 && (
                      <div
                        style={{
                          fontSize: 9,
                          color: colors.textMuted,
                          marginTop: 4,
                        }}
                      >
                        {level.minXP} XP
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div
          style={{
            background: colors.cardBackground,
            borderRadius: 16,
            border: `1px solid ${colors.border}`,
            padding: 20,
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: colors.text,
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            📈 Performance Stats
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            {[
              {
                label: "Total Battles",
                value:
                  stats?.weeklyStats?.battlesPlayed ??
                  (detailedProfile?.battleWins ?? 0) +
                    (detailedProfile?.battleLosses ?? 0),
                color: colors.textMuted,
                icon: "⚔️",
              },
              {
                label: "Wins",
                value:
                  stats?.weeklyStats?.battlesWon ??
                  detailedProfile.battleWins ??
                  0,
                color: colors.success,
                icon: "🏆",
              },
              {
                label: "Win Rate",
                value: `${Math.round(
                  ((detailedProfile.battleWins ?? 0) /
                    ((detailedProfile.battleWins ?? 0) +
                      (detailedProfile.battleLosses ?? 0) || 1)) *
                    100,
                )}%`,
                color: colors.accentSecondary,
                icon: "📊",
              },
              {
                label: "Win Streak",
                value: detailedProfile.winStreak ?? 0,
                color: colors.warning,
                icon: "🔥",
              },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  background:
                    theme === "dark"
                      ? "rgba(255,255,255,0.03)"
                      : "rgba(0,0,0,0.03)",
                  borderRadius: 12,
                  padding: 16,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</div>
                <div
                  style={{
                    fontFamily: '"Fredoka One", cursive',
                    fontSize: 20,
                    color: stat.color,
                    marginBottom: 4,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: colors.textMuted,
                    fontWeight: 700,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressScreen;
