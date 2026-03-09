import { useCallback, useRef } from "react";

interface RateLimitOptions {
  /** Max submissions allowed in the time window */
  maxAttempts: number;
  /** Time window in milliseconds (default: 60000 = 1 minute) */
  windowMs: number;
  /** Storage key for persistence across page navigations */
  storageKey: string;
}

interface RateLimitState {
  attempts: number[];
}

const getState = (key: string): RateLimitState => {
  try {
    const raw = sessionStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { attempts: [] };
};

const setState = (key: string, state: RateLimitState) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(state));
  } catch {}
};

/**
 * Client-side rate limiter for form submissions.
 * Tracks attempts in sessionStorage with a sliding window.
 */
export const useRateLimit = ({ maxAttempts, windowMs, storageKey }: RateLimitOptions) => {
  const stateRef = useRef<RateLimitState | null>(null);

  const checkRateLimit = useCallback((): { allowed: boolean; retryAfterMs: number } => {
    const now = Date.now();
    const state = getState(storageKey);

    // Prune expired attempts
    state.attempts = state.attempts.filter((t) => now - t < windowMs);

    if (state.attempts.length >= maxAttempts) {
      const oldestInWindow = Math.min(...state.attempts);
      const retryAfterMs = windowMs - (now - oldestInWindow);
      setState(storageKey, state);
      return { allowed: false, retryAfterMs };
    }

    return { allowed: true, retryAfterMs: 0 };
  }, [maxAttempts, windowMs, storageKey]);

  const recordAttempt = useCallback(() => {
    const now = Date.now();
    const state = getState(storageKey);
    state.attempts = state.attempts.filter((t) => now - t < windowMs);
    state.attempts.push(now);
    setState(storageKey, state);
  }, [windowMs, storageKey]);

  return { checkRateLimit, recordAttempt };
};
