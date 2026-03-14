import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

const WS_URL = process.env.REACT_APP_WS_URL || "http://localhost:3001";

export type GamePhase =
  | "idle"
  | "waiting" // created room, waiting for opponent
  | "countdown" // opponent joined, 3s before first question
  | "question" // question is live
  | "reveal" // answer revealed, showing result
  | "result"; // battle over

export interface PlayerInfo {
  id: string;
  name: string;
  xp: number;
  level: number;
}

export interface ScoreState {
  score: number;
  hp: number;
}

export interface Scores {
  player1: ScoreState;
  player2: ScoreState;
}

export interface CurrentQuestion {
  id: string;
  index: number;
  total: number;
  text: string;
  options: string[];
}

export interface BattleResult {
  winnerId: string | null;
  scores: { player1: number; player2: number };
  xpEarned: Record<string, number>;
}

export interface GameState {
  phase: GamePhase;
  roomCode: string | null;
  player1: PlayerInfo | null;
  player2: PlayerInfo | null;
  currentQuestion: CurrentQuestion | null;
  scores: Scores | null;
  correctIndex: number | null;
  myAnswerIndex: number | null;
  opponentAnswered: boolean;
  result: BattleResult | null;
  error: string | null;
}

const initialState: GameState = {
  phase: "idle",
  roomCode: null,
  player1: null,
  player2: null,
  currentQuestion: null,
  scores: null,
  correctIndex: null,
  myAnswerIndex: null,
  opponentAnswered: false,
  result: null,
  error: null,
};

export const useGameSocket = (userId: string, token: string) => {
  const socketRef = useRef<Socket | null>(null);
  const [gameState, setGameState] = useState<GameState>(initialState);

  useEffect(() => {
    if (!userId || !token) {
      console.log("Socket not connecting - missing userId or token:", {
        userId: !!userId,
        token: !!token,
      });
      return;
    }

    console.log("Attempting to connect socket with:", {
      WS_URL,
      userId,
      hasToken: !!token,
    });

    const socket = io(WS_URL, {
      auth: { token }, // JWT token for auth
      withCredentials: true, // Enable CORS credentials
      transports: ["websocket", "polling"], // Fallback to polling if websocket fails
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection failed:", err);
      setGameState((s) => ({
        ...s,
        error: "Connection failed: " + err.message,
      }));
    });

    // Server created room successfully
    socket.on("room_created", ({ roomCode }: { roomCode: string }) => {
      console.log("✅ Room created:", roomCode);
      setGameState((s) => ({ ...s, phase: "waiting", roomCode }));
    });

    // Opponent joined — both players info sent
    socket.on(
      "opponent_joined",
      ({ player1, player2 }: { player1: PlayerInfo; player2: PlayerInfo }) => {
        setGameState((s) => ({ ...s, phase: "countdown", player1, player2 }));
      },
    );

    // New question from server
    socket.on(
      "question_start",
      ({
        index,
        total,
        question,
        scores,
      }: {
        index: number;
        total: number;
        question: { id: string; text: string; options: string[] };
        scores: Scores;
      }) => {
        setGameState((s) => ({
          ...s,
          phase: "question",
          currentQuestion: { ...question, index, total },
          scores,
          correctIndex: null,
          myAnswerIndex: null,
          opponentAnswered: false,
        }));
      },
    );

    // Opponent answered (no answer index revealed — just status)
    socket.on("opponent_answered", ({ playerId }: { playerId: string }) => {
      // Only update opponent status if the answerer is not me
      if (playerId !== userId) {
        setGameState((s) => ({ ...s, opponentAnswered: true }));
      }
    });

    // Reveal correct answer + updated scores
    socket.on(
      "question_reveal",
      ({ correctIndex, scores }: { correctIndex: number; scores: Scores }) => {
        setGameState((s) => ({ ...s, phase: "reveal", correctIndex, scores }));
      },
    );

    // Battle over
    socket.on("battle_result", (result: BattleResult) => {
      setGameState((s) => ({ ...s, phase: "result", result }));
    });

    // Opponent left mid-battle
    socket.on("opponent_disconnected", () => {
      setGameState({
        ...initialState,
        error: "Opponent disconnected. Battle cancelled.",
      });
    });

    // Server error
    socket.on("error", ({ message }: { message: string }) => {
      setGameState((s) => ({ ...s, error: message }));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, token]);

  // ── ACTIONS ──

  const createRoom = useCallback(
    (topic: string) => {
      console.log("🎯 Creating room with topic:", topic, "userId:", userId);
      setGameState({ ...initialState, phase: "waiting" });
      if (socketRef.current?.connected) {
        console.log("📡 Emitting create_room event");
        socketRef.current.emit("create_room", { userId, topic });
      } else {
        console.error("❌ Socket not connected, cannot create room");
        setGameState((s) => ({ ...s, error: "Not connected to server" }));
      }
    },
    [userId],
  );

  const joinRoom = useCallback(
    (roomCode: string) => {
      setGameState({ ...initialState, phase: "waiting", roomCode });
      socketRef.current?.emit("join_room", {
        userId,
        roomCode: roomCode.toUpperCase(),
      });
    },
    [userId],
  );

  const submitAnswer = useCallback((roomCode: string, answerIndex: number) => {
    setGameState((s) => ({ ...s, myAnswerIndex: answerIndex }));
    socketRef.current?.emit("submit_answer", { roomCode, answerIndex });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(initialState);
  }, []);

  return { gameState, createRoom, joinRoom, submitAnswer, resetGame };
};
