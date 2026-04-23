import { useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';

const INACTIVITY_LIMIT_MS = 5 * 60 * 1000; // 5 minutes

export default function InactivityGuard() {
  const { logout } = useAuth();

  const resetTimer = useCallback(() => {
    // Clear existing timer
    const existingTimer = (window as any).__inactivityTimer;
    if (existingTimer) clearTimeout(existingTimer);

    // Set new timer
    (window as any).__inactivityTimer = setTimeout(() => {
      logout();
    }, INACTIVITY_LIMIT_MS);
  }, [logout]);

  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer(); // Start timer on mount

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      const timer = (window as any).__inactivityTimer;
      if (timer) clearTimeout(timer);
    };
  }, [resetTimer]);

  return null; // renders nothing
}
