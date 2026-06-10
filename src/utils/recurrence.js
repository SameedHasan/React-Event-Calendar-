import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { rrulestr } from 'rrule';

dayjs.extend(utc);

export const RECURRENCE_PRESETS = [
    { value: 'none', label: 'Does not repeat' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
];

const WEEKDAY_CODES = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

/**
 * @param {string} preset  'none' | 'daily' | 'weekly' | 'monthly'
 * @param {Date} startDate
 * @param {{ count?: number, until?: Date }} [options]
 * @returns {string|undefined}  RRULE body without the `RRULE:` prefix
 */
export function buildRecurrenceRule(preset, startDate, options = {}) {
    if (!preset || preset === 'none') return undefined;

    const parts = [];
    switch (preset) {
        case 'daily':
            parts.push('FREQ=DAILY');
            break;
        case 'weekly':
            parts.push('FREQ=WEEKLY', `BYDAY=${WEEKDAY_CODES[startDate.getDay()]}`);
            break;
        case 'monthly':
            parts.push('FREQ=MONTHLY');
            break;
        default:
            return undefined;
    }

    const { count, until } = options;
    if (count && count > 0) {
        parts.push(`COUNT=${Math.floor(count)}`);
    } else if (until) {
        parts.push(`UNTIL=${dayjs(until).utc().format('YYYYMMDD[T]HHmmss[Z]')}`);
    }

    return parts.join(';');
}

/**
 * Maps an RRULE string back to a form preset value.
 *
 * @param {string|undefined} recurrence
 * @returns {'none'|'daily'|'weekly'|'monthly'|'custom'}
 */
export function parseRecurrencePreset(recurrence) {
    if (!recurrence) return 'none';

    const rule = recurrence.toUpperCase();
    if (rule.includes('FREQ=DAILY')) return 'daily';
    if (rule.includes('FREQ=WEEKLY')) return 'weekly';
    if (rule.includes('FREQ=MONTHLY')) return 'monthly';
    return 'custom';
}

/**
 * Extracts COUNT from an RRULE string, if present.
 *
 * @param {string|undefined} recurrence
 * @returns {number|undefined}
 */
export function parseRecurrenceCount(recurrence) {
    if (!recurrence) return undefined;
    const match = recurrence.toUpperCase().match(/COUNT=(\d+)/);
    return match ? Number(match[1]) : undefined;
}

/**
 * @param {object} event
 * @returns {boolean}
 */
export function isRecurringInstance(event) {
    return Boolean(event?.recurrenceMasterId);
}

/**
 * Expands a single master event into display instances for a date range.
 *
 * @param {object} master
 * @param {Date} rangeStart
 * @param {Date} rangeEnd
 * @returns {object[]}
 */
export function expandRecurringEvent(master, rangeStart, rangeEnd) {
    if (!master?.recurrence) {
        return [master];
    }

    const masterStart = new Date(master.start);
    const masterEnd = new Date(master.end);
    const durationMs = masterEnd.getTime() - masterStart.getTime();

    if (Number.isNaN(durationMs) || durationMs < 0) {
        return [master];
    }

    try {
        const rule = rrulestr(`RRULE:${master.recurrence}`, { dtstart: masterStart });
        const occurrences = rule.between(rangeStart, rangeEnd, true);

        return occurrences.map((occurrence) => {
            const start = new Date(occurrence);
            const end = new Date(start.getTime() + durationMs);

            const {
                recurrence: _recurrence,
                ...rest
            } = master;

            return {
                ...rest,
                id: `${master.id}::${start.getTime()}`,
                start,
                end,
                recurrenceMasterId: master.id,
            };
        });
    } catch (err) {
        console.warn('[react-event-calendar] Could not expand recurrence for event', master.id, err);
        return [master];
    }
}

/**
 * Expands all recurring events for the visible calendar range.
 * Non-recurring events pass through unchanged.
 *
 * @param {object[]} events
 * @param {Date} rangeStart
 * @param {Date} rangeEnd
 * @returns {object[]}
 */
export function expandRecurringEvents(events, rangeStart, rangeEnd) {
    if (!Array.isArray(events) || events.length === 0) return [];

    return events.flatMap((event) => expandRecurringEvent(event, rangeStart, rangeEnd));
}
