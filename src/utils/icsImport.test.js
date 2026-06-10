import { describe, it, expect } from 'vitest';
import {
    parseICS,
    unfoldIcsLines,
    parseIcsDate,
    parseVeventBlock,
    extractIcsComponents,
} from './icsImport';

const SAMPLE_ICS = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Test//EN
BEGIN:VEVENT
UID:evt-1@example.com
DTSTAMP:20260610T120000Z
DTSTART:20260610T140000Z
DTEND:20260610T150000Z
SUMMARY:Team Standup
DESCRIPTION:Daily sync
CATEGORIES:Meeting
LOCATION:Zoom
END:VEVENT
BEGIN:VEVENT
UID:evt-2@example.com
DTSTART:20260615T090000
DTEND:20260615T103000
SUMMARY:Local Workshop
END:VEVENT
END:VCALENDAR`;

describe('unfoldIcsLines', () => {
    it('unfolds RFC 5545 continuation lines (discards folding whitespace)', () => {
        const folded = 'DESCRIPTION:Long line that continues\r\n here on the next line';
        expect(unfoldIcsLines(folded)).toBe('DESCRIPTION:Long line that continueshere on the next line');
    });
});

describe('parseIcsDate', () => {
    it('parses UTC datetime', () => {
        const d = parseIcsDate('20260610T140000Z', {});
        expect(d.toISOString()).toBe('2026-06-10T14:00:00.000Z');
    });

    it('parses all-day DATE value', () => {
        const d = parseIcsDate('20260610', { VALUE: 'DATE' });
        expect(d.getFullYear()).toBe(2026);
        expect(d.getMonth()).toBe(5);
        expect(d.getDate()).toBe(10);
    });
});

describe('parseICS', () => {
    it('returns empty array for invalid input', () => {
        expect(parseICS('')).toEqual([]);
        expect(parseICS(null)).toEqual([]);
    });

    it('parses multiple VEVENT blocks', () => {
        const events = parseICS(SAMPLE_ICS);
        expect(events).toHaveLength(2);

        expect(events[0].title).toBe('Team Standup');
        expect(events[0].id).toBe('evt-1@example.com');
        expect(events[0].type).toBe('Meeting');
        expect(events[0].description).toBe('Daily sync');
        expect(events[0].location).toBe('Zoom');
        expect(events[0].start.toISOString()).toBe('2026-06-10T14:00:00.000Z');
        expect(events[0].end.toISOString()).toBe('2026-06-10T15:00:00.000Z');
    });

    it('parses local datetime without Z suffix', () => {
        const events = parseICS(SAMPLE_ICS);
        const local = events[1];
        expect(local.title).toBe('Local Workshop');
        expect(local.start.getHours()).toBe(9);
        expect(local.end.getHours()).toBe(10);
        expect(local.end.getMinutes()).toBe(30);
    });

    it('parses RRULE on master events', () => {
        const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
UID:weekly@example.com
DTSTART:20260610T100000Z
DTEND:20260610T110000Z
SUMMARY:Weekly sync
RRULE:FREQ=WEEKLY;BYDAY=TU;COUNT=8
END:VEVENT
END:VCALENDAR`;
        const [event] = parseICS(ics);
        expect(event.recurrence).toBe('FREQ=WEEKLY;BYDAY=TU;COUNT=8');
    });

    it('parses all-day events', () => {
        const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
UID:allday@example.com
DTSTART;VALUE=DATE:20260610
DTEND;VALUE=DATE:20260611
SUMMARY:Holiday
END:VEVENT
END:VCALENDAR`;
        const [event] = parseICS(ics);
        expect(event.allDay).toBe(true);
        expect(event.title).toBe('Holiday');
    });

    it('unescapes special characters in text fields', () => {
        const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
UID:escape@example.com
DTSTART:20260610T100000Z
DTEND:20260610T110000Z
SUMMARY:Meet\\; discuss
DESCRIPTION:Line one\\nLine two
END:VEVENT
END:VCALENDAR`;
        const [event] = parseICS(ics);
        expect(event.title).toBe('Meet; discuss');
        expect(event.description).toBe('Line one\nLine two');
    });

    it('uses DURATION when DTEND is absent', () => {
        const block = `UID:dur@example.com
DTSTART:20260610T100000Z
DURATION:PT1H30M
SUMMARY:Timed block`;
        const event = parseVeventBlock(block);
        expect(event.end.getTime() - event.start.getTime()).toBe(90 * 60 * 1000);
    });
});

describe('extractIcsComponents', () => {
    it('extracts inner VEVENT bodies', () => {
        const unfolded = unfoldIcsLines(SAMPLE_ICS);
        const blocks = extractIcsComponents(unfolded, 'VEVENT');
        expect(blocks).toHaveLength(2);
        expect(blocks[0]).toContain('SUMMARY:Team Standup');
    });
});
