import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { fakeBrowser } from 'wxt/testing';

import { App } from '../entrypoints/newtab/App';

beforeEach(() => {
  fakeBrowser.reset();
  document.documentElement.removeAttribute('data-theme');
});

async function openSettings(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Open settings' }));
  return screen.getByRole('dialog', { name: 'Settings' });
}

describe('App', () => {
  it('hides a widget when toggled off and persists the choice', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);
    expect(screen.getByRole('region', { name: 'Todos' })).toBeInTheDocument();

    const dialog = await openSettings(user);
    await user.click(within(dialog).getByLabelText('Todos'));
    await user.click(within(dialog).getByRole('button', { name: 'Done' }));
    expect(screen.queryByRole('region', { name: 'Todos' })).not.toBeInTheDocument();

    unmount();
    render(<App />);
    await waitFor(() =>
      expect(screen.queryByRole('region', { name: 'Todos' })).not.toBeInTheDocument(),
    );
  });

  it('applies an explicit theme choice to the document root', async () => {
    const user = userEvent.setup();
    render(<App />);
    const dialog = await openSettings(user);
    await user.selectOptions(within(dialog).getByLabelText('Theme'), 'dark');
    await waitFor(() => expect(document.documentElement.dataset.theme).toBe('dark'));
  });

  it('shows the saved display name in the greeting', async () => {
    const user = userEvent.setup();
    render(<App />);
    const dialog = await openSettings(user);
    await user.type(within(dialog).getByLabelText('Display name'), 'Grace');
    await user.click(within(dialog).getByRole('button', { name: 'Done' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Grace');
  });
});
