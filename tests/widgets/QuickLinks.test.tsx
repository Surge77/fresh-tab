import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { fakeBrowser } from 'wxt/testing';

import { setLinks } from '../../lib/storage';
import { QuickLinks } from '../../widgets/QuickLinks';

beforeEach(() => {
  fakeBrowser.reset();
});

describe('QuickLinks', () => {
  it('loads existing links from storage on mount', async () => {
    await setLinks([{ id: 'a', label: 'Docs', url: 'https://example.com/', order: 0 }]);
    render(<QuickLinks />);
    expect(await screen.findByText('Docs')).toBeInTheDocument();
  });

  it('adds a sanitized link via the modal', async () => {
    const user = userEvent.setup();
    render(<QuickLinks />);
    await user.click(screen.getByRole('button', { name: '+ Add' }));
    await user.type(screen.getByLabelText('Label'), 'Search');
    await user.type(screen.getByLabelText('URL'), 'example.com');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    const link = await screen.findByRole('link', { name: /Search/ });
    expect(link).toHaveAttribute('href', 'https://example.com/');
  });

  it('edits an existing link through the modal', async () => {
    const user = userEvent.setup();
    await setLinks([{ id: 'a', label: 'Docs', url: 'https://example.com/', order: 0 }]);
    render(<QuickLinks />);
    await user.click(await screen.findByRole('button', { name: 'Edit Docs' }));
    const labelField = screen.getByLabelText('Label');
    await user.clear(labelField);
    await user.type(labelField, 'Manual');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByRole('link', { name: /Manual/ })).toBeInTheDocument();
    expect(screen.queryByText('Docs')).not.toBeInTheDocument();
  });

  it('rejects a javascript: url with a visible error', async () => {
    const user = userEvent.setup();
    render(<QuickLinks />);
    await user.click(screen.getByRole('button', { name: '+ Add' }));
    await user.type(screen.getByLabelText('URL'), 'javascript:alert(1)');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByRole('alert')).toHaveTextContent(/valid http/i);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('falls back to a letter avatar when the favicon fails to load', async () => {
    await setLinks([{ id: 'a', label: 'Docs', url: 'https://example.com/', order: 0 }]);
    const { container } = render(<QuickLinks />);
    await screen.findByText('Docs');
    const img = container.querySelector('img');
    expect(img).not.toBeNull();
    fireEvent.error(img as HTMLImageElement);
    await waitFor(() => expect(screen.getByText('D')).toBeInTheDocument());
  });
});
