import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { quoteOfDay } from '../../lib/quote-of-day';
import { QUOTES } from '../../lib/quotes';
import { Quote } from '../../widgets/Quote';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2021, 0, 4, 10));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Quote', () => {
  it("renders today's deterministic quote", () => {
    const expected = quoteOfDay(new Date(2021, 0, 4, 10), QUOTES);
    render(<Quote />);
    expect(screen.getByText(`“${expected.text}”`)).toBeInTheDocument();
    expect(screen.getByText(`— ${expected.author}`)).toBeInTheDocument();
  });
});
