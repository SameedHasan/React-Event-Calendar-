import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import localeData from 'dayjs/plugin/localeData';
import { toDayjs, nowInTz } from './tz';

dayjs.extend(isoWeek);
dayjs.extend(localeData);

/**
 * Returns whether an event overlaps with a given day.
 * When `tz` is provided, start/end are interpreted in that timezone.
 */
export const isEventOnDay = (event, day, tz) => {
    const dayStart = toDayjs(day, tz).startOf('day');
    const dayEnd = toDayjs(day, tz).endOf('day');
    const eventStart = toDayjs(event.start, tz);
    const eventEnd = toDayjs(event.end, tz);
    return eventStart.isBefore(dayEnd) && eventEnd.isAfter(dayStart);
};

/**
 * Checks if an event should render in the all-day / spanning header row.
 * Explicit `allDay: true`, crosses a calendar-day boundary, or lasts 24+ hours.
 */
export const isAllDayOrMultiDay = (event, tz) => {
    if (event?.allDay === true) return true;

    const start = toDayjs(event.start, tz);
    const end = toDayjs(event.end, tz);

    if (!start.isSame(end, 'day')) return true;

    return end.diff(start, 'hour') >= 24;
};

/**
 * ISO week number for a date (consistent with dayjs isoWeek in views).
 */
export const getIsoWeekNumber = (date, tz) => toDayjs(date, tz).isoWeek();

/**
 * Gets the portion of an event that falls within a specific day.
 * Returns null if the event doesn't cover this day.
 * Otherwise returns { start, end, isStartDay, isEndDay, durationMinutes }.
 */
export const getEventDaySegment = (event, day, tz) => {
    if (!isEventOnDay(event, day, tz)) return null;

    const dayStart = toDayjs(day, tz).startOf('day');
    const dayEnd = toDayjs(day, tz).endOf('day');
    const eventStart = toDayjs(event.start, tz);
    const eventEnd = toDayjs(event.end, tz);

    const segmentStart = eventStart.isBefore(dayStart) ? dayStart : eventStart;
    const segmentEnd = eventEnd.isAfter(dayEnd) ? dayEnd : eventEnd;

    return {
        start: segmentStart,
        end: segmentEnd,
        isStartDay: eventStart.isSame(toDayjs(day, tz), 'day'),
        isEndDay: eventEnd.isSame(toDayjs(day, tz), 'day'),
        durationMinutes: segmentEnd.diff(segmentStart, 'minute'),
    };
};

/**
 * Formats a date/dayjs value into a time string, respecting 12h or 24h format.
 * When `tz` is provided the time is displayed in that timezone.
 */
export const formatTime = (time, formatType = '12h', tz) => {
    const t = toDayjs(time, tz);
    if (formatType === '24h') {
        return t.format('HH:mm');
    }
    return t.format('h:mm A');
};

/**
 * Formats an hour number (0 to 23) into a header label, respecting 12h or 24h format.
 * Hour labels are timezone-agnostic (they label the grid column, not a specific moment).
 */
export const formatHourLabel = (hour, formatType = '12h') => {
    if (formatType === '24h') {
        return `${String(hour).padStart(2, '0')}:00`;
    }
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
};

export const DAY_INDEX_MAP = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6
};

export const getDayIndex = (date, startOfWeek = 'monday') => {
    const d = dayjs(date).day();
    const s = DAY_INDEX_MAP[String(startOfWeek).toLowerCase()] ?? 1;
    return (d - s + 7) % 7;
};

export const calculateWeekRange = (date, startOfWeek = 'monday') => {
    const d = dayjs(date);
    const relativeIndex = getDayIndex(d.toDate(), startOfWeek);
    const start = d.subtract(relativeIndex, 'day');
    const end = start.add(6, 'day');

    return {
        start: start.format('MMM D, YYYY'),
        end: end.format('MMM D, YYYY'),
        /** ISO strings for logic — never parse the localized `range` display string. */
        startDate: start.startOf('day').toISOString(),
        endDate: end.endOf('day').toISOString(),
    };
};

export const getShiftedShortDOW = (startOfWeek = 'monday') => {
    const s = DAY_INDEX_MAP[String(startOfWeek).toLowerCase()] ?? 1;
    const base = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return [...base.slice(s), ...base.slice(0, s)];
};

export const getShiftedSingleDOW = (startOfWeek = 'monday') => {
    const s = DAY_INDEX_MAP[String(startOfWeek).toLowerCase()] ?? 1;
    const base = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return [...base.slice(s), ...base.slice(0, s)];
};

/**
 * Re-exported for convenience — timezone-aware "now".
 */
export { nowInTz };

/**
 * Returns the day-of-week abbreviations (e.g. 'Mon', 'Tue') shifted so that
 * the calendar's chosen `startOfWeek` day comes first.
 * Uses dayjs localeData to produce locale-aware abbreviations.
 *
 * @param {string} startOfWeek  e.g. 'monday', 'sunday'
 * @returns {string[]}
 */
export const getLocalizedShortDOW = (startOfWeek = 'monday') => {
    const s = DAY_INDEX_MAP[String(startOfWeek).toLowerCase()] ?? 1;
    try {
        // dayjs.weekdaysShort() returns ['Sun', 'Mon', ...] (Sun-first) in current locale
        const base = dayjs.weekdaysShort();
        if (Array.isArray(base) && base.length === 7) {
            return [...base.slice(s), ...base.slice(0, s)];
        }
    } catch {/* ignore */}
    // Fallback to hardcoded English
    return getShiftedShortDOW(startOfWeek);
};

/**
 * Returns single-letter day abbreviations shifted so that the calendar's
 * chosen `startOfWeek` day comes first.
 * Uses dayjs localeData to produce locale-aware abbreviations.
 *
 * @param {string} startOfWeek  e.g. 'monday', 'sunday'
 * @returns {string[]}
 */
export const getLocalizedSingleDOW = (startOfWeek = 'monday') => {
    const s = DAY_INDEX_MAP[String(startOfWeek).toLowerCase()] ?? 1;
    try {
        // dayjs.weekdaysMin() returns single-letter or very short abbreviations per locale
        const base = dayjs.weekdaysMin();
        if (Array.isArray(base) && base.length === 7) {
            return [...base.slice(s), ...base.slice(0, s)];
        }
    } catch {/* ignore */}
    // Fallback to hardcoded English
    return getShiftedSingleDOW(startOfWeek);
};
