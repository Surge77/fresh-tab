import { describe, expect, it } from 'vitest';

import {
  BREAK_MS,
  FOCUS_MS,
  INITIAL_POMODORO,
  pomodoroReducer,
  type PomodoroState,
} from '../../lib/pomodoro-reducer';

const running: PomodoroState = { ...INITIAL_POMODORO, status: 'running' };

describe('pomodoroReducer', () => {
  it('starts a focus session with the full duration', () => {
    const next = pomodoroReducer(INITIAL_POMODORO, { type: 'start' });
    expect(next.status).toBe('running');
    expect(next.mode).toBe('focus');
    expect(next.remainingMs).toBe(FOCUS_MS);
  });

  it('pauses and resumes without losing remaining time', () => {
    const ticked = pomodoroReducer(running, { type: 'tick', elapsedMs: 60_000 });
    const paused = pomodoroReducer(ticked, { type: 'pause' });
    expect(paused.status).toBe('paused');
    expect(paused.remainingMs).toBe(FOCUS_MS - 60_000);

    const resumed = pomodoroReducer(paused, { type: 'resume' });
    expect(resumed.status).toBe('running');
    expect(resumed.remainingMs).toBe(FOCUS_MS - 60_000);
  });

  it('ignores ticks unless running', () => {
    expect(pomodoroReducer(INITIAL_POMODORO, { type: 'tick', elapsedMs: 1000 })).toEqual(
      INITIAL_POMODORO,
    );
    const paused = pomodoroReducer(running, { type: 'pause' });
    expect(pomodoroReducer(paused, { type: 'tick', elapsedMs: 1000 })).toEqual(paused);
  });

  it('completes focus into an idle break and counts the session', () => {
    const done = pomodoroReducer(running, { type: 'tick', elapsedMs: FOCUS_MS });
    expect(done.mode).toBe('break');
    expect(done.status).toBe('idle');
    expect(done.remainingMs).toBe(BREAK_MS);
    expect(done.completedToday).toBe(1);
  });

  it('completes break back into an idle focus without counting', () => {
    const breakRunning: PomodoroState = {
      mode: 'break',
      status: 'running',
      remainingMs: BREAK_MS,
      completedToday: 2,
    };
    const done = pomodoroReducer(breakRunning, { type: 'tick', elapsedMs: BREAK_MS });
    expect(done.mode).toBe('focus');
    expect(done.status).toBe('idle');
    expect(done.remainingMs).toBe(FOCUS_MS);
    expect(done.completedToday).toBe(2);
  });

  it('never lets remaining time go negative', () => {
    const done = pomodoroReducer(running, { type: 'tick', elapsedMs: FOCUS_MS * 3 });
    expect(done.remainingMs).toBeGreaterThanOrEqual(0);
  });

  it('reset returns to an idle focus session but keeps the daily count', () => {
    const midway = pomodoroReducer(running, { type: 'tick', elapsedMs: 60_000 });
    const withCount: PomodoroState = { ...midway, completedToday: 3 };
    const reset = pomodoroReducer(withCount, { type: 'reset' });
    expect(reset.mode).toBe('focus');
    expect(reset.status).toBe('idle');
    expect(reset.remainingMs).toBe(FOCUS_MS);
    expect(reset.completedToday).toBe(3);
  });

  it('skip jumps to the next mode without counting a focus session', () => {
    const skipped = pomodoroReducer(running, { type: 'skip' });
    expect(skipped.mode).toBe('break');
    expect(skipped.status).toBe('idle');
    expect(skipped.completedToday).toBe(0);
  });

  it('hydrates the daily count', () => {
    const next = pomodoroReducer(INITIAL_POMODORO, { type: 'hydrate', completedToday: 5 });
    expect(next.completedToday).toBe(5);
  });
});
