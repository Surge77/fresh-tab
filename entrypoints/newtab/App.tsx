import { useEffect, useState } from 'react';

import { SettingsPanel } from '../../components/SettingsPanel';
import { DEFAULT_SETTINGS, getSettings, setSettings as persistSettings } from '../../lib/storage';
import { resolveTheme } from '../../lib/theme';
import type { Settings } from '../../lib/types';
import { Clock } from '../../widgets/Clock';
import { Greeting } from '../../widgets/Greeting';
import { QuickLinks } from '../../widgets/QuickLinks';
import { Quote } from '../../widgets/Quote';
import { Todos } from '../../widgets/Todos';

export function App() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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

  function updateSettings(patch: Partial<Settings>) {
    setSettings((current) => {
      const next = { ...current, ...patch };
      void persistSettings(next);
      return next;
    });
  }

  const { widgets } = settings;

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-8 bg-white px-6 py-12 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
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
    </main>
  );
}
