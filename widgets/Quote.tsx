import { quoteOfDay } from '../lib/quote-of-day';
import { QUOTES } from '../lib/quotes';

export function Quote() {
  const quote = quoteOfDay(new Date(), QUOTES);

  return (
    <figure className="max-w-md text-center">
      <blockquote className="text-base italic text-slate-600 dark:text-slate-300">
        “{quote.text}”
      </blockquote>
      <figcaption className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        — {quote.author}
      </figcaption>
    </figure>
  );
}
