import dayjs from 'dayjs';

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
 * Checks if an event is a "multi-day" or "all-day" event.
 * Definition: spans 24 hours or more, OR spans across distinct calendar days
 * where the duration is long enough to warrant putting it in the top header.
 * Here we define it as any event spanning 24 hours or more.
 */
export const isAllDayOrMultiDay = (event) => {
    const duration = dayjs(event.end).diff(dayjs(event.start), 'hour');
    return duration >= 24;
};

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
