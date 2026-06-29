import { describe, expect, it } from 'vitest';

import { sanitizeUrl } from '../../lib/sanitize-url';

describe('sanitizeUrl', () => {
  it('keeps https urls', () => {
    expect(sanitizeUrl('https://example.com')).toBe('https://example.com/');
  });

  it('keeps http urls', () => {
    expect(sanitizeUrl('http://example.com/path')).toBe('http://example.com/path');
  });

  it('prepends https to a bare domain', () => {
    expect(sanitizeUrl('example.com')).toBe('https://example.com/');
  });

  it('rejects javascript: scheme', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBeNull();
  });

  it('rejects data: scheme', () => {
    expect(sanitizeUrl('data:text/html,<script>x</script>')).toBeNull();
  });

  it('rejects ftp: scheme', () => {
    expect(sanitizeUrl('ftp://files.example.com')).toBeNull();
  });

  it('rejects empty and whitespace input', () => {
    expect(sanitizeUrl('')).toBeNull();
    expect(sanitizeUrl('   ')).toBeNull();
  });

  it('trims surrounding whitespace', () => {
    expect(sanitizeUrl('  https://example.com  ')).toBe('https://example.com/');
  });
});
