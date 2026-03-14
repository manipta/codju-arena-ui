import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API = process.env.REACT_APP_API_URL || "http://localhost:3001";

export interface DetailedUserProfile {
  user: {
    id: string;
    name: string;
    email: string;
    xp: number;
    level: number;
    battleWins: number;
    battleLosses: number;
    winStreak: number;
    streakCount: number;
    lastActiveDate: string;
  };
  currentLevel: {
    id: number;
    name: string;
    color: string;
    description: string;
  };
  nextLevel: {
    name: string;
    xpRequired: number;
  } | null;
  levelProgress: {
    current: number;
    total: number;
    percentage: number;
  };
}

export const useUserProfile = () => {
  const [profile, setProfile] = useState<DetailedUserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchProfile = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data);
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
  };
};
