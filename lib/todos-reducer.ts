import type { Todo } from './types';

export type TodoAction =
  | { type: 'set'; todos: Todo[] }
  | { type: 'add'; todo: Todo }
  | { type: 'toggle'; id: string }
  | { type: 'delete'; id: string }
  | { type: 'reorder'; from: number; to: number };

function reindex(todos: Todo[]): Todo[] {
  return todos.map((todo, index) => (todo.order === index ? todo : { ...todo, order: index }));
}

export function todosReducer(state: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case 'set':
      return reindex(action.todos);

    case 'add':
      return [...state, { ...action.todo, order: state.length }];

    case 'toggle':
      return state.map((todo) =>
        todo.id === action.id ? { ...todo, done: !todo.done } : todo,
      );

    case 'delete':
      return reindex(state.filter((todo) => todo.id !== action.id));

    case 'reorder': {
      const { from, to } = action;
      const isInRange =
        from >= 0 && from < state.length && to >= 0 && to < state.length;
      if (!isInRange) {
        return state;
      }
      const next = [...state];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return reindex(next);
    }
  }
}
