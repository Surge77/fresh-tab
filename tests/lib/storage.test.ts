import { beforeEach, describe, expect, it } from 'vitest';
import { fakeBrowser } from 'wxt/testing';
import { storage } from 'wxt/utils/storage';

import {
  DEFAULT_SETTINGS,
  getFocusDay,
  getLinks,
  getSettings,
  getTodos,
  setFocusDay,
  setLinks,
  setSettings,
  setTodos,
  todayKey,
} from '../../lib/storage';
import type { QuickLink, Settings, Todo } from '../../lib/types';

beforeEach(() => {
  fakeBrowser.reset();
});

describe('settings storage', () => {
  it('returns defaults when storage is empty', async () => {
    expect(await getSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it('round-trips a saved value', async () => {
    const custom: Settings = {
      displayName: 'Ada',
      theme: 'dark',
      accent: 'rose',
      aurora: false,
      widgets: {
        clock: true,
        greeting: false,
        todos: true,
        links: false,
        quote: true,
        focus: false,
      },
    };
    await setSettings(custom);
    expect(await getSettings()).toEqual(custom);
  });

  it('falls back to defaults when stored data is malformed', async () => {
    await storage.setItem('local:settings', 42 as unknown);
    expect(await getSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it('preserves known fields and fills the rest from defaults', async () => {
    await storage.setItem('local:settings', { displayName: 'X' } as unknown);
    expect(await getSettings()).toEqual({ ...DEFAULT_SETTINGS, displayName: 'X' });
  });

  it('migrates v0.1 settings without wiping user preferences', async () => {
    // Exact shape written by the published 0.1.0 build — no accent/aurora/focus.
    await storage.setItem('local:settings', {
      displayName: 'Grace',
      theme: 'dark',
      widgets: { clock: true, greeting: false, todos: true, links: true, quote: false },
    } as unknown);

    const migrated = await getSettings();
    expect(migrated.displayName).toBe('Grace');
    expect(migrated.theme).toBe('dark');
    expect(migrated.widgets.greeting).toBe(false);
    expect(migrated.widgets.quote).toBe(false);
    expect(migrated.accent).toBe(DEFAULT_SETTINGS.accent);
    expect(migrated.aurora).toBe(true);
    expect(migrated.widgets.focus).toBe(true);
  });

  it('replaces invalid field values with defaults', async () => {
    await storage.setItem('local:settings', {
      displayName: 7,
      theme: 'neon',
      accent: 'plaid',
      widgets: { clock: 'yes' },
    } as unknown);
    expect(await getSettings()).toEqual(DEFAULT_SETTINGS);
  });
});

describe('todos storage', () => {
  const todo: Todo = { id: 'a', text: 'write tests', done: false, order: 0, createdAt: 1 };

  it('returns an empty array when storage is empty', async () => {
    expect(await getTodos()).toEqual([]);
  });

  it('round-trips a saved list', async () => {
    await setTodos([todo]);
    expect(await getTodos()).toEqual([todo]);
  });

  it('falls back to empty array when stored value is not an array', async () => {
    await storage.setItem('local:todos', { nope: true } as unknown);
    expect(await getTodos()).toEqual([]);
  });

  it('drops malformed items', async () => {
    await storage.setItem('local:todos', [todo, { id: 5 }] as unknown);
    expect(await getTodos()).toEqual([todo]);
  });
});

describe('links storage', () => {
  const link: QuickLink = { id: 'l1', label: 'Docs', url: 'https://example.com/', order: 0 };

  it('returns an empty array when storage is empty', async () => {
    expect(await getLinks()).toEqual([]);
  });

  it('round-trips a saved list', async () => {
    await setLinks([link]);
    expect(await getLinks()).toEqual([link]);
  });

  it('drops malformed items', async () => {
    await storage.setItem('local:links', [link, { url: 123 }] as unknown);
    expect(await getLinks()).toEqual([link]);
  });
});

describe('focus day storage', () => {
  const now = new Date(2026, 6, 24);

  it('returns a zeroed record for today when storage is empty', async () => {
    expect(await getFocusDay(now)).toEqual({ date: '2026-07-24', completed: 0 });
  });

  it('round-trips a saved record for the same day', async () => {
    await setFocusDay({ date: todayKey(now), completed: 4 });
    expect(await getFocusDay(now)).toEqual({ date: '2026-07-24', completed: 4 });
  });

  it('resets the count when the stored record is from another day', async () => {
    await setFocusDay({ date: '2026-07-23', completed: 9 });
    expect(await getFocusDay(now)).toEqual({ date: '2026-07-24', completed: 0 });
  });
});
