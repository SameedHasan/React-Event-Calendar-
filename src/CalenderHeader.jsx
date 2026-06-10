import React, { useMemo, useRef } from 'react';
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
    UploadOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { tzLabel } from './utils/tz';
import useCalendarStore from './store/useCalendarStore';
import { exportEventsToICS } from './utils/icsExport';
import { parseICSFile } from './utils/icsImport';
import useLocaleAware from './hooks/useLocaleAware';
import { getViewLabel, formatWeekLabel } from './utils/locale';

dayjs.extend(isoWeek);

const { Text } = Typography;

const VIEW_ICONS = {
    month: <CalendarOutlined />,
    week: <TableOutlined />,
    day: <FieldTimeOutlined />,
    list: <UnorderedListOutlined />,
    year: <AppstoreOutlined />,
};

const VIEW_VALUES = ['month', 'week', 'day', 'list', 'year'];

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
        sourceEvents,
        openCreateModal,
        showExportButton,
        showImportButton,
        showAddEventButton,
        importEvents,
        timezone,
    } = useCalendarStore();

    const importInputRef = useRef(null);

    const { localeReady, locale } = useLocaleAware();

    const views = useMemo(
        () => {
            void localeReady;
            return VIEW_VALUES.map((value) => ({
                value,
                label: getViewLabel(value, locale),
                icon: VIEW_ICONS[value],
            }));
        },
        [locale, localeReady]
    );

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
        void localeReady;
        switch (view) {
            case 'month':
                return dayjs(currentDate).format('MMMM YYYY');
            case 'year':
                return dayjs(currentDate).format('YYYY');
            case 'week':
            case 'list':
                return weekRange.range || '';
            case 'day': {
                if (!weekRange.startDate) return '';
                const day = dayjs(weekRange.startDate).add(currentDayIndex, 'day');
                return day.format('dddd, MMMM D YYYY');
            }
            default:
                return '';
        }
    }, [view, currentDate, weekRange.range, weekRange.startDate, currentDayIndex, localeReady]);

    // Sub-label (e.g. "Week 23")
    const subLabel = useMemo(() => {
        void localeReady;
        if (view === 'week' || view === 'list' || view === 'day') {
            return formatWeekLabel(weekRange.count, locale);
        }
        return null;
    }, [view, weekRange.count, locale, localeReady]);

    const nav = handlers[view];

    return (
        <div
            role="toolbar"
            aria-label="Calendar navigation"
            style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            padding: '10px 0 18px',
            flexWrap: 'wrap',
        }}
        >
            {/* ── LEFT: title + today ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                {/* Today button */}
                <button
                    type="button"
                    onClick={goToToday}
                    aria-label="Go to today"
                    aria-keyshortcuts="T"
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
                        { handler: nav?.prev, icon: <LeftOutlined style={{ fontSize: '11px' }} />, label: 'Previous period', shortcut: 'ArrowLeft' },
                        { handler: nav?.next, icon: <RightOutlined style={{ fontSize: '11px' }} />, label: 'Next period', shortcut: 'ArrowRight' },
                    ].map(({ handler, icon, label, shortcut }, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={handler}
                            aria-label={label}
                            aria-keyshortcuts={shortcut}
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
                <div style={{ minWidth: 0 }} aria-live="off">
                    <div
                        aria-current="date"
                        style={{
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
                    {timezone && (
                        <Text style={{
                            fontSize: '10px', fontWeight: 500,
                            color: '#94a3b8', letterSpacing: '0.2px',
                            marginTop: '2px', display: 'block',
                        }}
                            title={tzLabel(timezone)}
                        >
                            {tzLabel(timezone)}
                        </Text>
                    )}
                </div>
            </div>

            {/* ── RIGHT: view switcher & export button ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                {/* Add Event button */}
                {showAddEventButton && (
                    <button
                        type="button"
                        onClick={() => openCreateModal(null)}
                        title="Add new event"
                        aria-label="Add new event"
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

                {/* Import button */}
                {showImportButton && (
                    <>
                        <input
                            ref={importInputRef}
                            type="file"
                            accept=".ics,text/calendar"
                            style={{ display: 'none' }}
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                e.target.value = '';
                                if (!file) return;
                                const parsed = await parseICSFile(file);
                                importEvents(parsed);
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => importInputRef.current?.click()}
                            title="Import events from iCal (.ics)"
                            aria-label="Import events from iCal"
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
                            <UploadOutlined style={{ fontSize: '14px' }} />
                            <span>Import</span>
                        </button>
                    </>
                )}

                {/* Export button */}
                {showExportButton && (
                    <button
                        type="button"
                        onClick={() => exportEventsToICS(sourceEvents, { calendarName: 'React Event Calendar Suite', timezone })}
                        title="Export all events to iCal (.ics)"
                        aria-label="Export all events to iCal"
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
                <div
                    role="tablist"
                    aria-label="Calendar views"
                    style={{
                    display: 'flex',
                    background: 'var(--bg-color)',
                    borderRadius: '10px',
                    padding: '3px',
                    gap: '2px',
                }}
                >
                    {views.map(({ value, label, icon }) => {
                        const isActive = view === value;
                        const shortcut = value === 'month' ? 'M' : value === 'week' ? 'W' : value === 'day' ? 'D' : value === 'list' ? 'L' : 'Y';
                        return (
                            <button
                                key={value}
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                aria-label={`${label} view`}
                                aria-keyshortcuts={shortcut}
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
