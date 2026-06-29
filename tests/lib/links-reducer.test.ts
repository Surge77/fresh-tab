import { describe, expect, it } from 'vitest';

import { linksReducer } from '../../lib/links-reducer';
import type { QuickLink } from '../../lib/types';

function makeLink(id: string, order: number): QuickLink {
  return { id, label: `l-${id}`, url: `https://${id}.example.com/`, order };
}

describe('linksReducer', () => {
  it('replaces state on set and reindexes order', () => {
    const next = linksReducer([], { type: 'set', links: [makeLink('a', 9)] });
    expect(next).toEqual([{ ...makeLink('a', 9), order: 0 }]);
  });

  it('appends on add with the next order index', () => {
    const next = linksReducer([makeLink('a', 0)], { type: 'add', link: makeLink('b', 99) });
    expect(next).toHaveLength(2);
    expect(next[1].order).toBe(1);
  });

  it('updates label and url without mutating input', () => {
    const start = [makeLink('a', 0)];
    const next = linksReducer(start, {
      type: 'update',
      id: 'a',
      label: 'New',
      url: 'https://new.example.com/',
    });
    expect(next[0].label).toBe('New');
    expect(next[0].url).toBe('https://new.example.com/');
    expect(start[0].label).toBe('l-a');
  });

  it('removes and reindexes order on delete', () => {
    const start = [makeLink('a', 0), makeLink('b', 1), makeLink('c', 2)];
    const next = linksReducer(start, { type: 'delete', id: 'b' });
    expect(next.map((l) => l.id)).toEqual(['a', 'c']);
    expect(next.map((l) => l.order)).toEqual([0, 1]);
  });
});
