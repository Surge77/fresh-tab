import { storage } from 'wxt/utils/storage';

import type { Accent, FocusDay, QuickLink, Settings, Theme, Todo, WidgetFlags } from './types';

// Fired on window after todos are written from outside the Todos widget
// (e.g. the command palette) so the widget can reload its local copy.
export const TODOS_CHANGED_EVENT = 'freshtab:todos-changed';

const SETTINGS_KEY = 'local:settings';
const TODOS_KEY = 'local:todos';
const LINKS_KEY = 'local:links';
const FOCUS_KEY = 'local:focusDay';

const THEMES: Theme[] = ['light', 'dark', 'system'];
export const ACCENTS: Accent[] = ['blue', 'violet', 'emerald', 'amber', 'rose', 'cyan'];
const WIDGET_KEYS = ['clock', 'greeting', 'todos', 'links', 'quote', 'focus'] as const;

export const DEFAULT_SETTINGS: Settings = {
  displayName: '',
  theme: 'system',
  accent: 'blue',
  aurora: true,
  widgets: { clock: true, greeting: true, todos: true, links: true, quote: true, focus: true },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizeWidgets(value: unknown): WidgetFlags {
  const raw = isRecord(value) ? value : {};
  const widgets = { ...DEFAULT_SETTINGS.widgets };
  for (const key of WIDGET_KEYS) {
    if (typeof raw[key] === 'boolean') {
      widgets[key] = raw[key];
    }
  }
  return widgets;
}

// Field-by-field merge instead of all-or-nothing validation: settings stored
// by an older version lack newer fields and must not reset the user's data.
function normalizeSettings(value: unknown): Settings {
  const raw = isRecord(value) ? value : {};
  return {
    displayName:
      typeof raw.displayName === 'string' ? raw.displayName : DEFAULT_SETTINGS.displayName,
    theme: THEMES.includes(raw.theme as Theme) ? (raw.theme as Theme) : DEFAULT_SETTINGS.theme,
    accent: ACCENTS.includes(raw.accent as Accent)
      ? (raw.accent as Accent)
      : DEFAULT_SETTINGS.accent,
    aurora: typeof raw.aurora === 'boolean' ? raw.aurora : DEFAULT_SETTINGS.aurora,
    widgets: normalizeWidgets(raw.widgets),
  };
}

function isTodo(value: unknown): value is Todo {
  if (!isRecord(value)) {
    return false;
  }
  return (
    typeof value.id === 'string' &&
    typeof value.text === 'string' &&
    typeof value.done === 'boolean' &&
    typeof value.order === 'number' &&
    typeof value.createdAt === 'number'
  );
}

function isQuickLink(value: unknown): value is QuickLink {
  if (!isRecord(value)) {
    return false;
  }
  return (
    typeof value.id === 'string' &&
    typeof value.label === 'string' &&
    typeof value.url === 'string' &&
    typeof value.order === 'number'
  );
}

function validArray<T>(value: unknown, guard: (item: unknown) => item is T): T[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter(guard);
}

export async function getSettings(): Promise<Settings> {
  return normalizeSettings(await storage.getItem<unknown>(SETTINGS_KEY));
}

export async function setSettings(settings: Settings): Promise<void> {
  await storage.setItem(SETTINGS_KEY, settings);
}

export async function getTodos(): Promise<Todo[]> {
  return validArray(await storage.getItem<unknown>(TODOS_KEY), isTodo);
}

export async function setTodos(todos: Todo[]): Promise<void> {
  await storage.setItem(TODOS_KEY, todos);
}

export async function getLinks(): Promise<QuickLink[]> {
  return validArray(await storage.getItem<unknown>(LINKS_KEY), isQuickLink);
}

export async function setLinks(links: QuickLink[]): Promise<void> {
  await storage.setItem(LINKS_KEY, links);
}

export function todayKey(now: Date): string {
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

export async function getFocusDay(now: Date): Promise<FocusDay> {
  const raw = await storage.getItem<unknown>(FOCUS_KEY);
  const today = todayKey(now);
  if (
    isRecord(raw) &&
    typeof raw.date === 'string' &&
    typeof raw.completed === 'number' &&
    raw.date === today
  ) {
    return { date: raw.date, completed: raw.completed };
  }
  return { date: today, completed: 0 };
}

export async function setFocusDay(focusDay: FocusDay): Promise<void> {
  await storage.setItem(FOCUS_KEY, focusDay);
}
