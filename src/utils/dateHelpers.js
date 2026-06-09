import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

/**
 * Returns whether an event overlaps with a given day.
 */
export const isEventOnDay = (event, day) => {
    const dayStart = dayjs(day).startOf('day');
    const dayEnd = dayjs(day).endOf('day');
    const eventStart = dayjs(event.start);
    const eventEnd = dayjs(event.end);
    return eventStart.isBefore(dayEnd) && eventEnd.isAfter(dayStart);
};

/**
 * Checks if an event should render in the all-day / spanning header row.
 * Explicit `allDay: true`, crosses a calendar-day boundary, or lasts 24+ hours.
 */
export const isAllDayOrMultiDay = (event) => {
    if (event?.allDay === true) return true;

    const start = dayjs(event.start);
    const end = dayjs(event.end);

    if (!start.isSame(end, 'day')) return true;

    return end.diff(start, 'hour') >= 24;
};

/**
 * ISO week number for a date (consistent with dayjs isoWeek in views).
 */
export const getIsoWeekNumber = (date) => dayjs(date).isoWeek();

/**
 * Gets the portion of an event that falls within a specific day.
 * Returns null if the event doesn't cover this day.
 * Otherwise returns { start, end, isStartDay, isEndDay, durationMinutes }.
 */
export const getEventDaySegment = (event, day) => {
    if (!isEventOnDay(event, day)) return null;

    const dayStart = dayjs(day).startOf('day');
    const dayEnd = dayjs(day).endOf('day');
    const eventStart = dayjs(event.start);
    const eventEnd = dayjs(event.end);

    const segmentStart = eventStart.isBefore(dayStart) ? dayStart : eventStart;
    const segmentEnd = eventEnd.isAfter(dayEnd) ? dayEnd : eventEnd;

    return {
        start: segmentStart,
        end: segmentEnd,
        isStartDay: eventStart.isSame(day, 'day'),
        isEndDay: eventEnd.isSame(day, 'day'),
        durationMinutes: segmentEnd.diff(segmentStart, 'minute'),
    };
};

/**
 * Formats a dayjs object or string into a time string, respecting 12h or 24h format.
 */
export const formatTime = (time, formatType = '12h') => {
    const t = dayjs(time);
    if (formatType === '24h') {
        return t.format('HH:mm');
    }
    return t.format('h:mm A');
};

/**
 * Formats an hour number (0 to 23) into a header label, respecting 12h or 24h format.
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

export const getDayIndex = (date, startOfWeek = "monday") => {
    const d = dayjs(date).day();
    const s = DAY_INDEX_MAP[String(startOfWeek).toLowerCase()] ?? 1;
    return (d - s + 7) % 7;
};

export const calculateWeekRange = (date, startOfWeek = "monday") => {
    const d = dayjs(date);
    const relativeIndex = getDayIndex(d.toDate(), startOfWeek);
    const start = d.subtract(relativeIndex, 'day');
    const end = start.add(6, 'day');

    return {
        start: start.format('MMM D, YYYY'),
        end: end.format('MMM D, YYYY')
    };
};

export const getShiftedShortDOW = (startOfWeek = "monday") => {
    const s = DAY_INDEX_MAP[String(startOfWeek).toLowerCase()] ?? 1;
    const base = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return [...base.slice(s), ...base.slice(0, s)];
};

export const getShiftedSingleDOW = (startOfWeek = "monday") => {
    const s = DAY_INDEX_MAP[String(startOfWeek).toLowerCase()] ?? 1;
    const base = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return [...base.slice(s), ...base.slice(0, s)];
};
