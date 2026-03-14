import React from 'react';

interface Props {
  question: string;
  options: string[];
  onAnswer: (index: number) => void;
  selectedIndex: number | null;
  correctIndex: number | null;
  disabled: boolean;
}

const LETTERS = ['A', 'B', 'C', 'D'];

const QuestionCard: React.FC<Props> = ({
  question, options, onAnswer, selectedIndex, correctIndex, disabled,
}) => {
  const getStyle = (i: number): React.CSSProperties => {
    const base: React.CSSProperties = {
      background: '#1E2333',
      border: '1.5px solid rgba(255,255,255,0.08)',
      borderRadius: 12,
      padding: '14px 12px',
      cursor: disabled ? 'default' : 'pointer',
      textAlign: 'left',
      transition: 'all 0.15s',
      width: '100%',
      fontFamily: '"Nunito", sans-serif',
      color: '#F0EEE8',
    };

    // After reveal
    if (correctIndex !== null) {
      if (i === correctIndex) {
        return { ...base, background: 'rgba(29,158,117,0.2)', border: '1.5px solid #1D9E75' };
      }
      if (i === selectedIndex && i !== correctIndex) {
        return { ...base, background: 'rgba(226,75,74,0.2)', border: '1.5px solid #E24B4A' };
      }
      return { ...base, opacity: 0.5 };
    }

    // Selected before reveal
    if (i === selectedIndex) {
      return { ...base, background: 'rgba(55,138,221,0.2)', border: '1.5px solid #378ADD' };
    }

    return base;
  };

  return (
    <div>
      {/* Question text */}
      <div style={{
        background: '#1E2333',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        padding: '18px 16px',
        marginBottom: 12,
      }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: '#8A8FA8', letterSpacing: '0.1em', marginBottom: 8 }}>
          QUESTION
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.5, color: '#F0EEE8' }}>
          {question}
        </div>
      </div>

      {/* Options grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {options.map((opt, i) => (
          <button
            key={i}
            style={getStyle(i)}
            disabled={disabled}
            onClick={() => !disabled && onAnswer(i)}
          >
            <span style={{ fontSize: 10, fontWeight: 800, color: '#8A8FA8', display: 'block', marginBottom: 3 }}>
              {LETTERS[i]}
            </span>
            <span style={{ fontSize: 13, fontWeight: 700 }}>{opt}</span>
            {correctIndex !== null && i === correctIndex && (
              <span style={{ float: 'right', color: '#1D9E75' }}>✓</span>
            )}
            {correctIndex !== null && i === selectedIndex && i !== correctIndex && (
              <span style={{ float: 'right', color: '#E24B4A' }}>✗</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
