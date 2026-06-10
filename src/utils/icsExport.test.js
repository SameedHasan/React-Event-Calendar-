import { describe, it, expect, vi, afterEach } from 'vitest';
import { eventsToICS, downloadICS, exportEventsToICS } from './icsExport';

describe('eventsToICS', () => {
  it('produces a valid VCALENDAR wrapper with no events', () => {
    const ics = eventsToICS([], 'Team Calendar');
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('END:VCALENDAR');
    expect(ics).toContain('VERSION:2.0');
    expect(ics).toContain('X-WR-CALNAME:Team Calendar');
    expect(ics).not.toContain('BEGIN:VEVENT');
  });

  it('escapes special characters in text fields per RFC 5545', () => {
    const ics = eventsToICS([
      {
        id: 1,
        title: 'Meet; discuss, plan\\backslash',
        description: 'Line one\nLine two',
        start: new Date('2026-06-10T10:00:00'),
        end: new Date('2026-06-10T11:00:00'),
      },
    ]);

    expect(ics).toContain('SUMMARY:Meet\\; discuss\\, plan\\\\backslash');
    expect(ics).toContain('DESCRIPTION:Line one\\nLine two');
  });

  it('outputs UTC datetimes ending with Z', () => {
    const ics = eventsToICS([
      {
        id: 1,
        title: 'Standup',
        start: new Date('2026-06-10T14:30:00Z'),
        end: new Date('2026-06-10T15:00:00Z'),
      },
    ]);

    expect(ics).toMatch(/DTSTART:\d{8}T\d{6}Z/);
    expect(ics).toMatch(/DTEND:\d{8}T\d{6}Z/);
    expect(ics).toMatch(/DTSTAMP:\d{8}T\d{6}Z/);
  });

  it('folds long lines per RFC 5545', () => {
    const longTitle = 'A'.repeat(100);
    const ics = eventsToICS([
      {
        id: 1,
        title: longTitle,
        start: new Date('2026-06-10T10:00:00'),
        end: new Date('2026-06-10T11:00:00'),
      },
    ]);

    const summaryLine = ics.split('\r\n').find((line) => line.startsWith('SUMMARY:'));
    expect(summaryLine.length).toBeLessThanOrEqual(75);
    expect(ics).toMatch(/\r\n /);
  });

  it('includes optional type and location fields', () => {
    const ics = eventsToICS([
      {
        id: 2,
        title: 'Workshop',
        type: 'Training',
        location: 'Room 42',
        start: new Date('2026-06-11T09:00:00'),
        end: new Date('2026-06-11T12:00:00'),
      },
    ]);

    expect(ics).toContain('CATEGORIES:Training');
    expect(ics).toContain('LOCATION:Room 42');
  });

  it('uses CRLF line endings', () => {
    const ics = eventsToICS([
      {
        id: 1,
        title: 'Test',
        start: new Date('2026-06-10T10:00:00'),
        end: new Date('2026-06-10T11:00:00'),
      },
    ]);

    expect(ics).toContain('\r\n');
    expect(ics).not.toMatch(/[^\r]\n/);
  });
});

describe('downloadICS', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates a download link and clicks it', () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    const appendSpy = vi.spyOn(document.body, 'appendChild');
    vi.useFakeTimers();

    downloadICS('BEGIN:VCALENDAR\r\nEND:VCALENDAR', 'my-events.ics');

    expect(appendSpy).toHaveBeenCalled();
    const link = appendSpy.mock.calls[0][0];
    expect(link.download).toBe('my-events.ics');
    expect(clickSpy).toHaveBeenCalled();

    vi.runAllTimers();
    vi.useRealTimers();
  });
});

describe('exportEventsToICS', () => {
  it('warns and returns early when events array is empty', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    exportEventsToICS([]);

    expect(warnSpy).toHaveBeenCalledWith('[react-event-calendar-suite] No events to export.');
    expect(clickSpy).not.toHaveBeenCalled();

    warnSpy.mockRestore();
    clickSpy.mockRestore();
  });
});
