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
        showExportButton,
        showAddEventButton,
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
        list:  { prev: decrementWeek,  next: incrementWeek },
    }), [currentDayIndex, previousMonth, nextMonth, previousYear, nextYear, decrementWeek, incrementWeek, handleNextandPrevDay]);

    // Title text shown in the header centre-left
    const titleContent = useMemo(() => {
        switch (view) {
            case 'month':
                return dayjs(currentDate).format('MMMM YYYY');
            case 'year':
                return dayjs(currentDate).format('YYYY');
            case 'week':
            case 'list':
                return weekRange.range || '';
            case 'day': {
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
                        border: '1.5px solid var(--primary-color)',
                        background: 'var(--white-color)',
                        color: 'var(--primary-color)',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        letterSpacing: '0.2px',
                        flexShrink: 0,
                        transition: 'all 0.18s ease',
                        lineHeight: '20px',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = 'var(--primary-color)';
                        e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'var(--white-color)';
                        e.currentTarget.style.color = 'var(--primary-color)';
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
                                border: '1.5px solid var(--border-color)',
                                background: 'var(--white-color)',
                                color: 'var(--text-secondary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                flexShrink: 0,
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = 'var(--primary-color)';
                                e.currentTarget.style.color = 'var(--primary-color)';
                                e.currentTarget.style.background = 'var(--color-active-menu-bg)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = 'var(--border-color)';
                                e.currentTarget.style.color = 'var(--text-secondary)';
                                e.currentTarget.style.background = 'var(--white-color)';
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
                {showAddEventButton && (
                    <button
                        onClick={() => openCreateModal(null)}
                        title="Add new event"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 14px',
                            borderRadius: '10px',
                            border: '1.5px solid var(--primary-color)',
                            background: 'var(--primary-color)',
                            color: '#fff',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.18s ease',
                            lineHeight: '20px',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'color-mix(in srgb, var(--primary-color) 85%, #000)';
                            e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--primary-color) 85%, #000)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'var(--primary-color)';
                            e.currentTarget.style.borderColor = 'var(--primary-color)';
                        }}
                    >
                        <PlusOutlined style={{ fontSize: '14px' }} />
                        <span>Add Event</span>
                    </button>
                )}

                {/* Export button */}
                {showExportButton && (
                    <button
                        onClick={() => exportEventsToICS(events, { calendarName: 'React Event Calendar Suite' })}
                        title="Export all events to iCal (.ics)"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 14px',
                            borderRadius: '10px',
                            border: '1.5px solid var(--border-color)',
                            background: 'var(--white-color)',
                            color: 'var(--text-secondary)',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.18s ease',
                            lineHeight: '20px',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = 'var(--primary-color)';
                            e.currentTarget.style.color = 'var(--primary-color)';
                            e.currentTarget.style.background = 'var(--color-active-menu-bg)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = 'var(--border-color)';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                            e.currentTarget.style.background = 'var(--white-color)';
                        }}
                    >
                        <DownloadOutlined style={{ fontSize: '14px' }} />
                        <span>Export</span>
                    </button>
                )}

                {/* View Switcher */}
                <div style={{
                    display: 'flex',
                    background: 'var(--bg-color)',
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
                                    background: isActive ? 'var(--white-color)' : 'transparent',
                                    color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)',
                                    fontSize: '13px',
                                    fontWeight: isActive ? 700 : 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.18s ease',
                                    boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.10)' : 'none',
                                    whiteSpace: 'nowrap',
                                }}
                                onMouseEnter={e => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'var(--border-color)';
                                        e.currentTarget.style.color = 'var(--text-primary)';
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = 'var(--text-secondary)';
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
