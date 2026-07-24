export const FOCUS_MS = 25 * 60_000;
export const BREAK_MS = 5 * 60_000;

export type PomodoroMode = 'focus' | 'break';
export type PomodoroStatus = 'idle' | 'running' | 'paused';

export interface PomodoroState {
  mode: PomodoroMode;
  status: PomodoroStatus;
  remainingMs: number;
  completedToday: number;
}

export type PomodoroAction =
  | { type: 'start' }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'reset' }
  | { type: 'skip' }
  | { type: 'tick'; elapsedMs: number }
  | { type: 'hydrate'; completedToday: number };

export const INITIAL_POMODORO: PomodoroState = {
  mode: 'focus',
  status: 'idle',
  remainingMs: FOCUS_MS,
  completedToday: 0,
};

function durationFor(mode: PomodoroMode): number {
  return mode === 'focus' ? FOCUS_MS : BREAK_MS;
}

function nextMode(state: PomodoroState, countCompletion: boolean): PomodoroState {
  const mode: PomodoroMode = state.mode === 'focus' ? 'break' : 'focus';
  return {
    mode,
    status: 'idle',
    remainingMs: durationFor(mode),
    completedToday:
      countCompletion && state.mode === 'focus' ? state.completedToday + 1 : state.completedToday,
  };
}

export function pomodoroReducer(state: PomodoroState, action: PomodoroAction): PomodoroState {
  switch (action.type) {
    case 'start':
      return { ...state, status: 'running', remainingMs: durationFor(state.mode) };
    case 'pause':
      return state.status === 'running' ? { ...state, status: 'paused' } : state;
    case 'resume':
      return state.status === 'paused' ? { ...state, status: 'running' } : state;
    case 'reset':
      return { ...INITIAL_POMODORO, completedToday: state.completedToday };
    case 'skip':
      return nextMode(state, false);
    case 'tick': {
      if (state.status !== 'running') {
        return state;
      }
      const remainingMs = state.remainingMs - action.elapsedMs;
      if (remainingMs <= 0) {
        return nextMode(state, true);
      }
      return { ...state, remainingMs };
    }
    case 'hydrate':
      return { ...state, completedToday: action.completedToday };
  }
}
