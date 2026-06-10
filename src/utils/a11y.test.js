import { describe, it, expect } from 'vitest';
import { buildCalendarTitle, buildLiveAnnouncement } from './a11y';

describe('a11y helpers', () => {
  it('builds month title', () => {
    expect(
      buildCalendarTitle('month', {
        currentDate: new Date(2026, 5, 9),
        weekRange: { count: 24, range: '' },
        currentDayIndex: 0,
      })
    ).toBe('June 2026');
  });

  it('builds live announcement', () => {
    expect(buildLiveAnnouncement('week', 'Jun 8, 2026 - Jun 14, 2026')).toBe(
      'Week view, Jun 8, 2026 - Jun 14, 2026'
    );
  });

  it('builds day title from weekRange.startDate (not localized range string)', () => {
    const weekStart = new Date(2026, 5, 8); // Mon Jun 8 2026
    expect(
      buildCalendarTitle('day', {
        currentDate: new Date(2026, 5, 9),
        weekRange: {
          count: 24,
          range: '六月 8, 2026 - 六月 14, 2026',
          startDate: weekStart.toISOString(),
        },
        currentDayIndex: 1,
      })
    ).toBe('Tuesday, June 9 2026');
  });
});
