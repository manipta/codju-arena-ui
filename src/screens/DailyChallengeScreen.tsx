import React, { useState, useEffect } from "react";
import axios from "axios";
import QuestionCard from "../components/QuestionCard";
import TimerRing from "../components/TimerRing";
import { useCountdown } from "../hooks/useCountdown";
import { useTheme } from "../context/ThemeContext";

const API = process.env.REACT_APP_API_URL || "http://localhost:3001";

interface DailyChallenge {
  challengeId: string;
  date: string;
  topic: string;
  difficulty: string;
  description: string;
  isCompleted: boolean;
  reward: {
    xp: number;
    badge: string;
  };
  questions: Array<{
    id: string;
    text: string;
    options: string[];
    correctIndex: number; // Required field from backend
  }>;
}

interface Props {
  onNavigate: (screen: string) => void;
}

const DailyChallengeScreen: React.FC<Props> = ({ onNavigate }) => {
  const { colors, theme } = useTheme();
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<
    Array<{ questionId: string; selectedIndex: number; timeSpent: number }>
  >([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [hasStarted, setHasStarted] = useState(false);

  const { timeLeft, reset: resetTimer } = useCountdown(
    20,
    hasStarted && !showResult,
  );

  useEffect(() => {
    fetchDailyChallenge();
  }, []);

  const fetchDailyChallenge = async () => {
    try {
      console.log("🎯 Fetching daily challenge...");
      const response = await axios.get(`${API}/daily-challenge/today`);
      console.log("✅ Daily challenge loaded:", response.data);
      setChallenge(response.data);
    } catch (error) {
      console.error("❌ Failed to fetch daily challenge:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetChallengeSession = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setCorrectAnswer(null);
    setShowCorrectAnswer(false);
    setShowResult(false);
    setResult(null);
    setHasStarted(false);
    setQuestionStartTime(Date.now());
    resetTimer(); // Reset the countdown timer
  };

  const startChallenge = () => {
    resetChallengeSession();
    setHasStarted(true);
    setQuestionStartTime(Date.now());
    resetTimer();
  };

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null || !challenge) return;

    const timeSpent = (Date.now() - questionStartTime) / 1000;
    const currentQuestion = challenge.questions[currentQuestionIndex];

    // Use real correct answer from backend
    const correctIndex = currentQuestion.correctIndex ?? 0;

    const newAnswer = {
      questionId: currentQuestion.id,
      selectedIndex: answerIndex,
      timeSpent,
    };

    setAnswers((prev) => [...prev, newAnswer]);
    setSelectedAnswer(answerIndex);
    setCorrectAnswer(correctIndex);
    setShowCorrectAnswer(true);

    // Move to next question after 2 seconds
    setTimeout(() => {
      if (currentQuestionIndex < challenge.questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setCorrectAnswer(null);
        setShowCorrectAnswer(false);
        setQuestionStartTime(Date.now());
        resetTimer();
      } else {
        // Submit challenge
        submitChallenge([...answers, newAnswer]);
      }
    }, 2000);
  };

  const submitChallenge = async (finalAnswers: typeof answers) => {
    if (!challenge) return;

    try {
      console.log("📤 Submitting daily challenge:", {
        challengeId: challenge.challengeId,
        answers: finalAnswers,
      });
      const response = await axios.post(`${API}/daily-challenge/submit`, {
        challengeId: challenge.challengeId,
        answers: finalAnswers,
      });
      console.log("✅ Daily challenge completed:", response.data);
      setResult(response.data);
      setShowResult(true);
    } catch (error) {
      console.error("❌ Failed to submit daily challenge:", error);
    }
  };

  // Auto-submit if time runs out
  useEffect(() => {
    if (timeLeft === 0 && hasStarted && selectedAnswer === null && challenge) {
      // When time runs out, show the real correct answer
      const currentQuestion = challenge.questions[currentQuestionIndex];
      const correctIndex = currentQuestion.correctIndex ?? 0;
      setCorrectAnswer(correctIndex);
      setShowCorrectAnswer(true);
      setSelectedAnswer(-1); // -1 indicates no answer selected

      // Move to next question after showing the correct answer
      setTimeout(() => {
        if (currentQuestionIndex < challenge.questions.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
          setSelectedAnswer(null);
          setCorrectAnswer(null);
          setShowCorrectAnswer(false);
          setQuestionStartTime(Date.now());
          resetTimer();
        } else {
          // Submit challenge with time-out answer
          const timeoutAnswer = {
            questionId: challenge.questions[currentQuestionIndex].id,
            selectedIndex: -1,
            timeSpent: 20,
          };
          submitChallenge([...answers, timeoutAnswer]);
        }
      }, 2000);
    }
  }, [
    timeLeft,
    hasStarted,
    selectedAnswer,
    challenge,
    currentQuestionIndex,
    answers,
    resetTimer,
  ]);

  if (loading) {
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
              fontSize: 18,
              cursor: "pointer",
              padding: "4px 8px",
              fontFamily: '"Nunito", sans-serif',
            }}
          >
            ←
          </button>
          <div
            style={{
              fontFamily: '"Fredoka One", cursive',
              fontSize: 20,
              background: "linear-gradient(90deg,#EF9F27,#D85A30)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Daily Challenge
          </div>
          <div />
        </nav>
        <div
          style={{ padding: 40, textAlign: "center", color: colors.textMuted }}
        >
          <div style={{ fontSize: 18, marginBottom: 8 }}>🎯</div>
          Loading today's challenge...
        </div>
      </div>
    );
  }

  if (!challenge) {
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
              fontSize: 18,
              cursor: "pointer",
              padding: "4px 8px",
              fontFamily: '"Nunito", sans-serif',
            }}
          >
            ←
          </button>
          <div
            style={{
              fontFamily: '"Fredoka One", cursive',
              fontSize: 20,
              background: "linear-gradient(90deg,#EF9F27,#D85A30)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Daily Challenge
          </div>
          <div />
        </nav>
        <div style={{ padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>😔</div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              marginBottom: 8,
              color: colors.text,
            }}
          >
            No Challenge Available
          </div>
          <div
            style={{ fontSize: 13, color: colors.textMuted, marginBottom: 20 }}
          >
            Check back tomorrow for a new challenge!
          </div>
          <button
            onClick={() => onNavigate("home")}
            style={{
              width: "100%",
              padding: 16,
              borderRadius: 12,
              border: "none",
              background: colors.warning,
              color: "#fff",
              fontFamily: '"Nunito", sans-serif',
              fontSize: 15,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

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
              fontSize: 18,
              cursor: "pointer",
              padding: "4px 8px",
              fontFamily: '"Nunito", sans-serif',
            }}
          >
            ←
          </button>
          <div
            style={{
              fontFamily: '"Fredoka One", cursive',
              fontSize: 20,
              background: "linear-gradient(90deg,#EF9F27,#D85A30)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Challenge Complete
          </div>
          <div />
        </nav>

        <div style={{ padding: 20, textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>
            {result.rank === "A"
              ? "🏆"
              : result.rank === "B"
                ? "🥈"
                : result.rank === "C"
                  ? "🥉"
                  : "📚"}
          </div>

          <div
            style={{
              fontFamily: '"Fredoka One", cursive',
              fontSize: 28,
              marginBottom: 8,
            }}
          >
            Challenge Complete!
          </div>

          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              color:
                result.rank === "A"
                  ? "#EF9F27"
                  : result.rank === "B"
                    ? "#8c8ca0"
                    : "#b06037",
              marginBottom: 16,
            }}
          >
            Rank: {result.rank}
          </div>

          {result.isNewPersonalBest && (
            <div
              style={{
                background: "rgba(239,159,39,0.1)",
                border: "1px solid rgba(239,159,39,0.3)",
                borderRadius: 12,
                padding: "8px 16px",
                marginBottom: 16,
                fontSize: 12,
                fontWeight: 800,
                color: "#EF9F27",
              }}
            >
              🎉 New Personal Best!
            </div>
          )}

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
              <div style={{ fontSize: 11, color: colors.textMuted }}>Score</div>
            </div>
            <div style={statCardStyle}>
              <div style={{ fontSize: 24, color: "#EF9F27" }}>
                {result.correctAnswers}/{result.totalQuestions}
              </div>
              <div style={{ fontSize: 11, color: colors.textMuted }}>
                Correct
              </div>
            </div>
            <div style={statCardStyle}>
              <div style={{ fontSize: 24, color: "#378ADD" }}>
                +{result.xpEarned}
              </div>
              <div style={{ fontSize: 11, color: colors.textMuted }}>
                XP Earned
              </div>
            </div>
            <div style={statCardStyle}>
              <div style={{ fontSize: 24, color: "#8B5CF6" }}>
                {result.newStreakCount}🔥
              </div>
              <div style={{ fontSize: 11, color: colors.textMuted }}>
                Streak
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              onClick={() => onNavigate("leaderboard")}
              style={primaryBtnStyle}
            >
              View Leaderboard
            </button>
            <button
              onClick={() => onNavigate("home")}
              style={secondaryBtnStyle}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (hasStarted) {
    const currentQuestion = challenge.questions[currentQuestionIndex];
    const progress =
      ((currentQuestionIndex + 1) / challenge.questions.length) * 100;

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
            Question {currentQuestionIndex + 1}/{challenge.questions.length}
          </div>
          <TimerRing timeLeft={timeLeft} total={20} />
          <div style={{ fontSize: 14, fontWeight: 800, color: colors.warning }}>
            Daily Challenge
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
                background: colors.warning,
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
            fontSize: 18,
            cursor: "pointer",
            padding: "4px 8px",
            fontFamily: '"Nunito", sans-serif',
          }}
        >
          ←
        </button>
        <div
          style={{
            fontFamily: '"Fredoka One", cursive',
            fontSize: 20,
            background: "linear-gradient(90deg,#EF9F27,#D85A30)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          🎯 Daily Challenge
        </div>
        <div />
      </nav>

      <div style={{ padding: 20 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
          <div
            style={{
              fontFamily: '"Fredoka One", cursive',
              fontSize: 26,
              marginBottom: 4,
            }}
          >
            {challenge.description}
          </div>
          <div style={{ fontSize: 13, color: colors.textMuted }}>
            {new Date(challenge.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        {challenge.isCompleted ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>✅</div>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
              Already Completed!
            </div>
            <div
              style={{
                fontSize: 13,
                color: colors.textMuted,
                marginBottom: 20,
              }}
            >
              Come back tomorrow for a new challenge
            </div>
            <button
              onClick={() => onNavigate("home")}
              style={secondaryBtnStyle}
            >
              Back to Home
            </button>
          </div>
        ) : (
          <>
            {/* Challenge info */}
            <div
              style={{
                background: "rgba(239,159,39,0.1)",
                border: "1px solid rgba(239,159,39,0.3)",
                borderRadius: 16,
                padding: 20,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800 }}>
                    Today's Challenge
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: colors.textMuted,
                      marginTop: 2,
                    }}
                  >
                    Topic: {challenge.topic} • Difficulty:{" "}
                    {challenge.difficulty}
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 20 }}>🏆</div>
                  <div
                    style={{ fontSize: 10, fontWeight: 800, color: "#EF9F27" }}
                  >
                    +{challenge.reward.xp} XP
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: "#8A8FA8" }}>
                Complete {challenge.questions.length} questions to earn your
                reward!
              </div>
            </div>

            <button onClick={startChallenge} style={primaryBtnStyle}>
              🚀 Start Challenge
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const primaryBtnStyle: React.CSSProperties = {
  width: "100%",
  padding: 16,
  borderRadius: 12,
  border: "none",
  background: "#EF9F27",
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

export default DailyChallengeScreen;
