import { describe, it, expect } from 'vitest';
import {
    buildRecurrenceRule,
    parseRecurrencePreset,
    parseRecurrenceCount,
    expandRecurringEvent,
    expandRecurringEvents,
    isRecurringInstance,
} from './recurrence';

describe('buildRecurrenceRule', () => {
    const start = new Date(2026, 5, 9, 9, 0); // Tuesday

    it('returns undefined for none', () => {
        expect(buildRecurrenceRule('none', start)).toBeUndefined();
    });

    it('builds daily rule', () => {
        expect(buildRecurrenceRule('daily', start)).toBe('FREQ=DAILY');
    });

    it('builds weekly rule with weekday from start date', () => {
        expect(buildRecurrenceRule('weekly', start)).toBe('FREQ=WEEKLY;BYDAY=TU');
    });

    it('builds monthly rule with optional count', () => {
        expect(buildRecurrenceRule('monthly', start, { count: 6 })).toBe('FREQ=MONTHLY;COUNT=6');
    });
});

describe('parseRecurrencePreset', () => {
    it('detects presets from RRULE strings', () => {
        expect(parseRecurrencePreset('FREQ=WEEKLY;BYDAY=MO')).toBe('weekly');
        expect(parseRecurrencePreset('FREQ=DAILY;COUNT=10')).toBe('daily');
        expect(parseRecurrencePreset(undefined)).toBe('none');
    });
});

describe('parseRecurrenceCount', () => {
    it('extracts COUNT value', () => {
        expect(parseRecurrenceCount('FREQ=DAILY;COUNT=12')).toBe(12);
        expect(parseRecurrenceCount('FREQ=DAILY')).toBeUndefined();
    });
});

describe('expandRecurringEvents', () => {
    const master = {
        id: 'standup',
        title: 'Standup',
        type: 'Meeting',
        start: new Date(2026, 5, 9, 9, 0),
        end: new Date(2026, 5, 9, 9, 30),
        recurrence: 'FREQ=DAILY;COUNT=5',
    };

    it('expands daily events inside the visible range', () => {
        const rangeStart = new Date(2026, 5, 8);
        const rangeEnd = new Date(2026, 5, 12, 23, 59, 59);

        const expanded = expandRecurringEvents([master], rangeStart, rangeEnd);
        expect(expanded).toHaveLength(4);
        expect(expanded.every((e) => e.recurrenceMasterId === 'standup')).toBe(true);
        expect(expanded[0].id).toBe('standup::' + new Date(2026, 5, 9, 9, 0).getTime());
    });

    it('passes through non-recurring events', () => {
        const single = {
            id: 1,
            title: 'One-off',
            start: new Date(2026, 5, 10, 10, 0),
            end: new Date(2026, 5, 10, 11, 0),
            type: 'Meeting',
        };

        const expanded = expandRecurringEvents([single], new Date(2026, 5, 1), new Date(2026, 5, 30));
        expect(expanded).toEqual([single]);
    });

    it('flags recurring instances', () => {
        const [instance] = expandRecurringEvent(
            master,
            new Date(2026, 5, 9),
            new Date(2026, 5, 10, 23, 59, 59)
        );
        expect(isRecurringInstance(instance)).toBe(true);
    });
});
