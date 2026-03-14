import React, { useState, useEffect } from "react";
import axios from "axios";
import { useStreak } from "../hooks/useStreak";
import QuestionCard from "../components/QuestionCard";
import TimerRing from "../components/TimerRing";
import { useCountdown } from "../hooks/useCountdown";
import { useTheme } from "../context/ThemeContext";

const API = process.env.REACT_APP_API_URL || "http://localhost:3001";

interface Question {
  id: string;
  text: string;
  options: string[];
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  correctIndex: number; // Required field from backend
}

interface PracticeSession {
  sessionId: string;
  questions: Question[];
}

interface Answer {
  questionId: string;
  selectedIndex: number;
  timeSpent: number;
  isCorrect?: boolean; // Add this to track if answer was correct
}

interface Props {
  onNavigate: (screen: string) => void;
}

const TOPICS = [
  { key: "general", label: "🌍 General", color: "#5DCAA5" },
  { key: "science", label: "🔬 Science", color: "#378ADD" },
  { key: "math", label: "➕ Math", color: "#EF9F27" },
  { key: "history", label: "📖 History", color: "#D85A30" },
  { key: "tech", label: "💻 Tech", color: "#8B5CF6" },
];

const PracticeScreen: React.FC<Props> = ({ onNavigate }) => {
  const { updateStreak } = useStreak();
  const [selectedTopic, setSelectedTopic] = useState("general");
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const { timeLeft, reset: resetTimer } = useCountdown(
    15,
    !!session && !showResult,
  );

  const { colors, theme } = useTheme();

  // Cleanup when component unmounts or navigates away
  useEffect(() => {
    return () => {
      // Reset timer when leaving the screen
      resetTimer();
    };
  }, [resetTimer]);

  const resetPracticeSession = () => {
    setSession(null);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setCorrectAnswer(null);
    setShowCorrectAnswer(false);
    setLoading(false);
    setShowResult(false);
    setResult(null);
    setQuestionStartTime(Date.now());
    resetTimer(); // Reset the countdown timer
  };

  const startPractice = async () => {
    setLoading(true);
    try {
      console.log("🎯 Starting practice session for topic:", selectedTopic);
      const response = await axios.get(`${API}/practice/questions`, {
        params: { topic: selectedTopic, count: 5 },
      });
      console.log("✅ Practice session started:", response.data);

      // Reset all state first
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setSelectedAnswer(null);
      setCorrectAnswer(null);
      setShowCorrectAnswer(false);
      setShowResult(false);
      setResult(null);

      // Set new session and start
      setSession(response.data);
      setQuestionStartTime(Date.now());
      resetTimer();
    } catch (error) {
      console.error("❌ Failed to start practice:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    const timeSpent = (Date.now() - questionStartTime) / 1000;
    const currentQuestion = session?.questions[currentQuestionIndex];

    if (currentQuestion) {
      // Use real correct answer from backend
      const correctIndex = currentQuestion.correctIndex ?? 0;
      const isCorrect = answerIndex === correctIndex;
      const newAnswer: Answer = {
        questionId: currentQuestion.id,
        selectedIndex: answerIndex,
        timeSpent,
        isCorrect,
      };

      setAnswers((prev) => [...prev, newAnswer]);
      setSelectedAnswer(answerIndex);
      setCorrectAnswer(correctIndex);
      setShowCorrectAnswer(true);

      // Move to next question after 2 seconds
      setTimeout(() => {
        if (currentQuestionIndex < (session?.questions.length || 0) - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
          setSelectedAnswer(null);
          setCorrectAnswer(null);
          setShowCorrectAnswer(false);
          setQuestionStartTime(Date.now());
          resetTimer();
        } else {
          // Submit session
          submitSession([...answers, newAnswer]);
        }
      }, 2000);
    }
  };

  const submitSession = async (finalAnswers: Answer[]) => {
    if (!session) return;

    try {
      console.log("📤 Submitting practice session:", {
        sessionId: session.sessionId,
        answers: finalAnswers,
      });
      const response = await axios.post(`${API}/practice/submit`, {
        sessionId: session.sessionId,
        answers: finalAnswers,
        totalTime: finalAnswers.reduce((sum, a) => sum + a.timeSpent, 0),
      });
      console.log("✅ Practice session completed:", response.data);
      setResult(response.data);
      setShowResult(true);

      // Update streak after successful practice
      updateStreak("practice");
    } catch (error) {
      console.error("❌ Failed to submit practice:", error);
    }
  };

  // Auto-submit if time runs out
  useEffect(() => {
    if (timeLeft === 0 && session && selectedAnswer === null) {
      // When time runs out, show the real correct answer
      const currentQuestion = session.questions[currentQuestionIndex];
      const correctIndex = currentQuestion.correctIndex ?? 0;
      setCorrectAnswer(correctIndex);
      setShowCorrectAnswer(true);
      setSelectedAnswer(-1); // -1 indicates no answer selected

      // Move to next question after showing the correct answer
      setTimeout(() => {
        if (currentQuestionIndex < (session?.questions.length || 0) - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
          setSelectedAnswer(null);
          setCorrectAnswer(null);
          setShowCorrectAnswer(false);
          setQuestionStartTime(Date.now());
          resetTimer();
        } else {
          // Submit session with time-out answer
          const timeoutAnswer: Answer = {
            questionId: session.questions[currentQuestionIndex].id,
            selectedIndex: -1,
            timeSpent: 15,
            isCorrect: false,
          };
          submitSession([...answers, timeoutAnswer]);
        }
      }, 2000);
    }
  }, [
    timeLeft,
    session,
    selectedAnswer,
    currentQuestionIndex,
    answers,
    resetTimer,
  ]);

  if (showResult && result) {
    return (
      <div
        style={{
          fontFamily: '"Nunito", sans-serif',
          color: colors.text,
          paddingBottom: 80,
          background: colors.background,
          minHeight: "100vh",
        }}
      >
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            background: colors.navBackground,
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <button
            onClick={() => onNavigate("home")}
            style={{
              background: "none",
              border: "none",
              color: colors.text,
              fontSize: 22,
              cursor: "pointer",
              padding: 0,
            }}
          >
            ←
          </button>
          <div
            style={{
              fontFamily: '"Fredoka One", cursive',
              fontSize: 20,
              background: colors.gradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Practice Results
          </div>
          <div />
        </nav>

        <div style={{ padding: 20, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>
            {result.accuracy >= 80 ? "🎉" : result.accuracy >= 60 ? "👍" : "📚"}
          </div>

          <div
            style={{
              fontFamily: '"Fredoka One", cursive',
              fontSize: 28,
              marginBottom: 8,
              color: colors.text,
            }}
          >
            Practice Complete!
          </div>

          <div
            style={{ fontSize: 14, color: colors.textMuted, marginBottom: 24 }}
          >
            {result.feedback}
          </div>

          {/* Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                background: colors.cardBackground,
                borderRadius: 12,
                border: `1px solid ${colors.border}`,
                padding: "12px 10px",
                textAlign: "center" as const,
              }}
            >
              <div style={{ fontSize: 24, color: colors.accent }}>
                {result.score}
              </div>
              <div style={{ fontSize: 11, color: colors.textMuted }}>Score</div>
            </div>
            <div
              style={{
                background: colors.cardBackground,
                borderRadius: 12,
                border: `1px solid ${colors.border}`,
                padding: "12px 10px",
                textAlign: "center" as const,
              }}
            >
              <div style={{ fontSize: 24, color: colors.warning }}>
                {result.accuracy}%
              </div>
              <div style={{ fontSize: 11, color: colors.textMuted }}>
                Accuracy
              </div>
            </div>
            <div
              style={{
                background: colors.cardBackground,
                borderRadius: 12,
                border: `1px solid ${colors.border}`,
                padding: "12px 10px",
                textAlign: "center" as const,
              }}
            >
              <div style={{ fontSize: 24, color: colors.accentSecondary }}>
                {result.correctAnswers}/{result.totalQuestions}
              </div>
              <div style={{ fontSize: 11, color: colors.textMuted }}>
                Correct
              </div>
            </div>
            <div
              style={{
                background: colors.cardBackground,
                borderRadius: 12,
                border: `1px solid ${colors.border}`,
                padding: "12px 10px",
                textAlign: "center" as const,
              }}
            >
              <div style={{ fontSize: 24, color: "#8B5CF6" }}>
                +{result.xpEarned}
              </div>
              <div style={{ fontSize: 11, color: colors.textMuted }}>
                XP Earned
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              onClick={() => {
                resetPracticeSession();
              }}
              style={{
                width: "100%",
                padding: 16,
                borderRadius: 12,
                border: "none",
                background: colors.accent,
                color: "#fff",
                fontFamily: '"Nunito", sans-serif',
                fontSize: 15,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Practice Again
            </button>
            <button
              onClick={() => {
                resetPracticeSession();
                onNavigate("home");
              }}
              style={{
                width: "100%",
                padding: 14,
                borderRadius: 12,
                background:
                  theme === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.05)",
                border: `1px solid ${colors.border}`,
                color: colors.text,
                fontFamily: '"Nunito", sans-serif',
                fontSize: 14,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (session) {
    const currentQuestion = session.questions[currentQuestionIndex];
    const progress =
      ((currentQuestionIndex + 1) / session.questions.length) * 100;

    return (
      <div
        style={{
          fontFamily: '"Nunito", sans-serif',
          color: colors.text,
          minHeight: "100vh",
          background: colors.background,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 800 }}>
            Question {currentQuestionIndex + 1}/{session.questions.length}
          </div>
          <TimerRing timeLeft={timeLeft} total={15} />
          <div style={{ fontSize: 14, fontWeight: 800, color: colors.accent }}>
            Practice
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ padding: "0 20px", marginBottom: 20 }}>
          <div
            style={{
              height: 4,
              background:
                theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: colors.accent,
                transition: "width 0.3s ease",
                borderRadius: 2,
              }}
            />
          </div>
        </div>

        {/* Question */}
        <div style={{ padding: "0 20px" }}>
          <QuestionCard
            question={currentQuestion.text}
            options={currentQuestion.options}
            onAnswer={handleAnswer}
            selectedIndex={selectedAnswer}
            correctIndex={showCorrectAnswer ? correctAnswer : null}
            disabled={selectedAnswer !== null}
          />

          {/* Show result message */}
          {showCorrectAnswer && (
            <div
              style={{
                textAlign: "center",
                marginTop: 16,
                fontSize: 14,
                fontWeight: 800,
                color:
                  selectedAnswer === correctAnswer
                    ? colors.success
                    : selectedAnswer === -1
                      ? colors.warning
                      : colors.error,
                animation: "fadeUp 0.4s ease",
              }}
            >
              {selectedAnswer === -1
                ? "⏰ Time's up!"
                : selectedAnswer === correctAnswer
                  ? "✅ Correct!"
                  : "❌ Wrong answer"}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: '"Nunito", sans-serif',
        color: colors.text,
        paddingBottom: 80,
        background: colors.background,
        minHeight: "100vh",
      }}
    >
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          background: colors.navBackground,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <button
          onClick={() => onNavigate("home")}
          style={{
            background: "none",
            border: "none",
            color: colors.text,
            fontSize: 22,
            cursor: "pointer",
            padding: 0,
          }}
        >
          ←
        </button>
        <div
          style={{
            fontFamily: '"Fredoka One", cursive',
            fontSize: 20,
            background: colors.gradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          📚 Practice
        </div>
        <div />
      </nav>

      <div style={{ padding: 20 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            style={{
              fontFamily: '"Fredoka One", cursive',
              background: "linear-gradient(90deg,#EF9F27,#D85A30)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: 26,
              marginBottom: 4,
            }}
          >
            Practice Mode
          </div>
          <div style={{ fontSize: 13, color: colors.textMuted }}>
            Sharpen your skills with solo practice
          </div>
        </div>

        {/* Topic selection */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            color: colors.textMuted,
            letterSpacing: "0.1em",
            marginBottom: 10,
          }}
        >
          SELECT TOPIC
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          {TOPICS.map((topic) => (
            <button
              key={topic.key}
              onClick={() => setSelectedTopic(topic.key)}
              style={{
                padding: "8px 16px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 800,
                border: `1.5px solid ${selectedTopic === topic.key ? colors.accent : colors.border}`,
                background:
                  selectedTopic === topic.key
                    ? theme === "dark"
                      ? "rgba(93,202,165,0.1)"
                      : "rgba(16,185,129,0.1)"
                    : "transparent",
                color:
                  selectedTopic === topic.key
                    ? colors.accent
                    : colors.textMuted,
                cursor: "pointer",
                fontFamily: '"Nunito", sans-serif',
              }}
            >
              {topic.label}
            </button>
          ))}
        </div>

        <button
          onClick={startPractice}
          disabled={loading}
          style={{
            width: "100%",
            padding: 16,
            borderRadius: 12,
            border: "none",
            background: colors.accent,
            color: "#fff",
            fontFamily: '"Nunito", sans-serif',
            fontSize: 15,
            fontWeight: 800,
            cursor: "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Starting..." : "🚀 Start Practice Session"}
        </button>
      </div>
    </div>
  );
};

export default PracticeScreen;
