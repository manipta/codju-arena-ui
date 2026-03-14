import { useState, useCallback } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:3001";

interface StreakResponse {
  streakCount: number;
  streakUpdated: boolean;
  xpBonus: number;
  message: string;
}

export const useStreak = () => {
  const [loading, setLoading] = useState(false);

  const updateStreak = useCallback(
    async (
      activityType: "battle" | "practice" | "daily_challenge",
    ): Promise<StreakResponse | null> => {
      setLoading(true);
      try {
        console.log("🔥 Updating streak for activity:", activityType);
        const response = await axios.post(`${API}/users/update-streak`, {
          activityType,
        });
        console.log("✅ Streak updated:", response.data);
        return response.data;
      } catch (error) {
        console.error("❌ Failed to update streak:", error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { updateStreak, loading };
};
