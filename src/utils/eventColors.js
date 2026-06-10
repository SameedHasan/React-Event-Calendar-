/**
 * Dynamic event color utility.
 *
 * Assigns a consistent color to any event type string — no fixed types required.
 *
 * Priority:
 *   1. eventColors[type] from calendar config
 *   2. event.color — if the event carries its own hex/css color
 *   3. palette[hash(event.type)] — deterministic color based on the type string
 *
 * Usage:
 *   const { color, bg, border } = getEventStyle(event, eventColors);
 */

// Accent colors use 600-level hues for WCAG AA contrast on light backgrounds.
const PALETTE = [
    { color: '#2563eb', bg: '#eff6ff',  border: '#bfdbfe' }, // blue
    { color: '#059669', bg: '#ecfdf5',  border: '#a7f3d0' }, // emerald
    { color: '#7c3aed', bg: '#f5f3ff',  border: '#ddd6fe' }, // violet
    { color: '#d97706', bg: '#fffbeb',  border: '#fde68a' }, // amber
    { color: '#dc2626', bg: '#fef2f2',  border: '#fecaca' }, // red
    { color: '#0891b2', bg: '#ecfeff',  border: '#a5f3fc' }, // cyan
    { color: '#ea580c', bg: '#fff7ed',  border: '#fed7aa' }, // orange
    { color: '#db2777', bg: '#fdf2f8',  border: '#fbcfe8' }, // pink
    { color: '#0d9488', bg: '#f0fdfa',  border: '#99f6e4' }, // teal
    { color: '#4f46e5', bg: '#eef2ff',  border: '#c7d2fe' }, // indigo
];

const hashType = (str = '') => {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = (h * 31 + str.charCodeAt(i)) >>> 0;
    }
    return h % PALETTE.length;
};

export const getEventStyle = (event = {}, eventColors = {}) => {
    if (eventColors && eventColors[event.type]) {
        const hex = eventColors[event.type];
        return {
            color: hex,
            bg: `color-mix(in srgb, ${hex} 9.4%, var(--white-color))`,
            border: `color-mix(in srgb, ${hex} 31%, var(--white-color))`,
        };
    }

    if (event.color) {
        return {
            color: event.color,
            bg: `color-mix(in srgb, ${event.color} 9.4%, var(--white-color))`,
            border: `color-mix(in srgb, ${event.color} 31%, var(--white-color))`,
        };
    }

    return PALETTE[hashType(event.type)];
};

/**
 * Returns all unique types found in an events array,
 * each paired with its resolved style.
 */
export const getEventTypeLegend = (events = [], eventColors = {}) => {
    const map = new Map();
    events.forEach(ev => {
        if (!map.has(ev.type)) {
            map.set(ev.type, { type: ev.type, style: getEventStyle(ev, eventColors), count: 0 });
        }
        map.get(ev.type).count++;
    });
    return [...map.values()];
};
