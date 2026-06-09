import React, { useEffect } from 'react';
import { ConfigProvider } from 'antd';
import { useShallow } from 'zustand/react/shallow';
import './index.css';
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
import EventModal from './EventModal';

const Calendar = ({
    events = [],
    defaultView = 'month',
    startOfWeek = 'monday',
    timeFormat = '12h',
    categories,
    primaryColor = '#1272bf',
    // CRUD:
    onAddEvent,
    onUpdateEvent,
    onDeleteEvent,
    // Advanced NPM Props:
    currentDate,
    onDateChange,
    onViewChange,
    hideWeekends = false,
    showWeekNumbers = false,
    showToolbar = true,
    showExportButton = true,
    showAddEventButton = true,
    allowDateClick = true,
    eventColors = {},
    theme = 'light',
    onEventClick,
    onDateClick,
}) => {
    const {
        view,
        setEvents,
        setView,
        setStartOfWeek,
        setTimeFormat,
        setCallbacks,
        setCategories,
        setConfigs,
        setCurrentDate,
    } = useCalendarStore(
        useShallow((state) => ({
            view: state.view,
            setEvents: state.setEvents,
            setView: state.setView,
            setStartOfWeek: state.setStartOfWeek,
            setTimeFormat: state.setTimeFormat,
            setCallbacks: state.setCallbacks,
            setCategories: state.setCategories,
            setConfigs: state.setConfigs,
            setCurrentDate: state.setCurrentDate,
        }))
    );

    // Activate keyboard shortcuts
    useKeyboardShortcuts();

    // Seed the store whenever the events prop changes
    useEffect(() => {
        setEvents(events);
    }, [events, setEvents]);

    // Sync callbacks with the store
    useEffect(() => {
        setCallbacks({ onAddEvent, onUpdateEvent, onDeleteEvent });
    }, [onAddEvent, onUpdateEvent, onDeleteEvent, setCallbacks]);

    // Sync categories with the store
    useEffect(() => {
        if (categories) {
            setCategories(categories);
        }
    }, [categories, setCategories]);

    // Sync other advanced configurations with the store
    useEffect(() => {
        setConfigs({
            onDateChange,
            onViewChange,
            hideWeekends,
            showWeekNumbers,
            showToolbar,
            showExportButton,
            showAddEventButton,
            allowDateClick,
            eventColors,
            theme,
            onEventClick,
            onDateClick,
        });
    }, [
        onDateChange,
        onViewChange,
        hideWeekends,
        showWeekNumbers,
        showToolbar,
        showExportButton,
        showAddEventButton,
        allowDateClick,
        eventColors,
        theme,
        onEventClick,
        onDateClick,
        setConfigs,
    ]);

    // Sync currentDate explicitly when it changes from the parent
    useEffect(() => {
        if (currentDate) {
            setCurrentDate(currentDate);
        }
    }, [currentDate, setCurrentDate]);

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
        <ConfigProvider theme={{ token: { colorPrimary: primaryColor } }}>
            <div
                className={`calendar-root theme-${theme}`}
                style={{
                    padding: '20px',
                    height: 'calc(100vh - 104px)',
                    overflow: 'auto',
                    backgroundColor: 'var(--white-color)',
                    transition: 'background-color 0.25s ease, color 0.25s ease',
                    '--primary-color': primaryColor,
                }}
            >
                {showToolbar && <CalenderHeader />}
                {view === 'month' && <CalenderMonthView />}
                {view === 'week' && <DaysOfWeek />}
                {view === 'day' && <CalenderDayView />}
                {view === 'list' && <CalenderListView />}
                {view === 'year' && <CalenderYearView />}
                <EventModal />
            </div>
        </ConfigProvider>
    );
};

export default Calendar;