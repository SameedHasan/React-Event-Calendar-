import React from 'react';
import useCalendarStore from '../store/useCalendarStore';

/**
 * Centered empty-state overlay for time-grid views (week, day).
 * Only renders when `renderEmpty` is provided and `isEmpty` is true.
 */
export default function CalendarViewEmpty({ view, isEmpty }) {
    const renderEmpty = useCalendarStore((state) => state.renderEmpty);

    if (!isEmpty || !renderEmpty) {
        return null;
    }

    return (
        <div
            className="calendar-view-empty"
            style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 20,
                pointerEvents: 'none',
            }}
        >
            <div style={{ pointerEvents: 'auto', textAlign: 'center' }}>
                {renderEmpty(view)}
            </div>
        </div>
    );
}
