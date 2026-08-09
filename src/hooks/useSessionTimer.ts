import { useEffect } from 'react';
import { useSessionStore } from '../store/sessionStore';
import { formatSecondsToHHMMSS } from '../utils/formatting';

export function useSessionTimer() {
  const { secondsRemaining, decrementTimer, setSessionEnded } = useSessionStore();

  useEffect(() => {
    if (secondsRemaining <= 0) {
      setSessionEnded(true, '24-hour session limit expired');
      return;
    }

    const timer = setInterval(() => {
      decrementTimer();
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining, decrementTimer, setSessionEnded]);

  return {
    secondsRemaining,
    formattedTime: formatSecondsToHHMMSS(secondsRemaining),
  };
}
