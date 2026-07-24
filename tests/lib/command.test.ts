import { describe, expect, it } from 'vitest';

import { filterCommands, fuzzyScore, type PaletteCommand } from '../../lib/command';

function cmd(id: string, label: string, keywords = ''): PaletteCommand {
  return { id, label, keywords, perform: () => undefined };
}

describe('fuzzyScore', () => {
  it('returns -1 when characters are missing', () => {
    expect(fuzzyScore('xyz', 'GitHub')).toBe(-1);
  });

  it('matches subsequences case-insensitively', () => {
    expect(fuzzyScore('gh', 'GitHub')).toBeGreaterThan(0);
    expect(fuzzyScore('github', 'GitHub')).toBeGreaterThan(0);
  });

  it('scores consecutive matches higher than scattered ones', () => {
    const consecutive = fuzzyScore('git', 'GitHub');
    const scattered = fuzzyScore('gtb', 'GitHub');
    expect(consecutive).toBeGreaterThan(scattered);
  });

  it('matches everything with an empty query', () => {
    expect(fuzzyScore('', 'anything')).toBe(0);
  });
});

describe('filterCommands', () => {
  const commands = [
    cmd('theme-dark', 'Switch to dark theme', 'theme dark'),
    cmd('link-github', 'Open GitHub', 'github link'),
    cmd('link-gmail', 'Open Gmail', 'gmail link'),
  ];

  it('returns all commands for an empty query', () => {
    expect(filterCommands(commands, '')).toHaveLength(3);
  });

  it('filters out non-matching commands', () => {
    const results = filterCommands(commands, 'github');
    expect(results.map((c) => c.id)).toEqual(['link-github']);
  });

  it('ranks better matches first', () => {
    const results = filterCommands(commands, 'gma');
    expect(results[0]?.id).toBe('link-gmail');
  });

  it('matches on keywords as well as label', () => {
    const results = filterCommands(commands, 'dark');
    expect(results.map((c) => c.id)).toContain('theme-dark');
  });
});
