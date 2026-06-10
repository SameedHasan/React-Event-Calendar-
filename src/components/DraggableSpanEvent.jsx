import React, { useRef, useState } from 'react';
import { useDraggable, useDndMonitor } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import dayjs from 'dayjs';
import { useShallow } from 'zustand/react/shallow';
import useCalendarStore from '../store/useCalendarStore';
import { isCalendarDnDEnabled } from '../utils/eventDnD';

const MIN_BAR_WIDTH = 24;

/** Wrap drag listeners so a handle press doesn't also start the parent move drag. */
const stopProp = (listeners = {}) => {
    const wrapped = {};
    for (const key of Object.keys(listeners)) {
        wrapped[key] = (e) => {
            e.stopPropagation();
            listeners[key](e);
        };
    }
    return wrapped;
};

/**
 * Drag + edge-resize shell for spanning event bars (month view + week all-day row).
 * - Move: translate the whole bar, drop on a day cell to reschedule.
 * - Resize start/end: anchor the opposite edge and live-extend the bar toward the
 *   hovered day, so it reads as "extending" rather than moving.
 */
export default function DraggableSpanEvent({
    event,
    anchorDay,
    instanceKey,
    style,
    children,
}) {
    const { readOnly, onEventDrop, onEventResize, onUpdateEvent } = useCalendarStore(
        useShallow((state) => ({
            readOnly: state.readOnly,
            onEventDrop: state.onEventDrop,
            onEventResize: state.onEventResize,
            onUpdateEvent: state.callbacks.onUpdateEvent,
        }))
    );
    const enabled = isCalendarDnDEnabled({ readOnly, onEventDrop, onEventResize, onUpdateEvent });
    const canMove = enabled && Boolean(onEventDrop || onUpdateEvent);
    const canResize = enabled && Boolean(onEventResize || onUpdateEvent);
    const dayKey = dayjs(anchorDay).format('YYYY-MM-DD');

    const shellRef = useRef(null);
    const [preview, setPreview] = useState(null);

    const moveId = `span-move-${event.id}-${instanceKey}-${dayKey}`;
    const resizeStartId = `span-resize-start-${event.id}-${instanceKey}-${dayKey}`;
    const resizeEndId = `span-resize-end-${event.id}-${instanceKey}-${dayKey}`;

    const move = useDraggable({
        id: moveId,
        data: { event, anchorDay: dayjs(anchorDay).toDate(), mode: 'span', interaction: 'move' },
        disabled: !canMove,
    });

    const resizeStart = useDraggable({
        id: resizeStartId,
        data: { event, anchorDay: dayjs(anchorDay).toDate(), mode: 'span', interaction: 'resize-start' },
        disabled: !canResize,
    });

    const resizeEnd = useDraggable({
        id: resizeEndId,
        data: { event, anchorDay: dayjs(anchorDay).toDate(), mode: 'span', interaction: 'resize-end' },
        disabled: !canResize,
    });

    const computePreview = (activeId, overId) => {
        const isStart = activeId === resizeStartId;
        const isEnd = activeId === resizeEndId;
        if (!isStart && !isEnd) return;

        const shell = shellRef.current;
        const container = shell?.offsetParent;
        if (!shell || !container) return;

        const dayEl = document.querySelector(`[data-calendar-drop-day="${overId}"]`);
        if (!dayEl) return;

        const containerRect = container.getBoundingClientRect();
        const dayRect = dayEl.getBoundingClientRect();
        const shellLeft = shell.offsetLeft;
        const shellRight = shell.offsetLeft + shell.offsetWidth;

        if (isEnd) {
            const right = dayRect.right - containerRect.left - 4;
            const width = Math.max(right - shellLeft, MIN_BAR_WIDTH);
            setPreview({ left: shellLeft, width });
        } else {
            const left = dayRect.left - containerRect.left + 4;
            const clampedLeft = Math.min(left, shellRight - MIN_BAR_WIDTH);
            const width = Math.max(shellRight - clampedLeft, MIN_BAR_WIDTH);
            setPreview({ left: clampedLeft, width });
        }
    };

    useDndMonitor({
        onDragMove({ active, over }) {
            if (!over) return;
            computePreview(active.id, over.id);
        },
        onDragOver({ active, over }) {
            if (!over) return;
            computePreview(active.id, over.id);
        },
        onDragEnd() {
            setPreview(null);
        },
        onDragCancel() {
            setPreview(null);
        },
    });

    const isResizing = resizeStart.isDragging || resizeEnd.isDragging;
    const isDragging = move.isDragging || isResizing;
    const transformStyle = move.isDragging && move.transform
        ? CSS.Translate.toString(move.transform)
        : undefined;

    const previewStyle = preview
        ? { left: `${preview.left}px`, width: `${preview.width}px` }
        : null;

    return (
        <div
            ref={(node) => {
                shellRef.current = node;
                move.setNodeRef(node);
            }}
            className="calendar-span-event-shell"
            style={{
                ...style,
                ...previewStyle,
                transform: transformStyle,
                zIndex: isDragging ? 50 : style?.zIndex,
                opacity: move.isDragging ? 0.85 : 1,
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
                    ref={resizeStart.setNodeRef}
                    {...stopProp(resizeStart.listeners)}
                    {...resizeStart.attributes}
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
                />
            )}
            {canResize && (
                <div
                    ref={resizeEnd.setNodeRef}
                    {...stopProp(resizeEnd.listeners)}
                    {...resizeEnd.attributes}
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
                />
            )}
        </div>
    );
}
