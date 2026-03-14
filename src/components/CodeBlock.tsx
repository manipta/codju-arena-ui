import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = "javascript",
  title,
}) => {
  const { colors, theme } = useTheme();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div
      style={{
        background: colors.cardBackground,
        border: `1px solid ${colors.border}`,
        borderRadius: 14,
        marginBottom: 16,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          background:
            theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
          borderBottom: `1px solid ${colors.borderLight}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: colors.textMuted,
              letterSpacing: "0.1em",
            }}
          >
            {title || language.toUpperCase()}
          </div>
        </div>

        <button
          onClick={copyToClipboard}
          style={{
            background: copied ? colors.success : colors.accent,
            color: "#FFFFFF",
            border: "none",
            borderRadius: 8,
            padding: "6px 12px",
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.15s",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: '"Nunito", sans-serif',
          }}
          onMouseEnter={(e) => {
            if (!copied) {
              e.currentTarget.style.transform = "scale(1.05)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <span style={{ fontSize: 12 }}>{copied ? "✓" : "📋"}</span>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Code content */}
      <div
        style={{
          padding: "16px",
          overflow: "auto",
          maxHeight: "400px",
        }}
      >
        <pre
          style={{
            margin: 0,
            fontFamily: '"Fira Code", "Consolas", monospace',
            fontSize: 13,
            lineHeight: 1.5,
            color: colors.text,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
