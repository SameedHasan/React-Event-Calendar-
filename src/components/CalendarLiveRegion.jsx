import React, { useEffect, useRef, useState } from 'react';
import useCalendarStore from '../store/useCalendarStore';
import { buildCalendarTitle, buildLiveAnnouncement } from '../utils/a11y';

export default function CalendarLiveRegion() {
    const { view, currentDate, weekRange, currentDayIndex } = useCalendarStore();
    const [message, setMessage] = useState('');
    const isFirstRender = useRef(true);

    useEffect(() => {
        const title = buildCalendarTitle(view, { currentDate, weekRange, currentDayIndex });
        const announcement = buildLiveAnnouncement(view, title);

        if (isFirstRender.current) {
            isFirstRender.current = false;
            setMessage(announcement);
            return;
        }

        setMessage(announcement);
    }, [view, currentDate, weekRange, currentDayIndex]);

    return (
        <div
            className="calendar-live-region"
            aria-live="polite"
            aria-atomic="true"
            style={{
                position: 'absolute',
                width: '1px',
                height: '1px',
                padding: 0,
                margin: '-1px',
                overflow: 'hidden',
                clip: 'rect(0, 0, 0, 0)',
                whiteSpace: 'nowrap',
                border: 0,
            }}
        >
            {message}
        </div>
    );
}
