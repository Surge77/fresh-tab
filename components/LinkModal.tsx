import { useEffect, useState, type FormEvent } from 'react';

import { sanitizeUrl } from '../lib/sanitize-url';

interface LinkModalProps {
  title: string;
  initialLabel: string;
  initialUrl: string;
  onSave: (label: string, url: string) => void;
  onCancel: () => void;
}

const fieldClass =
  'mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm ' +
  'text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ' +
  'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100';

export function LinkModal({ title, initialLabel, initialUrl, onSave, onCancel }: LinkModalProps) {
  const [label, setLabel] = useState(initialLabel);
  const [url, setUrl] = useState(initialUrl);
  const [error, setError] = useState('');

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onCancel();
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onCancel]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanUrl = sanitizeUrl(url);
    if (!cleanUrl) {
      setError('Enter a valid http or https URL');
      return;
    }
    const cleanLabel = label.trim() || new URL(cleanUrl).hostname;
    onSave(cleanLabel, cleanUrl);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-10 grid place-items-center bg-black/40 p-4"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl dark:bg-slate-900"
      >
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>

        <label className="mt-4 block text-sm text-slate-600 dark:text-slate-300">
          Label
          <input
            type="text"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            className={fieldClass}
          />
        </label>

        <label className="mt-3 block text-sm text-slate-600 dark:text-slate-300">
          URL
          <input
            type="text"
            value={url}
            onChange={(event) => {
              setUrl(event.target.value);
              setError('');
            }}
            aria-invalid={error !== ''}
            placeholder="https://example.com"
            className={fieldClass}
          />
        </label>

        {error !== '' && (
          <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-blue-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
