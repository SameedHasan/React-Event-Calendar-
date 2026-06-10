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
});
