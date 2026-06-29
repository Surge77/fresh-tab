export type Theme = 'light' | 'dark' | 'system';

export interface WidgetFlags {
  clock: boolean;
  greeting: boolean;
  todos: boolean;
  links: boolean;
  quote: boolean;
}

export interface Settings {
  displayName: string;
  theme: Theme;
  widgets: WidgetFlags;
}

export interface Todo {
  id: string;
  text: string;
  done: boolean;
  order: number;
  createdAt: number;
}

export interface QuickLink {
  id: string;
  label: string;
  url: string;
  order: number;
}

export interface Quote {
  text: string;
  author: string;
}
