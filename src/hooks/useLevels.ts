import { useState, useEffect } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:3001";

interface Level {
  id: number;
  name: string;
  minXP: number;
  maxXP: number | null;
  color: string;
  description: string;
  benefits: string[];
  icon: string;
}

interface LevelProgress {
  current: number;
  total: number | null;
  percentage: number;
}

interface UserLevelInfo {
  currentLevel: Level;
  nextLevel: Level | null;
  levelProgress: LevelProgress;
}

export const useLevels = () => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        console.log("📊 Fetching level configuration...");
        const response = await axios.get(`${API}/levels/config`);
        console.log("✅ Levels loaded:", response.data);
        setLevels(response.data.levels);
      } catch (err) {
        console.error("❌ Failed to fetch levels:", err);
        setError("Failed to load levels");
        // Fallback to default levels
        setLevels([
          {
            id: 1,
            name: "Foundation",
            minXP: 0,
            maxXP: 699,
            color: "#8A8FA8",
            description: "Starting your learning journey",
            benefits: ["Access to basic questions", "Foundation knowledge"],
            icon: "🌱",
          },
          {
            id: 2,
            name: "Elementary",
            minXP: 700,
            maxXP: 1499,
            color: "#5DCAA5",
            description: "Building fundamental skills",
            benefits: ["Unlock science topics", "Daily challenges"],
            icon: "📚",
          },
          {
            id: 3,
            name: "Intermediate",
            minXP: 1500,
            maxXP: 1999,
            color: "#378ADD",
            description: "Expanding knowledge base",
            benefits: ["Advanced topics", "Multiplayer battles"],
            icon: "🎯",
          },
          {
            id: 4,
            name: "Advanced",
            minXP: 2000,
            maxXP: 4999,
            color: "#EF9F27",
            description: "Mastering complex concepts",
            benefits: ["Expert questions", "Leaderboard access"],
            icon: "🏆",
          },
          {
            id: 5,
            name: "Expert",
            minXP: 5000,
            maxXP: 9999,
            color: "#D85A30",
            description: "Specialized expertise",
            benefits: ["Create custom challenges", "Mentor others"],
            icon: "⭐",
          },
          {
            id: 6,
            name: "Master",
            minXP: 10000,
            maxXP: null,
            color: "#8B5CF6",
            description: "Peak performance achieved",
            benefits: ["All features unlocked", "Master badge"],
            icon: "👑",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, []);

  const calculateUserLevel = (userXP: number): UserLevelInfo => {
    const currentLevel =
      levels.find(
        (level) =>
          userXP >= level.minXP &&
          (level.maxXP === null || userXP <= level.maxXP),
      ) || levels[0];

    const nextLevel =
      levels.find((level) => level.id === currentLevel.id + 1) || null;

    const levelProgress: LevelProgress = {
      current: userXP - currentLevel.minXP,
      total: currentLevel.maxXP
        ? currentLevel.maxXP - currentLevel.minXP
        : null,
      percentage: currentLevel.maxXP
        ? ((userXP - currentLevel.minXP) /
            (currentLevel.maxXP - currentLevel.minXP)) *
          100
        : 100,
    };

    return {
      currentLevel,
      nextLevel,
      levelProgress,
    };
  };

  return {
    levels,
    loading,
    error,
    calculateUserLevel,
  };
};
