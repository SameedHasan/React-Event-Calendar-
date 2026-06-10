import React, { useCallback, useRef, useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import dayjs from 'dayjs';
import { useShallow } from 'zustand/react/shallow';
import useCalendarStore from '../store/useCalendarStore';
import { isRecurringInstance } from '../utils/recurrence';
import {
    isCalendarDnDEnabled,
    computeSpanEndResize,
    computeSpanStartResize,
    parseDayDropId,
} from '../utils/eventDnD';

const MIN_BAR_WIDTH = 24;

/**
 * Pointer-based resize for a span edge handle.
 *
 * Attaches window-level pointermove/pointerup listeners on pointerdown so there is
 * no dependency on setPointerCapture, React synthetic event routing, or dnd-kit state.
 * A drag that ends on an invalid target simply calls cleanup() — nothing can get stuck.
 */
function usePointerResize({ shellKey, calEvent, interaction, canResize, onEventResize, onUpdateEvent }) {
    const [isResizing, setIsResizing] = useState(false);
    const [ghost, setGhost] = useState(null);

    // Ref so window listeners always read the latest values without stale closures.
    const latestRef = useRef({});
    latestRef.current = { calEvent, interaction, onEventResize, onUpdateEvent };

    // Synchronous active-drag flag — not affected by React render cycles.
    const dragRef = useRef(null);

    const cleanup = useCallback(() => {
        dragRef.current = null;
        setIsResizing(false);
        setGhost(null);
    }, []);

    const onPointerDown = useCallback((e) => {
        if (!canResize) return;
        if (dragRef.current) return; // ignore if already resizing

        e.stopPropagation(); // prevent shell's dnd-kit move from starting

        const shell = document.querySelector(`[data-calendar-span-shell="${shellKey}"]`);
        const container = shell?.offsetParent;
        if (!shell || !container) return;

        const baseline = {
            container,
            shellLeft: shell.offsetLeft,
            shellRight: shell.offsetLeft + shell.offsetWidth,
            top: shell.offsetTop,
            height: shell.offsetHeight,
        };

        dragRef.current = { baseline };
        setIsResizing(true);

        // Compute ghost geometry for a given pointer position.
        const ghostForPoint = (clientX, clientY) => {
            const { container: c, shellLeft, shellRight, top, height } = baseline;
            const { interaction: itr } = latestRef.current;

            const els = document.elementsFromPoint(clientX, clientY);
            const dayEl = els.find((el) => el.dataset.calendarDropDay);
            if (!dayEl) return null;

            const cRect = c.getBoundingClientRect();
            const dRect = dayEl.getBoundingClientRect();

            let left, width;
            if (itr === 'resize-end') {
                const right = dRect.right - cRect.left - 4;
                width = Math.max(right - shellLeft, MIN_BAR_WIDTH);
                left = shellLeft;
            } else {
                left = Math.min(dRect.left - cRect.left + 4, shellRight - MIN_BAR_WIDTH);
                width = Math.max(shellRight - left, MIN_BAR_WIDTH);
            }

            return { top, height, left, width, dayId: dayEl.dataset.calendarDropDay };
        };

        const onMove = (ev) => {
            if (!dragRef.current) return;
            setGhost(ghostForPoint(ev.clientX, ev.clientY));
        };

        const onUp = (ev) => {
            // Always remove listeners first so no double-firing.
            window.removeEventListener('pointermove', onMove, true);
            window.removeEventListener('pointerup', onUp, true);
            window.removeEventListener('pointercancel', onUp, true);

            if (!dragRef.current) return;

            const g = ghostForPoint(ev.clientX, ev.clientY);
            cleanup();

            if (!g?.dayId) return;

            const {
                calEvent: evt,
                interaction: itr,
                onEventResize: onResize,
                onUpdateEvent: onUpdate,
            } = latestRef.current;

            const targetDay = parseDayDropId(g.dayId);
            if (!targetDay) return;

            const range = itr === 'resize-end'
                ? computeSpanEndResize({ event: evt, targetDay })
                : computeSpanStartResize({ event: evt, targetDay });

            if (!range) return;

            if (onResize) {
                onResize({ event: evt, ...range });
            } else if (onUpdate) {
                onUpdate({ ...evt, start: range.start, end: range.end });
            }
        };

        // Use capture phase so these fire even if a child stops propagation.
        window.addEventListener('pointermove', onMove, true);
        window.addEventListener('pointerup', onUp, true);
        window.addEventListener('pointercancel', onUp, true);
    }, [canResize, shellKey, cleanup]);

    return { isResizing, ghost, onPointerDown };
}

/**
 * Drag + edge-resize shell for spanning event bars (month view + week all-day row).
 * - Move: dnd-kit (translate the bar, drop on a day cell to reschedule)
 * - Resize start / end: window pointer listeners (can never get stuck)
 */
export default function DraggableSpanEvent({
    event,
    anchorDay,
    instanceKey,
    style,
    children,
}) {
    const {
        readOnly,
        onEventDrop,
        onEventResize,
        onUpdateEvent,
        disableDrag,
        disableResize,
    } = useCalendarStore(
        useShallow((state) => ({
            readOnly: state.readOnly,
            onEventDrop: state.onEventDrop,
            onEventResize: state.onEventResize,
            onUpdateEvent: state.callbacks.onUpdateEvent,
            disableDrag: state.disableDrag,
            disableResize: state.disableResize,
        }))
    );

    const enabled = isCalendarDnDEnabled({ readOnly, onEventDrop, onEventResize, onUpdateEvent })
        && !isRecurringInstance(event);
    const canMove = enabled && !disableDrag && Boolean(onEventDrop || onUpdateEvent);
    const canResize = enabled && !disableResize && Boolean(onEventResize || onUpdateEvent);
    const dayKey = dayjs(anchorDay).format('YYYY-MM-DD');
    const moveId = `span-move-${event.id}-${instanceKey}-${dayKey}`;

    const move = useDraggable({
        id: moveId,
        data: { event, anchorDay: dayjs(anchorDay).toDate(), mode: 'span', interaction: 'move' },
        disabled: !canMove,
    });

    const endResize = usePointerResize({
        shellKey: moveId,
        calEvent: event,
        interaction: 'resize-end',
        canResize,
        onEventResize,
        onUpdateEvent,
    });

    const startResize = usePointerResize({
        shellKey: moveId,
        calEvent: event,
        interaction: 'resize-start',
        canResize,
        onEventResize,
        onUpdateEvent,
    });

    const isResizing = startResize.isResizing || endResize.isResizing;
    const isDragging = move.isDragging || isResizing;
    const ghost = startResize.ghost ?? endResize.ghost;

    const transformStyle = move.isDragging && move.transform
        ? CSS.Translate.toString(move.transform)
        : undefined;

    return (
        <>
            <div
                ref={move.setNodeRef}
                className="calendar-span-event-shell"
                data-calendar-span-shell={moveId}
                style={{
                    ...style,
                    transform: transformStyle,
                    zIndex: isDragging ? 50 : style?.zIndex,
                    opacity: move.isDragging ? 0.85 : isResizing ? 0.5 : 1,
                    touchAction: canMove ? 'none' : undefined,
                }}
                {...(canMove ? move.listeners : {})}
                {...(canMove ? move.attributes : {})}
                data-calendar-dnd={canMove ? 'span-move' : undefined}
                data-calendar-resizing={isResizing || undefined}
            >
                {children}
                {canResize && (
                    <div
                        data-calendar-dnd="resize-start"
                        aria-label={`Change start day of ${event.title}`}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: 8,
                            height: '100%',
                            cursor: 'ew-resize',
                            touchAction: 'none',
                            zIndex: 2,
                        }}
                        onPointerDown={startResize.onPointerDown}
                    />
                )}
                {canResize && (
                    <div
                        data-calendar-dnd="resize-end"
                        aria-label={`Extend ${event.title} to another day`}
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: 8,
                            height: '100%',
                            cursor: 'ew-resize',
                            touchAction: 'none',
                            zIndex: 2,
                        }}
                        onPointerDown={endResize.onPointerDown}
                    />
                )}
            </div>
            {ghost && (
                <div
                    className="calendar-span-resize-ghost"
                    aria-hidden
                    style={{
                        position: 'absolute',
                        top: `${ghost.top}px`,
                        left: `${ghost.left}px`,
                        width: `${ghost.width}px`,
                        height: `${ghost.height}px`,
                        pointerEvents: 'none',
                        zIndex: 55,
                        boxSizing: 'border-box',
                    }}
                />
            )}
        </>
    );
}
