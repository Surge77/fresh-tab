import { useEffect } from 'react';

import { ACCENTS } from '../lib/storage';
import type { Settings, Theme, WidgetFlags } from '../lib/types';

interface SettingsPanelProps {
  settings: Settings;
  onChange: (patch: Partial<Settings>) => void;
  onClose: () => void;
}

const THEME_OPTIONS: Theme[] = ['light', 'dark', 'system'];

const ACCENT_SWATCH: Record<string, string> = {
  blue: '#3b82f6',
  violet: '#8b5cf6',
  emerald: '#10b981',
  amber: '#f59e0b',
  rose: '#f43f5e',
  cyan: '#06b6d4',
};

const WIDGET_LABELS: Array<{ key: keyof WidgetFlags; label: string }> = [
  { key: 'clock', label: 'Clock' },
  { key: 'greeting', label: 'Greeting' },
  { key: 'focus', label: 'Focus timer' },
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
      <div className="glass max-h-[85vh] w-full max-w-sm overflow-y-auto rounded-xl p-5">
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
          <legend className="text-sm text-slate-600 dark:text-slate-300">Accent color</legend>
          <div className="mt-2 flex gap-2">
            {ACCENTS.map((accent) => (
              <button
                key={accent}
                type="button"
                onClick={() => onChange({ accent })}
                aria-label={`${accent} accent`}
                aria-pressed={settings.accent === accent}
                style={{ backgroundColor: ACCENT_SWATCH[accent] }}
                className={`h-7 w-7 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  settings.accent === accent
                    ? 'ring-2 ring-slate-900 ring-offset-2 dark:ring-white'
                    : ''
                }`}
              />
            ))}
          </div>
        </fieldset>

        <label className="mt-4 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
          <input
            type="checkbox"
            checked={settings.aurora}
            onChange={(event) => onChange({ aurora: event.target.checked })}
            className="h-4 w-4"
          />
          Aurora background
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
                  className="h-4 w-4"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
          Tip: press <kbd className="rounded border border-slate-300 px-1 dark:border-slate-600">Ctrl</kbd>
          +<kbd className="rounded border border-slate-300 px-1 dark:border-slate-600">K</kbd> for
          the command palette.
        </p>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="accent-bg rounded-md px-3 py-1.5 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
