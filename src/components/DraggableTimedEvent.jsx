import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import dayjs from 'dayjs';
import { useShallow } from 'zustand/react/shallow';
import useCalendarStore from '../store/useCalendarStore';
import { isCalendarDnDEnabled } from '../utils/eventDnD';

/**
 * Drag + resize shell for timed events in week/day grids.
 * Disabled when readOnly or no drop/resize/update handlers are configured.
 */
export default function DraggableTimedEvent({
    event,
    anchorDay,
    hourHeight,
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

    const move = useDraggable({
        id: `move-${event.id}-${dayKey}`,
        data: {
            event,
            anchorDay: dayjs(anchorDay).toDate(),
            mode: 'time-grid',
            interaction: 'move',
            hourHeight,
        },
        disabled: !canMove,
    });

    const resize = useDraggable({
        id: `resize-${event.id}-${dayKey}`,
        data: {
            event,
            anchorDay: dayjs(anchorDay).toDate(),
            mode: 'time-grid',
            interaction: 'resize',
            hourHeight,
        },
        disabled: !canResize,
    });

    const isDragging = move.isDragging || resize.isDragging;
    const transform = move.isDragging ? move.transform : resize.transform;
    const transformStyle = transform ? CSS.Translate.toString(transform) : undefined;

    return (
        <div
            ref={move.setNodeRef}
            className="calendar-timed-event-shell"
            style={{
                ...style,
                transform: transformStyle,
                zIndex: isDragging ? 50 : style?.zIndex,
                opacity: isDragging ? 0.9 : 1,
                touchAction: canMove ? 'none' : undefined,
                overflow: 'visible',
            }}
            {...(canMove ? move.listeners : {})}
            {...(canMove ? move.attributes : {})}
            data-calendar-dnd={canMove ? 'move' : undefined}
        >
            {children}
            {canResize && (
                <div
                    ref={resize.setNodeRef}
                    {...resize.listeners}
                    {...resize.attributes}
                    data-calendar-dnd="resize"
                    aria-label={`Resize ${event.title}`}
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 8,
                        cursor: 'ns-resize',
                        touchAction: 'none',
                    }}
                />
            )}
        </div>
    );
}
