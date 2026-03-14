import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const AuthScreen: React.FC = () => {
  const { login, register } = useAuth();
  const { colors } = useTheme();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Fill in all fields");
      return;
    }
    if (mode === "register" && !name) {
      setError("Enter your name");
      return;
    }
    setError("");
    setLoading(true);
    try {
      if (mode === "login") await login(email, password);
      else await register(name, email, password);
    } catch (e: any) {
      setError(e.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: '"Nunito", sans-serif',
        padding: 24,
      }}
    >
      <div style={{ width: "100%", maxWidth: 380 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              fontFamily: '"Fredoka One", cursive',
              fontSize: 36,
              background: colors.gradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ⚔️ Codju Arena
          </div>
          <div style={{ color: colors.textMuted, fontSize: 13, marginTop: 6 }}>
            Battle. Learn. Level up.
          </div>
        </div>

        {/* Card */}
        <div
          style={{
            background: colors.cardBackground,
            borderRadius: 20,
            border: `1px solid ${colors.border}`,
            padding: "28px 24px",
          }}
        >
          {/* Mode toggle */}
          <div
            style={{
              display: "flex",
              background: colors.surface,
              borderRadius: 10,
              padding: 3,
              marginBottom: 24,
            }}
          >
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setError("");
                }}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  borderRadius: 8,
                  border: "none",
                  fontFamily: '"Nunito", sans-serif',
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: mode === m ? colors.accent : "transparent",
                  color: mode === m ? "#fff" : colors.textMuted,
                }}
              >
                {m === "login" ? "Log In" : "Sign Up"}
              </button>
            ))}
          </div>

          {mode === "register" && (
            <input
              style={getInputStyle(colors)}
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            style={getInputStyle(colors)}
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password input with show/hide toggle */}
          <div style={{ position: "relative", marginBottom: error ? 8 : 20 }}>
            <input
              style={getInputStyle(colors, true)}
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "rgba(128, 128, 128, 0.8)",
                cursor: "pointer",
                fontSize: 14,
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                lineHeight: 1,
                transition: "color 0.2s ease",
                userSelect: "none",
                msTouchSelect: "none",
                msUserSelect: "none",
                MozUserSelect: "none",
                WebkitUserSelect: "none",
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(128, 128, 128, 0.8)";
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {error && (
            <div
              style={{
                fontSize: 12,
                color: colors.error,
                background: `${colors.error}20`,
                borderRadius: 8,
                padding: "8px 12px",
                marginBottom: 16,
              }}
            >
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 12,
              border: "none",
              background: colors.accent,
              color: "#fff",
              fontFamily: '"Nunito", sans-serif',
              fontSize: 15,
              fontWeight: 800,
              cursor: loading ? "default" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Enter the Arena ⚔️"
                : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

const getInputStyle = (
  colors: any,
  hasToggle = false,
): React.CSSProperties => ({
  width: "100%",
  padding: hasToggle ? "12px 40px 12px 14px" : "12px 14px",
  marginBottom: 12,
  background: colors.surface,
  border: `1px solid ${colors.border}`,
  borderRadius: 10,
  outline: "none",
  fontFamily: '"Nunito", sans-serif',
  fontSize: 14,
  color: colors.text,
  boxSizing: "border-box",
});

export default AuthScreen;
