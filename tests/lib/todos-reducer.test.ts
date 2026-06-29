import { describe, expect, it } from 'vitest';

import { todosReducer } from '../../lib/todos-reducer';
import type { Todo } from '../../lib/types';

function makeTodo(id: string, order: number, done = false): Todo {
  return { id, text: `t-${id}`, done, order, createdAt: order };
}

describe('todosReducer', () => {
  it('replaces state on set', () => {
    const next = todosReducer([makeTodo('a', 0)], { type: 'set', todos: [makeTodo('b', 0)] });
    expect(next.map((t) => t.id)).toEqual(['b']);
  });

  it('appends on add with the next order index', () => {
    const start = [makeTodo('a', 0)];
    const added = makeTodo('b', 99);
    const next = todosReducer(start, { type: 'add', todo: added });
    expect(next).toHaveLength(2);
    expect(next[1].id).toBe('b');
    expect(next[1].order).toBe(1);
  });

  it('flips done on toggle without mutating input', () => {
    const start = [makeTodo('a', 0, false)];
    const next = todosReducer(start, { type: 'toggle', id: 'a' });
    expect(next[0].done).toBe(true);
    expect(start[0].done).toBe(false);
  });

  it('removes and reindexes order on delete', () => {
    const start = [makeTodo('a', 0), makeTodo('b', 1), makeTodo('c', 2)];
    const next = todosReducer(start, { type: 'delete', id: 'b' });
    expect(next.map((t) => t.id)).toEqual(['a', 'c']);
    expect(next.map((t) => t.order)).toEqual([0, 1]);
  });

  it('moves an item and reindexes order on reorder', () => {
    const start = [makeTodo('a', 0), makeTodo('b', 1), makeTodo('c', 2)];
    const next = todosReducer(start, { type: 'reorder', from: 0, to: 2 });
    expect(next.map((t) => t.id)).toEqual(['b', 'c', 'a']);
    expect(next.map((t) => t.order)).toEqual([0, 1, 2]);
  });

  it('ignores reorder with out-of-range indices', () => {
    const start = [makeTodo('a', 0), makeTodo('b', 1)];
    expect(todosReducer(start, { type: 'reorder', from: 0, to: 5 })).toEqual(start);
  });
});
