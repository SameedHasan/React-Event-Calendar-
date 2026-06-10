import { describe, expect, it, vi, afterEach } from 'vitest';
import { render, waitFor, cleanup } from '@testing-library/react';
import Calendar from './Calender.jsx';

afterEach(() => {
    cleanup();
});

const timedEvent = {
    id: 1,
    title: 'Standup',
    start: new Date(2026, 5, 9, 9, 0),
    end: new Date(2026, 5, 9, 9, 30),
    type: 'Meeting',
};

describe('Calendar drag-and-drop', () => {
    it('enables drag handles when onEventDrop is provided', async () => {
        render(
            <Calendar
                events={[timedEvent]}
                defaultView="week"
                currentDate={new Date(2026, 5, 9)}
                onEventDrop={vi.fn()}
                onEventResize={vi.fn()}
            />
        );

        await waitFor(() => {
            expect(document.querySelector('[data-calendar-dnd="move"]')).toBeTruthy();
            expect(document.querySelector('[data-calendar-dnd="resize"]')).toBeTruthy();
        });
    });

    it('disables drag handles when readOnly is true', async () => {
        render(
            <Calendar
                events={[timedEvent]}
                defaultView="week"
                currentDate={new Date(2026, 5, 9)}
                readOnly
                onEventDrop={vi.fn()}
                onEventResize={vi.fn()}
            />
        );

        await waitFor(() => {
            expect(document.querySelector('[data-calendar-dnd="move"]')).toBeNull();
            expect(document.querySelector('[data-calendar-dnd="resize"]')).toBeNull();
        });
    });

    it('enables month drag handles when onEventDrop is provided', async () => {
        render(
            <Calendar
                events={[timedEvent]}
                defaultView="month"
                currentDate={new Date(2026, 5, 9)}
                onEventDrop={vi.fn()}
                onEventResize={vi.fn()}
            />
        );

        await waitFor(() => {
            expect(document.querySelector('[data-calendar-dnd="span-move"]')).toBeTruthy();
            expect(document.querySelector('[data-calendar-dnd="resize-start"]')).toBeTruthy();
            expect(document.querySelector('[data-calendar-dnd="resize-end"]')).toBeTruthy();
        });
    });

    it('disableDrag removes the move handle but keeps resize', async () => {
        render(
            <Calendar
                events={[timedEvent]}
                defaultView="week"
                currentDate={new Date(2026, 5, 9)}
                onEventDrop={vi.fn()}
                onEventResize={vi.fn()}
                disableDrag
            />
        );

        await waitFor(() => {
            expect(document.querySelector('[data-calendar-dnd="resize"]')).toBeTruthy();
        });
        expect(document.querySelector('[data-calendar-dnd="move"]')).toBeNull();
    });

    it('disableResize removes the resize handle but keeps move', async () => {
        render(
            <Calendar
                events={[timedEvent]}
                defaultView="week"
                currentDate={new Date(2026, 5, 9)}
                onEventDrop={vi.fn()}
                onEventResize={vi.fn()}
                disableResize
            />
        );

        await waitFor(() => {
            expect(document.querySelector('[data-calendar-dnd="move"]')).toBeTruthy();
        });
        expect(document.querySelector('[data-calendar-dnd="resize"]')).toBeNull();
    });

    it('falls back to onUpdateEvent for resize when onEventResize is omitted', async () => {
        render(
            <Calendar
                events={[timedEvent]}
                defaultView="day"
                currentDate={new Date(2026, 5, 9)}
                onUpdateEvent={vi.fn()}
            />
        );

        await waitFor(() => {
            expect(document.querySelector('[data-calendar-dnd="resize"]')).toBeTruthy();
        });
    });
});
