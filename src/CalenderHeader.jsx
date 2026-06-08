import React, { useMemo } from 'react';
import { Typography } from 'antd';
import {
    LeftOutlined,
    RightOutlined,
    CalendarOutlined,
    UnorderedListOutlined,
    AppstoreOutlined,
    FieldTimeOutlined,
    TableOutlined,
    DownloadOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import useCalendarStore from './store/useCalendarStore';
import { exportEventsToICS } from './utils/icsExport';

dayjs.extend(isoWeek);

const { Text } = Typography;

const VIEWS = [
    { value: 'month',  label: 'Month',  icon: <CalendarOutlined /> },
    { value: 'week',   label: 'Week',   icon: <TableOutlined /> },
    { value: 'day',    label: 'Day',    icon: <FieldTimeOutlined /> },
    { value: 'list',   label: 'List',   icon: <UnorderedListOutlined /> },
    { value: 'year',   label: 'Year',   icon: <AppstoreOutlined /> },
];

function CalendarHeader() {
    const {
        currentDate,
        view,
        weekRange,
        currentDayIndex,
        previousMonth,
        nextMonth,
        previousYear,
        nextYear,
        setView,
        decrementWeek,
        incrementWeek,
        handleNextandPrevDay,
        goToToday,
        events,
        openCreateModal,
    } = useCalendarStore();

    // Navigation handlers per view
    const handlers = useMemo(() => ({
        month: { prev: previousMonth,  next: nextMonth },
        year:  { prev: previousYear,   next: nextYear },
        week:  { prev: decrementWeek,  next: incrementWeek },
        day: {
            prev: () => currentDayIndex > 0
                ? handleNextandPrevDay(currentDayIndex - 1)
                : (handleNextandPrevDay(6), decrementWeek()),
            next: () => currentDayIndex < 6
                ? handleNextandPrevDay(currentDayIndex + 1)
                : (handleNextandPrevDay(0), incrementWeek()),
        },
        list: {
            prev: () => currentDayIndex > 0
                ? handleNextandPrevDay(currentDayIndex - 1)
                : (handleNextandPrevDay(6), decrementWeek()),
            next: () => currentDayIndex < 6
                ? handleNextandPrevDay(currentDayIndex + 1)
                : (handleNextandPrevDay(0), incrementWeek()),
        },
    }), [currentDayIndex, previousMonth, nextMonth, previousYear, nextYear, decrementWeek, incrementWeek, handleNextandPrevDay]);

    // Title text shown in the header centre-left
    const titleContent = useMemo(() => {
        switch (view) {
            case 'month':
                return dayjs(currentDate).format('MMMM YYYY');
            case 'year':
                return dayjs(currentDate).format('YYYY');
            case 'week':
                return weekRange.range || '';
            case 'day':
            case 'list': {
                if (!weekRange.range) return '';
                const monday = dayjs(weekRange.range.split(' - ')[0], 'MMM D, YYYY');
                const day = monday.add(currentDayIndex, 'day');
                return day.format('dddd, MMMM D YYYY');
            }
            default:
                return '';
        }
    }, [view, currentDate, weekRange.range, currentDayIndex]);

    // Sub-label (e.g. "Week 23")
    const subLabel = useMemo(() => {
        if (view === 'week' || view === 'list') return `Week ${weekRange.count}`;
        if (view === 'day') return `Week ${weekRange.count}`;
        return null;
    }, [view, weekRange.count]);

    const nav = handlers[view];

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            padding: '10px 0 18px',
            flexWrap: 'wrap',
        }}>
            {/* ── LEFT: title + today ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                {/* Today button */}
                <button
                    onClick={goToToday}
                    style={{
                        padding: '6px 16px',
                        borderRadius: '8px',
                        border: '1.5px solid #1272bf',
                        background: '#fff',
                        color: '#1272bf',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        letterSpacing: '0.2px',
                        flexShrink: 0,
                        transition: 'all 0.18s ease',
                        lineHeight: '20px',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = '#1272bf';
                        e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = '#fff';
                        e.currentTarget.style.color = '#1272bf';
                    }}
                >
                    Today
                </button>

                {/* Prev / Next */}
                <div style={{ display: 'flex', gap: '4px' }}>
                    {[
                        { handler: nav?.prev, icon: <LeftOutlined style={{ fontSize: '11px' }} /> },
                        { handler: nav?.next, icon: <RightOutlined style={{ fontSize: '11px' }} /> },
                    ].map(({ handler, icon }, i) => (
                        <button
                            key={i}
                            onClick={handler}
                            style={{
                                width: '32px', height: '32px',
                                borderRadius: '8px',
                                border: '1.5px solid #e2e8f0',
                                background: '#fff',
                                color: '#475569',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                flexShrink: 0,
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = '#1272bf';
                                e.currentTarget.style.color = '#1272bf';
                                e.currentTarget.style.background = '#eff6ff';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = '#e2e8f0';
                                e.currentTarget.style.color = '#475569';
                                e.currentTarget.style.background = '#fff';
                            }}
                        >
                            {icon}
                        </button>
                    ))}
                </div>

                {/* Title */}
                <div style={{ minWidth: 0 }}>
                    <div style={{
                        fontSize: view === 'week' ? '18px' : '22px',
                        fontWeight: 800,
                        color: '#0f172a',
                        lineHeight: 1.1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        letterSpacing: '-0.3px',
                        transition: 'font-size 0.2s ease',
                    }}>
                        {titleContent}
                    </div>
                    {subLabel && (
                        <Text style={{
                            fontSize: '11px', fontWeight: 600,
                            color: '#94a3b8', textTransform: 'uppercase',
                            letterSpacing: '0.5px', marginTop: '1px', display: 'block',
                        }}>
                            {subLabel}
                        </Text>
                    )}
                </div>
            </div>

            {/* ── RIGHT: view switcher & export button ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                {/* Add Event button */}
                <button
                    onClick={() => openCreateModal(null)}
                    title="Add new event"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #1272bf',
                        background: '#1272bf',
                        color: '#fff',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.18s ease',
                        lineHeight: '20px',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = '#0e5c9b';
                        e.currentTarget.style.borderColor = '#0e5c9b';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = '#1272bf';
                        e.currentTarget.style.borderColor = '#1272bf';
                    }}
                >
                    <PlusOutlined style={{ fontSize: '14px' }} />
                    <span>Add Event</span>
                </button>

                {/* Export button */}
                <button
                    onClick={() => exportEventsToICS(events, { calendarName: 'React Event Calendar Suite' })}
                    title="Export all events to iCal (.ics)"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        background: '#fff',
                        color: '#475569',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.18s ease',
                        lineHeight: '20px',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.borderColor = '#1272bf';
                        e.currentTarget.style.color = '#1272bf';
                        e.currentTarget.style.background = '#eff6ff';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.borderColor = '#cbd5e1';
                        e.currentTarget.style.color = '#475569';
                        e.currentTarget.style.background = '#fff';
                    }}
                >
                    <DownloadOutlined style={{ fontSize: '14px' }} />
                    <span>Export</span>
                </button>

                {/* View Switcher */}
                <div style={{
                    display: 'flex',
                    background: '#f1f5f9',
                    borderRadius: '10px',
                    padding: '3px',
                    gap: '2px',
                }}>
                    {VIEWS.map(({ value, label, icon }) => {
                        const isActive = view === value;
                        return (
                            <button
                                key={value}
                                onClick={() => setView(value)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    padding: '6px 13px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: isActive ? '#fff' : 'transparent',
                                    color: isActive ? '#1272bf' : '#64748b',
                                    fontSize: '13px',
                                    fontWeight: isActive ? 700 : 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.18s ease',
                                    boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.10)' : 'none',
                                    whiteSpace: 'nowrap',
                                }}
                                onMouseEnter={e => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = '#e2e8f0';
                                        e.currentTarget.style.color = '#334155';
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = '#64748b';
                                    }
                                }}
                            >
                                <span style={{ fontSize: '13px' }}>{icon}</span>
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default CalendarHeader;
