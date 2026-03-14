import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API = process.env.REACT_APP_API_URL || "http://localhost:3001";

export interface DailyActivity {
  date: string;
  battlesPlayed: number;
  xpEarned: number;
  completed: boolean;
}

export interface WeeklyStats {
  battlesPlayed: number;
  battlesWon: number;
  xpEarned: number;
  averageScore: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: string;
  isNew: boolean;
}

export interface UserStats {
  dailyActivity: DailyActivity[];
  weeklyStats: WeeklyStats;
  achievements: Achievement[];
}

export const useUserStats = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchStats = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API}/users/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch user stats:", err);
      setError("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [token]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};
