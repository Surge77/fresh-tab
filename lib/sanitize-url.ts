const SAFE_PROTOCOLS = ['http:', 'https:'];
const HAS_SCHEME = /^[a-z][a-z0-9+.-]*:/i;

export function sanitizeUrl(input: string): string | null {
  const trimmed = input.trim();
  if (trimmed === '') {
    return null;
  }

  const withScheme = HAS_SCHEME.test(trimmed) ? trimmed : `https://${trimmed}`;

  let parsed: URL;
  try {
    parsed = new URL(withScheme);
  } catch {
    return null;
  }

  if (!SAFE_PROTOCOLS.includes(parsed.protocol)) {
    return null;
  }

  return parsed.href;
}
