import React, { useState, useEffect } from "react";
import axios from "axios";
import { useStreak } from "../hooks/useStreak";
import QuestionCard from "../components/QuestionCard";
import TimerRing from "../components/TimerRing";
import { useCountdown } from "../hooks/useCountdown";

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
          color: "#F0EEE8",
          paddingBottom: 80,
        }}
      >
        <nav style={navStyle}>
          <button onClick={() => onNavigate("home")} style={backBtnStyle}>
            ←
          </button>
          <div style={logoStyle}>Practice Results</div>
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
            }}
          >
            Practice Complete!
          </div>

          <div style={{ fontSize: 14, color: "#8A8FA8", marginBottom: 24 }}>
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
            <div style={statCardStyle}>
              <div style={{ fontSize: 24, color: "#5DCAA5" }}>
                {result.score}
              </div>
              <div style={{ fontSize: 11, color: "#8A8FA8" }}>Score</div>
            </div>
            <div style={statCardStyle}>
              <div style={{ fontSize: 24, color: "#EF9F27" }}>
                {result.accuracy}%
              </div>
              <div style={{ fontSize: 11, color: "#8A8FA8" }}>Accuracy</div>
            </div>
            <div style={statCardStyle}>
              <div style={{ fontSize: 24, color: "#378ADD" }}>
                {result.correctAnswers}/{result.totalQuestions}
              </div>
              <div style={{ fontSize: 11, color: "#8A8FA8" }}>Correct</div>
            </div>
            <div style={statCardStyle}>
              <div style={{ fontSize: 24, color: "#8B5CF6" }}>
                +{result.xpEarned}
              </div>
              <div style={{ fontSize: 11, color: "#8A8FA8" }}>XP Earned</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              onClick={() => {
                resetPracticeSession();
              }}
              style={primaryBtnStyle}
            >
              Practice Again
            </button>
            <button
              onClick={() => {
                resetPracticeSession();
                onNavigate("home");
              }}
              style={secondaryBtnStyle}
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
          color: "#F0EEE8",
          minHeight: "100vh",
          background: "#0F1117",
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
          <div style={{ fontSize: 14, fontWeight: 800, color: "#5DCAA5" }}>
            Practice
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ padding: "0 20px", marginBottom: 20 }}>
          <div
            style={{
              height: 4,
              background: "rgba(255,255,255,0.1)",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "#5DCAA5",
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
                    ? "#5DCAA5"
                    : selectedAnswer === -1
                      ? "#EF9F27"
                      : "#E24B4A",
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
        color: "#F0EEE8",
        paddingBottom: 80,
      }}
    >
      <nav style={navStyle}>
        <button onClick={() => onNavigate("home")} style={backBtnStyle}>
          ←
        </button>
        <div style={logoStyle}>📚 Practice</div>
        <div />
      </nav>

      <div style={{ padding: 20 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            style={{
              fontFamily: '"Fredoka One", cursive',
              fontSize: 26,
              marginBottom: 4,
            }}
          >
            Practice Mode
          </div>
          <div style={{ fontSize: 13, color: "#8A8FA8" }}>
            Sharpen your skills with solo practice
          </div>
        </div>

        {/* Topic selection */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            color: "#8A8FA8",
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
                border: `1.5px solid ${selectedTopic === topic.key ? topic.color : "rgba(255,255,255,0.08)"}`,
                background:
                  selectedTopic === topic.key
                    ? `${topic.color}20`
                    : "transparent",
                color: selectedTopic === topic.key ? topic.color : "#8A8FA8",
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
            ...primaryBtnStyle,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Starting..." : "🚀 Start Practice Session"}
        </button>
      </div>
    </div>
  );
};

const navStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "14px 20px",
  background: "#181C27",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
};

const backBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#F0EEE8",
  fontSize: 22,
  cursor: "pointer",
  padding: 0,
};

const logoStyle: React.CSSProperties = {
  fontFamily: '"Fredoka One", cursive',
  fontSize: 20,
  background: "linear-gradient(90deg,#5DCAA5,#378ADD)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const primaryBtnStyle: React.CSSProperties = {
  width: "100%",
  padding: 16,
  borderRadius: 12,
  border: "none",
  background: "#1D9E75",
  color: "#fff",
  fontFamily: '"Nunito", sans-serif',
  fontSize: 15,
  fontWeight: 800,
  cursor: "pointer",
};

const secondaryBtnStyle: React.CSSProperties = {
  width: "100%",
  padding: 14,
  borderRadius: 12,
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#F0EEE8",
  fontFamily: '"Nunito", sans-serif',
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
};

const statCardStyle: React.CSSProperties = {
  background: "#1E2333",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.07)",
  padding: "12px 10px",
  textAlign: "center",
};

export default PracticeScreen;
