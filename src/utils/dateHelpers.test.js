import { describe, it, expect } from 'vitest';
import dayjs from 'dayjs';
import {
  isEventOnDay,
  isAllDayOrMultiDay,
  getIsoWeekNumber,
  formatTime,
  formatHourLabel,
  getDayIndex,
  calculateWeekRange,
  getEventDaySegment,
  getShiftedShortDOW,
  getShiftedSingleDOW,
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

  it('returns 0 for monday when week starts on monday', () => {
    const monday = new Date(2026, 5, 8);
    expect(getDayIndex(monday, 'monday')).toBe(0);
  });
});

describe('calculateWeekRange', () => {
  it('returns a seven-day range starting on monday', () => {
    const wednesday = new Date(2026, 5, 10);
    const range = calculateWeekRange(wednesday, 'monday');

    expect(range.start).toBe('Jun 8, 2026');
    expect(range.end).toBe('Jun 14, 2026');
  });

  it('returns a seven-day range starting on sunday', () => {
    const wednesday = new Date(2026, 5, 10);
    const range = calculateWeekRange(wednesday, 'sunday');

    expect(range.start).toBe('Jun 7, 2026');
    expect(range.end).toBe('Jun 13, 2026');
  });
});

describe('getEventDaySegment', () => {
  it('returns null when event does not overlap the day', () => {
    const event = {
      start: new Date(2026, 5, 11, 9, 0),
      end: new Date(2026, 5, 11, 10, 0),
    };

    expect(getEventDaySegment(event, new Date(2026, 5, 10))).toBeNull();
  });

  it('returns segment metadata for a same-day event', () => {
    const day = new Date(2026, 5, 10);
    const event = {
      start: new Date(2026, 5, 10, 9, 0),
      end: new Date(2026, 5, 10, 11, 0),
    };

    const segment = getEventDaySegment(event, day);

    expect(segment.isStartDay).toBe(true);
    expect(segment.isEndDay).toBe(true);
    expect(segment.durationMinutes).toBe(120);
  });

  it('marks continuation days for multi-day events', () => {
    const middleDay = new Date(2026, 5, 11);
    const event = {
      start: new Date(2026, 5, 10, 9, 0),
      end: new Date(2026, 5, 12, 11, 0),
    };

    const segment = getEventDaySegment(event, middleDay);

    expect(segment.isStartDay).toBe(false);
    expect(segment.isEndDay).toBe(false);
  });
});

describe('formatHourLabel', () => {
  it('formats 24h hour labels', () => {
    expect(formatHourLabel(9, '24h')).toBe('09:00');
    expect(formatHourLabel(14, '24h')).toBe('14:00');
  });

  it('formats 12h hour labels', () => {
    expect(formatHourLabel(0, '12h')).toBe('12 AM');
    expect(formatHourLabel(12, '12h')).toBe('12 PM');
    expect(formatHourLabel(15, '12h')).toBe('3 PM');
  });
});

describe('getShiftedShortDOW', () => {
  it('starts on monday by default', () => {
    expect(getShiftedShortDOW('monday')).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  });

  it('starts on sunday when configured', () => {
    expect(getShiftedShortDOW('sunday')[0]).toBe('Sun');
  });
});

describe('getShiftedSingleDOW', () => {
  it('returns single-letter labels rotated to week start', () => {
    expect(getShiftedSingleDOW('monday')[0]).toBe('M');
    expect(getShiftedSingleDOW('sunday')[0]).toBe('S');
  });
});
