import React from "react";
import { useAuth } from "../context/AuthContext";
import { useLevels } from "../hooks/useLevels";
import ProfileAvatar from "../components/ProfileAvatar";
import StreakBadge from "../components/StreakBadge";
import NotificationBell from "../components/NotificationBell";
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

const HomeScreen: React.FC<Props> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const { levels, calculateUserLevel } = useLevels();

  if (!user) return null;

  // Use dynamic levels if available, fallback to static
  const userLevelInfo = levels.length > 0 ? calculateUserLevel(user.xp) : null;
  const currentLevel = userLevelInfo?.currentLevel || getLevelFromXP(user.xp);
  const nextLevel =
    userLevelInfo?.nextLevel ||
    LEVELS.find((l) => l.level === (currentLevel as any).level + 1);
  const progress =
    userLevelInfo?.levelProgress.percentage || getXPProgress(user.xp);
  const xpToNext = nextLevel ? nextLevel.minXP - user.xp : getXPToNext(user.xp);

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
        color: "#F0EEE8",
        paddingBottom: 80,
      }}
    >
      {/* Nav */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          background: "#181C27",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            fontFamily: '"Fredoka One", cursive',
            fontSize: 20,
            background: "linear-gradient(90deg,#5DCAA5,#378ADD)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          ⚔️ Codju Arena
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <NotificationBell />
          <StreakBadge count={user.streakCount} size="sm" />
          <div
            style={{
              background: "rgba(29,158,117,0.15)",
              border: "1px solid rgba(29,158,117,0.3)",
              borderRadius: 20,
              padding: "3px 10px",
              fontSize: 12,
              fontWeight: 800,
              color: "#5DCAA5",
            }}
          >
            ⚡ {user.xp} XP
          </div>
          <button
            onClick={logout}
            style={{
              background: "none",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              color: "#8A8FA8",
              fontSize: 11,
              padding: "4px 8px",
              cursor: "pointer",
              fontFamily: '"Nunito", sans-serif',
            }}
          >
            Out
          </button>
        </div>
      </nav>

      <div style={{ padding: "20px 20px 0" }}>
        {/* === PLAYER PROGRESS SECTION === */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            color: "#8A8FA8",
            letterSpacing: "0.1em",
            marginBottom: 12,
          }}
        >
          PLAYER PROGRESS
        </div>

        {/* Current Level & XP Bar */}
        <div
          style={{
            background: "#1E2333",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.08)",
            padding: 16,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <ProfileAvatar xp={user.xp} size={44} userName={user.name} />
              <div>
                <div
                  style={{
                    fontFamily: '"Fredoka One", cursive',
                    fontSize: 20,
                    color: currentLevel.color,
                  }}
                >
                  {currentLevel.name}
                </div>
                <div style={{ fontSize: 11, color: "#8A8FA8" }}>
                  {userLevelInfo
                    ? (currentLevel as any).description
                    : (currentLevel as any).school}
                </div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: "#8A8FA8", textAlign: "right" }}>
              <div style={{ fontWeight: 800, color: "#F0EEE8" }}>
                {user.xp} XP
              </div>
              <div>/ {currentLevel.maxXP ?? "∞"}</div>
            </div>
          </div>

          {/* Bar */}
          <div
            style={{
              height: 10,
              background: "rgba(255,255,255,0.07)",
              borderRadius: 5,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: 5,
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${currentLevel.color}, #378ADD)`,
                transition: "width 1s ease",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: 20,
                  background: "rgba(255,255,255,0.3)",
                  animation: "shimmer 1.5s infinite",
                }}
              />
            </div>
          </div>

          {nextLevel && (
            <div style={{ fontSize: 11, color: "#8A8FA8", marginTop: 6 }}>
              📚 {xpToNext} XP to reach{" "}
              {userLevelInfo ? nextLevel.name : (nextLevel as any).school} —
              become {nextLevel.name}!
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            color: "#8A8FA8",
            letterSpacing: "0.1em",
            marginBottom: 12,
          }}
        >
          QUICK PLAY
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <div
            onClick={() => onNavigate("arena")}
            style={{
              gridColumn: "1/-1",
              background:
                "linear-gradient(135deg,rgba(29,158,117,0.15),rgba(55,138,221,0.15))",
              border: "1px solid rgba(29,158,117,0.35)",
              borderRadius: 14,
              padding: "18px 16px",
              cursor: "pointer",
              placeItems: "center",
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 6 }}>⚔️</div>
            <div style={{ fontSize: 15, fontWeight: 800 }}>Enter the Arena</div>
            <div style={{ fontSize: 11, color: "#8A8FA8", marginTop: 2 }}>
              Challenge students across India
            </div>
          </div>
          {/* <div onClick={() => onNavigate("join-room")} style={actionCardStyle}>
            <div style={{ fontSize: 26, marginBottom: 6 }}>🔗</div>
            <div style={{ fontSize: 13, fontWeight: 800 }}>Join Room</div>
            <div style={{ fontSize: 11, color: "#8A8FA8", marginTop: 2 }}>
              Enter a room code
            </div>
          </div> */}
          <div onClick={() => onNavigate("practice")} style={actionCardStyle}>
            <div style={{ fontSize: 26, marginBottom: 6 }}>📚</div>
            <div style={{ fontSize: 13, fontWeight: 800 }}>Practice</div>
            <div style={{ fontSize: 11, color: "#8A8FA8", marginTop: 2 }}>
              Solo practice sessions
            </div>
          </div>
          <div
            onClick={() => onNavigate("leaderboard")}
            style={actionCardStyle}
          >
            <div style={{ fontSize: 26, marginBottom: 6 }}>🏆</div>
            <div style={{ fontSize: 13, fontWeight: 800 }}>Leaderboard</div>
            <div style={{ fontSize: 11, color: "#8A8FA8", marginTop: 2 }}>
              See who's #1
            </div>
          </div>
        </div>

        {/* Daily Challenge Banner */}
        <div
          onClick={() => onNavigate("daily-challenge")}
          style={{
            background:
              "linear-gradient(135deg,rgba(239,159,39,0.15),rgba(216,90,48,0.15))",
            border: "1px solid rgba(239,159,39,0.35)",
            borderRadius: 16,
            padding: "16px 20px",
            cursor: "pointer",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>
              🎯 Daily Challenge
            </div>
            <div style={{ fontSize: 12, color: "#8A8FA8" }}>
              Complete today's challenge for bonus XP
            </div>
          </div>
          <div style={{ fontSize: 24 }}>→</div>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 10,
            marginBottom: 16,
          }}
        >
          {[
            { label: "Wins", value: user.battleWins, color: "#5DCAA5" },
            {
              label: "Win Streak",
              value: `${user.winStreak}🔥`,
              color: "#EF9F27",
            },
            {
              label: "Battles",
              value: user.battleWins + user.battleLosses,
              color: "#8A8FA8",
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "#1E2333",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.07)",
                padding: "12px 10px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: '"Fredoka One", cursive',
                  fontSize: 22,
                  color: s.color,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "#8A8FA8",
                  marginTop: 2,
                  fontWeight: 800,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* === PROGRESS SECTION === */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            color: "#8A8FA8",
            letterSpacing: "0.1em",
            marginBottom: 12,
          }}
        >
          📊 PROGRESS
        </div>

        {/* Learning Progression */}
        <div
          style={{
            background: "#1E2333",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.08)",
            padding: 20,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: "#F0EEE8",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            🎓 Learning Progression
          </div>

          {/* Current Level Highlight */}
          <div style={{ marginBottom: 20 }}>
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
                    padding: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: level.color,
                      boxShadow: `0 0 12px ${level.color}60`,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: level.color,
                        marginBottom: 2,
                      }}
                    >
                      {(level as any).name || (level as any).label} Level
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#8A8FA8",
                      }}
                    >
                      {level.description}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: "#F0EEE8",
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
                top: 16,
                left: 8,
                right: 8,
                height: 2,
                background: "rgba(255,255,255,0.08)",
                borderRadius: 1,
              }}
            />

            {/* Progress line */}
            <div
              style={{
                position: "absolute",
                top: 16,
                left: 8,
                width: `${Math.min(100, (user.xp / (progressionLevels[progressionLevels.length - 1]?.minXP || 5000)) * 100)}%`,
                height: 2,
                background: "linear-gradient(90deg, #5DCAA5, #378ADD)",
                borderRadius: 1,
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
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        background: reached
                          ? level.color
                          : "rgba(255,255,255,0.1)",
                        border: `2px solid ${reached ? level.color : "rgba(255,255,255,0.2)"}`,
                        marginBottom: 8,
                        transition: "all 0.3s ease",
                        boxShadow: isCurrent
                          ? `0 0 16px ${level.color}60`
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
                                width: 6,
                                height: 6,
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
                        fontSize: 9,
                        fontWeight: 700,
                        textAlign: "center",
                        color: isCurrent
                          ? level.color
                          : reached
                            ? "#F0EEE8"
                            : "#8A8FA8",
                        lineHeight: 1.2,
                        maxWidth: 60,
                      }}
                    >
                      {(level as any).name || (level as any).label}
                    </div>

                    {/* XP requirement */}
                    {level.minXP > 0 && (
                      <div
                        style={{
                          fontSize: 8,
                          color: "#8A8FA8",
                          marginTop: 2,
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

        {/* Daily Streak - Enhanced UI */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #FF6B6B 0%, #FF8E53 50%, #FF6B35 100%)",
            borderRadius: 20,
            padding: 20,
            marginBottom: 16,
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(255, 107, 107, 0.3)",
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: "absolute",
              top: -20,
              right: -20,
              width: 100,
              height: 100,
              background:
                "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -30,
              left: -30,
              width: 80,
              height: 80,
              background:
                "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
              borderRadius: "50%",
            }}
          />

          {/* Header Section */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 20,
              position: "relative",
              zIndex: 1,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#fff",
                  marginBottom: 4,
                  textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                🔥 Daily Streak
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.9)",
                  fontWeight: 600,
                }}
              >
                Keep the momentum going!
              </div>
            </div>

            {/* Streak Counter */}
            <div
              style={{
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                borderRadius: 16,
                padding: "12px 16px",
                textAlign: "center",
                border: "1px solid rgba(255,255,255,0.3)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 900,
                  color: "#fff",
                  lineHeight: 1,
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                {user.streakCount}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.9)",
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                  marginTop: 2,
                }}
              >
                DAYS
              </div>
            </div>
          </div>

          {/* Weekly Progress */}
          <div
            style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: 16,
              padding: 16,
              position: "relative",
              zIndex: 1,
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: "rgba(255,255,255,0.9)",
                marginBottom: 12,
                letterSpacing: "0.5px",
              }}
            >
              THIS WEEK
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {dayLabels.map((d, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    position: "relative",
                  }}
                >
                  {/* Day Circle */}
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "1",
                      borderRadius: "50%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 9,
                      fontWeight: 800,
                      background:
                        d.done || d.isToday
                          ? "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)"
                          : "rgba(255,255,255,0.1)",
                      border: d.isToday
                        ? "2px solid #FFD700"
                        : d.done
                          ? "2px solid #FFA500"
                          : "2px solid rgba(255,255,255,0.2)",
                      color:
                        d.done || d.isToday
                          ? "#8B4513"
                          : "rgba(255,255,255,0.7)",
                      boxShadow:
                        d.done || d.isToday
                          ? "0 4px 12px rgba(255, 215, 0, 0.4)"
                          : "none",
                      transition: "all 0.3s ease",
                      transform: d.isToday ? "scale(1.1)" : "scale(1)",
                    }}
                  >
                    <div style={{ fontSize: 8, marginBottom: 1 }}>
                      {d.label}
                    </div>
                    <div style={{ fontSize: 10 }}>
                      {d.done ? "✓" : d.isToday ? "●" : "○"}
                    </div>
                  </div>

                  {/* Today Indicator */}
                  {d.isToday && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: -8,
                        left: "50%",
                        transform: "translateX(-50%)",
                        fontSize: 8,
                        fontWeight: 800,
                        color: "#FFD700",
                        textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                      }}
                    >
                      TODAY
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div
              style={{
                height: 6,
                background: "rgba(255,255,255,0.2)",
                borderRadius: 3,
                overflow: "hidden",
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(user.streakCount % 7) * (100 / 7)}%`,
                  background:
                    "linear-gradient(90deg, #FFD700 0%, #FFA500 100%)",
                  borderRadius: 3,
                  transition: "width 0.5s ease",
                  boxShadow: "0 0 8px rgba(255, 215, 0, 0.6)",
                }}
              />
            </div>

            {/* Motivational Text */}
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.8)",
                textAlign: "center",
                fontWeight: 600,
              }}
            >
              {user.streakCount === 0
                ? "Start your streak today! 🚀"
                : user.streakCount < 7
                  ? `${7 - (user.streakCount % 7)} more days to complete the week! 💪`
                  : "Amazing consistency! Keep it up! 🌟"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const actionCardStyle: React.CSSProperties = {
  background: "#1E2333",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 14,
  padding: "16px 14px",
  cursor: "pointer",

  placeItems: "center",
};

export default HomeScreen;
