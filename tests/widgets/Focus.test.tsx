import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fakeBrowser } from 'wxt/testing';

import { getFocusDay } from '../../lib/storage';
import { Focus } from '../../widgets/Focus';

// Fake timers must be active before the component mounts so its interval is
// scheduled on the fake clock. userEvent deadlocks under fake timers, so
// clicks use the synchronous fireEvent instead; the mount promise is flushed
// with act() because RTL's findBy cannot detect vitest fake timers.
beforeEach(() => {
  fakeBrowser.reset();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

async function renderFocus() {
  render(<Focus />);
  await act(async () => {});
}

function click(name: string) {
  fireEvent.click(screen.getByRole('button', { name }));
}

describe('Focus', () => {
  it('renders an idle 25-minute focus session', async () => {
    await renderFocus();
    expect(screen.getByText('25:00')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
  });

  it('counts down once started', async () => {
    await renderFocus();
    click('Start');

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByText('24:57')).toBeInTheDocument();
  });

  it('pause stops the countdown and resume continues it', async () => {
    await renderFocus();
    click('Start');

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    click('Pause');
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByText('24:58')).toBeInTheDocument();

    click('Resume');
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('24:57')).toBeInTheDocument();
  });

  it('persists the completed count when a focus session finishes', async () => {
    await renderFocus();
    click('Start');

    await act(async () => {
      vi.advanceTimersByTime(25 * 60_000);
    });

    expect(screen.getByText('1 focus session today')).toBeInTheDocument();
    expect(screen.getByText('Break')).toBeInTheDocument();
    expect((await getFocusDay(new Date())).completed).toBe(1);
  });

  it('skip moves to a break without counting a session', async () => {
    await renderFocus();
    click('Skip');
    expect(screen.getByText('Break')).toBeInTheDocument();
    expect(screen.getByText('05:00')).toBeInTheDocument();
    expect(screen.getByText('0 focus sessions today')).toBeInTheDocument();
  });
});
