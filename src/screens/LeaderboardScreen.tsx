import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { getLevelFromXP } from "../utils/levels";
import ProfileAvatar from "../components/ProfileAvatar";

const API = process.env.REACT_APP_API_URL || "http://localhost:3001";

interface LeaderEntry {
  id: string;
  name: string;
  xp: number;
  level: number;
  streakCount: number;
  battleWins: number;
  battleLosses: number;
  winStreak: number;
  lastActiveDate: string;
}

interface LeaderboardResponse {
  leaderboard: LeaderEntry[];
  myRank: number;
  totalUsers: number;
}

type LeaderboardPeriod = "weekly" | "monthly" | "allTime";

interface Props {
  onNavigate: (screen: string) => void;
}

const LeaderboardScreen: React.FC<Props> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState<LeaderEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<LeaderboardPeriod>("weekly");
  const [myRank, setMyRank] = useState<number>(0);
  const [totalUsers, setTotalUsers] = useState<number>(0);

  const fetchLeaderboard = async (selectedPeriod: LeaderboardPeriod) => {
    setLoading(true);
    setError(null);
    try {
      console.log(
        `🏆 Fetching ${selectedPeriod} leaderboard from:`,
        `${API}/users/leaderboard?period=${selectedPeriod}`,
      );
      const response = await axios.get(
        `${API}/users/leaderboard?period=${selectedPeriod}`,
      );
      console.log("✅ Leaderboard response:", response.data);

      if (response.data.leaderboard) {
        // New API format with structured response
        setLeaders(response.data.leaderboard);
        setMyRank(response.data.myRank || 0);
        setTotalUsers(
          response.data.totalUsers || response.data.leaderboard.length,
        );
      } else {
        // Fallback for simple array response
        setLeaders(response.data);
        const userRank =
          response.data.findIndex((l: LeaderEntry) => l.id === user?.id) + 1;
        setMyRank(userRank);
        setTotalUsers(response.data.length);
      }
    } catch (err) {
      console.error("❌ Leaderboard fetch failed:", err);
      setError("Failed to load leaderboard");
      setLeaders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(period);
  }, [period, user?.id]);

  const top3 = leaders.slice(0, 3);
  const calculatedRank = leaders.findIndex((l) => l.id === user?.id) + 1;

  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;
  const podiumHeights = [72, 100, 52];
  const podiumColors = ["#8c8ca0", "#EF9F27", "#b06037"];
  const podiumNums = [2, 1, 3];

  return (
    <div
      style={{
        fontFamily: '"Nunito", sans-serif',
        color: "#F0EEE8",
        paddingBottom: 80,
      }}
    >
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
        <button
          onClick={() => onNavigate("home")}
          style={{
            background: "none",
            border: "none",
            color: "#F0EEE8",
            fontSize: 22,
            cursor: "pointer",
          }}
        >
          ←
        </button>
        <div
          style={{
            fontFamily: '"Fredoka One", cursive',
            fontSize: 20,
            background: "linear-gradient(90deg,#5DCAA5,#378ADD)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          🏆 Rankings
        </div>
        <div style={{ fontSize: 11, color: "#8A8FA8" }}>
          {period === "weekly"
            ? "This week"
            : period === "monthly"
              ? "This month"
              : "All time"}
        </div>
      </nav>

      <div style={{ padding: "20px 20px 0" }}>
        {/* Period selector */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: "#8A8FA8",
              letterSpacing: "0.1em",
              marginBottom: 8,
            }}
          >
            LEADERBOARD PERIOD
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {[
              { key: "weekly" as LeaderboardPeriod, label: "This Week" },
              { key: "monthly" as LeaderboardPeriod, label: "This Month" },
              { key: "allTime" as LeaderboardPeriod, label: "All Time" },
            ].map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 16,
                  fontSize: 11,
                  fontWeight: 800,
                  border: `1.5px solid ${period === p.key ? "#5DCAA5" : "rgba(255,255,255,0.08)"}`,
                  background:
                    period === p.key ? "rgba(93,202,165,0.1)" : "transparent",
                  color: period === p.key ? "#5DCAA5" : "#8A8FA8",
                  cursor: "pointer",
                  fontFamily: '"Nunito", sans-serif',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            style={{
              fontFamily: '"Fredoka One", cursive',
              fontSize: 26,
              marginBottom: 4,
            }}
          >
            Top Students
          </div>
          <div style={{ fontSize: 12, color: "#8A8FA8" }}>
            Win battles to climb the ranks 🔥
          </div>
          {totalUsers > 0 && (
            <div style={{ fontSize: 11, color: "#8A8FA8", marginTop: 4 }}>
              {totalUsers} students competing
            </div>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "#8A8FA8" }}>
            <div style={{ fontSize: 18, marginBottom: 8 }}>📊</div>
            Loading leaderboard...
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <div style={{ fontSize: 18, marginBottom: 8 }}>😔</div>
            <div style={{ color: "#8A8FA8", marginBottom: 12 }}>{error}</div>
            <button
              onClick={() => fetchLeaderboard(period)}
              style={{
                background: "#1D9E75",
                border: "none",
                borderRadius: 8,
                color: "#fff",
                padding: "8px 16px",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: '"Nunito", sans-serif',
              }}
            >
              Try Again
            </button>
          </div>
        ) : leaders.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#8A8FA8" }}>
            <div style={{ fontSize: 18, marginBottom: 8 }}>🎯</div>
            No rankings yet. Be the first to battle!
          </div>
        ) : (
          <>
            {/* Podium */}
            {top3.length === 3 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  gap: 8,
                  marginBottom: 24,
                  height: 160,
                }}
              >
                {podiumOrder.map((entry, i) => {
                  const level = getLevelFromXP(entry.xp);
                  return (
                    <div
                      key={entry.id}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: 6,
                      }}
                    >
                      <ProfileAvatar
                        xp={entry.xp}
                        size={32}
                        userName={entry.name}
                      />
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          textAlign: "center",
                          maxWidth: 72,
                        }}
                      >
                        {entry.name.split(" ")[0]}
                      </div>
                      <div style={{ fontSize: 9, color: "#8A8FA8" }}>
                        {entry.xp} XP
                      </div>
                      <div
                        style={{
                          width: 80,
                          height: podiumHeights[i],
                          borderRadius: "10px 10px 0 0",
                          background: `linear-gradient(180deg,${podiumColors[i]}55,${podiumColors[i]}18)`,
                          borderTop: `2px solid ${podiumColors[i]}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: '"Fredoka One", cursive',
                          fontSize: 22,
                          color: podiumColors[i],
                        }}
                      >
                        {podiumNums[i]}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* My rank banner (if not in top 3) */}
            {(myRank > 3 || calculatedRank > 3) &&
              (myRank > 0 || calculatedRank > 0) && (
                <div
                  style={{
                    background: "rgba(93,202,165,0.08)",
                    border: "1px solid rgba(93,202,165,0.3)",
                    borderRadius: 12,
                    padding: "12px 16px",
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: "#5DCAA5",
                        fontWeight: 800,
                        fontSize: 14,
                      }}
                    >
                      Your rank: #{myRank || calculatedRank}
                    </div>
                    <div
                      style={{ color: "#8A8FA8", fontSize: 11, marginTop: 2 }}
                    >
                      Out of {totalUsers} students
                    </div>
                  </div>
                  <div style={{ fontSize: 20 }}>📈</div>
                </div>
              )}

            {/* Full list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {leaders.map((entry, i) => {
                const level = getLevelFromXP(entry.xp);
                const isMe = entry.id === user?.id;
                return (
                  <div
                    key={entry.id}
                    style={{
                      background: isMe ? "rgba(93,202,165,0.06)" : "#1E2333",
                      borderRadius: 12,
                      border: `1px solid ${isMe ? "rgba(93,202,165,0.35)" : "rgba(255,255,255,0.07)"}`,
                      padding: "12px 14px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: '"Fredoka One", cursive',
                        fontSize: 16,
                        width: 24,
                        color:
                          i === 0
                            ? "#EF9F27"
                            : i === 1
                              ? "#8c8ca0"
                              : i === 2
                                ? "#b06037"
                                : "#8A8FA8",
                        textAlign: "center",
                      }}
                    >
                      {i + 1}
                    </div>
                    <ProfileAvatar
                      xp={entry.xp}
                      size={36}
                      userName={entry.name}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 800 }}>
                        {entry.name}
                        {isMe && (
                          <span
                            style={{
                              fontSize: 10,
                              background: "rgba(93,202,165,0.2)",
                              color: "#5DCAA5",
                              padding: "1px 6px",
                              borderRadius: 10,
                              marginLeft: 6,
                            }}
                          >
                            You
                          </span>
                        )}
                      </div>
                      <div
                        style={{ fontSize: 11, color: "#8A8FA8", marginTop: 1 }}
                      >
                        🔥 {entry.streakCount} day streak · {entry.battleWins}{" "}
                        wins
                        {entry.winStreak > 0 &&
                          ` · ${entry.winStreak} win streak`}
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: '"Fredoka One", cursive',
                        fontSize: 18,
                        color: level.color,
                      }}
                    >
                      {entry.xp} XP
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LeaderboardScreen;
