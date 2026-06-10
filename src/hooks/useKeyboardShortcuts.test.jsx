import React, { useEffect } from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { CalendarStoreProvider, useCalendarStore } from '../store/useCalendarStore';
import useKeyboardShortcuts from './useKeyboardShortcuts';

function ViewProbe({ onViewChange }) {
  const view = useCalendarStore((state) => state.view);

  useEffect(() => {
    onViewChange(view);
  }, [view, onViewChange]);

  return null;
}

function ShortcutHarness({ withInput = false }) {
  useKeyboardShortcuts();
  return withInput ? <input data-testid="typing-input" /> : <div data-testid="surface" />;
}

afterEach(() => {
  cleanup();
});

describe('useKeyboardShortcuts', () => {
  it('switches to week view when W is pressed', () => {
    const onViewChange = vi.fn();

    render(
      <CalendarStoreProvider defaultView="month">
        <ViewProbe onViewChange={onViewChange} />
        <ShortcutHarness />
      </CalendarStoreProvider>
    );

    fireEvent.keyDown(document, { key: 'w' });

    expect(onViewChange).toHaveBeenLastCalledWith('week');
  });

  it('ignores shortcuts when focus is in an input', () => {
    const onViewChange = vi.fn();

    const { getByTestId } = render(
      <CalendarStoreProvider defaultView="month">
        <ViewProbe onViewChange={onViewChange} />
        <ShortcutHarness withInput />
      </CalendarStoreProvider>
    );

    const input = getByTestId('typing-input');
    fireEvent.keyDown(input, { key: 'w', target: input });

    expect(onViewChange).not.toHaveBeenCalledWith('week');
  });

  it('ignores shortcuts when modifier keys are held', () => {
    const onViewChange = vi.fn();

    render(
      <CalendarStoreProvider defaultView="month">
        <ViewProbe onViewChange={onViewChange} />
        <ShortcutHarness />
      </CalendarStoreProvider>
    );

    fireEvent.keyDown(document, { key: 'w', ctrlKey: true });

    expect(onViewChange).not.toHaveBeenCalledWith('week');
  });

  it('switches views with M, D, L, and Y keys', () => {
    const onViewChange = vi.fn();

    render(
      <CalendarStoreProvider defaultView="month">
        <ViewProbe onViewChange={onViewChange} />
        <ShortcutHarness />
      </CalendarStoreProvider>
    );

    fireEvent.keyDown(document, { key: 'd' });
    expect(onViewChange).toHaveBeenLastCalledWith('day');

    fireEvent.keyDown(document, { key: 'l' });
    expect(onViewChange).toHaveBeenLastCalledWith('list');

    fireEvent.keyDown(document, { key: 'y' });
    expect(onViewChange).toHaveBeenLastCalledWith('year');

    fireEvent.keyDown(document, { key: 'm' });
    expect(onViewChange).toHaveBeenLastCalledWith('month');
  });
});
