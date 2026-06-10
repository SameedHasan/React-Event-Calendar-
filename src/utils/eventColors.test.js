import { describe, it, expect } from 'vitest';
import { getEventStyle, getEventTypeLegend } from './eventColors';

describe('getEventStyle', () => {
  it('uses eventColors config override when provided', () => {
    const style = getEventStyle(
      { type: 'Meeting', title: 'Sync' },
      { Meeting: '#ff0000' }
    );

    expect(style.color).toBe('#ff0000');
    expect(style.bg).toContain('#ff0000');
    expect(style.border).toContain('#ff0000');
  });

  it('uses event.color when no type override exists', () => {
    const style = getEventStyle({ type: 'Call', color: '#00ff00' }, {});

    expect(style.color).toBe('#00ff00');
    expect(style.bg).toContain('#00ff00');
  });

  it('returns consistent palette colors for the same type', () => {
    const first = getEventStyle({ type: 'Workshop' }, {});
    const second = getEventStyle({ type: 'Workshop' }, {});

    expect(first).toEqual(second);
  });

  it('returns different palette colors for different types', () => {
    const a = getEventStyle({ type: 'Alpha' }, {});
    const b = getEventStyle({ type: 'Beta' }, {});

    expect(a.color).not.toBe(b.color);
  });
});

describe('getEventTypeLegend', () => {
  it('returns unique types with counts', () => {
    const events = [
      { id: 1, type: 'Meeting', title: 'A' },
      { id: 2, type: 'Meeting', title: 'B' },
      { id: 3, type: 'Call', title: 'C' },
    ];

    const legend = getEventTypeLegend(events);

    expect(legend).toHaveLength(2);
    const meeting = legend.find((item) => item.type === 'Meeting');
    const call = legend.find((item) => item.type === 'Call');

    expect(meeting.count).toBe(2);
    expect(call.count).toBe(1);
    expect(meeting.style.color).toBeDefined();
  });

  it('returns empty array for no events', () => {
    expect(getEventTypeLegend([])).toEqual([]);
  });
});
