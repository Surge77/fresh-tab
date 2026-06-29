import { useEffect } from 'react';

import type { Settings, Theme, WidgetFlags } from '../lib/types';

interface SettingsPanelProps {
  settings: Settings;
  onChange: (patch: Partial<Settings>) => void;
  onClose: () => void;
}

const THEME_OPTIONS: Theme[] = ['light', 'dark', 'system'];

const WIDGET_LABELS: Array<{ key: keyof WidgetFlags; label: string }> = [
  { key: 'clock', label: 'Clock' },
  { key: 'greeting', label: 'Greeting' },
  { key: 'todos', label: 'Todos' },
  { key: 'links', label: 'Quick links' },
  { key: 'quote', label: 'Quote' },
];

const fieldClass =
  'mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm ' +
  'text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ' +
  'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100';

export function SettingsPanel({ settings, onChange, onClose }: SettingsPanelProps) {
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  function toggleWidget(key: keyof WidgetFlags, value: boolean) {
    onChange({ widgets: { ...settings.widgets, [key]: value } });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
      className="fixed inset-0 z-10 grid place-items-center bg-black/40 p-4"
    >
      <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Settings</h2>

        <label className="mt-4 block text-sm text-slate-600 dark:text-slate-300">
          Display name
          <input
            type="text"
            value={settings.displayName}
            onChange={(event) => onChange({ displayName: event.target.value })}
            className={fieldClass}
          />
        </label>

        <label className="mt-3 block text-sm text-slate-600 dark:text-slate-300">
          Theme
          <select
            value={settings.theme}
            onChange={(event) => onChange({ theme: event.target.value as Theme })}
            className={fieldClass}
          >
            {THEME_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="mt-4">
          <legend className="text-sm text-slate-600 dark:text-slate-300">Widgets</legend>
          <div className="mt-2 space-y-1">
            {WIDGET_LABELS.map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200"
              >
                <input
                  type="checkbox"
                  checked={settings.widgets[key]}
                  onChange={(event) => toggleWidget(key, event.target.checked)}
                  className="h-4 w-4 accent-blue-500"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-blue-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
