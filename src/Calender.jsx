import React, { useEffect } from 'react';
import CalenderHeader from './CalenderHeader';
import CalenderMonthView from './CalenderMonthView';
import useCalendarStore from './store/useCalendarStore';
import DaysOfWeek from './DaysOfWeek';
import CalenderDayView from './CalenderDayView';
import CalenderListView from './CalenderListView';
import CalenderYearView from './CalenderYearView';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';

/**
 * <Calendar> — the main component.
 *
 * Props
 * ─────
 * events       {Array}   Required. Array of event objects. Each event:
 *                        { id, title, start (Date), end (Date),
 *                          type ('Video'|'Audio'|'Inperson'), description }
 *
 * defaultView  {string}  Optional. Initial view: 'month'|'week'|'day'|'list'|'year'
 *                        Defaults to 'month'.
 */
const Calendar = ({ events = [], defaultView = 'month', startOfWeek = 'monday', timeFormat = '12h' }) => {
    const { view, setEvents, setView, setStartOfWeek, setTimeFormat } = useCalendarStore();

    // Activate keyboard shortcuts
    useKeyboardShortcuts();

    // Seed the store whenever the events prop changes
    useEffect(() => {
        setEvents(events);
    }, [events, setEvents]);

    // Sync startOfWeek and timeFormat configuration props with the store
    useEffect(() => {
        setStartOfWeek(startOfWeek);
    }, [startOfWeek, setStartOfWeek]);

    useEffect(() => {
        setTimeFormat(timeFormat);
    }, [timeFormat, setTimeFormat]);

    // Apply defaultView only on first mount
    useEffect(() => {
        if (defaultView && defaultView !== 'month') {
            setView(defaultView);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={{
            margin: '20px 16px',
            padding: '20px',
            height: 'calc(100vh - 104px)',
            overflow: 'auto',
            backgroundColor: 'var(--white-color)',
        }}>
            <CalenderHeader />
            {view === 'month' && <CalenderMonthView />}
            {view === 'week'  && <DaysOfWeek />}
            {view === 'day'   && <CalenderDayView />}
            {view === 'list'  && <CalenderListView />}
            {view === 'year'  && <CalenderYearView />}
        </div>
    );
};

export default Calendar;