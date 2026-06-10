import { describe, expect, it, vi } from 'vitest';
import {
    computeEventDrop,
    computeEventResize,
    computeMonthEventDrop,
    computeSpanEndResize,
    computeSpanStartResize,
    handleSpanDragEnd,
    handleTimeGridDragEnd,
    isCalendarDnDEnabled,
    pixelsToMinutes,
    snapDeltaMinutes,
} from './eventDnD';

describe('eventDnD', () => {
    const event = {
        id: 1,
        title: 'Standup',
        start: new Date(2026, 5, 9, 9, 0),
        end: new Date(2026, 5, 9, 9, 30),
        type: 'Meeting',
    };

    it('snaps drag delta to 15-minute increments', () => {
        expect(snapDeltaMinutes(7)).toBe(0);
        expect(snapDeltaMinutes(8)).toBe(15);
        expect(snapDeltaMinutes(22)).toBe(15);
        expect(snapDeltaMinutes(23)).toBe(30);
    });

    it('converts pixels to minutes using hour height', () => {
        expect(pixelsToMinutes(56, 56)).toBe(60);
        expect(pixelsToMinutes(14, 56)).toBe(15);
    });

    it('computes drop preserving duration', () => {
        const result = computeEventDrop({
            event,
            anchorDay: new Date(2026, 5, 9),
            targetDay: new Date(2026, 5, 9),
            deltaMinutes: 30,
        });

        expect(result.start).toEqual(new Date(2026, 5, 9, 9, 30));
        expect(result.end).toEqual(new Date(2026, 5, 9, 10, 0));
    });

    it('computes drop across week columns', () => {
        const result = computeEventDrop({
            event,
            anchorDay: new Date(2026, 5, 9),
            targetDay: new Date(2026, 5, 10),
            deltaMinutes: 0,
        });

        expect(result.start).toEqual(new Date(2026, 5, 10, 9, 0));
        expect(result.end).toEqual(new Date(2026, 5, 10, 9, 30));
    });

    it('computes resize with minimum duration', () => {
        const result = computeEventResize({
            event,
            anchorDay: new Date(2026, 5, 9),
            deltaMinutes: 30,
        });

        expect(result.start).toEqual(event.start);
        expect(result.end).toEqual(new Date(2026, 5, 9, 10, 0));
    });

    it('rejects resize below minimum duration', () => {
        const result = computeEventResize({
            event,
            anchorDay: new Date(2026, 5, 9),
            deltaMinutes: -20,
        });

        expect(result).toBeNull();
    });

    it('isCalendarDnDEnabled respects readOnly', () => {
        expect(isCalendarDnDEnabled({ readOnly: true, onEventDrop: () => {} })).toBe(false);
        expect(isCalendarDnDEnabled({ readOnly: false, onEventDrop: () => {} })).toBe(true);
        expect(isCalendarDnDEnabled({ readOnly: false, onUpdateEvent: () => {} })).toBe(true);
        expect(isCalendarDnDEnabled({ readOnly: false })).toBe(false);
    });

    it('computes month drop by whole days', () => {
        const result = computeMonthEventDrop({
            event,
            anchorDay: new Date(2026, 5, 9),
            targetDay: new Date(2026, 5, 11),
        });

        expect(result.start).toEqual(new Date(2026, 5, 11, 9, 0));
        expect(result.end).toEqual(new Date(2026, 5, 11, 9, 30));
    });

    it('computes span end resize onto another day', () => {
        const result = computeSpanEndResize({
            event,
            targetDay: new Date(2026, 5, 10),
        });

        expect(result.start).toEqual(event.start);
        expect(result.end).toEqual(new Date(2026, 5, 10, 9, 30));
    });

    it('computes span start resize to an earlier day', () => {
        const result = computeSpanStartResize({
            event,
            targetDay: new Date(2026, 5, 7),
        });

        expect(result.start).toEqual(new Date(2026, 5, 7, 9, 0));
        expect(result.end).toEqual(event.end);
    });

    it('rejects span start resize past the end', () => {
        const result = computeSpanStartResize({
            event,
            targetDay: new Date(2026, 5, 12),
        });

        expect(result).toBeNull();
    });

    it('handleSpanDragEnd calls onEventResize for resize-start', () => {
        const onEventResize = vi.fn();
        handleSpanDragEnd(
            {
                active: {
                    data: {
                        current: {
                            event,
                            anchorDay: new Date(2026, 5, 9),
                            mode: 'span',
                            interaction: 'resize-start',
                        },
                    },
                },
                over: { id: 'day-2026-06-07' },
            },
            { readOnly: false, onEventDrop: null, onEventResize, onUpdateEvent: null }
        );

        expect(onEventResize).toHaveBeenCalledWith({
            event,
            start: new Date(2026, 5, 7, 9, 0),
            end: event.end,
        });
    });

    it('handleSpanDragEnd calls onEventDrop for move', () => {
        const onEventDrop = vi.fn();
        handleSpanDragEnd(
            {
                active: {
                    data: {
                        current: {
                            event,
                            anchorDay: new Date(2026, 5, 9),
                            mode: 'span',
                            interaction: 'move',
                        },
                    },
                },
                over: { id: 'day-2026-06-11' },
            },
            { readOnly: false, onEventDrop, onEventResize: null, onUpdateEvent: null }
        );

        expect(onEventDrop).toHaveBeenCalledWith({
            event,
            start: new Date(2026, 5, 11, 9, 0),
            end: new Date(2026, 5, 11, 9, 30),
        });
    });

    it('handleSpanDragEnd calls onEventResize for resize-end', () => {
        const onEventResize = vi.fn();
        handleSpanDragEnd(
            {
                active: {
                    data: {
                        current: {
                            event,
                            anchorDay: new Date(2026, 5, 9),
                            mode: 'span',
                            interaction: 'resize-end',
                        },
                    },
                },
                over: { id: 'day-2026-06-10' },
            },
            { readOnly: false, onEventDrop: null, onEventResize, onUpdateEvent: null }
        );

        expect(onEventResize).toHaveBeenCalledWith({
            event,
            start: event.start,
            end: new Date(2026, 5, 10, 9, 30),
        });
    });

    it('handleTimeGridDragEnd calls onEventDrop', () => {
        const onEventDrop = vi.fn();
        handleTimeGridDragEnd(
            {
                active: {
                    data: {
                        current: {
                            event,
                            anchorDay: new Date(2026, 5, 9),
                            interaction: 'move',
                            hourHeight: 56,
                        },
                    },
                },
                over: { id: 'day-2026-06-09' },
                delta: { x: 0, y: 28 },
            },
            { readOnly: false, onEventDrop, onEventResize: null, onUpdateEvent: null }
        );

        expect(onEventDrop).toHaveBeenCalledWith({
            event,
            start: new Date(2026, 5, 9, 9, 30),
            end: new Date(2026, 5, 9, 10, 0),
        });
    });
});
