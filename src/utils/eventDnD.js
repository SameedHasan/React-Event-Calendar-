import dayjs from 'dayjs';
import { getEventDaySegment } from './dateHelpers';

export const SNAP_MINUTES = 15;
export const MIN_EVENT_MINUTES = 15;

export function pixelsToMinutes(px, hourHeight) {
    return (px / hourHeight) * 60;
}

export function snapDeltaMinutes(rawMinutes) {
    return Math.round(rawMinutes / SNAP_MINUTES) * SNAP_MINUTES;
}

export function parseDayDropId(dropId) {
    if (!dropId || typeof dropId !== 'string' || !dropId.startsWith('day-')) {
        return null;
    }
    const parsed = dayjs(dropId.slice(4));
    return parsed.isValid() ? parsed : null;
}

/**
 * Compute new start/end after dragging a timed event in week or day view.
 * Preserves total event duration; supports day-column changes in week view.
 */
export function computeEventDrop({ event, anchorDay, targetDay, deltaMinutes }) {
    const anchor = dayjs(anchorDay);
    const target = dayjs(targetDay ?? anchorDay);
    const segment = getEventDaySegment(event, anchor);
    if (!segment) return null;

    const eventStart = dayjs(event.start);
    const eventEnd = dayjs(event.end);
    const durationMs = eventEnd.diff(eventStart);

    const dayShift = target.startOf('day').diff(anchor.startOf('day'), 'day');
    const newStart = segment.start.add(deltaMinutes, 'minute').add(dayShift, 'day');
    const newEnd = newStart.add(durationMs, 'millisecond');

    return {
        start: newStart.toDate(),
        end: newEnd.toDate(),
    };
}

/**
 * Compute new start/end after resizing the bottom edge of a timed event segment.
 */
export function computeEventResize({ event, anchorDay, deltaMinutes }) {
    const segment = getEventDaySegment(event, dayjs(anchorDay));
    if (!segment) return null;

    const eventStart = dayjs(event.start);
    const newEnd = segment.end.add(deltaMinutes, 'minute');

    if (newEnd.diff(eventStart, 'minute') < MIN_EVENT_MINUTES) {
        return null;
    }

    return {
        start: eventStart.toDate(),
        end: newEnd.toDate(),
    };
}

export function isCalendarDnDEnabled({ readOnly, onEventDrop, onEventResize, onUpdateEvent }) {
    if (readOnly) return false;
    return Boolean(onEventDrop || onEventResize || onUpdateEvent);
}

/** @deprecated Use isCalendarDnDEnabled */
export const isTimeGridDnDEnabled = isCalendarDnDEnabled;

/**
 * Shift an event by whole days in month view (preserves time-of-day and duration).
 */
/**
 * Set event end to the target calendar day (preserves end time-of-day).
 * Start is unchanged — extends or shortens multi-day / single-day spans.
 */
export function computeSpanEndResize({ event, targetDay }) {
    const eventStart = dayjs(event.start);
    const target = dayjs(targetDay);
    const newEnd = dayjs(event.end)
        .year(target.year())
        .month(target.month())
        .date(target.date());

    if (newEnd.isBefore(eventStart)) return null;
    if (newEnd.diff(eventStart, 'minute') < MIN_EVENT_MINUTES) return null;

    return {
        start: eventStart.toDate(),
        end: newEnd.toDate(),
    };
}

/**
 * Set event start to the target calendar day (preserves start time-of-day).
 * End is unchanged — extends a span into earlier days or shrinks it.
 */
export function computeSpanStartResize({ event, targetDay }) {
    const eventEnd = dayjs(event.end);
    const target = dayjs(targetDay);
    const newStart = dayjs(event.start)
        .year(target.year())
        .month(target.month())
        .date(target.date());

    if (newStart.isAfter(eventEnd)) return null;
    if (eventEnd.diff(newStart, 'minute') < MIN_EVENT_MINUTES) return null;

    return {
        start: newStart.toDate(),
        end: eventEnd.toDate(),
    };
}

export function computeMonthEventDrop({ event, anchorDay, targetDay }) {
    const anchor = dayjs(anchorDay).startOf('day');
    const target = dayjs(targetDay).startOf('day');
    const dayShift = target.diff(anchor, 'day');

    if (dayShift === 0) return null;

    const eventStart = dayjs(event.start);
    const eventEnd = dayjs(event.end);
    const durationMs = eventEnd.diff(eventStart);
    const newStart = eventStart.add(dayShift, 'day');
    const newEnd = newStart.add(durationMs, 'millisecond');

    return {
        start: newStart.toDate(),
        end: newEnd.toDate(),
    };
}

function dispatchScheduleChange({ event, start, end }, { onEventDrop, onUpdateEvent }) {
    const payload = { event, start, end };
    if (onEventDrop) {
        onEventDrop(payload);
    } else {
        onUpdateEvent({ ...event, start, end });
    }
}

function dispatchSpanResize({ event, start, end }, { onEventResize, onUpdateEvent }) {
    const payload = { event, start, end };
    if (onEventResize) {
        onEventResize(payload);
    } else {
        onUpdateEvent({ ...event, start, end });
    }
}

export function handleSpanDragEnd(
    { active, over },
    { readOnly, onEventDrop, onEventResize, onUpdateEvent }
) {
    if (readOnly) return;

    const data = active?.data?.current;
    if (!data?.event || data?.mode !== 'span') return;

    const targetDay = parseDayDropId(over?.id);
    if (!targetDay) return;

    if (data.interaction === 'move') {
        if (!onEventDrop && !onUpdateEvent) return;

        const range = computeMonthEventDrop({
            event: data.event,
            anchorDay: data.anchorDay,
            targetDay,
        });
        if (!range) return;

        dispatchScheduleChange(
            { event: data.event, ...range },
            { onEventDrop, onUpdateEvent }
        );
        return;
    }

    if (data.interaction === 'resize-end' || data.interaction === 'resize-start') {
        if (!onEventResize && !onUpdateEvent) return;

        const range = data.interaction === 'resize-end'
            ? computeSpanEndResize({ event: data.event, targetDay })
            : computeSpanStartResize({ event: data.event, targetDay });
        if (!range) return;

        dispatchSpanResize(
            { event: data.event, ...range },
            { onEventResize, onUpdateEvent }
        );
    }
}

/** @deprecated Use handleSpanDragEnd */
export const handleMonthDragEnd = handleSpanDragEnd;

export function handleTimeGridDragEnd(
    { active, over, delta },
    { readOnly, onEventDrop, onEventResize, onUpdateEvent }
) {
    if (readOnly) return;

    const data = active?.data?.current;
    if (!data?.event || !data?.anchorDay || data?.mode === 'month') return;

    const deltaMinutes = snapDeltaMinutes(pixelsToMinutes(delta.y, data.hourHeight));
    const targetDay = parseDayDropId(over?.id) ?? dayjs(data.anchorDay);
    const anchorDay = dayjs(data.anchorDay);
    const dayShift = targetDay.startOf('day').diff(anchorDay.startOf('day'), 'day');

    if (data.interaction === 'move') {
        if (deltaMinutes === 0 && dayShift === 0) return;
        if (!onEventDrop && !onUpdateEvent) return;

        const range = computeEventDrop({
            event: data.event,
            anchorDay,
            targetDay,
            deltaMinutes,
        });
        if (!range) return;

        dispatchScheduleChange(
            { event: data.event, ...range },
            { onEventDrop, onUpdateEvent }
        );
        return;
    }

    if (data.interaction === 'resize') {
        if (deltaMinutes === 0) return;
        if (!onEventResize && !onUpdateEvent) return;

        const range = computeEventResize({
            event: data.event,
            anchorDay,
            deltaMinutes,
        });
        if (!range) return;

        if (onEventResize) {
            onEventResize({ event: data.event, start: range.start, end: range.end });
        } else {
            onUpdateEvent({ ...data.event, start: range.start, end: range.end });
        }
    }
}

export function handleCalendarDragEnd(dragEvent, callbacks) {
    const mode = dragEvent.active?.data?.current?.mode;
    if (mode === 'span' || mode === 'month') {
        handleSpanDragEnd(dragEvent, callbacks);
        return;
    }
    handleTimeGridDragEnd(dragEvent, callbacks);
}
