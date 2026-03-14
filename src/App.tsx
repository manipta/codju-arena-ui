import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useGameSocket } from "./hooks/useGameSocket";
import AuthScreen from "./screens/AuthScreen";
import HomeScreen from "./screens/HomeScreen";
import { ArenaScreen, LobbyScreen } from "./screens/ArenaScreen";
import BattleScreen from "./screens/BattleScreen";
import ResultScreen from "./screens/ResultScreen";
import LeaderboardScreen from "./screens/LeaderboardScreen";
import PracticeScreen from "./screens/PracticeScreen";
import DailyChallengeScreen from "./screens/DailyChallengeScreen";
import TabBar from "./components/TabBar";
import JoinRoomModal from "./components/JoinRoomModal";

// ── Global styles injected once ──────────────────────────────────────────────
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka+One&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: #0F1117;
    color: #F0EEE8;
    font-family: 'Nunito', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  @keyframes charBounce {
    0%,100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  @keyframes shimmer {
    0%,100%{ opacity: 0; }
    50%{ opacity: 1; }
  }
  @keyframes fadeUp {
    from { transform: translateY(16px); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }
  @keyframes trophyPop {
    from { transform: scale(0) rotate(-20deg); opacity: 0; }
    to   { transform: scale(1) rotate(0deg);   opacity: 1; }
  }
  @keyframes blink {
    0%,100%{ opacity: 1; }
    50%{ opacity: 0.3; }
  }
  @keyframes pulseRing {
    0%,100%{ box-shadow: 0 0 0 0 rgba(93,202,165,0.4); }
    50%{ box-shadow: 0 0 0 20px rgba(93,202,165,0); }
  }
  @keyframes slideFromLeft {
    from { transform: translateX(-60px); opacity: 0; }
    to   { transform: translateX(0);     opacity: 1; }
  }
  @keyframes slideFromRight {
    from { transform: translateX(60px); opacity: 0; }
    to   { transform: translateX(0);    opacity: 1; }
  }
  @keyframes vsPop {
    from { transform: scale(0); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
  }

  input::placeholder { color: #8A8FA8; }
  input:focus { border-color: rgba(93,202,165,0.5) !important; }
  button:active { transform: scale(0.97); }
  ::-webkit-scrollbar { display: none; }
`;

type Screen =
  | "home"
  | "arena"
  | "lobby"
  | "leaderboard"
  | "practice"
  | "daily-challenge"
  | "profile";

// ── Inner app (has auth context) ────────────────────────────────────────────
const AppInner: React.FC = () => {
  const { user, token, loading, refreshUser } = useAuth();
  const [screen, setScreen] = useState<Screen>("home");
  const [showJoinModal, setShowJoinModal] = useState(false);

  // Only init socket when logged in
  console.log("User object:", user);
  console.log("User ID:", user?.id);
  console.log("Token exists:", !!token);

  const { gameState, createRoom, joinRoom, submitAnswer, resetGame } =
    useGameSocket(user?.id || "", token || "");

  const handleJoinRoom = (code: string) => {
    joinRoom(code);
    setScreen("lobby");
  };

  // When battle ends, refresh user XP from server
  useEffect(() => {
    if (gameState.phase === "result") {
      refreshUser();
    }
  }, [gameState.phase]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0F1117",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: '"Fredoka One", cursive',
            fontSize: 24,
            color: "#5DCAA5",
          }}
        >
          Loading...
        </div>
      </div>
    );
  }

  if (!user) return <AuthScreen />;

  // ── Battle is active — full-screen battle/result, no tab bar ────────────
  if (
    gameState.phase === "countdown" ||
    gameState.phase === "question" ||
    gameState.phase === "reveal"
  ) {
    return (
      <BattleScreen
        gameState={gameState}
        userId={user.id}
        onAnswer={(i) =>
          gameState.roomCode && submitAnswer(gameState.roomCode, i)
        }
      />
    );
  }

  if (gameState.phase === "result" && gameState.result) {
    const opp =
      gameState.player1?.id === user.id ? gameState.player2 : gameState.player1;
    return (
      <ResultScreen
        result={gameState.result}
        userId={user.id}
        myName={user.name}
        oppName={opp?.name || "Opponent"}
        myXPBefore={user.xp}
        onPlayAgain={() => {
          resetGame();
          setScreen("arena");
        }}
        onHome={() => {
          resetGame();
          setScreen("home");
        }}
        onLeaderboard={() => {
          resetGame();
          setScreen("leaderboard");
        }}
      />
    );
  }

  // ── Normal navigation ───────────────────────────────────────────────────
  const renderScreen = () => {
    switch (screen) {
      case "home":
        return (
          <HomeScreen
            onNavigate={(s) => {
              if (s === "join-room") {
                setShowJoinModal(true);
              } else {
                setScreen(s as Screen);
              }
            }}
          />
        );

      case "arena":
        return (
          <ArenaScreen
            onNavigate={(s) => {
              if (s === "join-room") {
                setShowJoinModal(true);
              } else {
                setScreen(s as Screen);
              }
            }}
            onStartBattle={(topic, mode) => {
              if (mode === "create") createRoom(topic);
              setScreen("lobby");
            }}
          />
        );

      case "lobby":
        return (
          <LobbyScreen
            onNavigate={(s) => setScreen(s as Screen)}
            onCreate={(topic) => createRoom(topic)}
            onJoin={(code) => joinRoom(code)}
            roomCode={gameState.roomCode}
            isWaiting={gameState.phase === "waiting"}
          />
        );

      case "leaderboard":
        return <LeaderboardScreen onNavigate={(s) => setScreen(s as Screen)} />;

      case "practice":
        return <PracticeScreen onNavigate={(s) => setScreen(s as Screen)} />;

      case "daily-challenge":
        return (
          <DailyChallengeScreen onNavigate={(s) => setScreen(s as Screen)} />
        );

      default:
        return (
          <HomeScreen
            onNavigate={(s) => {
              if (s === "join-room") {
                setShowJoinModal(true);
              } else {
                setScreen(s as Screen);
              }
            }}
          />
        );
    }
  };

  const showTabBar = !["battle", "result"].includes(gameState.phase);

  return (
    <>
      {renderScreen()}
      {showTabBar && (
        <TabBar active={screen} onNavigate={(s) => setScreen(s as Screen)} />
      )}
      <JoinRoomModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onJoin={handleJoinRoom}
      />
    </>
  );
};

// ── Root App ─────────────────────────────────────────────────────────────────
const App: React.FC = () => (
  <>
    <style>{globalStyles}</style>
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  </>
);

export default App;
