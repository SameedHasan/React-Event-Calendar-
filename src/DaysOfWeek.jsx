import React, { useEffect, useMemo, useRef } from 'react';
import { Typography } from 'antd';
import useCalendarStore from './store/useCalendarStore';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { getEventStyle } from './utils/eventColors';
import { isEventOnDay, isAllDayOrMultiDay, getEventDaySegment } from './utils/dateHelpers';

dayjs.extend(isoWeek);

const { Text } = Typography;

const HOUR_HEIGHT = 56; // px per hour
const START_HOUR = 0;
const TOTAL_HOURS = 24;

const DOW_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const WeekEventBlock = ({ event, dayStart }) => {
    const cfg = getEventStyle(event);
    const segment = getEventDaySegment(event, dayStart);
    if (!segment) return null;

    const startMinutes = segment.start.hour() * 60 + segment.start.minute() - START_HOUR * 60;
    const top = (startMinutes / 60) * HOUR_HEIGHT;
    const height = Math.max((segment.durationMinutes / 60) * HOUR_HEIGHT, 22);

    return (
        <div style={{
            position: 'absolute',
            top: `${top}px`,
            left: '3px', right: '3px',
            height: `${height}px`,
            background: cfg.bg,
            border: `1px solid ${cfg.border}`,
            borderLeft: `3px solid ${cfg.color}`,
            borderRadius: '6px',
            padding: '3px 5px',
            overflow: 'hidden',
            cursor: 'pointer',
            zIndex: 2,
            transition: 'all 0.15s ease',
            boxSizing: 'border-box',
        }}
        onMouseEnter={e => {
            e.currentTarget.style.boxShadow = `0 2px 10px ${cfg.color}40`;
            e.currentTarget.style.zIndex = '10';
        }}
        onMouseLeave={e => {
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
                <Text style={{ fontSize: '10px', color: '#64748b', display: 'block', marginTop: '2px' }}>
                    {dayjs(event.start).format('h:mm')}–{dayjs(event.end).format('h:mm A')}
                </Text>
            )}
        </div>
    );
};

const DaysOfWeek = () => {
    const { weekRange, currentWeek, setWeekRange, events } = useCalendarStore();
    const today = dayjs();
    const containerRef = useRef(null);

    const weekDays = useMemo(() => {
        const monday = dayjs(currentWeek).isoWeekday(1);
        return Array.from({ length: 7 }, (_, i) => monday.add(i, 'day'));
    }, [currentWeek]);

    useEffect(() => {
        const weekNumber = dayjs(currentWeek).isoWeek();
        const start = weekDays[0].format('MMM D, YYYY');
        const end = weekDays[6].format('MMM D, YYYY');
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

    const monday = weekDays[0];

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
            const startCol = dayjs(event.start).isBefore(monday, 'day')
                ? 0
                : dayjs(event.start).diff(monday, 'day');
            const endCol = dayjs(event.end).isAfter(weekDays[6], 'day')
                ? 6
                : dayjs(event.end).diff(monday, 'day');

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
        });

        return {
            allDayEventsWithLayout: layout,
            allDayTracks: tracks
        };
    }, [events, weekDays, monday, hasAllDayEvents]);

    // Current time indicator
    const now = dayjs();
    const currentTimeTop = (now.hour() + now.minute() / 60 - START_HOUR) * HOUR_HEIGHT;
    const isCurrentWeek = weekDays.some(d => d.isSame(today, 'day'));
    const todayColIndex = weekDays.findIndex(d => d.isSame(today, 'day'));

    const TIME_GUTTER = 56; // width of time column in px

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 180px)', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            {/* Sticky header row */}
            <div style={{
                display: 'flex', flexShrink: 0,
                background: 'linear-gradient(135deg, #f8fafc 0%, #f0f7ff 100%)',
                borderBottom: '2px solid #e2e8f0',
            }}>
                {/* Gutter */}
                <div style={{ width: `${TIME_GUTTER}px`, flexShrink: 0, borderRight: '1px solid #e2e8f0' }} />
                {/* Day columns */}
                {weekDays.map((day, i) => {
                    const isToday = day.isSame(today, 'day');
                    const isWeekend = day.isoWeekday() >= 6;
                    return (
                        <div key={i} style={{
                            flex: 1, padding: '10px 4px', textAlign: 'center',
                            borderRight: i < 6 ? '1px solid #e2e8f0' : 'none',
                            background: isToday ? '#eff6ff' : 'transparent',
                        }}>
                            <Text style={{
                                fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
                                letterSpacing: '0.4px', display: 'block',
                                color: isToday ? '#1272bf' : isWeekend ? '#94a3b8' : '#64748b',
                            }}>
                                {DOW_SHORT[i]}
                            </Text>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '50%', margin: '4px auto 0',
                                background: isToday ? '#1272bf' : 'transparent',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Text style={{
                                    fontSize: '16px', fontWeight: isToday ? 700 : 500,
                                    color: isToday ? '#fff' : isWeekend ? '#94a3b8' : '#1e293b',
                                }}>
                                    {day.format('D')}
                                </Text>
                            </div>
                            <Text style={{ fontSize: '10px', color: isToday ? '#1272bf' : '#94a3b8', display: 'block', marginTop: '1px' }}>
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
                <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', flexShrink: 0, position: 'relative' }}>
                    <div style={{ width: `${TIME_GUTTER}px`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #e2e8f0' }}>
                        <Text style={{ fontSize: '9px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1 }}>All-day</Text>
                    </div>

                    <div style={{ flex: 1, position: 'relative', height: `${allDayTracks.length * 28 + 12}px` }}>
                        {/* Background Column Dividers */}
                        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, display: 'flex', pointerEvents: 'none' }}>
                            {Array.from({ length: 7 }).map((_, idx) => (
                                <div key={idx} style={{ flex: 1, borderRight: idx < 6 ? '1px solid #e2e8f0' : 'none' }} />
                            ))}
                        </div>

                        {/* Spanning Event Bars */}
                        {allDayEventsWithLayout.map(({ event, track, startCol, endCol }) => {
                            const style = getEventStyle(event);
                            const leftPct = (startCol / 7) * 100;
                            const widthPct = ((endCol - startCol + 1) / 7) * 100;

                            return (
                                <div
                                    key={event.id}
                                    style={{
                                        position: 'absolute',
                                        top: `${track * 28 + 6}px`,
                                        left: `calc(${leftPct}% + 4px)`,
                                        width: `calc(${widthPct}% - 8px)`,
                                        height: '22px',
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
                                        zIndex: 10,
                                    }}
                                    title={`${event.title} - ${event.description || ''}`}
                                >
                                    <Text style={{
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        color: '#1e293b',
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
                            );
                        })}
                    </div>
                    {/* Scrollbar spacer to align with body */}
                    <div style={{ width: '8px', flexShrink: 0 }} />
                </div>
            )}

            {/* Scrollable grid body */}
            <div ref={containerRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', position: 'relative', background: '#fff' }}>
                <div style={{ display: 'flex', position: 'relative', height: `${TOTAL_HOURS * HOUR_HEIGHT}px` }}>
                    {/* Time gutter */}
                    <div style={{ width: `${TIME_GUTTER}px`, flexShrink: 0, position: 'relative', borderRight: '1px solid #e2e8f0' }}>
                        {Array.from({ length: TOTAL_HOURS }, (_, h) => (
                            <div key={h} style={{
                                position: 'absolute', top: `${h * HOUR_HEIGHT - 8}px`,
                                right: '8px', width: '40px', textAlign: 'right',
                            }}>
                                <Text style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8' }}>
                                    {h === 0 ? '' : dayjs().hour(h).minute(0).format('h A')}
                                </Text>
                            </div>
                        ))}
                    </div>

                    {/* Day columns */}
                    {weekDays.map((day, colIdx) => {
                        const isToday = day.isSame(today, 'day');
                        const isWeekend = day.isoWeekday() >= 6;
                        const dayEvents = getEventsForDay(day);
                        return (
                            <div key={colIdx} style={{
                                flex: 1, position: 'relative',
                                borderRight: colIdx < 6 ? '1px solid #f1f5f9' : 'none',
                                background: isToday ? '#fafeff' : isWeekend ? '#fdfcff' : '#fff',
                            }}>
                                {/* Hour grid lines */}
                                {Array.from({ length: TOTAL_HOURS }, (_, h) => (
                                    <div key={h} style={{
                                        position: 'absolute', top: `${h * HOUR_HEIGHT}px`,
                                        left: 0, right: 0,
                                        borderTop: h === 0 ? 'none' : '1px solid #f1f5f9',
                                    }} />
                                ))}
                                {/* Half-hour lines */}
                                {Array.from({ length: TOTAL_HOURS }, (_, h) => (
                                    <div key={`half-${h}`} style={{
                                        position: 'absolute', top: `${h * HOUR_HEIGHT + HOUR_HEIGHT / 2}px`,
                                        left: '8px', right: 0,
                                        borderTop: '1px dashed #f1f5f9',
                                    }} />
                                ))}
                                {/* Events */}
                                {dayEvents.map(ev => (
                                    <WeekEventBlock key={ev.id} event={ev} dayStart={day} />
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
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DaysOfWeek;
