/**
 * Dynamic event color utility.
 *
 * Assigns a consistent color to any event type string — no fixed types required.
 *
 * Priority:
 *   1. event.color  — if the event carries its own hex/css color
 *   2. palette[hash(event.type)]  — deterministic color based on the type string
 *
 * Usage:
 *   import { getEventStyle } from '../utils/eventColors';
 *   const { color, bg, border } = getEventStyle(event);
 */

import useCalendarStore from '../store/useCalendarStore';

const PALETTE = [
    { color: '#3b82f6', bg: '#eff6ff',  border: '#bfdbfe' }, // blue
    { color: '#10b981', bg: '#ecfdf5',  border: '#a7f3d0' }, // emerald
    { color: '#8b5cf6', bg: '#f5f3ff',  border: '#ddd6fe' }, // violet
    { color: '#f59e0b', bg: '#fffbeb',  border: '#fde68a' }, // amber
    { color: '#ef4444', bg: '#fef2f2',  border: '#fecaca' }, // red
    { color: '#06b6d4', bg: '#ecfeff',  border: '#a5f3fc' }, // cyan
    { color: '#f97316', bg: '#fff7ed',  border: '#fed7aa' }, // orange
    { color: '#ec4899', bg: '#fdf2f8',  border: '#fbcfe8' }, // pink
    { color: '#14b8a6', bg: '#f0fdfa',  border: '#99f6e4' }, // teal
    { color: '#6366f1', bg: '#eef2ff',  border: '#c7d2fe' }, // indigo
];

const hashType = (str = '') => {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = (h * 31 + str.charCodeAt(i)) >>> 0;
    }
    return h % PALETTE.length;
};

export const getEventStyle = (event = {}) => {
    try {
        const store = useCalendarStore.getState();
        if (store && store.eventColors && store.eventColors[event.type]) {
            const hex = store.eventColors[event.type];
            return {
                color: hex,
                bg: `${hex}18`,
                border: `${hex}50`,
            };
        }
    } catch (e) {
        // Fallback
    }

    if (event.color) {
        return {
            color:  event.color,
            bg:     `${event.color}18`,
            border: `${event.color}50`,
        };
    }
    return PALETTE[hashType(event.type)];
};

/**
 * Returns all unique types found in an events array,
 * each paired with its resolved style.
 *
 * @param {object[]} events
 * @returns {{ type: string, style: object, count: number }[]}
 */
export const getEventTypeLegend = (events = []) => {
    const map = new Map();
    events.forEach(ev => {
        if (!map.has(ev.type)) {
            map.set(ev.type, { type: ev.type, style: getEventStyle(ev), count: 0 });
        }
        map.get(ev.type).count++;
    });
    return [...map.values()];
};
