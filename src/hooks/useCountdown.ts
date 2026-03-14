import { useState, useEffect, useRef, useCallback } from 'react';

export const useCountdown = (
  seconds: number,
  active: boolean,
  onEnd?: () => void,
) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;

  // Reset when seconds or active changes
  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds, active]);

  useEffect(() => {
    if (!active) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          onEndRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active]);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeLeft(seconds);
  }, [seconds]);

  return { timeLeft, reset };
};
