import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
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

describe('Calendar customization API', () => {
  it('renders custom event content via renderEvent', () => {
    render(
      <Calendar
        events={sampleEvents}
        currentDate={new Date(2026, 5, 9)}
        renderEvent={(event) => (
          <span data-testid="custom-event">{event.title} (custom)</span>
        )}
      />
    );

    expect(screen.getByTestId('custom-event')).toHaveTextContent('Sprint Planning (custom)');
  });

  it('does not wrap custom renderEvent in default colored chrome in week view', () => {
    render(
      <Calendar
        events={sampleEvents}
        defaultView="week"
        currentDate={new Date(2026, 5, 9)}
        renderEvent={(event) => (
          <button type="button" data-testid="week-custom-event">{event.title}</button>
        )}
      />
    );

    const slot = screen.getByTestId('week-custom-event').closest('.calendar-event-slot');
    expect(slot).toBeInTheDocument();
    expect(slot.style.background).toBe('');
    expect(slot.style.border).toBe('');
  });

  it('renders custom empty state via renderEmpty in week view', () => {
    render(
      <Calendar
        events={[]}
        defaultView="week"
        currentDate={new Date(2026, 5, 9)}
        renderEmpty={(view) => <div data-testid="custom-empty">Nothing in {view}</div>}
      />
    );

    expect(screen.getByTestId('custom-empty')).toHaveTextContent('Nothing in week');
  });

  it('renders custom empty state via renderEmpty in day view', () => {
    render(
      <Calendar
        events={[]}
        defaultView="day"
        currentDate={new Date(2026, 5, 9)}
        renderEmpty={(view) => <div data-testid="custom-empty">Nothing in {view}</div>}
      />
    );

    expect(screen.getByTestId('custom-empty')).toHaveTextContent('Nothing in day');
  });

  it('renders custom empty state via renderEmpty in list view', () => {
    render(
      <Calendar
        events={[]}
        defaultView="list"
        currentDate={new Date(2026, 5, 9)}
        renderEmpty={(view) => <div data-testid="custom-empty">Nothing in {view}</div>}
      />
    );

    expect(screen.getByTestId('custom-empty')).toHaveTextContent('Nothing in list');
  });

  it('renders custom toolbar via renderToolbar', () => {
    render(
      <Calendar
        events={sampleEvents}
        currentDate={new Date(2026, 5, 9)}
        renderToolbar={(api) => (
          <div data-testid="custom-toolbar">
            View: {api.view} — {api.events.length} events
          </div>
        )}
      />
    );

    expect(screen.getByTestId('custom-toolbar')).toHaveTextContent('View: month — 1 events');
  });

  it('shows loading overlay when loading is true', () => {
    render(
      <Calendar
        events={sampleEvents}
        loading
        currentDate={new Date(2026, 5, 9)}
      />
    );

    expect(document.querySelector('.calendar-loading-overlay')).toBeInTheDocument();
  });

  it('calls renderEvent context onClick handler', () => {
    const onEventClick = vi.fn();

    render(
      <Calendar
        events={sampleEvents}
        readOnly
        currentDate={new Date(2026, 5, 9)}
        onEventClick={onEventClick}
        renderEvent={(event, { onClick }) => (
          <button type="button" data-testid="custom-event-btn" onClick={onClick}>
            {event.title}
          </button>
        )}
      />
    );

    screen.getByTestId('custom-event-btn').click();
    expect(onEventClick).toHaveBeenCalledWith(sampleEvents[0]);
  });
});
