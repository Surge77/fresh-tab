import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';

import { filterCommands, type PaletteCommand } from '../lib/command';
import { ACCENTS, getLinks, getTodos, setTodos, TODOS_CHANGED_EVENT } from '../lib/storage';
import type { QuickLink, Settings, Theme } from '../lib/types';

const THEMES: Theme[] = ['light', 'dark', 'system'];
const TODO_PREFIX = 'todo ';

interface CommandPaletteProps {
  settings: Settings;
  onUpdateSettings: (patch: Partial<Settings>) => void;
  onClose: () => void;
}

async function addTodo(text: string): Promise<void> {
  const todos = await getTodos();
  await setTodos([
    ...todos,
    { id: crypto.randomUUID(), text, done: false, order: 0, createdAt: Date.now() },
  ]);
  window.dispatchEvent(new CustomEvent(TODOS_CHANGED_EVENT));
}

export function CommandPalette({ settings, onUpdateSettings, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [links, setLinks] = useState<QuickLink[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isActive = true;
    void getLinks().then((loaded) => {
      if (isActive) {
        setLinks(loaded);
      }
    });
    inputRef.current?.focus();
    return () => {
      isActive = false;
    };
  }, []);

  const commands = useMemo<PaletteCommand[]>(() => {
    const staticCommands: PaletteCommand[] = [
      ...links.map((link) => ({
        id: `link-${link.id}`,
        label: `Open ${link.label}`,
        hint: link.url,
        keywords: `link ${link.label}`,
        perform: () => window.location.assign(link.url),
      })),
      ...THEMES.map((theme) => ({
        id: `theme-${theme}`,
        label: `Theme: ${theme}`,
        keywords: `theme ${theme}`,
        perform: () => onUpdateSettings({ theme }),
      })),
      ...ACCENTS.map((accent) => ({
        id: `accent-${accent}`,
        label: `Accent: ${accent}`,
        keywords: `accent color ${accent}`,
        perform: () => onUpdateSettings({ accent }),
      })),
      {
        id: 'toggle-aurora',
        label: settings.aurora ? 'Turn aurora background off' : 'Turn aurora background on',
        keywords: 'aurora background toggle',
        perform: () => onUpdateSettings({ aurora: !settings.aurora }),
      },
    ];
    return staticCommands;
  }, [links, settings.aurora, onUpdateSettings]);

  const results = useMemo<PaletteCommand[]>(() => {
    const trimmed = query.trim();
    const matches = filterCommands(commands, trimmed);

    if (trimmed.toLowerCase().startsWith(TODO_PREFIX)) {
      const text = trimmed.slice(TODO_PREFIX.length).trim();
      if (text !== '') {
        matches.unshift({
          id: 'add-todo',
          label: `Add todo: ${text}`,
          keywords: 'todo add',
          perform: () => void addTodo(text),
        });
      }
    }

    if (trimmed !== '') {
      matches.push({
        id: 'web-search',
        label: `Search the web for “${trimmed}”`,
        keywords: 'search web',
        perform: () =>
          window.location.assign(`https://duckduckgo.com/?q=${encodeURIComponent(trimmed)}`),
      });
    }
    return matches;
  }, [commands, query]);

  function run(command: PaletteCommand) {
    command.perform();
    onClose();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const command = results[activeIndex];
      if (command) {
        run(command);
      }
    } else if (event.key === 'Escape') {
      onClose();
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      className="fixed inset-0 z-20 flex justify-center bg-black/40 p-4 pt-[18vh]"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="glass h-fit w-full max-w-lg overflow-hidden rounded-xl">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type a command, link, or “todo …”"
          aria-label="Command input"
          className="w-full border-b border-slate-200/60 bg-transparent px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none dark:border-slate-700/60 dark:text-slate-100"
        />
        <ul role="listbox" aria-label="Commands" className="max-h-72 overflow-y-auto p-1.5">
          {results.map((command, index) => (
            <li key={command.id} role="option" aria-selected={index === activeIndex}>
              <button
                type="button"
                onClick={() => run(command)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`flex w-full items-baseline justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm ${
                  index === activeIndex
                    ? 'accent-bg text-white'
                    : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                <span className="truncate">{command.label}</span>
                {command.hint && (
                  <span
                    className={`truncate text-xs ${
                      index === activeIndex ? 'text-white/70' : 'text-slate-400'
                    }`}
                  >
                    {command.hint}
                  </span>
                )}
              </button>
            </li>
          ))}
          {results.length === 0 && (
            <li className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">
              Type to search links, themes, accents…
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
