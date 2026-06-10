import React, { useEffect } from 'react';
import { ConfigProvider } from 'antd';
import { useShallow } from 'zustand/react/shallow';
import './index.css';
import CalenderMonthView from './CalenderMonthView';
import { CalendarStoreProvider, useCalendarStore } from './store/useCalendarStore';
import DaysOfWeek from './DaysOfWeek';
import CalenderDayView from './CalenderDayView';
import CalenderListView from './CalenderListView';
import CalenderYearView from './CalenderYearView';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import EventModal from './EventModal';
import CalendarToolbar from './components/CalendarToolbar';
import CalendarLoadingOverlay from './components/CalendarLoadingOverlay';
import CalendarLiveRegion from './components/CalendarLiveRegion';
import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp';
import { CALENDAR_KEYSHORTCUTS_ATTR } from './utils/a11y';

const CalendarInner = ({
    events = [],
    defaultView = 'month',
    view: controlledView,
    startOfWeek = 'monday',
    timeFormat = '12h',
    categories,
    primaryColor = '#1272bf',
    onAddEvent,
    onUpdateEvent,
    onDeleteEvent,
    currentDate,
    onDateChange,
    onViewChange,
    hideWeekends = false,
    showWeekNumbers = false,
    showToolbar = true,
    showExportButton = false,
    showAddEventButton = true,
    allowDateClick = true,
    readOnly = false,
    eventColors = {},
    theme = 'light',
    onEventClick,
    onDateClick,
    onEventDrop,
    onEventResize,
    disableDrag = false,
    disableResize = false,
    loading = false,
    renderEvent,
    renderEventTooltip,
    renderToolbar,
    renderEmpty,
    className,
    style,
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

    useKeyboardShortcuts();

    useEffect(() => {
        setEvents(events);
    }, [events, setEvents]);

    useEffect(() => {
        setCallbacks({ onAddEvent, onUpdateEvent, onDeleteEvent });
    }, [onAddEvent, onUpdateEvent, onDeleteEvent, setCallbacks]);

    useEffect(() => {
        if (categories) {
            setCategories(categories);
        }
    }, [categories, setCategories]);

    useEffect(() => {
        setConfigs({
            onDateChange,
            onViewChange,
            hideWeekends,
            showWeekNumbers,
            showToolbar,
            showExportButton,
            showAddEventButton: readOnly ? false : showAddEventButton,
            allowDateClick: readOnly ? false : allowDateClick,
            readOnly,
            eventColors,
            theme,
            onEventClick,
            onDateClick,
            onEventDrop,
            onEventResize,
            disableDrag,
            disableResize,
            loading,
            renderEvent,
            renderEventTooltip,
            renderToolbar,
            renderEmpty,
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
        readOnly,
        eventColors,
        theme,
        onEventClick,
        onDateClick,
        onEventDrop,
        onEventResize,
        disableDrag,
        disableResize,
        loading,
        renderEvent,
        renderEventTooltip,
        renderToolbar,
        renderEmpty,
        setConfigs,
    ]);

    const currentDateTime = currentDate?.getTime?.();

    useEffect(() => {
        if (currentDateTime != null) {
            setCurrentDate(currentDate, { notify: false });
        }
    }, [currentDate, currentDateTime, setCurrentDate]);

    useEffect(() => {
        setStartOfWeek(startOfWeek);
    }, [startOfWeek, setStartOfWeek]);

    useEffect(() => {
        setTimeFormat(timeFormat);
    }, [timeFormat, setTimeFormat]);

    useEffect(() => {
        if (controlledView !== undefined) {
            setView(controlledView, { notify: false });
        }
    }, [controlledView, setView]);

    useEffect(() => {
        if (controlledView === undefined && defaultView) {
            setView(defaultView, { notify: false });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const activeView = controlledView ?? view;

    return (
        <ConfigProvider theme={{ token: { colorPrimary: primaryColor } }}>
            <div
                className={['calendar-root', `theme-${theme}`, className].filter(Boolean).join(' ')}
                role="application"
                aria-label="Event calendar"
                aria-keyshortcuts={CALENDAR_KEYSHORTCUTS_ATTR}
                style={{
                    height: '100%',
                    minHeight: 0,
                    overflow: 'auto',
                    backgroundColor: 'var(--white-color)',
                    transition: 'background-color 0.25s ease, color 0.25s ease',
                    '--primary-color': primaryColor,
                    ...style,
                }}
            >
                {showToolbar && <CalendarToolbar />}
                <CalendarLoadingOverlay loading={loading}>
                    {activeView === 'month' && <CalenderMonthView />}
                    {activeView === 'week' && <DaysOfWeek />}
                    {activeView === 'day' && <CalenderDayView />}
                    {activeView === 'list' && <CalenderListView />}
                    {activeView === 'year' && <CalenderYearView />}
                </CalendarLoadingOverlay>
                {!readOnly && <EventModal />}
                <CalendarLiveRegion />
                <KeyboardShortcutsHelp />
            </div>
        </ConfigProvider>
    );
};

const Calendar = ({
    defaultView = 'month',
    ...props
}) => (
    <CalendarStoreProvider defaultView={defaultView}>
        <CalendarInner defaultView={defaultView} {...props} />
    </CalendarStoreProvider>
);

export default Calendar;
