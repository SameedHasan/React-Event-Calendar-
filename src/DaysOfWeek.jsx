import React, { useEffect, useMemo, useRef } from 'react';
import { Typography } from 'antd';
import useCalendarStore from './store/useCalendarStore';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { getEventStyle } from './utils/eventColors';
import { isEventOnDay, isAllDayOrMultiDay, getEventDaySegment, formatTime, formatHourLabel, getDayIndex } from './utils/dateHelpers';
import EventRenderer from './components/EventRenderer';
import CalendarViewEmpty from './components/CalendarViewEmpty';
import DraggableTimedEvent from './components/DraggableTimedEvent';
import DraggableSpanEvent from './components/DraggableSpanEvent';
import DroppableDayColumn from './components/DroppableDayColumn';
import CalendarDndProvider from './components/CalendarDndProvider';

dayjs.extend(isoWeek);

const { Text } = Typography;

const HOUR_HEIGHT = 56; // px per hour
const START_HOUR = 0;
const TOTAL_HOURS = 24;

const WeekEventBlock = ({ event, dayStart, timeFormat }) => {
    const { eventColors } = useCalendarStore();
    const cfg = getEventStyle(event, eventColors);
    const segment = getEventDaySegment(event, dayStart);
    if (!segment) return null;

    const startMinutes = segment.start.hour() * 60 + segment.start.minute() - START_HOUR * 60;
    const top = (startMinutes / 60) * HOUR_HEIGHT;
    const height = Math.max((segment.durationMinutes / 60) * HOUR_HEIGHT, 22);

    const shellStyle = {
        position: 'absolute',
        top: `${top}px`,
        left: '3px',
        right: '3px',
        height: `${height}px`,
        zIndex: 2,
        boxSizing: 'border-box',
    };

    const chromeStyle = {
        height: '100%',
        width: '100%',
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderLeft: `3px solid ${cfg.color}`,
        borderRadius: '6px',
        padding: '3px 5px',
        overflow: 'hidden',
        cursor: 'pointer',
        boxSizing: 'border-box',
        transition: 'all 0.15s ease',
    };

    return (
        <DraggableTimedEvent
            event={event}
            anchorDay={dayStart}
            hourHeight={HOUR_HEIGHT}
            style={shellStyle}
        >
            <EventRenderer
                event={event}
                view="week"
                date={dayStart}
                wrapperStyle={shellStyle}
            >
                {({ onClick }) => (
                    <div
                        style={chromeStyle}
                        onClick={onClick}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = `0 2px 10px ${cfg.color}40`;
                            e.currentTarget.style.zIndex = '10';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.zIndex = '2';
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', lineHeight: 1 }}>
                            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
                            <Text style={{
                                fontSize: '11px', fontWeight: 700, color: cfg.color,
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>
                                {event.title}
                            </Text>
                        </div>
                        {height > 36 && (
                            <Text style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>
                                {formatTime(event.start, timeFormat)}–{formatTime(event.end, timeFormat)}
                            </Text>
                        )}
                    </div>
                )}
            </EventRenderer>
        </DraggableTimedEvent>
    );
};

const DaysOfWeek = () => {
    const {
        currentWeek,
        setWeekRange,
        events,
        startOfWeek,
        timeFormat,
        openCreateModal,
        hideWeekends,
        onDateClick,
        allowDateClick,
        eventColors,
    } = useCalendarStore();
    const today = dayjs();
    const containerRef = useRef(null);

    const weekDays = useMemo(() => {
        const startDay = dayjs(currentWeek).subtract(getDayIndex(dayjs(currentWeek).toDate(), startOfWeek), 'day');
        const baseDays = Array.from({ length: 7 }, (_, i) => startDay.add(i, 'day'));
        if (hideWeekends) {
            return baseDays.filter(d => d.day() !== 0 && d.day() !== 6);
        }
        return baseDays;
    }, [currentWeek, startOfWeek, hideWeekends]);

    useEffect(() => {
        const weekNumber = dayjs(currentWeek).isoWeek();
        const start = weekDays[0].format('MMM D, YYYY');
        const end = weekDays[weekDays.length - 1].format('MMM D, YYYY');
        setWeekRange({ count: weekNumber, range: `${start} - ${end}` });
    }, [currentWeek, setWeekRange, weekDays]);

    // Scroll to 7 AM on mount
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = 7 * HOUR_HEIGHT - 20;
        }
    }, []);

    const getEventsForDay = (day) =>
        events.filter(ev => isEventOnDay(ev, day) && !isAllDayOrMultiDay(ev))
               .sort((a, b) => new Date(a.start) - new Date(b.start));

    const hasAllDayEvents = useMemo(() => {
        return events.some(ev => isAllDayOrMultiDay(ev) && weekDays.some(day => isEventOnDay(ev, day)));
    }, [events, weekDays]);

    const weekHasEvents = useMemo(
        () => events.some((ev) => weekDays.some((day) => isEventOnDay(ev, day))),
        [events, weekDays]
    );

    const startOfWeekDay = weekDays[0];

    const { allDayEventsWithLayout, allDayTracks } = useMemo(() => {
        if (!hasAllDayEvents) {
            return { allDayEventsWithLayout: [], allDayTracks: [] };
        }
        // 1. Get all-day events overlapping with this week
        const weekAllDayEvents = events.filter(ev =>
            isAllDayOrMultiDay(ev) && weekDays.some(day => isEventOnDay(ev, day))
        );

        // 2. Sort by start date (earlier start goes first) and then by duration (longer first)
        const sorted = [...weekAllDayEvents].sort((a, b) => {
            const diffStart = dayjs(a.start).diff(dayjs(b.start));
            if (diffStart !== 0) return diffStart;
            return dayjs(b.end).diff(dayjs(b.start)) - dayjs(a.end).diff(dayjs(a.start));
        });

        // 3. Assign tracks
        const tracks = [];
        const layout = sorted.map(event => {
            let startCol = 0;
            let endCol = 0;

            if (dayjs(event.start).isBefore(startOfWeekDay, 'day')) {
                startCol = 0;
            } else {
                startCol = weekDays.findIndex(d => d.isSame(dayjs(event.start), 'day'));
            }

            if (dayjs(event.end).isAfter(weekDays[weekDays.length - 1], 'day')) {
                endCol = weekDays.length - 1;
            } else {
                endCol = weekDays.findIndex(d => d.isSame(dayjs(event.end), 'day'));
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

        return {
            allDayEventsWithLayout: layout,
            allDayTracks: tracks
        };
    }, [events, weekDays, startOfWeekDay, hasAllDayEvents]);

    // Current time indicator
    const now = dayjs();
    const currentTimeTop = (now.hour() + now.minute() / 60 - START_HOUR) * HOUR_HEIGHT;

    const TIME_GUTTER = 56; // width of time column in px

    return (
        <CalendarDndProvider>
        <div
            role="grid"
            aria-label="Week calendar"
            style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 180px)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
        >
            {/* Sticky header row */}
            <div
                role="row"
                style={{
                display: 'flex', flexShrink: 0,
                background: 'linear-gradient(135deg, var(--bg-color) 0%, var(--tag-bg) 100%)',
                borderBottom: '2px solid var(--border-color)',
            }}
            >
                {/* Gutter */}
                <div role="columnheader" aria-hidden="true" style={{ width: `${TIME_GUTTER}px`, flexShrink: 0, borderRight: '1px solid var(--border-color)' }} />
                {/* Day columns */}
                {weekDays.map((day, i) => {
                    const isToday = day.isSame(today, 'day');
                    const isWeekend = day.day() === 0 || day.day() === 6;
                    return (
                        <div
                            key={i}
                            role="columnheader"
                            aria-selected={isToday}
                            aria-label={day.format('dddd, MMMM D, YYYY')}
                            style={{
                            flex: 1, padding: '10px 4px', textAlign: 'center',
                            borderRight: i < weekDays.length - 1 ? '1px solid var(--border-color)' : 'none',
                            background: isToday ? 'var(--color-active-menu-bg)' : 'transparent',
                        }}>
                            <Text style={{
                                fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
                                letterSpacing: '0.4px', display: 'block',
                                color: isToday ? 'var(--primary-color)' : isWeekend ? 'var(--text-secondary)' : 'var(--text-primary)',
                            }}>
                                {day.format('ddd')}
                            </Text>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '50%', margin: '4px auto 0',
                                background: isToday ? 'var(--primary-color)' : 'transparent',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Text style={{
                                    fontSize: '16px', fontWeight: isToday ? 700 : 500,
                                    color: isToday ? '#fff' : isWeekend ? 'var(--text-secondary)' : 'var(--text-primary)',
                                }}>
                                    {day.format('D')}
                                </Text>
                            </div>
                            <Text style={{ fontSize: '10px', color: isToday ? 'var(--primary-color)' : 'var(--text-secondary)', display: 'block', marginTop: '1px' }}>
                                {day.format('MMM')}
                            </Text>
                        </div>
                    );
                })}
                {/* Scrollbar spacer to align with body */}
                <div style={{ width: '8px', flexShrink: 0 }} />
            </div>

            {/* All-Day Events row */}
            {hasAllDayEvents && (
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-color)', flexShrink: 0, position: 'relative' }}>
                    <div style={{ width: `${TIME_GUTTER}px`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid var(--border-color)' }}>
                        <Text style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1 }}>All-day</Text>
                    </div>

                    <div style={{ flex: 1, position: 'relative', height: `${allDayTracks.length * 28 + 12}px` }}>
                        {/* Droppable day targets for span move / resize */}
                        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, display: 'flex', zIndex: 1 }}>
                            {weekDays.map((day, idx) => (
                                <DroppableDayColumn
                                    key={day.format('YYYY-MM-DD')}
                                    day={day}
                                    style={{
                                        flex: 1,
                                        borderRight: idx < weekDays.length - 1 ? '1px solid var(--border-color)' : 'none',
                                    }}
                                />
                            ))}
                        </div>

                        {/* Spanning Event Bars */}
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 2 }}>
                        {allDayEventsWithLayout.map(({ event, track, startCol, endCol }) => {
                            const style = getEventStyle(event, eventColors);
                            const leftPct = (startCol / weekDays.length) * 100;
                            const widthPct = ((endCol - startCol + 1) / weekDays.length) * 100;
                            const contextDay = weekDays[startCol];

                            const shellStyle = {
                                position: 'absolute',
                                top: `${track * 28 + 6}px`,
                                left: `calc(${leftPct}% + 4px)`,
                                width: `calc(${widthPct}% - 8px)`,
                                height: '22px',
                                boxSizing: 'border-box',
                                pointerEvents: 'auto',
                                zIndex: 10,
                            };

                            const chromeStyle = {
                                width: '100%',
                                height: '100%',
                                background: style.bg,
                                border: `1px solid ${style.border}`,
                                borderLeft: `4px solid ${style.color}`,
                                borderRadius: '4px',
                                padding: '0 8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                boxSizing: 'border-box',
                                cursor: 'pointer',
                            };

                            return (
                                <DraggableSpanEvent
                                    key={`${event.id}-allday-${startCol}`}
                                    event={event}
                                    anchorDay={contextDay}
                                    instanceKey={`w-allday-${startCol}`}
                                    style={shellStyle}
                                >
                                    <EventRenderer
                                        event={event}
                                        view="week"
                                        date={contextDay.toDate()}
                                        wrapperStyle={chromeStyle}
                                    >
                                        {({ onClick }) => (
                                            <div
                                                onClick={onClick}
                                                style={chromeStyle}
                                                title={`${event.title} - ${event.description || ''}`}
                                            >
                                                <Text style={{
                                                    fontSize: '11px',
                                                    fontWeight: 700,
                                                    color: 'var(--text-primary)',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}>
                                                    {event.title}
                                                </Text>
                                                <span style={{ fontSize: '10px', color: style.color, fontWeight: 700, flexShrink: 0, marginLeft: '6px' }}>
                                                    {event.type}
                                                </span>
                                            </div>
                                        )}
                                    </EventRenderer>
                                </DraggableSpanEvent>
                            );
                        })}
                        </div>
                    </div>
                    {/* Scrollbar spacer to align with body */}
                    <div style={{ width: '8px', flexShrink: 0 }} />
                </div>
            )}

            {/* Scrollable grid body */}
            <div ref={containerRef} role="rowgroup" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', position: 'relative', background: 'var(--white-color)' }}>
                <CalendarViewEmpty view="week" isEmpty={!weekHasEvents} />
                <div role="row" style={{ display: 'flex', position: 'relative', height: `${TOTAL_HOURS * HOUR_HEIGHT}px` }}>
                    {/* Time gutter */}
                    <div style={{ width: `${TIME_GUTTER}px`, flexShrink: 0, position: 'relative', borderRight: '1px solid var(--border-color)' }}>
                        {Array.from({ length: TOTAL_HOURS }, (_, h) => (
                            <div key={h} style={{
                                position: 'absolute', top: `${h * HOUR_HEIGHT - 8}px`,
                                right: '8px', width: '40px', textAlign: 'right',
                            }}>
                                <Text style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                    {h === 0 ? '' : formatHourLabel(h, timeFormat)}
                                </Text>
                            </div>
                        ))}
                    </div>

                    {/* Day columns */}
                    {weekDays.map((day, colIdx) => {
                        const isToday = day.isSame(today, 'day');
                        const isWeekend = day.day() === 0 || day.day() === 6;
                        const dayEvents = getEventsForDay(day);
                        return (
                            <DroppableDayColumn
                                key={colIdx}
                                day={day}
                                role="gridcell"
                                aria-selected={isToday}
                                aria-label={day.format('dddd, MMMM D, YYYY')}
                                onClick={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const y = e.clientY - rect.top;
                                    const clickedHour = Math.max(0, Math.min(23, Math.floor(y / HOUR_HEIGHT)));
                                    const prepopulated = dayjs(day).hour(clickedHour).minute(0);
                                    if (onDateClick) {
                                        const res = onDateClick(prepopulated.toDate());
                                        if (res === false) return;
                                    }
                                    if (allowDateClick) {
                                        openCreateModal(prepopulated.toDate());
                                    }
                                }}
                                style={{
                                    flex: 1, position: 'relative',
                                    borderRight: colIdx < weekDays.length - 1 ? '1px solid var(--border-color)' : 'none',
                                    background: isToday ? 'var(--color-active-menu-bg)' : isWeekend ? 'var(--bg-color)' : 'var(--white-color)',
                                    cursor: 'pointer',
                                }}
                            >
                                {/* Hour grid lines */}
                                {Array.from({ length: TOTAL_HOURS }, (_, h) => (
                                    <div key={h} style={{
                                        position: 'absolute', top: `${h * HOUR_HEIGHT}px`,
                                        left: 0, right: 0,
                                        borderTop: h === 0 ? 'none' : '1px solid var(--border-color)',
                                    }} />
                                ))}
                                {/* Half-hour lines */}
                                {Array.from({ length: TOTAL_HOURS }, (_, h) => (
                                    <div key={`half-${h}`} style={{
                                        position: 'absolute', top: `${h * HOUR_HEIGHT + HOUR_HEIGHT / 2}px`,
                                        left: '8px', right: 0,
                                        borderTop: '1px dashed var(--border-color)',
                                    }} />
                                ))}
                                {/* Events */}
                                {dayEvents.map(ev => (
                                    <WeekEventBlock key={ev.id} event={ev} dayStart={day} timeFormat={timeFormat} />
                                ))}
                                {/* Current time line for today */}
                                {isToday && (
                                    <div style={{
                                        position: 'absolute', top: `${currentTimeTop}px`,
                                        left: 0, right: 0, zIndex: 5,
                                        display: 'flex', alignItems: 'center',
                                    }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', flexShrink: 0, marginLeft: '-4px' }} />
                                        <div style={{ flex: 1, height: '2px', background: '#ef4444' }} />
                                    </div>
                                )}
                            </DroppableDayColumn>
                        );
                    })}
                </div>
            </div>
        </div>
        </CalendarDndProvider>
    );
};

export default DaysOfWeek;
