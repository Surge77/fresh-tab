import { useEffect, useReducer, useState, type FormEvent, type KeyboardEvent } from 'react';

import { getTodos, setTodos, TODOS_CHANGED_EVENT } from '../lib/storage';
import { todosReducer } from '../lib/todos-reducer';

const WRITE_DEBOUNCE_MS = 250;

const inputClass =
  'flex-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 ' +
  'placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100';

const buttonClass =
  'rounded-md px-2 text-slate-400 hover:text-red-500 focus-visible:outline-none ' +
  'focus-visible:ring-2 focus-visible:ring-blue-500';

export function Todos() {
  const [todos, dispatch] = useReducer(todosReducer, []);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    let isActive = true;
    void getTodos().then((loaded) => {
      if (isActive) {
        dispatch({ type: 'set', todos: loaded });
        setHasLoaded(true);
      }
    });
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!hasLoaded) {
      return;
    }
    const timeoutId = setTimeout(() => void setTodos(todos), WRITE_DEBOUNCE_MS);
    return () => clearTimeout(timeoutId);
  }, [todos, hasLoaded]);

  useEffect(() => {
    const reload = () => void getTodos().then((loaded) => dispatch({ type: 'set', todos: loaded }));
    window.addEventListener(TODOS_CHANGED_EVENT, reload);
    return () => window.removeEventListener(TODOS_CHANGED_EVENT, reload);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) {
      return;
    }
    dispatch({
      type: 'add',
      todo: { id: crypto.randomUUID(), text, done: false, order: 0, createdAt: Date.now() },
    });
    setDraft('');
  }

  function handleItemKeyDown(event: KeyboardEvent<HTMLLIElement>, id: string) {
    if (event.key === 'Delete') {
      event.preventDefault();
      dispatch({ type: 'delete', id });
    }
  }

  return (
    <section aria-label="Todos" className="glass rise-in w-full max-w-md rounded-xl p-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Add a task…"
          aria-label="New task"
          className={inputClass}
        />
        <button type="submit" className={`${buttonClass} accent-text`}>
          Add
        </button>
      </form>

      {hasLoaded && todos.length === 0 && (
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          No tasks yet — add one above.
        </p>
      )}

      <ul className="mt-3 space-y-1">
        {todos.map((todo) => (
          <li
            key={todo.id}
            tabIndex={0}
            onKeyDown={(event) => handleItemKeyDown(event, todo.id)}
            className="flex items-center gap-2 rounded-md px-1 py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => dispatch({ type: 'toggle', id: todo.id })}
              aria-label={`Toggle ${todo.text}`}
              className="h-4 w-4 accent-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            />
            <span
              className={
                todo.done
                  ? 'text-sm text-slate-400 line-through'
                  : 'text-sm text-slate-800 dark:text-slate-200'
              }
            >
              {todo.text}
            </span>
            <button
              type="button"
              onClick={() => dispatch({ type: 'delete', id: todo.id })}
              aria-label={`Delete ${todo.text}`}
              className={`ml-auto ${buttonClass}`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
