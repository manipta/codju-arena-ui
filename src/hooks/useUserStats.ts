import { useState, useEffect } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:3001";

interface DailyActivity {
  date: string;
  battlesPlayed: number;
  xpEarned: number;
  completed: boolean;
}

interface WeeklyStats {
  battlesPlayed: number;
  battlesWon: number;
  xpEarned: number;
  averageScore: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: string;
  isNew: boolean;
}

interface UserStats {
  dailyActivity: DailyActivity[];
  weeklyStats: WeeklyStats;
  achievements: Achievement[];
}

export const useUserStats = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("📊 Fetching user stats...");
      const response = await axios.get(`${API}/users/stats`);
      console.log("✅ User stats loaded:", response.data);
      setStats(response.data);
    } catch (err) {
      console.error("❌ Failed to fetch user stats:", err);
      setError("Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: fetchStats };
};
