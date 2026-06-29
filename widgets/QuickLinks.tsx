import { useEffect, useReducer, useState } from 'react';

import { LinkIcon } from '../components/LinkIcon';
import { LinkModal } from '../components/LinkModal';
import { getLinks, setLinks } from '../lib/storage';
import { linksReducer } from '../lib/links-reducer';
import { sanitizeUrl } from '../lib/sanitize-url';
import type { QuickLink } from '../lib/types';

const WRITE_DEBOUNCE_MS = 250;

type ModalState = { mode: 'add' } | { mode: 'edit'; link: QuickLink } | null;

const tileClass =
  'flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm ' +
  'text-slate-800 hover:border-blue-400 focus-visible:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-blue-500 dark:border-slate-700 dark:text-slate-200';

const iconButtonClass =
  'rounded px-1 text-xs text-slate-400 hover:text-slate-700 focus-visible:outline-none ' +
  'focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:text-slate-200';

export function QuickLinks() {
  const [links, dispatch] = useReducer(linksReducer, []);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [modal, setModal] = useState<ModalState>(null);

  useEffect(() => {
    let isActive = true;
    void getLinks().then((loaded) => {
      if (isActive) {
        dispatch({ type: 'set', links: loaded });
        setHasLoaded(true);
      }
    });
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!hasLoaded) {
      return;
    }
    const timeoutId = setTimeout(() => void setLinks(links), WRITE_DEBOUNCE_MS);
    return () => clearTimeout(timeoutId);
  }, [links, hasLoaded]);

  function handleSave(label: string, url: string) {
    if (modal?.mode === 'edit') {
      dispatch({ type: 'update', id: modal.link.id, label, url });
    } else {
      dispatch({
        type: 'add',
        link: { id: crypto.randomUUID(), label, url, order: 0 },
      });
    }
    setModal(null);
  }

  return (
    <section aria-label="Quick links" className="w-full max-w-md">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">Quick links</h2>
        <button
          type="button"
          onClick={() => setModal({ mode: 'add' })}
          className="rounded-md px-2 py-1 text-sm text-blue-500 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          + Add
        </button>
      </div>

      <ul className="grid grid-cols-2 gap-2">
        {links.map((link) => (
          <li key={link.id} className="flex items-center gap-1">
            <a href={sanitizeUrl(link.url) ?? '#'} className={`${tileClass} flex-1`}>
              <LinkIcon url={link.url} label={link.label} />
              <span className="truncate">{link.label}</span>
            </a>
            <button
              type="button"
              onClick={() => setModal({ mode: 'edit', link })}
              aria-label={`Edit ${link.label}`}
              className={iconButtonClass}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: 'delete', id: link.id })}
              aria-label={`Delete ${link.label}`}
              className={iconButtonClass}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      {modal !== null && (
        <LinkModal
          title={modal.mode === 'edit' ? 'Edit link' : 'Add link'}
          initialLabel={modal.mode === 'edit' ? modal.link.label : ''}
          initialUrl={modal.mode === 'edit' ? modal.link.url : ''}
          onSave={handleSave}
          onCancel={() => setModal(null)}
        />
      )}
    </section>
  );
}
