import { describe, expect, it } from 'vitest';

import { dayOfYear, quoteOfDay } from '../../lib/quote-of-day';
import type { Quote } from '../../lib/types';

const QUOTES: Quote[] = [
  { text: 'q0', author: 'a0' },
  { text: 'q1', author: 'a1' },
  { text: 'q2', author: 'a2' },
];

describe('dayOfYear', () => {
  it('returns 1 on January 1st', () => {
    expect(dayOfYear(new Date(2021, 0, 1))).toBe(1);
  });

  it('returns 32 on February 1st', () => {
    expect(dayOfYear(new Date(2021, 1, 1))).toBe(32);
  });
});

describe('quoteOfDay', () => {
  it('is stable within the same day', () => {
    const morning = quoteOfDay(new Date(2021, 0, 4, 8), QUOTES);
    const evening = quoteOfDay(new Date(2021, 0, 4, 20), QUOTES);
    expect(morning).toEqual(evening);
  });

  it('changes the next day', () => {
    const today = quoteOfDay(new Date(2021, 0, 4), QUOTES);
    const tomorrow = quoteOfDay(new Date(2021, 0, 5), QUOTES);
    expect(today).not.toEqual(tomorrow);
  });

  it('selects by dayOfYear modulo list length', () => {
    expect(quoteOfDay(new Date(2021, 0, 4), QUOTES)).toEqual(QUOTES[4 % QUOTES.length]);
  });
});
