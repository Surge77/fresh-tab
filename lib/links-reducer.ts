import type { QuickLink } from './types';

export type LinkAction =
  | { type: 'set'; links: QuickLink[] }
  | { type: 'add'; link: QuickLink }
  | { type: 'update'; id: string; label: string; url: string }
  | { type: 'delete'; id: string };

function reindex(links: QuickLink[]): QuickLink[] {
  return links.map((link, index) => (link.order === index ? link : { ...link, order: index }));
}

export function linksReducer(state: QuickLink[], action: LinkAction): QuickLink[] {
  switch (action.type) {
    case 'set':
      return reindex(action.links);

    case 'add':
      return [...state, { ...action.link, order: state.length }];

    case 'update':
      return state.map((link) =>
        link.id === action.id ? { ...link, label: action.label, url: action.url } : link,
      );

    case 'delete':
      return reindex(state.filter((link) => link.id !== action.id));
  }
}
