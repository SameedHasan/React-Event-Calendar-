import React, { useMemo } from 'react';
import useCalendarStore from './store/useCalendarStore';
import { Typography, Tooltip } from 'antd';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { getEventStyle } from './utils/eventColors';
import { isEventOnDay, isAllDayOrMultiDay, formatTime, getDayIndex, getShiftedShortDOW } from './utils/dateHelpers';

dayjs.extend(isoWeek);

const { Text } = Typography;

const TooltipContent = ({ events, day, timeFormat, eventColors }) => (
    <div style={{ padding: '2px 0' }}>
        <div style={{ fontWeight: 700, fontSize: '12px', marginBottom: '8px', color: '#1e293b' }}>
            All Events ({events.length})
        </div>
        {events.map(ev => {
            const cfg = getEventStyle(ev, eventColors);
            const isStartDay = dayjs(ev.start).isSame(day, 'day');
            return (
                <div key={ev.id} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '5px 8px', marginBottom: '4px',
                    background: cfg.bg, borderRadius: '6px', border: `1px solid ${cfg.border}`,
                }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', flex: 1 }}>{ev.title}</span>
                    <span style={{ fontSize: '11px', color: cfg.color, fontWeight: 600 }}>{ev.type}</span>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                        {isStartDay ? formatTime(ev.start, timeFormat) : '← Cont.'}
                    </span>
                </div>
            );
        })}
    </div>
);

const CalenderMonthView = () => {
    const {
        currentDate,
        events,
        startOfWeek,
        timeFormat,
        openCreateModal,
        openEditModal,
        hideWeekends,
        showWeekNumbers,
        onEventClick,
        onDateClick,
        allowDateClick,
        eventColors,
    } = useCalendarStore();
    const today = dayjs();
    const current = dayjs(currentDate);

    const getEventsForDate = (date) =>
        events.filter(ev => isEventOnDay(ev, date))
               .sort((a, b) => new Date(a.start) - new Date(b.start));

    // Build grid: days from startOfWeek of week containing 1st to end of week containing last
    const gridDays = useMemo(() => {
        const firstDay = current.startOf('month');
        const lastDay = current.endOf('month');
        
        const startOffset = getDayIndex(firstDay.toDate(), startOfWeek);
        const gridStart = firstDay.subtract(startOffset, 'day');
        
        const endOffset = 6 - getDayIndex(lastDay.toDate(), startOfWeek);
        const gridEnd = lastDay.add(endOffset, 'day');

        const days = [];
        let d = gridStart;
        while (d.isBefore(gridEnd) || d.isSame(gridEnd, 'day')) {
            days.push(d);
            d = d.add(1, 'day');
        }
        return days;
    }, [currentDate, startOfWeek]);

    // Group gridDays into weeks
    const weeks = useMemo(() => {
        const result = [];
        for (let i = 0; i < gridDays.length; i += 7) {
            result.push(gridDays.slice(i, i + 7));
        }
        return result;
    }, [gridDays]);

    const dow = useMemo(() => {
        const baseDOW = getShiftedShortDOW(startOfWeek);
        if (hideWeekends) {
            return baseDOW.filter(d => d !== 'Sat' && d !== 'Sun');
        }
        return baseDOW;
    }, [startOfWeek, hideWeekends]);

    return (
        <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            {/* Day-of-week header */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: showWeekNumbers 
                    ? `40px repeat(${dow.length}, 1fr)` 
                    : `repeat(${dow.length}, 1fr)`,
                background: 'linear-gradient(135deg, var(--bg-color) 0%, var(--tag-bg) 100%)',
                borderBottom: '1px solid var(--border-color)',
            }}>
                {showWeekNumbers && (
                    <div style={{
                        padding: '12px 0', textAlign: 'center',
                        borderRight: '1px solid var(--border-color)',
                        background: 'var(--bg-color)',
                    }}>
                        <Text style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Wk</Text>
                    </div>
                )}
                {dow.map((d, i) => (
                    <div key={d} style={{
                        padding: '12px 0', textAlign: 'center',
                        borderRight: i < dow.length - 1 ? '1px solid var(--border-color)' : 'none',
                    }}>
                        <Text style={{
                            fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px',
                            textTransform: 'uppercase',
                            color: i >= 5 ? 'var(--text-secondary)' : 'var(--text-primary)',
                        }}>
                            {d}
                        </Text>
                    </div>
                ))}
            </div>

            {/* Day grid divided by weeks */}
            <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--white-color)' }}>
                {weeks.map((week, weekIdx) => {
                    const filteredWeek = hideWeekends
                        ? week.filter(d => d.day() !== 0 && d.day() !== 6)
                        : week;

                    // 1. Get all events overlapping with this week
                    const weekEvents = events.filter(ev =>
                        filteredWeek.some(day => isEventOnDay(ev, day))
                    );

                    // 2. Sort events: multi-day first, then single-day by start time
                    const sortedWeekEvents = [...weekEvents].sort((a, b) => {
                        const isAMulti = dayjs(a.end).diff(dayjs(a.start), 'day') > 0 || isAllDayOrMultiDay(a);
                        const isBMulti = dayjs(b.end).diff(dayjs(b.start), 'day') > 0 || isAllDayOrMultiDay(b);
                        if (isAMulti && !isBMulti) return -1;
                        if (!isAMulti && isBMulti) return 1;
                        return new Date(a.start) - new Date(b.start);
                    });

                    // 3. Assign tracks
                    const tracks = [];
                    const weekEventsWithLayout = sortedWeekEvents.map(event => {
                        let startCol = 0;
                        let endCol = 0;

                        if (dayjs(event.start).isBefore(filteredWeek[0], 'day')) {
                            startCol = 0;
                        } else {
                            startCol = filteredWeek.findIndex(d => d.isSame(dayjs(event.start), 'day'));
                        }

                        if (dayjs(event.end).isAfter(filteredWeek[filteredWeek.length - 1], 'day')) {
                            endCol = filteredWeek.length - 1;
                        } else {
                            endCol = filteredWeek.findIndex(d => d.isSame(dayjs(event.end), 'day'));
                        }

                        if (startCol === -1 || endCol === -1) {
                            return null;
                        }

                        let trackIndex = 0;
                        while (true) {
                            if (!tracks[trackIndex]) {
                                tracks[trackIndex] = [];
                            }
                            const hasOverlap = tracks[trackIndex].some(item =>
                                !(endCol < item.startCol || startCol > item.endCol)
                            );
                            if (!hasOverlap) {
                                tracks[trackIndex].push({ startCol, endCol });
                                break;
                            }
                            trackIndex++;
                        }

                        return {
                            event,
                            track: trackIndex,
                            startCol,
                            endCol
                        };
                    }).filter(Boolean);

                    return (
                        <div key={weekIdx} style={{ display: 'flex', position: 'relative', borderBottom: '1px solid var(--border-color)' }}>
                            {/* Week number column if enabled */}
                            {showWeekNumbers && (
                                <div style={{
                                    width: '40px',
                                    minHeight: '115px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRight: '1px solid var(--border-color)',
                                    background: 'var(--tag-bg)',
                                    flexShrink: 0,
                                }}>
                                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                                        {dayjs(week[0]).isoWeek()}
                                    </span>
                                </div>
                            )}

                            {/* Background columns & Day numbers */}
                            {filteredWeek.map((day, colIdx) => {
                                const isCurrentMonth = day.month() === current.month();
                                const isToday = day.isSame(today, 'day');
                                const isWeekend = day.day() === 0 || day.day() === 6;
                                const dayEvents = getEventsForDate(day);

                                // Find visible events in this column
                                const visibleEvents = weekEventsWithLayout.filter(item =>
                                    item.track < 2 && item.startCol <= colIdx && colIdx <= item.endCol
                                );
                                const hiddenCount = dayEvents.length - visibleEvents.length;

                                return (
                                    <div
                                        key={day.toString()}
                                        onClick={() => {
                                            if (onDateClick) {
                                                const res = onDateClick(day.toDate());
                                                if (res === false) return;
                                            }
                                            if (allowDateClick) {
                                                openCreateModal(day.toDate());
                                            }
                                        }}
                                        style={{
                                            flex: 1,
                                            minHeight: '115px',
                                            padding: '6px',
                                            borderRight: colIdx < filteredWeek.length - 1 ? '1px solid var(--border-color)' : 'none',
                                            background: isToday
                                                ? 'var(--color-active-menu-bg)'
                                                : !isCurrentMonth
                                                    ? 'var(--bg-color)'
                                                    : isWeekend
                                                        ? 'var(--bg-color)'
                                                        : 'var(--white-color)',
                                            transition: 'background 0.15s',
                                            position: 'relative',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            boxSizing: 'border-box',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {/* Day number */}
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', height: '28px', alignItems: 'center' }}>
                                            <div style={{
                                                width: '26px', height: '26px',
                                                borderRadius: '50%',
                                                background: isToday ? 'var(--primary-color)' : 'transparent',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <Text style={{
                                                    fontSize: '13px',
                                                    fontWeight: isToday ? 700 : isCurrentMonth ? 500 : 400,
                                                    color: isToday ? '#fff' : isCurrentMonth ? 'var(--text-primary)' : 'var(--text-secondary)',
                                                }}>
                                                    {day.date()}
                                                </Text>
                                            </div>
                                        </div>

                                        {/* Spacer to push tooltip to bottom */}
                                        <div style={{ flex: 1 }} />

                                        {/* Tooltip "+X more" trigger at the bottom */}
                                        {hiddenCount > 0 && (
                                            <div
                                                onClick={(e) => e.stopPropagation()}
                                                style={{ display: 'flex', justifyContent: 'flex-start', height: '24px', alignItems: 'center' }}
                                            >
                                                <Tooltip
                                                    title={<TooltipContent events={dayEvents} day={day} timeFormat={timeFormat} eventColors={eventColors} />}
                                                    overlayInnerStyle={{ color: 'var(--text-primary)', background: 'var(--white-color)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '10px', minWidth: '220px' }}
                                                    color="var(--white-color)"
                                                    placement="top"
                                                >
                                                    <div style={{
                                                        fontSize: '11px', fontWeight: 600,
                                                        color: 'var(--primary-color)', background: 'var(--color-active-menu-bg)',
                                                        padding: '2px 6px', borderRadius: '5px',
                                                        cursor: 'pointer', display: 'inline-block',
                                                        border: '1px solid color-mix(in srgb, var(--primary-color) 25%, var(--white-color))',
                                                    }}>
                                                        +{hiddenCount} more
                                                    </div>
                                                </Tooltip>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Spanning Event Bars overlay */}
                            <div style={{ position: 'absolute', top: 0, left: showWeekNumbers ? '40px' : 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
                                {weekEventsWithLayout.map(({ event, track, startCol, endCol }) => {
                                    if (track >= 2) return null;

                                    const style = getEventStyle(event, eventColors);
                                    const totalCols = filteredWeek.length;
                                    const leftPct = (startCol / totalCols) * 100;
                                    const widthPct = ((endCol - startCol + 1) / totalCols) * 100;

                                    const isMultiDay = dayjs(event.end).diff(dayjs(event.start), 'day') > 0 || isAllDayOrMultiDay(event);

                                    return (
                                        <div
                                            key={event.id}
                                            style={{
                                                position: 'absolute',
                                                top: `${track * 24 + 38}px`,
                                                left: `calc(${leftPct}% + 4px)`,
                                                width: `calc(${widthPct}% - 8px)`,
                                                height: '20px',
                                                boxSizing: 'border-box',
                                                zIndex: 10,
                                                pointerEvents: 'auto',
                                            }}
                                        >
                                            {isMultiDay ? (
                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (onEventClick) {
                                                            const res = onEventClick(event);
                                                            if (res === false) return;
                                                        }
                                                        openEditModal(event);
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        background: style.bg,
                                                        border: `1px solid ${style.border}`,
                                                        borderLeft: `3px solid ${style.color}`,
                                                        borderRadius: '4px',
                                                        padding: '0 6px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        cursor: 'pointer',
                                                        boxSizing: 'border-box',
                                                    }}
                                                    title={`${event.title} (${event.type})`}
                                                >
                                                    <Text style={{
                                                        fontSize: '11px',
                                                        fontWeight: 700,
                                                        color: '#1e293b',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        flex: 1,
                                                    }}>
                                                        {event.title}
                                                    </Text>
                                                    <span style={{ fontSize: '9px', color: style.color, fontWeight: 700, marginLeft: '4px', flexShrink: 0 }}>
                                                        {event.type}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (onEventClick) {
                                                            const res = onEventClick(event);
                                                            if (res === false) return;
                                                        }
                                                        openEditModal(event);
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        padding: '0 4px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        cursor: 'pointer',
                                                        boxSizing: 'border-box',
                                                        borderRadius: '4px',
                                                        transition: 'background 0.15s',
                                                    }}
                                                onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                title={`${formatTime(event.start, timeFormat)} - ${event.title}`}
                                                >
                                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: style.color, flexShrink: 0 }} />
                                                    <Text style={{
                                                        fontSize: '10px',
                                                        color: style.color,
                                                        fontWeight: 700,
                                                        flexShrink: 0,
                                                    }}>
                                                        {formatTime(event.start, timeFormat)}
                                                    </Text>
                                                    <Text style={{
                                                        fontSize: '11px',
                                                        fontWeight: 600,
                                                        color: '#1e293b',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        flex: 1,
                                                    }}>
                                                        {event.title}
                                                    </Text>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalenderMonthView;
