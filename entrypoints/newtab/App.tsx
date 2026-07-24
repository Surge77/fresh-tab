import { useCallback, useEffect, useState } from 'react';

import { Background } from '../../components/Background';
import { CommandPalette } from '../../components/CommandPalette';
import { SettingsPanel } from '../../components/SettingsPanel';
import { getDaypart } from '../../lib/daypart';
import { DEFAULT_SETTINGS, getSettings, setSettings as persistSettings } from '../../lib/storage';
import { resolveTheme } from '../../lib/theme';
import type { Settings } from '../../lib/types';
import { Clock } from '../../widgets/Clock';
import { Focus } from '../../widgets/Focus';
import { Greeting } from '../../widgets/Greeting';
import { QuickLinks } from '../../widgets/QuickLinks';
import { Quote } from '../../widgets/Quote';
import { Todos } from '../../widgets/Todos';

const DAYPART_REFRESH_MS = 60_000;

function isTypingTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
}

export function App() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  useEffect(() => {
    let isActive = true;
    void getSettings().then((loaded) => {
      if (isActive) {
        setSettings(loaded);
      }
    });
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      document.documentElement.dataset.theme = resolveTheme(settings.theme, media.matches);
    };
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [settings.theme]);

  useEffect(() => {
    document.documentElement.dataset.accent = settings.accent;
  }, [settings.accent]);

  useEffect(() => {
    const apply = () => {
      document.documentElement.dataset.daypart = getDaypart(new Date().getHours());
    };
    apply();
    const intervalId = setInterval(apply, DAYPART_REFRESH_MS);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      const isPaletteShortcut =
        ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') ||
        (event.key === '/' && !isTypingTarget(event.target));
      if (isPaletteShortcut) {
        event.preventDefault();
        setIsPaletteOpen((open) => !open);
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((current) => {
      const next = { ...current, ...patch };
      void persistSettings(next);
      return next;
    });
  }, []);

  const { widgets } = settings;

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-6 px-6 py-12 text-slate-900 dark:text-slate-100">
      {settings.aurora && <Background />}

      <button
        type="button"
        onClick={() => setIsSettingsOpen(true)}
        aria-label="Open settings"
        className="absolute right-4 top-4 rounded-md px-2 py-1 text-slate-400 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:text-slate-200"
      >
        ⚙
      </button>

      {widgets.clock && <Clock />}
      {widgets.greeting && <Greeting displayName={settings.displayName} />}
      {widgets.focus && <Focus />}
      {widgets.todos && <Todos />}
      {widgets.links && <QuickLinks />}
      {widgets.quote && <Quote />}

      {isSettingsOpen && (
        <SettingsPanel
          settings={settings}
          onChange={updateSettings}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {isPaletteOpen && (
        <CommandPalette
          settings={settings}
          onUpdateSettings={updateSettings}
          onClose={() => setIsPaletteOpen(false)}
        />
      )}
    </main>
  );
}
