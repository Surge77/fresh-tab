import { describe, expect, it } from 'vitest';

import { faviconUrl, initialFor } from '../../lib/favicon';

describe('faviconUrl', () => {
  it('builds a favicon service url from the hostname', () => {
    expect(faviconUrl('https://github.com/wxt-dev/wxt')).toBe(
      'https://www.google.com/s2/favicons?domain=github.com&sz=64',
    );
  });

  it('returns null for an unparseable url', () => {
    expect(faviconUrl('not a url')).toBeNull();
  });
});

describe('initialFor', () => {
  it('returns the uppercased first character of the label', () => {
    expect(initialFor('docs')).toBe('D');
  });

  it('falls back to a placeholder for an empty label', () => {
    expect(initialFor('   ')).toBe('?');
  });
});
