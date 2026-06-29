import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { fakeBrowser } from 'wxt/testing';

import { setTodos } from '../../lib/storage';
import { Todos } from '../../widgets/Todos';

beforeEach(() => {
  fakeBrowser.reset();
});

describe('Todos', () => {
  it('loads existing todos from storage on mount', async () => {
    await setTodos([{ id: 'a', text: 'ship phase 3', done: false, order: 0, createdAt: 1 }]);
    render(<Todos />);
    expect(await screen.findByText('ship phase 3')).toBeInTheDocument();
  });

  it('adds a todo from the input on Enter', async () => {
    const user = userEvent.setup();
    render(<Todos />);
    await user.type(screen.getByLabelText('New task'), 'write docs{Enter}');
    expect(await screen.findByText('write docs')).toBeInTheDocument();
  });

  it('toggles a todo via its checkbox', async () => {
    const user = userEvent.setup();
    await setTodos([{ id: 'a', text: 'task', done: false, order: 0, createdAt: 1 }]);
    render(<Todos />);
    const checkbox = await screen.findByLabelText('Toggle task');
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('deletes a todo via its delete button', async () => {
    const user = userEvent.setup();
    await setTodos([{ id: 'a', text: 'temp task', done: false, order: 0, createdAt: 1 }]);
    render(<Todos />);
    await user.click(await screen.findByLabelText('Delete temp task'));
    await waitFor(() => expect(screen.queryByText('temp task')).not.toBeInTheDocument());
  });

  it('deletes the focused todo on the Delete key', async () => {
    const user = userEvent.setup();
    await setTodos([{ id: 'a', text: 'kbd task', done: false, order: 0, createdAt: 1 }]);
    render(<Todos />);
    const item = (await screen.findByText('kbd task')).closest('li');
    item?.focus();
    await user.keyboard('{Delete}');
    await waitFor(() => expect(screen.queryByText('kbd task')).not.toBeInTheDocument());
  });
});
