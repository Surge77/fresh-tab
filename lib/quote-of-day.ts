import type { Quote } from './types';

const MS_PER_DAY = 86_400_000;

export function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / MS_PER_DAY);
}

export function quoteOfDay(date: Date, quotes: Quote[]): Quote {
  return quotes[dayOfYear(date) % quotes.length];
}
