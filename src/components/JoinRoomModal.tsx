import React, { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (code: string) => void;
}

const JoinRoomModal: React.FC<Props> = ({ isOpen, onClose, onJoin }) => {
  const [roomCode, setRoomCode] = useState("");

  if (!isOpen) return null;

  const handleJoin = () => {
    if (roomCode.length >= 4) {
      onJoin(roomCode);
      setRoomCode("");
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleJoin();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.8)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#1E2333",
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.1)",
          padding: 24,
          width: "100%",
          maxWidth: 320,
          fontFamily: '"Nunito", sans-serif',
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "#F0EEE8",
            }}
          >
            Join Room
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#8A8FA8",
              fontSize: 24,
              cursor: "pointer",
              padding: 0,
            }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            fontSize: 12,
            color: "#8A8FA8",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          Enter the room code shared by your friend
        </div>

        <input
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            padding: "16px 20px",
            fontSize: 18,
            color: "#F0EEE8",
            fontFamily: '"Fredoka One", cursive',
            letterSpacing: 6,
            textAlign: "center",
            outline: "none",
            marginBottom: 16,
            boxSizing: "border-box",
            textTransform: "uppercase",
          }}
          placeholder="ENTER CODE"
          maxLength={6}
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
          onKeyPress={handleKeyPress}
          autoFocus
        />

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "transparent",
              color: "#8A8FA8",
              fontFamily: '"Nunito", sans-serif',
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleJoin}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 10,
              border: "none",
              background:
                roomCode.length >= 4 ? "#1D9E75" : "rgba(29,158,117,0.3)",
              color: roomCode.length >= 4 ? "#fff" : "#8A8FA8",
              fontFamily: '"Nunito", sans-serif',
              fontSize: 14,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Join Battle
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinRoomModal;
