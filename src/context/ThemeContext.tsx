import React, { createContext, useContext, useState, useEffect } from "react";

export type Theme = "dark" | "light";

interface ThemeColors {
  background: string;
  surface: string;
  surfaceSecondary: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderLight: string;
  accent: string;
  accentSecondary: string;
  success: string;
  warning: string;
  error: string;
  gradient: string;
  cardBackground: string;
  navBackground: string;
}

const darkTheme: ThemeColors = {
  background: "#0F1419",
  surface: "#1E2333",
  surfaceSecondary: "#181C27",
  text: "#F0EEE8",
  textSecondary: "#C4C4C4",
  textMuted: "#8A8FA8",
  border: "rgba(255,255,255,0.08)",
  borderLight: "rgba(255,255,255,0.05)",
  accent: "#5DCAA5",
  accentSecondary: "#378ADD",
  success: "#5DCAA5",
  warning: "#EF9F27",
  error: "#FF6B6B",
  gradient: "linear-gradient(90deg,#5DCAA5,#378ADD)",
  cardBackground: "#1E2333",
  navBackground: "#181C27",
};

const lightTheme: ThemeColors = {
  background: "#FFFFFF",
  surface: "#F8F9FA",
  surfaceSecondary: "#FFFFFF",
  text: "#1A1A1A",
  textSecondary: "#4A4A4A",
  textMuted: "#6B7280",
  border: "rgba(0,0,0,0.08)",
  borderLight: "rgba(0,0,0,0.05)",
  accent: "#10B981",
  accentSecondary: "#3B82F6",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  gradient: "linear-gradient(90deg,#10B981,#3B82F6)",
  cardBackground: "#FFFFFF",
  navBackground: "#F8F9FA",
};

interface ThemeContextType {
  theme: Theme;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("codju-theme");
    return (saved as Theme) || "dark";
  });

  const colors = theme === "dark" ? darkTheme : lightTheme;

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("codju-theme", newTheme);
  };

  useEffect(() => {
    // Update CSS custom properties for global styles
    const root = document.documentElement;
    root.style.setProperty("--bg-color", colors.background);
    root.style.setProperty("--text-color", colors.text);
    root.style.setProperty("--surface-color", colors.surface);
  }, [colors]);

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
