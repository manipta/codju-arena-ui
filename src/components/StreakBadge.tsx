import React from 'react';

interface Props {
  count: number;
  size?: 'sm' | 'md';
}

const StreakBadge: React.FC<Props> = ({ count, size = 'md' }) => {
  if (!count) return null;
  const isSmall = size === 'sm';

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: isSmall ? 3 : 5,
      background: 'rgba(239,159,39,0.15)',
      border: '1px solid rgba(239,159,39,0.3)',
      borderRadius: 20,
      padding: isSmall ? '2px 8px' : '4px 12px',
      fontSize: isSmall ? 11 : 13,
      fontWeight: 800,
      color: '#EF9F27',
    }}>
      🔥 {count}
    </div>
  );
};

export default StreakBadge;
