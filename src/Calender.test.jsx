import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, within, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Calendar from './Calender';

afterEach(() => {
  cleanup();
});

const sampleEvents = [
  {
    id: 1,
    title: 'Sprint Planning',
    start: new Date(2026, 5, 9, 10, 0),
    end: new Date(2026, 5, 9, 11, 30),
    type: 'Planning',
  },
];

describe('Calendar', () => {
  it('renders the calendar root with default month view', () => {
    render(<Calendar events={sampleEvents} currentDate={new Date(2026, 5, 9)} />);

    expect(document.querySelector('.calendar-root')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Month/i })).toBeInTheDocument();
    expect(screen.getByText('Sprint Planning')).toBeInTheDocument();
  });

  it('renders week view content when defaultView is week', () => {
    render(
      <Calendar
        events={sampleEvents}
        defaultView="week"
        currentDate={new Date(2026, 5, 9)}
      />
    );

    expect(screen.getByText(/Week \d+/)).toBeInTheDocument();
  });

  it('renders day view content when defaultView is day', () => {
    render(
      <Calendar
        events={sampleEvents}
        defaultView="day"
        currentDate={new Date(2026, 5, 9)}
      />
    );

    expect(screen.getByText(/Tuesday, June 9 2026/i)).toBeInTheDocument();
  });

  it('renders list view content when defaultView is list', () => {
    render(
      <Calendar
        events={[]}
        defaultView="list"
        currentDate={new Date(2026, 5, 9)}
      />
    );

    expect(screen.getAllByText(/No events this week/i).length).toBeGreaterThan(0);
  });

  it('renders year view content when defaultView is year', { timeout: 15000 }, () => {
    render(
      <Calendar
        events={sampleEvents}
        defaultView="year"
        currentDate={new Date(2026, 5, 9)}
      />
    );

    expect(screen.getByText('January')).toBeInTheDocument();
    expect(screen.getByText('December')).toBeInTheDocument();
  });

  it('hides add-event controls when readOnly is true', () => {
    render(<Calendar events={sampleEvents} readOnly currentDate={new Date(2026, 5, 9)} />);

    expect(screen.queryByRole('button', { name: /Add Event/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows add-event button when not readOnly', () => {
    render(<Calendar events={sampleEvents} currentDate={new Date(2026, 5, 9)} />);

    expect(screen.getByRole('button', { name: /Add Event/i })).toBeInTheDocument();
  });

  it('respects controlled view prop', () => {
    const onViewChange = vi.fn();

    render(
      <Calendar
        events={[]}
        view="list"
        onViewChange={onViewChange}
        currentDate={new Date(2026, 5, 9)}
      />
    );

    expect(screen.getAllByText(/No events this week/i).length).toBeGreaterThan(0);
  });

  it('calls onViewChange when toolbar view button is clicked', async () => {
    const user = userEvent.setup();
    const onViewChange = vi.fn();

    render(
      <Calendar
        events={sampleEvents}
        onViewChange={onViewChange}
        currentDate={new Date(2026, 5, 9)}
      />
    );

    await user.click(screen.getByRole('button', { name: /Week/i }));

    expect(onViewChange).toHaveBeenCalledWith('week');
    expect(screen.getByText(/Week \d+/)).toBeInTheDocument();
  });

  it('isolates state between two calendar instances', { timeout: 15000 }, async () => {
    const user = userEvent.setup();

    const { container } = render(
      <>
        <Calendar
          className="calendar-a"
          defaultView="month"
          events={sampleEvents}
          currentDate={new Date(2026, 5, 9)}
        />
        <Calendar
          className="calendar-b"
          defaultView="year"
          events={[]}
          currentDate={new Date(2026, 5, 9)}
        />
      </>
    );

    const calendarA = container.querySelector('.calendar-a');
    const calendarB = container.querySelector('.calendar-b');

    expect(within(calendarA).getByText('Sprint Planning')).toBeInTheDocument();
    expect(within(calendarB).getByText('January')).toBeInTheDocument();

    await user.click(within(calendarA).getByRole('button', { name: /Week/i }));

    expect(within(calendarA).getByText(/Week \d+/)).toBeInTheDocument();
    expect(within(calendarB).getByText('January')).toBeInTheDocument();
    expect(within(calendarB).queryByText(/Week \d+/)).not.toBeInTheDocument();
  });

  it('applies custom className and style on the root', () => {
    render(
      <Calendar
        events={[]}
        className="my-calendar"
        style={{ maxWidth: 900 }}
        currentDate={new Date(2026, 5, 9)}
      />
    );

    const root = document.querySelector('.calendar-root.my-calendar');
    expect(root).toBeInTheDocument();
    expect(root).toHaveStyle({ maxWidth: '900px' });
  });
});
