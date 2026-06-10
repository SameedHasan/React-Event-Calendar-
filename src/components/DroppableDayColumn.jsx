import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import dayjs from 'dayjs';

export default function DroppableDayColumn({ day, children, ...rest }) {
    const dayId = `day-${dayjs(day).format('YYYY-MM-DD')}`;
    const { setNodeRef, isOver } = useDroppable({ id: dayId });

    return (
        <div
            ref={setNodeRef}
            data-calendar-drop-day={dayId}
            data-calendar-drop-active={isOver || undefined}
            {...rest}
        >
            {children}
        </div>
    );
}
