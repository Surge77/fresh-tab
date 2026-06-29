import React from 'react';
import ReactDOM from 'react-dom/client';

import { ErrorBoundary } from '../../components/ErrorBoundary';
import { resolveTheme } from '../../lib/theme';
import { App } from './App';
import './style.css';

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.dataset.theme = resolveTheme('system', prefersDark);

const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
  );
}
