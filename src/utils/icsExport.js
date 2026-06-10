import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezonePlugin from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezonePlugin);

/**
 * Converts a date to an ICS-compatible UTC datetime string.
 * Format: YYYYMMDDTHHMMSSZ
 */
const toICSDateUTC = (date) => {
    return dayjs(date).utc().format('YYYYMMDDTHHmmss') + 'Z';
};

/**
 * Converts a date to an ICS-compatible local datetime string in a given timezone.
 * Format: YYYYMMDDTHHMMSS (no Z suffix — timezone is conveyed in the property name)
 */
const toICSDateLocal = (date, tz) => {
    return dayjs.tz(date, tz).format('YYYYMMDDTHHmmss');
};

/**
 * Escapes special characters in text fields per RFC 5545.
 * Commas, semicolons, and backslashes must be escaped.
 * Newlines become literal \n.
 */
const escapeICSText = (text) => {
    if (!text) return '';
    return text
        .replace(/\\/g, '\\\\')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,')
        .replace(/\n/g, '\\n');
};

/**
 * Folds long lines per RFC 5545 (max 75 octets per line).
 * Continuation lines start with a single space.
 */
const foldLine = (line) => {
    const MAX = 75;
    if (line.length <= MAX) return line;

    const parts = [];
    parts.push(line.substring(0, MAX));
    let remaining = line.substring(MAX);

    while (remaining.length > 0) {
        // Continuation lines: space + up to 74 chars
        parts.push(' ' + remaining.substring(0, MAX - 1));
        remaining = remaining.substring(MAX - 1);
    }

    return parts.join('\r\n');
};

/**
 * Generates a unique UID for an event.
 */
const generateUID = (event) => {
    return `${event.id}-${Date.now()}@react-event-calendar-suite`;
};

/**
 * Converts an array of calendar events to an ICS (iCalendar) string.
 *
 * @param {Array} events - Array of event objects with { id, title, start, end, type?, description? }
 * @param {string} calendarName - Optional calendar name for the PRODID/X-WR-CALNAME
 * @param {string|null} timezone - IANA timezone string; when set events are written with DTSTART;TZID=...
 * @returns {string} A valid .ics file content string
 */
export const eventsToICS = (events, calendarName = 'My Calendar', timezone = null) => {
    const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//react-event-calendar-suite//EN',
        `X-WR-CALNAME:${escapeICSText(calendarName)}`,
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
    ];

    if (timezone) {
        lines.push(`X-WR-TIMEZONE:${timezone}`);
    }

    events.forEach((event) => {
        const uid = generateUID(event);
        const now = toICSDateUTC(new Date());

        let dtStart, dtEnd;
        if (timezone) {
            dtStart = `DTSTART;TZID=${timezone}:${toICSDateLocal(event.start, timezone)}`;
            dtEnd = `DTEND;TZID=${timezone}:${toICSDateLocal(event.end, timezone)}`;
        } else {
            dtStart = `DTSTART:${toICSDateUTC(event.start)}`;
            dtEnd = `DTEND:${toICSDateUTC(event.end)}`;
        }

        lines.push('BEGIN:VEVENT');
        lines.push(`UID:${uid}`);
        lines.push(`DTSTAMP:${now}`);
        lines.push(dtStart);
        lines.push(dtEnd);
        lines.push(foldLine(`SUMMARY:${escapeICSText(event.title)}`));

        if (event.description) {
            lines.push(foldLine(`DESCRIPTION:${escapeICSText(event.description)}`));
        }

        if (event.type) {
            lines.push(foldLine(`CATEGORIES:${escapeICSText(event.type)}`));
        }

        if (event.location) {
            lines.push(foldLine(`LOCATION:${escapeICSText(event.location)}`));
        }

        lines.push('END:VEVENT');
    });

    lines.push('END:VCALENDAR');

    // ICS uses CRLF line endings
    return lines.join('\r\n');
};

/**
 * Triggers a browser download of the given ICS content.
 *
 * @param {string} icsContent - The .ics file content string
 * @param {string} filename - The filename for the download (default: 'calendar-events.ics')
 */
export const downloadICS = (icsContent, filename = 'calendar-events.ics') => {
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    // Cleanup
    setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, 100);
};

/**
 * Convenience function: converts events to ICS and triggers download.
 *
 * @param {Array} events - Array of event objects
 * @param {Object} options - Optional settings
 * @param {string} options.calendarName - Calendar name (default: 'My Calendar')
 * @param {string} options.filename - Download filename (default: 'calendar-events.ics')
 */
export const exportEventsToICS = (events, options = {}) => {
    const {
        calendarName = 'My Calendar',
        filename = 'calendar-events.ics',
        timezone = null,
    } = options;

    if (!events || events.length === 0) {
        console.warn('[react-event-calendar-suite] No events to export.');
        return;
    }

    const icsContent = eventsToICS(events, calendarName, timezone);
    downloadICS(icsContent, filename);
};
