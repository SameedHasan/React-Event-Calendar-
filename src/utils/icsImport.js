/**
 * Lightweight RFC 5545 ICS parser for VEVENT components.
 * Supports folded lines, UTC/local datetimes, all-day events, RRULE, and common fields.
 */

const UNESCAPE_ICS = (text) =>
    text
        .replace(/\\n/g, '\n')
        .replace(/\\,/g, ',')
        .replace(/\\;/g, ';')
        .replace(/\\\\/g, '\\');

/**
 * Unfolds RFC 5545 continuation lines (CRLF + single space/tab).
 *
 * @param {string} content
 * @returns {string}
 */
export function unfoldIcsLines(content) {
    return content
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/\n[ \t]/g, '');
}

/**
 * @param {string[]} paramParts
 * @returns {Record<string, string>}
 */
function parsePropertyParams(paramParts) {
    const params = {};
    paramParts.forEach((part) => {
        const eq = part.indexOf('=');
        if (eq === -1) return;
        const key = part.slice(0, eq).toUpperCase();
        let val = part.slice(eq + 1);
        if (val.startsWith('"') && val.endsWith('"')) {
            val = val.slice(1, -1);
        }
        params[key] = val;
    });
    return params;
}

/**
 * @param {string} line
 * @returns {{ name: string, value: string, params: Record<string, string> } | null}
 */
function parsePropertyLine(line) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) return null;

    const left = line.slice(0, colonIdx);
    const value = line.slice(colonIdx + 1);
    const segments = left.split(';');
    const name = segments[0].toUpperCase();

    return {
        name,
        value,
        params: parsePropertyParams(segments.slice(1)),
    };
}

/**
 * @param {string} value
 * @param {Record<string, string>} params
 * @returns {Date}
 */
export function parseIcsDate(value, params = {}) {
    const raw = value.trim();
    const isDateOnly = params.VALUE === 'DATE' || (/^\d{8}$/.test(raw));

    if (isDateOnly) {
        const y = Number(raw.slice(0, 4));
        const m = Number(raw.slice(4, 6)) - 1;
        const d = Number(raw.slice(6, 8));
        return new Date(y, m, d);
    }

    const hasTime = raw.includes('T');
    if (!hasTime) {
        return new Date(raw);
    }

    const datePart = raw.slice(0, 8);
    const timePart = raw.slice(9).replace('Z', '');
    const y = Number(datePart.slice(0, 4));
    const mo = Number(datePart.slice(4, 6)) - 1;
    const d = Number(datePart.slice(6, 8));
    const h = Number(timePart.slice(0, 2)) || 0;
    const mi = Number(timePart.slice(2, 4)) || 0;
    const s = Number(timePart.slice(4, 6)) || 0;

    if (raw.endsWith('Z')) {
        return new Date(Date.UTC(y, mo, d, h, mi, s));
    }

    return new Date(y, mo, d, h, mi, s);
}

/**
 * @param {string} value  e.g. PT1H30M
 * @returns {number} duration in milliseconds
 */
function parseDurationMs(value) {
    const match = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/i.exec(value.trim());
    if (!match) return 60 * 60 * 1000;

    const days = Number(match[1] || 0);
    const hours = Number(match[2] || 0);
    const minutes = Number(match[3] || 0);
    const seconds = Number(match[4] || 0);

    return (((days * 24 + hours) * 60 + minutes) * 60 + seconds) * 1000;
}

/**
 * Extracts raw block strings for a given component name.
 *
 * @param {string} content  unfolded ICS text
 * @param {string} name     e.g. 'VEVENT'
 * @returns {string[]}
 */
export function extractIcsComponents(content, name) {
    const blocks = [];
    const upper = name.toUpperCase();
    const regex = new RegExp(`BEGIN:${upper}([\\s\\S]*?)END:${upper}`, 'gi');
    let match = regex.exec(content);

    while (match) {
        blocks.push(match[1].trim());
        match = regex.exec(content);
    }

    return blocks;
}

/**
 * @param {string} block  inner VEVENT body (without BEGIN/END)
 * @returns {object|null}
 */
export function parseVeventBlock(block) {
    const props = {};
    block.split('\n').forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed) return;
        const parsed = parsePropertyLine(trimmed);
        if (!parsed) return;

        const existing = props[parsed.name];
        if (!existing) {
            props[parsed.name] = parsed;
        } else if (Array.isArray(existing)) {
            existing.push(parsed);
        } else {
            props[parsed.name] = [existing, parsed];
        }
    });

    const startProp = props.DTSTART;
    if (!startProp) return null;

    const start = parseIcsDate(startProp.value, startProp.params);
    let end = null;

    if (props.DTEND) {
        end = parseIcsDate(props.DTEND.value, props.DTEND.params);
    } else if (props.DURATION) {
        end = new Date(start.getTime() + parseDurationMs(props.DURATION.value));
    } else if (startProp.params.VALUE === 'DATE' || /^\d{8}$/.test(startProp.value.trim())) {
        const nextDay = new Date(start);
        nextDay.setDate(nextDay.getDate() + 1);
        end = nextDay;
    } else {
        end = new Date(start.getTime() + 60 * 60 * 1000);
    }

    const summary = props.SUMMARY ? UNESCAPE_ICS(props.SUMMARY.value) : 'Untitled Event';
    const uid = props.UID ? UNESCAPE_ICS(props.UID.value) : `ics-${start.getTime()}-${summary}`;

    const event = {
        id: uid,
        title: summary,
        start,
        end,
        type: 'Imported',
    };

    if (props.DESCRIPTION) {
        event.description = UNESCAPE_ICS(props.DESCRIPTION.value);
    }

    if (props.LOCATION) {
        event.location = UNESCAPE_ICS(props.LOCATION.value);
    }

    if (props.CATEGORIES) {
        const category = UNESCAPE_ICS(props.CATEGORIES.value).split(',')[0]?.trim();
        if (category) event.type = category;
    }

    const rruleProp = props.RRULE;
    if (rruleProp) {
        event.recurrence = rruleProp.value.replace(/^RRULE:/i, '');
    }

    const isAllDay =
        startProp.params.VALUE === 'DATE'
        || (/^\d{8}$/.test(startProp.value.trim()) && (!props.DTEND || props.DTEND.params.VALUE === 'DATE'));
    if (isAllDay) {
        event.allDay = true;
    }

    return event;
}

/**
 * Parses an ICS (iCalendar) string into calendar event objects.
 *
 * @param {string} content  Raw .ics file content
 * @returns {Array<object>} CalendarEvent-compatible objects
 */
export function parseICS(content) {
    if (!content || typeof content !== 'string') return [];

    const unfolded = unfoldIcsLines(content);
    const blocks = extractIcsComponents(unfolded, 'VEVENT');

    return blocks
        .map(parseVeventBlock)
        .filter(Boolean);
}

/**
 * Reads a File/Blob and parses ICS content.
 *
 * @param {File|Blob} file
 * @returns {Promise<Array<object>>}
 */
export async function parseICSFile(file) {
    const text = await file.text();
    return parseICS(text);
}

/**
 * Opens a file picker, parses the selected .ics file, and returns events.
 * No-op when the user cancels.
 *
 * @returns {Promise<Array<object>|null>}
 */
export function pickAndParseICSFile() {
    return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.ics,text/calendar';
        input.style.display = 'none';

        input.addEventListener('change', async () => {
            const file = input.files?.[0];
            document.body.removeChild(input);
            if (!file) {
                resolve(null);
                return;
            }
            try {
                resolve(await parseICSFile(file));
            } catch {
                resolve([]);
            }
        });

        input.addEventListener('cancel', () => {
            document.body.removeChild(input);
            resolve(null);
        });

        document.body.appendChild(input);
        input.click();
    });
}
