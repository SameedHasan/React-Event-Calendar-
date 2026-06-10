import dayjs from 'dayjs';
import { isAllDayOrMultiDay } from './dateHelpers';

/** Style keys kept on the wrapper when using custom `renderEvent` (no default chrome). */
const LAYOUT_STYLE_KEYS = new Set([
    'position',
    'top',
    'left',
    'right',
    'bottom',
    'width',
    'height',
    'minWidth',
    'minHeight',
    'maxWidth',
    'maxHeight',
    'flex',
    'flexShrink',
    'flexGrow',
    'alignSelf',
    'zIndex',
    'boxSizing',
    'overflow',
    'overflowX',
    'overflowY',
    'pointerEvents',
    'cursor',
    'margin',
    'marginTop',
    'marginBottom',
    'marginLeft',
    'marginRight',
]);

export function pickLayoutStyles(style = {}) {
    return Object.fromEntries(
        Object.entries(style).filter(([key]) => LAYOUT_STYLE_KEYS.has(key))
    );
}

export function buildEventRenderContext(event, view, date) {
    const day = dayjs(date);
    return {
        view,
        date: day.toDate(),
        isMultiDay: isAllDayOrMultiDay(event),
        isStartDay: dayjs(event.start).isSame(day, 'day'),
        isEndDay: dayjs(event.end).isSame(day, 'day'),
    };
}

export function createEventClickHandler(event, { onEventClick, openEditModal, readOnly }) {
    return (e) => {
        e?.stopPropagation?.();
        if (onEventClick) {
            const res = onEventClick(event);
            if (res === false) return;
        }
        if (!readOnly) {
            openEditModal(event);
        }
    };
}
