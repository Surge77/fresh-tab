import { beforeEach, describe, expect, it } from 'vitest';
import { fakeBrowser } from 'wxt/testing';
import { storage } from 'wxt/utils/storage';

import {
  DEFAULT_SETTINGS,
  getLinks,
  getSettings,
  getTodos,
  setLinks,
  setSettings,
  setTodos,
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
      widgets: { clock: true, greeting: false, todos: true, links: false, quote: true },
    };
    await setSettings(custom);
    expect(await getSettings()).toEqual(custom);
  });

  it('falls back to defaults when stored data is malformed', async () => {
    await storage.setItem('local:settings', 42 as unknown);
    expect(await getSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it('falls back to defaults when required fields are missing', async () => {
    await storage.setItem('local:settings', { displayName: 'X' } as unknown);
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
