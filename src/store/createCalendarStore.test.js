import { describe, it, expect, vi } from 'vitest';
import { createCalendarStore } from './createCalendarStore';

describe('createCalendarStore', () => {
  it('initializes with default view and empty events', () => {
    const store = createCalendarStore({ defaultView: 'week' });
    const state = store.getState();

    expect(state.view).toBe('week');
    expect(state.events).toEqual([]);
    expect(state.readOnly).toBe(false);
  });

  it('calls onViewChange when setView notifies', () => {
    const onViewChange = vi.fn();
    const store = createCalendarStore({ defaultView: 'month' });

    store.getState().setConfigs({ onViewChange });
    store.getState().setView('day');

    expect(store.getState().view).toBe('day');
    expect(onViewChange).toHaveBeenCalledWith('day');
  });

  it('does not call onViewChange when notify is false', () => {
    const onViewChange = vi.fn();
    const store = createCalendarStore({ defaultView: 'month' });

    store.getState().setConfigs({ onViewChange });
    store.getState().setView('week', { notify: false });

    expect(store.getState().view).toBe('week');
    expect(onViewChange).not.toHaveBeenCalled();
  });

  it('blocks mutations when readOnly is true', () => {
    const store = createCalendarStore();
    store.getState().setConfigs({ readOnly: true });

    store.getState().openCreateModal(new Date());
    expect(store.getState().isModalOpen).toBe(false);

    store.getState().addEvent({ id: 1, title: 'Blocked' });
    expect(store.getState().events).toEqual([]);
  });

  it('adds, updates, and deletes events internally', () => {
    const store = createCalendarStore();
    const event = {
      id: 1,
      title: 'Demo',
      start: new Date('2026-06-10T10:00:00'),
      end: new Date('2026-06-10T11:00:00'),
    };

    store.getState().addEvent(event);
    expect(store.getState().events).toHaveLength(1);

    store.getState().updateEvent({ ...event, title: 'Updated' });
    expect(store.getState().events[0].title).toBe('Updated');

    store.getState().deleteEvent(1);
    expect(store.getState().events).toHaveLength(0);
  });

  it('delegates mutations to callbacks when provided', () => {
    const onAddEvent = vi.fn();
    const onUpdateEvent = vi.fn();
    const onDeleteEvent = vi.fn();
    const store = createCalendarStore();

    store.getState().setCallbacks({ onAddEvent, onUpdateEvent, onDeleteEvent });

    const event = { id: 2, title: 'External' };
    store.getState().addEvent(event);
    store.getState().updateEvent({ ...event, title: 'Changed' });
    store.getState().deleteEvent(2);

    expect(onAddEvent).toHaveBeenCalledWith(event);
    expect(onUpdateEvent).toHaveBeenCalledWith({ ...event, title: 'Changed' });
    expect(onDeleteEvent).toHaveBeenCalledWith(2);
    expect(store.getState().events).toEqual([]);
  });

  it('setCurrentDate does not notify parent when notify is false', () => {
    const onDateChange = vi.fn();
    const store = createCalendarStore();

    store.getState().setConfigs({ onDateChange });
    store.getState().setCurrentDate(new Date(2026, 5, 15), { notify: false });

    expect(onDateChange).not.toHaveBeenCalled();
    expect(new Date(store.getState().currentDate).getTime()).toBe(
      new Date(2026, 5, 15).getTime()
    );
  });

  it('setCurrentDate is a no-op when the date is unchanged', () => {
    const onDateChange = vi.fn();
    const store = createCalendarStore();
    const date = new Date(2026, 5, 15);

    store.getState().setConfigs({ onDateChange });
    store.getState().setCurrentDate(date);
    onDateChange.mockClear();

    store.getState().setCurrentDate(new Date(date.getTime()));

    expect(onDateChange).not.toHaveBeenCalled();
  });

  it('expands recurring events into display instances for the visible range', () => {
    const store = createCalendarStore({ defaultView: 'month' });
    store.getState().setCurrentDate(new Date(2026, 5, 9), { notify: false });

    store.getState().setEvents([
      {
        id: 'daily',
        title: 'Daily standup',
        type: 'Meeting',
        start: new Date(2026, 5, 9, 9, 0),
        end: new Date(2026, 5, 9, 9, 30),
        recurrence: 'FREQ=DAILY;COUNT=5',
      },
    ]);

    expect(store.getState().sourceEvents).toHaveLength(1);
    expect(store.getState().events.length).toBeGreaterThan(1);
    expect(store.getState().events.every((e) => e.recurrenceMasterId === 'daily')).toBe(true);
  });

  it('navigates months and calls onDateChange', () => {
    const onDateChange = vi.fn();
    const store = createCalendarStore();

    store.getState().setConfigs({ onDateChange });
    store.getState().setCurrentDate(new Date(2026, 5, 15));

    store.getState().previousMonth();
    const previous = onDateChange.mock.calls.at(-1)[0];
    expect(previous.getFullYear()).toBe(2026);
    expect(previous.getMonth()).toBe(4);
    expect(previous.getDate()).toBe(15);

    store.getState().nextMonth();
    const next = onDateChange.mock.calls.at(-1)[0];
    expect(next.getFullYear()).toBe(2026);
    expect(next.getMonth()).toBe(5);
    expect(next.getDate()).toBe(15);
  });
});
