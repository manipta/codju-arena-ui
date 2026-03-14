import React, { useEffect, useCallback } from 'react';
import { GameState } from '../hooks/useGameSocket';
import { useCountdown } from '../hooks/useCountdown';
import PlayerHUD from '../components/PlayerHUD';
import QuestionCard from '../components/QuestionCard';
import TimerRing from '../components/TimerRing';

interface Props {
  gameState: GameState;
  userId: string;
  onAnswer: (answerIndex: number) => void;
}

const BattleScreen: React.FC<Props> = ({ gameState, userId, onAnswer }) => {
  const { phase, player1, player2, currentQuestion, scores, correctIndex, myAnswerIndex, opponentAnswered, roomCode } = gameState;

  const isQuestion = phase === 'question';
  const { timeLeft } = useCountdown(15, isQuestion);

  // Determine which player is "me" and which is opponent
  const isPlayer1 = player1?.id === userId;
  const me = isPlayer1 ? player1 : player2;
  const opp = isPlayer1 ? player2 : player1;
  const myScores = isPlayer1 ? scores?.player1 : scores?.player2;
  const oppScores = isPlayer1 ? scores?.player2 : scores?.player1;

  const handleAnswer = useCallback((i: number) => {
    if (myAnswerIndex !== null) return;
    onAnswer(i);
  }, [myAnswerIndex, onAnswer]);

  if (phase === 'countdown') {
    return (
      <div style={{
        minHeight: '100vh', background: '#0F1117',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        fontFamily: '"Nunito", sans-serif',
      }}>
        {/* VS screen */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginBottom: 24 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 52, animation: 'slideFromLeft 0.4s ease' }}>
              {/* Player 1 char rendered via XP */}
              🟢
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, marginTop: 6 }}>{player1?.name}</div>
            <div style={{ fontSize: 11, color: '#8A8FA8' }}>{player1?.xp} XP</div>
          </div>
          <div style={{
            fontFamily: '"Fredoka One", cursive', fontSize: 48, color: '#EF9F27',
            animation: 'vsPop 0.5s 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
          }}>
            VS
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 52, animation: 'slideFromRight 0.4s ease' }}>🟡</div>
            <div style={{ fontSize: 14, fontWeight: 800, marginTop: 6 }}>{player2?.name}</div>
            <div style={{ fontSize: 11, color: '#8A8FA8' }}>{player2?.xp} XP</div>
          </div>
        </div>
        <div style={{ fontFamily: '"Fredoka One", cursive', fontSize: 20, color: '#8A8FA8' }}>
          Get ready...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0F1117',
      display: 'flex', flexDirection: 'column',
      fontFamily: '"Nunito", sans-serif', padding: '16px 16px 24px',
    }}>

      {/* HUD */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 16,
      }}>
        <PlayerHUD
          name="You"
          xp={me?.xp || 0}
          score={myScores?.score || 0}
          hp={myScores?.hp ?? 3}
        />

        {/* Centre timer */}
        <div style={{ textAlign: 'center' }}>
          <TimerRing timeLeft={timeLeft} total={15} />
          <div style={{ fontSize: 10, fontWeight: 800, color: '#8A8FA8', marginTop: 4, letterSpacing: '0.05em' }}>
            Q {(currentQuestion?.index ?? 0) + 1} / {currentQuestion?.total ?? 5}
          </div>
        </div>

        <PlayerHUD
          name={opp?.name || 'Opponent'}
          xp={opp?.xp || 0}
          score={oppScores?.score || 0}
          hp={oppScores?.hp ?? 3}
          isOpponent
          hasAnswered={opponentAnswered}
        />
      </div>

      {/* Question */}
      {currentQuestion && (
        <QuestionCard
          question={currentQuestion.text}
          options={currentQuestion.options}
          onAnswer={handleAnswer}
          selectedIndex={myAnswerIndex}
          correctIndex={phase === 'reveal' ? correctIndex : null}
          disabled={phase === 'reveal' || myAnswerIndex !== null}
        />
      )}

      {/* Reveal message */}
      {phase === 'reveal' && (
        <div style={{
          textAlign: 'center', marginTop: 16, fontSize: 13, fontWeight: 800,
          color: myAnswerIndex === correctIndex ? '#5DCAA5' : '#E24B4A',
          animation: 'fadeUp 0.4s ease',
        }}>
          {myAnswerIndex === null
            ? "⏰ Time's up!"
            : myAnswerIndex === correctIndex
              ? '✅ Correct!'
              : '❌ Wrong answer'}
        </div>
      )}
    </div>
  );
};

export default BattleScreen;
