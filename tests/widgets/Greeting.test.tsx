import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Greeting } from '../../widgets/Greeting';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2020, 0, 1, 9, 0, 0));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Greeting', () => {
  it('shows a time-aware greeting with the name', () => {
    render(<Greeting displayName="Ada" />);
    expect(screen.getByRole('heading')).toHaveTextContent('Good morning, Ada');
  });

  it('omits the name when display name is blank', () => {
    render(<Greeting displayName="   " />);
    expect(screen.getByRole('heading')).toHaveTextContent('Good morning');
    expect(screen.getByRole('heading').textContent).not.toContain(',');
  });
});
