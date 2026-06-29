import { describe, expect, it } from 'vitest';

import { resolveTheme } from '../../lib/theme';

describe('resolveTheme', () => {
  it('returns the explicit choice for light and dark', () => {
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });

  it('follows the OS preference when set to system', () => {
    expect(resolveTheme('system', true)).toBe('dark');
    expect(resolveTheme('system', false)).toBe('light');
  });
});
