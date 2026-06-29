import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Clock } from '../../widgets/Clock';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2020, 0, 1, 9, 5, 3));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Clock', () => {
  it('renders the current time', () => {
    render(<Clock />);
    expect(screen.getByLabelText('Current time')).toHaveTextContent('09:05:03');
  });

  it('advances every second', () => {
    render(<Clock />);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByLabelText('Current time')).toHaveTextContent('09:05:04');
  });

  it('clears its interval on unmount', () => {
    const clearSpy = vi.spyOn(globalThis, 'clearInterval');
    const { unmount } = render(<Clock />);
    unmount();
    expect(clearSpy).toHaveBeenCalled();
  });
});
