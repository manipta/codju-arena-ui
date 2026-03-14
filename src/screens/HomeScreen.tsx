import React from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useUserProfile } from "../hooks/useUserProfile";
import { useLevels } from "../hooks/useLevels";
import ProfileAvatar from "../components/ProfileAvatar";
import StreakBadge from "../components/StreakBadge";
// import NotificationBell from "../components/NotificationBell";
import {
  getLevelFromXP,
  getXPProgress,
  getXPToNext,
  LEVELS,
} from "../utils/levels";

interface Props {
  onNavigate: (screen: string) => void;
}

const HomeScreen: React.FC<Props> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const { theme, colors, toggleTheme } = useTheme();
  const { profile, loading: profileLoading } = useUserProfile();
  const { levels, calculateUserLevel } = useLevels();

  if (!user) return null;

  // Use detailed profile data if available, fallback to basic user data
  const detailedProfile = profile?.user || user;
  const currentLevel = profile?.currentLevel || getLevelFromXP(user.xp);
  const nextLevel = profile?.nextLevel;
  const progress = profile?.levelProgress?.percentage || getXPProgress(user.xp);
  const xpToNext =
    nextLevel?.xpRequired ||
    (nextLevel ? nextLevel.xpRequired : getXPToNext(user.xp));

  // Theme-aware action card style
  const actionCardStyle: React.CSSProperties = {
    background: colors.cardBackground,
    border: `1px solid ${colors.border}`,
    borderRadius: 14,
    padding: "16px 14px",
    cursor: "pointer",
    placeItems: "center",
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
      {/* Nav */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          background: colors.navBackground,
          borderBottom: `1px solid ${colors.border}`,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          className={theme === "dark" ? "gradient-text" : "gradient-text-light"}
          style={{
            fontFamily: '"Fredoka One", cursive',
            fontSize: 20,
          }}
        >
          ⚔️ Codju Arena
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* <NotificationBell /> */}
          <StreakBadge count={detailedProfile.streakCount} size="sm" />
          {/* <div
            style={{
              background:
                theme === "dark"
                  ? "rgba(29,158,117,0.15)"
                  : "rgba(16,185,129,0.15)",
              border:
                theme === "dark"
                  ? "1px solid rgba(29,158,117,0.3)"
                  : "1px solid rgba(16,185,129,0.3)",
              borderRadius: 20,
              padding: "3px 10px",
              fontSize: 12,
              fontWeight: 800,
              color: colors.accent,
            }}
          >
            ⚡ {detailedProfile.xp} XP
          </div> */}
          <button
            onClick={toggleTheme}
            style={{
              background: "none",
              border: `1px solid ${colors.border}`,
              borderRadius: 8,
              color: colors.textMuted,
              fontSize: 14,
              padding: "4px 8px",
              cursor: "pointer",
              fontFamily: '"Nunito", sans-serif',
            }}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button
            onClick={logout}
            style={{
              background: "none",
              border: `1px solid ${colors.border}`,
              borderRadius: 8,
              color: colors.textMuted,
              fontSize: 13,
              padding: "4px 8px",
              cursor: "pointer",
              fontFamily: '"Nunito", sans-serif',
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <div style={{ padding: "20px 20px 0" }}>
        {/* === PLAYER PROGRESS SECTION === */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            color: colors.textMuted,
            letterSpacing: "0.1em",
            marginBottom: 12,
          }}
        >
          PLAYER PROGRESS
        </div>

        {/* Current Level & XP Bar */}
        <div
          style={{
            background: colors.cardBackground,
            borderRadius: 16,
            border: `1px solid ${colors.border}`,
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
              <ProfileAvatar
                xp={detailedProfile.xp}
                size={44}
                userName={detailedProfile.name}
              />
              <div>
                <div
                  style={{
                    fontFamily: '"Fredoka One", cursive',
                    fontSize: 20,
                    color: theme === "dark" ? "#FFFFFF" : colors.text,
                  }}
                >
                  {currentLevel.name}
                </div>
                <div style={{ fontSize: 11, color: colors.textMuted }}>
                  {profile?.currentLevel?.description ||
                    (currentLevel as any).school}
                </div>
              </div>
            </div>
            <div
              style={{
                fontSize: 12,
                color: colors.textMuted,
                textAlign: "right",
              }}
            >
              <div style={{ fontWeight: 800, color: colors.text }}>
                {detailedProfile.xp} XP
              </div>
              <div>/ {profile?.levelProgress?.total || "∞"}</div>
            </div>
          </div>

          {/* Bar */}
          <div
            style={{
              height: 10,
              background:
                theme === "dark"
                  ? "rgba(255,255,255,0.07)"
                  : "rgba(0,0,0,0.07)",
              borderRadius: 5,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: 5,
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${currentLevel.color}, ${colors.accentSecondary})`,
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
            <div
              style={{ fontSize: 11, color: colors.textMuted, marginTop: 6 }}
            >
              📚 {xpToNext} XP to reach {nextLevel.name} — become{" "}
              {nextLevel.name}!
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            color: colors.textMuted,
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
            <div
              style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}
            >
              Challenge students across India
            </div>
          </div>
          <div onClick={() => onNavigate("practice")} style={actionCardStyle}>
            <div style={{ fontSize: 26, marginBottom: 6 }}>📚</div>
            <div style={{ fontSize: 13, fontWeight: 800 }}>Practice</div>
            <div
              style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}
            >
              Solo practice sessions
            </div>
          </div>
          <div
            onClick={() => onNavigate("leaderboard")}
            style={actionCardStyle}
          >
            <div style={{ fontSize: 26, marginBottom: 6 }}>🏆</div>
            <div style={{ fontSize: 13, fontWeight: 800 }}>Leaderboard</div>
            <div
              style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}
            >
              See who's #1
            </div>
          </div>
        </div>

        {/* Daily Challenge Banner */}
        <div
          onClick={() => onNavigate("daily-challenge")}
          style={{
            background:
              theme === "dark"
                ? "linear-gradient(135deg,rgba(239,159,39,0.15),rgba(216,90,48,0.15))"
                : "linear-gradient(135deg,rgba(245,158,11,0.15),rgba(239,68,68,0.15))",
            border:
              theme === "dark"
                ? "1px solid rgba(239,159,39,0.35)"
                : "1px solid rgba(245,158,11,0.35)",
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
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                marginBottom: 4,
                color: colors.text,
              }}
            >
              🎯 Daily Challenge
            </div>
            <div style={{ fontSize: 12, color: colors.textMuted }}>
              Complete today's challenge for bonus XP
            </div>
          </div>
          <div style={{ fontSize: 24, color: colors.text }}>→</div>
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
            {
              label: "Wins",
              value: detailedProfile.battleWins ?? 0,
              color: colors.success,
            },
            {
              label: "Win Streak",
              value: `${detailedProfile.winStreak ?? 0}`,
              color: colors.warning,
            },
            {
              label: "Battles",
              value:
                (detailedProfile.battleWins ?? 0) +
                (detailedProfile.battleLosses ?? 0),
              color: colors.textMuted,
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: colors.cardBackground,
                borderRadius: 12,
                border: `1px solid ${colors.borderLight}`,
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
                  color: colors.textMuted,
                  marginTop: 2,
                  fontWeight: 800,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
