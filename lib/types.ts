export type Theme = 'light' | 'dark' | 'system';

export type Accent = 'blue' | 'violet' | 'emerald' | 'amber' | 'rose' | 'cyan';

export interface WidgetFlags {
  clock: boolean;
  greeting: boolean;
  todos: boolean;
  links: boolean;
  quote: boolean;
  focus: boolean;
}

export interface Settings {
  displayName: string;
  theme: Theme;
  accent: Accent;
  aurora: boolean;
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

export interface FocusDay {
  date: string;
  completed: number;
}
