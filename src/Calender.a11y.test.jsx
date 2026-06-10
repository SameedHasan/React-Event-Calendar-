import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import Calendar from './Calender';

afterEach(() => {
  cleanup();
});

describe('Calendar accessibility', () => {
  it('exposes application landmark and keyboard shortcut hints', () => {
    render(
      <Calendar
        events={[]}
        currentDate={new Date(2026, 5, 9)}
      />
    );

    const root = document.querySelector('.calendar-root');
    expect(root).toHaveAttribute('role', 'application');
    expect(root).toHaveAttribute('aria-keyshortcuts');
  });

  it('renders toolbar tabs with aria-selected', () => {
    render(
      <Calendar
        events={[]}
        defaultView="month"
        currentDate={new Date(2026, 5, 9)}
      />
    );

    const tablist = screen.getByRole('tablist', { name: /calendar views/i });
    expect(tablist).toBeInTheDocument();

    const monthTab = screen.getByRole('tab', { name: /month view/i });
    expect(monthTab).toHaveAttribute('aria-selected', 'true');
  });

  it('renders month grid with grid role and marks today', () => {
    const today = new Date();

    render(
      <Calendar
        events={[]}
        defaultView="month"
        currentDate={today}
      />
    );

    expect(screen.getByRole('grid', { name: /month calendar/i })).toBeInTheDocument();

    const todayLabel = today.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    const todayCell = screen.getByRole('gridcell', { name: todayLabel });
    expect(todayCell).toHaveAttribute('aria-selected', 'true');
  });

  it('announces view changes in a live region', () => {
    render(
      <Calendar
        events={[]}
        defaultView="month"
        currentDate={new Date(2026, 5, 9)}
      />
    );

    const liveRegion = document.querySelector('.calendar-live-region');
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    expect(liveRegion?.textContent).toMatch(/Month view/i);
  });

  it('opens keyboard shortcuts help with ?', () => {
    render(
      <Calendar
        events={[]}
        currentDate={new Date(2026, 5, 9)}
      />
    );

    fireEvent.keyDown(document, { key: '?' });
    expect(screen.getByText('Keyboard shortcuts')).toBeInTheDocument();
  });
});
