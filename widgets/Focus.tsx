import { useEffect, useReducer, useRef, useState } from 'react';

import { getFocusDay, setFocusDay, todayKey } from '../lib/storage';
import {
  FOCUS_MS,
  BREAK_MS,
  INITIAL_POMODORO,
  pomodoroReducer,
} from '../lib/pomodoro-reducer';

const TICK_MS = 1000;
const RING_RADIUS = 54;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function formatRemaining(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

const controlClass =
  'rounded-md px-3 py-1 text-sm text-slate-600 hover:bg-slate-200/50 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ' +
  'dark:text-slate-300 dark:hover:bg-slate-700/50';

export function Focus() {
  const [state, dispatch] = useReducer(pomodoroReducer, INITIAL_POMODORO);
  const [hasLoaded, setHasLoaded] = useState(false);
  const lastCountRef = useRef(0);

  useEffect(() => {
    let isActive = true;
    void getFocusDay(new Date()).then((day) => {
      if (isActive) {
        lastCountRef.current = day.completed;
        dispatch({ type: 'hydrate', completedToday: day.completed });
        setHasLoaded(true);
      }
    });
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (state.status !== 'running') {
      return;
    }
    const intervalId = setInterval(() => dispatch({ type: 'tick', elapsedMs: TICK_MS }), TICK_MS);
    return () => clearInterval(intervalId);
  }, [state.status]);

  useEffect(() => {
    if (!hasLoaded || state.completedToday === lastCountRef.current) {
      return;
    }
    lastCountRef.current = state.completedToday;
    void setFocusDay({ date: todayKey(new Date()), completed: state.completedToday });
  }, [state.completedToday, hasLoaded]);

  const total = state.mode === 'focus' ? FOCUS_MS : BREAK_MS;
  const progress = 1 - state.remainingMs / total;
  const dashOffset = RING_CIRCUMFERENCE * (1 - progress);

  return (
    <section aria-label="Focus timer" className="glass rise-in w-full max-w-md rounded-xl p-4">
      <div className="flex items-center gap-4">
        <div className="relative h-28 w-28 shrink-0">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle
              cx="60"
              cy="60"
              r={RING_RADIUS}
              fill="none"
              strokeWidth="6"
              className="stroke-slate-300/40 dark:stroke-slate-600/40"
            />
            <circle
              cx="60"
              cy="60"
              r={RING_RADIUS}
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              stroke="var(--accent)"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <span className="text-xl font-semibold tabular-nums" aria-live="polite">
              {formatRemaining(state.remainingMs)}
            </span>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            {state.mode === 'focus' ? 'Focus session' : 'Break'}
          </p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {`${state.completedToday} focus ${state.completedToday === 1 ? 'session' : 'sessions'} today`}
          </p>
          <div className="mt-3 flex flex-wrap gap-1">
            {state.status === 'idle' && (
              <button
                type="button"
                onClick={() => dispatch({ type: 'start' })}
                className="accent-bg rounded-md px-3 py-1 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Start
              </button>
            )}
            {state.status === 'running' && (
              <button
                type="button"
                onClick={() => dispatch({ type: 'pause' })}
                className={controlClass}
              >
                Pause
              </button>
            )}
            {state.status === 'paused' && (
              <button
                type="button"
                onClick={() => dispatch({ type: 'resume' })}
                className={controlClass}
              >
                Resume
              </button>
            )}
            {state.status !== 'idle' && (
              <button
                type="button"
                onClick={() => dispatch({ type: 'reset' })}
                className={controlClass}
              >
                Reset
              </button>
            )}
            <button
              type="button"
              onClick={() => dispatch({ type: 'skip' })}
              className={controlClass}
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
