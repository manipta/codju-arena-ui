import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

// Configure axios defaults for CORS
axios.defaults.withCredentials = true;

const API = process.env.REACT_APP_API_URL || "http://localhost:3001";
console.log("🌐 API URL configured as:", API);

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  xp: number;
  level: number;
  streakCount: number;
  lastActiveDate: string | null;
  battleWins: number;
  battleLosses: number;
  winStreak: number;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("codju_token");
    const savedUser = localStorage.getItem("codju_user");
    console.log("Loading from localStorage:", {
      savedToken: !!savedToken,
      savedUser: !!savedUser,
    });
    if (savedToken && savedUser) {
      console.log("Setting token and user from localStorage");
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    console.log("🔄 Attempting login to:", `${API}/auth/login`);
    console.log("📡 Request data:", { email, password: "***" });

    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      console.log("✅ Login response:", res.data);
      const { token: access_token, user: u } = res.data;
      console.log("Login response user:", u);
      setToken(access_token);
      setUser(u);
      localStorage.setItem("codju_token", access_token);
      localStorage.setItem("codju_user", JSON.stringify(u));
      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    } catch (error) {
      console.error("❌ Login failed:", error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await axios.post(`${API}/auth/register`, {
      name,
      email,
      password,
    });
    const { access_token, user: u } = res.data;
    setToken(access_token);
    setUser(u);
    localStorage.setItem("codju_token", access_token);
    localStorage.setItem("codju_user", JSON.stringify(u));
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("codju_token");
    localStorage.removeItem("codju_user");
    delete axios.defaults.headers.common["Authorization"];
  };

  const refreshUser = async () => {
    try {
      const res = await axios.get(`${API}/auth/profile`);
      setUser(res.data);
      localStorage.setItem("codju_user", JSON.stringify(res.data));
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, refreshUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
