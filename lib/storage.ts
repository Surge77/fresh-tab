import { storage } from 'wxt/utils/storage';

import type { QuickLink, Settings, Theme, Todo, WidgetFlags } from './types';

const SETTINGS_KEY = 'local:settings';
const TODOS_KEY = 'local:todos';
const LINKS_KEY = 'local:links';

const THEMES: Theme[] = ['light', 'dark', 'system'];

export const DEFAULT_SETTINGS: Settings = {
  displayName: '',
  theme: 'system',
  widgets: { clock: true, greeting: true, todos: true, links: true, quote: true },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isWidgetFlags(value: unknown): value is WidgetFlags {
  if (!isRecord(value)) {
    return false;
  }
  return (['clock', 'greeting', 'todos', 'links', 'quote'] as const).every(
    (key) => typeof value[key] === 'boolean',
  );
}

function isSettings(value: unknown): value is Settings {
  if (!isRecord(value)) {
    return false;
  }
  return (
    typeof value.displayName === 'string' &&
    THEMES.includes(value.theme as Theme) &&
    isWidgetFlags(value.widgets)
  );
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
  const raw = await storage.getItem<unknown>(SETTINGS_KEY);
  return isSettings(raw) ? raw : DEFAULT_SETTINGS;
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
