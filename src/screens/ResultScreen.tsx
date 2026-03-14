import React, { useEffect, useState } from 'react';
import { BattleResult } from '../hooks/useGameSocket';
import { getLevelFromXP } from '../utils/levels';

interface Props {
  result: BattleResult;
  userId: string;
  myName: string;
  oppName: string;
  myXPBefore: number;
  onPlayAgain: () => void;
  onHome: () => void;
  onLeaderboard: () => void;
}

const ResultScreen: React.FC<Props> = ({
  result, userId, myName, oppName, myXPBefore, onPlayAgain, onHome, onLeaderboard,
}) => {
  const [showXP, setShowXP] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const didWin = result.winnerId === userId;
  const isDraw = result.winnerId === null;
  const xpEarned = result.xpEarned[userId] || 0;
  const myScore = result.scores.player1;
  const oppScore = result.scores.player2;

  const levelBefore = getLevelFromXP(myXPBefore);
  const levelAfter = getLevelFromXP(myXPBefore + xpEarned);
  const leveledUp = levelAfter.level > levelBefore.level;

  useEffect(() => {
    setTimeout(() => setShowXP(true), 600);
    if (leveledUp) setTimeout(() => setShowLevelUp(true), 1800);
  }, [leveledUp]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 50% 0%, rgba(239,159,39,0.12) 0%, #0F1117 60%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '40px 24px',
      fontFamily: '"Nunito", sans-serif', color: '#F0EEE8',
    }}>

      {/* Trophy */}
      <div style={{ fontSize: 72, marginBottom: 8, animation: 'trophyPop 0.6s cubic-bezier(0.34,1.56,0.64,1) both' }}>
        {isDraw ? '🤝' : didWin ? '🏆' : '😤'}
      </div>

      {/* Title */}
      <div style={{
        fontFamily: '"Fredoka One", cursive', fontSize: 34, marginBottom: 4,
        animation: 'fadeUp 0.5s 0.3s ease both',
      }}>
        {isDraw ? 'Draw!' : didWin ? 'You Won! 🎉' : 'Better luck next time!'}
      </div>

      <div style={{ fontSize: 13, color: '#8A8FA8', marginBottom: 28, animation: 'fadeUp 0.5s 0.4s ease both' }}>
        {isDraw ? 'Evenly matched!' : didWin ? 'You dominated the Arena!' : 'Keep practising — you\'ll get them!'}
      </div>

      {/* Scores */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24,
        animation: 'fadeUp 0.5s 0.5s ease both',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#8A8FA8', marginBottom: 4 }}>You</div>
          <div style={{
            fontFamily: '"Fredoka One", cursive', fontSize: 40,
            color: didWin ? '#5DCAA5' : '#8A8FA8',
          }}>
            {myScore}
          </div>
          <div style={{ fontSize: 10, color: '#8A8FA8' }}>pts</div>
        </div>
        <div style={{ fontSize: 16, color: '#8A8FA8' }}>vs</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#8A8FA8', marginBottom: 4 }}>{oppName}</div>
          <div style={{
            fontFamily: '"Fredoka One", cursive', fontSize: 40,
            color: !didWin && !isDraw ? '#5DCAA5' : '#8A8FA8',
          }}>
            {oppScore}
          </div>
          <div style={{ fontSize: 10, color: '#8A8FA8' }}>pts</div>
        </div>
      </div>

      {/* XP Earned */}
      <div style={{
        background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.25)',
        borderRadius: 16, padding: '20px 40px', textAlign: 'center',
        marginBottom: 28, animation: 'fadeUp 0.5s 0.6s ease both',
      }}>
        <div style={{ fontSize: 12, color: '#8A8FA8', marginBottom: 4 }}>XP Earned</div>
        <div style={{
          fontFamily: '"Fredoka One", cursive', fontSize: 44, color: '#5DCAA5',
          opacity: showXP ? 1 : 0,
          transform: showXP ? 'scale(1)' : 'scale(0.5)',
          transition: 'all 0.6s cubic-bezier(0.34,1.56,0.64,1)',
        }}>
          +{xpEarned} XP
        </div>
        {didWin && (result.xpEarned[userId] || 0) > 50 && (
          <div style={{ fontSize: 12, color: '#EF9F27', fontWeight: 800, marginTop: 4 }}>
            🔥 Win streak bonus!
          </div>
        )}
      </div>

      {/* Level up banner */}
      {leveledUp && showLevelUp && (
        <div style={{
          background: `rgba(${levelAfter.color},0.1)`,
          border: `1px solid ${levelAfter.color}55`,
          borderRadius: 14, padding: '12px 20px', textAlign: 'center',
          marginBottom: 24, animation: 'trophyPop 0.5s ease',
          width: '100%', maxWidth: 320,
        }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#8A8FA8', marginBottom: 4 }}>LEVEL UP!</div>
          <div style={{ fontFamily: '"Fredoka One", cursive', fontSize: 22, color: levelAfter.color }}>
            {levelAfter.emoji} {levelAfter.name}
          </div>
          <div style={{ fontSize: 12, color: '#8A8FA8', marginTop: 2 }}>
            Welcome to {levelAfter.school}!
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 10,
        width: '100%', maxWidth: 320,
        animation: 'fadeUp 0.5s 0.7s ease both',
      }}>
        <button onClick={onPlayAgain} style={{
          padding: 14, borderRadius: 12, border: 'none',
          background: '#1D9E75', color: '#fff',
          fontFamily: '"Nunito", sans-serif', fontSize: 15, fontWeight: 800, cursor: 'pointer',
        }}>
          ⚔️ Play Again
        </button>
        <button onClick={onLeaderboard} style={secondaryBtn}>🏆 See Rankings</button>
        <button onClick={onHome} style={secondaryBtn}>🏠 Back to Home</button>
      </div>

    </div>
  );
};

const secondaryBtn: React.CSSProperties = {
  padding: 14, borderRadius: 12,
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#F0EEE8',
  fontFamily: '"Nunito", sans-serif', fontSize: 14, fontWeight: 800, cursor: 'pointer',
};

export default ResultScreen;
