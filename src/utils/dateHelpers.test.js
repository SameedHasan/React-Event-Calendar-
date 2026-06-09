import { describe, it, expect } from 'vitest';
import dayjs from 'dayjs';
import {
  isEventOnDay,
  isAllDayOrMultiDay,
  getIsoWeekNumber,
  formatTime,
  getDayIndex,
} from './dateHelpers';

describe('isEventOnDay', () => {
  it('returns true when event overlaps the day', () => {
    const day = new Date(2026, 5, 10);
    const event = {
      start: new Date(2026, 5, 10, 9, 0),
      end: new Date(2026, 5, 10, 10, 0),
    };
    expect(isEventOnDay(event, day)).toBe(true);
  });

  it('returns false when event is on another day', () => {
    const day = new Date(2026, 5, 10);
    const event = {
      start: new Date(2026, 5, 11, 9, 0),
      end: new Date(2026, 5, 11, 10, 0),
    };
    expect(isEventOnDay(event, day)).toBe(false);
  });
});

describe('isAllDayOrMultiDay', () => {
  it('returns true when allDay is set', () => {
    expect(isAllDayOrMultiDay({ allDay: true, start: new Date(), end: new Date() })).toBe(true);
  });

  it('returns true when event crosses midnight', () => {
    const event = {
      start: new Date(2026, 5, 10, 23, 0),
      end: new Date(2026, 5, 11, 1, 0),
    };
    expect(isAllDayOrMultiDay(event)).toBe(true);
  });

  it('returns true when duration is 24 hours or more', () => {
    const event = {
      start: new Date(2026, 5, 10, 9, 0),
      end: new Date(2026, 5, 11, 9, 0),
    };
    expect(isAllDayOrMultiDay(event)).toBe(true);
  });

  it('returns false for a short same-day event', () => {
    const event = {
      start: new Date(2026, 5, 10, 9, 0),
      end: new Date(2026, 5, 10, 10, 0),
    };
    expect(isAllDayOrMultiDay(event)).toBe(false);
  });
});

describe('getIsoWeekNumber', () => {
  it('matches dayjs isoWeek', () => {
    const date = new Date(2026, 5, 9);
    expect(getIsoWeekNumber(date)).toBe(dayjs(date).isoWeek());
  });
});

describe('formatTime', () => {
  it('formats 12h time', () => {
    const t = new Date(2026, 5, 10, 14, 30);
    expect(formatTime(t, '12h')).toBe('2:30 PM');
  });

  it('formats 24h time', () => {
    const t = new Date(2026, 5, 10, 14, 30);
    expect(formatTime(t, '24h')).toBe('14:30');
  });
});

describe('getDayIndex', () => {
  it('returns 0 for sunday when week starts on sunday', () => {
    const sunday = new Date(2026, 5, 7);
    expect(getDayIndex(sunday, 'sunday')).toBe(0);
  });
});
