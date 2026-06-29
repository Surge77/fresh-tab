import { describe, expect, it } from 'vitest';

import { formatDate, formatTime, getGreeting } from '../../lib/time';

describe('getGreeting', () => {
  it('greets morning between 5 and 11', () => {
    expect(getGreeting(5)).toBe('Good morning');
    expect(getGreeting(11)).toBe('Good morning');
  });

  it('greets afternoon between 12 and 16', () => {
    expect(getGreeting(12)).toBe('Good afternoon');
    expect(getGreeting(16)).toBe('Good afternoon');
  });

  it('greets evening between 17 and 21', () => {
    expect(getGreeting(17)).toBe('Good evening');
    expect(getGreeting(21)).toBe('Good evening');
  });

  it('greets night between 22 and 4', () => {
    expect(getGreeting(22)).toBe('Good night');
    expect(getGreeting(0)).toBe('Good night');
    expect(getGreeting(4)).toBe('Good night');
  });
});

describe('formatTime', () => {
  it('zero-pads hours, minutes, and seconds in 24h form', () => {
    expect(formatTime(new Date(2020, 0, 1, 9, 5, 3))).toBe('09:05:03');
  });

  it('formats afternoon times', () => {
    expect(formatTime(new Date(2020, 0, 1, 23, 59, 59))).toBe('23:59:59');
  });
});

describe('formatDate', () => {
  it('formats weekday, month and day', () => {
    expect(formatDate(new Date(2020, 0, 1))).toBe('Wed, Jan 1');
  });
});
