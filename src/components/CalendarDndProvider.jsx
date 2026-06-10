import React, { useCallback } from 'react';
import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { useShallow } from 'zustand/react/shallow';
import useCalendarStore from '../store/useCalendarStore';
import { handleCalendarDragEnd } from '../utils/eventDnD';

export default function CalendarDndProvider({ children }) {
    const { readOnly, onEventDrop, onEventResize, onUpdateEvent } = useCalendarStore(
        useShallow((state) => ({
            readOnly: state.readOnly,
            onEventDrop: state.onEventDrop,
            onEventResize: state.onEventResize,
            onUpdateEvent: state.callbacks.onUpdateEvent,
        }))
    );

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        }),
        useSensor(KeyboardSensor)
    );

    const onDragEnd = useCallback(
        (event) => {
            handleCalendarDragEnd(event, {
                readOnly,
                onEventDrop,
                onEventResize,
                onUpdateEvent,
            });
        },
        [readOnly, onEventDrop, onEventResize, onUpdateEvent]
    );

    return (
        <DndContext sensors={sensors} onDragEnd={onDragEnd}>
            {children}
        </DndContext>
    );
}
