const FAVICON_SIZE = 64;

export function faviconUrl(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  return `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=${FAVICON_SIZE}`;
}

export function initialFor(label: string): string {
  const trimmed = label.trim();
  return trimmed ? trimmed[0].toUpperCase() : '?';
}
