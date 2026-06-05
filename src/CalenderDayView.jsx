import React, { useEffect, useMemo, useRef } from 'react';
import { Typography, Tag } from 'antd';
import useCalendarStore from './store/useCalendarStore';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { ClockCircleOutlined } from '@ant-design/icons';
import { getEventStyle } from './utils/eventColors';
import { isEventOnDay, isAllDayOrMultiDay, getEventDaySegment, formatTime, formatHourLabel, getDayIndex } from './utils/dateHelpers';

dayjs.extend(isoWeek);

const { Text } = Typography;

const HOUR_HEIGHT = 64; // px per hour
const START_HOUR = 0;
const TOTAL_HOURS = 24;

const DayEventBlock = ({ event, currentDate, timeFormat }) => {
    const cfg = getEventStyle(event);
    const segment = getEventDaySegment(event, currentDate);
    if (!segment) return null;

    const startMin = segment.start.hour() * 60 + segment.start.minute();
    const top = ((startMin - START_HOUR * 60) / 60) * HOUR_HEIGHT;
    const height = Math.max((segment.durationMinutes / 60) * HOUR_HEIGHT, 28);
    const durationMin = segment.durationMinutes;
    const durationStr = durationMin >= 60
        ? `${Math.floor(durationMin / 60)}h${durationMin % 60 > 0 ? ` ${durationMin % 60}m` : ''}`
        : `${durationMin}m`;
    const isCompact = height < 52;

    return (
        <div
            style={{
                position: 'absolute',
                top: `${top}px`,
                left: '8px', right: '8px',
                height: `${height}px`,
                background: cfg.bg,
                border: `1px solid ${cfg.border}`,
                borderLeft: `4px solid ${cfg.color}`,
                borderRadius: '8px',
                padding: isCompact ? '4px 8px' : '8px 12px',
                overflow: 'hidden',
                cursor: 'pointer',
                zIndex: 2,
                boxSizing: 'border-box',
                transition: 'all 0.18s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '3px',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.boxShadow = `0 4px 16px ${cfg.color}35`;
                e.currentTarget.style.transform = 'scale(1.005)';
                e.currentTarget.style.zIndex = '10';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.zIndex = '2';
            }}
        >
            {/* Title row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                <div style={{
                    width: isCompact ? '7px' : '9px', height: isCompact ? '7px' : '9px',
                    borderRadius: '50%', background: cfg.color, flexShrink: 0,
                }} />
                <Text style={{
                    fontSize: isCompact ? '12px' : '14px',
                    fontWeight: 700, color: '#1e293b',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    flex: 1,
                }}>
                    {event.title}
                </Text>
                {!isCompact && (
                    <Tag style={{
                        margin: 0, fontSize: '10px', borderRadius: '6px', flexShrink: 0,
                        background: cfg.bg, borderColor: cfg.border, color: cfg.color, fontWeight: 600,
                    }}>
                        {event.type}
                    </Tag>
                )}
            </div>

            {/* Time + duration row */}
            {!isCompact && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ClockCircleOutlined style={{ fontSize: '11px', color: '#94a3b8' }} />
                        <Text style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
                            {formatTime(event.start, timeFormat)} – {formatTime(event.end, timeFormat)}
                        </Text>
                    </div>
                    <Text style={{ fontSize: '10px', color: '#94a3b8' }}>· {durationStr}</Text>
                </div>
            )}

            {/* Description row */}
            {height > 80 && event.description && (
                <Text style={{
                    fontSize: '11px', color: '#64748b',
                    overflow: 'hidden', textOverflow: 'ellipsis',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                }}>
                    {event.description}
                </Text>
            )}
        </div>
    );
};

const CalenderDayView = () => {
    const { weekRange, currentWeek, currentDayIndex, setWeekRange, events, startOfWeek, timeFormat } = useCalendarStore();
    const containerRef = useRef(null);

    // Get the actual date for the current day in the week
    const currentDate = useMemo(() => {
        const startDay = dayjs(currentWeek).subtract(getDayIndex(dayjs(currentWeek).toDate(), startOfWeek), 'day');
        return startDay.add(currentDayIndex, 'day');
    }, [currentWeek, currentDayIndex, startOfWeek]);

    useEffect(() => {
        const weekNumber = dayjs(currentWeek).isoWeek();
        const startDay = dayjs(currentWeek).subtract(getDayIndex(dayjs(currentWeek).toDate(), startOfWeek), 'day');
        const start = startDay.format('MMM D, YYYY');
        const end = startDay.add(6, 'day').format('MMM D, YYYY');
        setWeekRange({ count: weekNumber, range: `${start} - ${end}` });
    }, [setWeekRange, currentWeek, startOfWeek]);

    // Scroll to 7 AM
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = 7 * HOUR_HEIGHT - 24;
        }
    }, []);

    const today = dayjs();
    const isToday = currentDate.isSame(today, 'day');

    const dayEvents = useMemo(() =>
        events
            .filter(ev => isEventOnDay(ev, currentDate) && !isAllDayOrMultiDay(ev))
            .sort((a, b) => new Date(a.start) - new Date(b.start)),
        [currentDate, events]
    );

    const allDayEvents = useMemo(() =>
        events.filter(ev => isEventOnDay(ev, currentDate) && isAllDayOrMultiDay(ev)),
        [currentDate, events]
    );

    const now = today;
    const currentTimeTop = (now.hour() + now.minute() / 60 - START_HOUR) * HOUR_HEIGHT;

    const TIME_GUTTER = 64;

    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            height: 'calc(100vh - 180px)',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
            {/* Sticky day header */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '14px 20px',
                background: isToday
                    ? 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)'
                    : 'linear-gradient(135deg, #f8fafc 0%, #f0f7ff 100%)',
                borderBottom: '2px solid #e2e8f0',
                flexShrink: 0,
            }}>
                {/* Date circle */}
                <div style={{
                    width: '52px', height: '52px', borderRadius: '14px',
                    background: isToday ? '#1272bf' : '#fff',
                    border: isToday ? 'none' : '1px solid #e2e8f0',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    boxShadow: isToday ? '0 4px 12px rgba(18,114,191,0.3)' : '0 1px 4px rgba(0,0,0,0.08)',
                    flexShrink: 0,
                }}>
                    <Text style={{ fontSize: '20px', fontWeight: 800, color: isToday ? '#fff' : '#1e293b', lineHeight: 1.1 }}>
                        {currentDate.format('D')}
                    </Text>
                    <Text style={{ fontSize: '10px', fontWeight: 600, color: isToday ? 'rgba(255,255,255,0.75)' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                        {currentDate.format('MMM')}
                    </Text>
                </div>

                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Text style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b' }}>
                            {currentDate.format('dddd')}
                        </Text>
                        {isToday && (
                            <span style={{
                                fontSize: '11px', fontWeight: 700, color: '#1272bf',
                                background: '#fff', padding: '2px 10px',
                                borderRadius: '20px', border: '1.5px solid #bfdbfe',
                            }}>
                                Today
                            </span>
                        )}
                    </div>
                    <Text style={{ fontSize: '13px', color: '#64748b' }}>
                        {currentDate.format('MMMM D, YYYY')}
                        {(dayEvents.length + allDayEvents.length) > 0 && (
                            <span style={{ marginLeft: '8px', color: '#1272bf', fontWeight: 600 }}>
                                · {dayEvents.length + allDayEvents.length} event{(dayEvents.length + allDayEvents.length) !== 1 ? 's' : ''}
                            </span>
                        )}
                    </Text>
                </div>
            </div>

            {/* All-Day Events row */}
            {allDayEvents.length > 0 && (
                <div style={{
                    padding: '10px 16px',
                    background: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    flexShrink: 0,
                }}>
                    <Text style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        All-day & Spanning Events
                    </Text>
                    {allDayEvents.map(event => {
                        const style = getEventStyle(event);
                        return (
                            <div key={event.id} style={{
                                background: style.bg,
                                border: `1px solid ${style.border}`,
                                borderLeft: `4px solid ${style.color}`,
                                borderRadius: '6px',
                                padding: '6px 12px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Text style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                                        {event.title}
                                    </Text>
                                    {event.description && (
                                        <Text style={{ fontSize: '11px', color: '#64748b' }}>
                                            — {event.description}
                                        </Text>
                                    )}
                                </div>
                                <Tag style={{
                                    margin: 0, fontSize: '10px', borderRadius: '6px',
                                    background: style.bg, borderColor: style.border, color: style.color, fontWeight: 600,
                                }}>
                                    {event.type}
                                </Tag>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Scrollable time grid */}
            <div ref={containerRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', background: '#fff', position: 'relative' }}>
                <div style={{ display: 'flex', height: `${TOTAL_HOURS * HOUR_HEIGHT}px`, position: 'relative' }}>
                    {/* Time gutter */}
                    <div style={{
                        width: `${TIME_GUTTER}px`, flexShrink: 0,
                        borderRight: '1px solid #e2e8f0',
                        position: 'relative',
                    }}>
                        {Array.from({ length: TOTAL_HOURS }, (_, h) => (
                            <div key={h} style={{
                                position: 'absolute', top: `${h * HOUR_HEIGHT - 9}px`,
                                right: '10px', textAlign: 'right',
                            }}>
                                <Text style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8' }}>
                                    {h === 0 ? '' : formatHourLabel(h, timeFormat)}
                                </Text>
                            </div>
                        ))}
                    </div>

                    {/* Main grid column */}
                    <div style={{ flex: 1, position: 'relative', background: isToday ? '#fafeff' : '#fff' }}>
                        {/* Hour grid lines */}
                        {Array.from({ length: TOTAL_HOURS }, (_, h) => (
                            <React.Fragment key={h}>
                                <div style={{
                                    position: 'absolute', top: `${h * HOUR_HEIGHT}px`,
                                    left: 0, right: 0,
                                    borderTop: h === 0 ? 'none' : '1px solid #f1f5f9',
                                }} />
                                {/* Half-hour dotted line */}
                                <div style={{
                                    position: 'absolute', top: `${h * HOUR_HEIGHT + HOUR_HEIGHT / 2}px`,
                                    left: '12px', right: 0,
                                    borderTop: '1px dashed #f1f5f9',
                                }} />
                            </React.Fragment>
                        ))}

                        {/* Events */}
                        {dayEvents.map(ev => (
                            <DayEventBlock key={ev.id} event={ev} currentDate={currentDate} timeFormat={timeFormat} />
                        ))}

                        {/* Current time indicator */}
                        {isToday && (
                            <div style={{
                                position: 'absolute', top: `${currentTimeTop}px`,
                                left: 0, right: 0, zIndex: 5,
                                display: 'flex', alignItems: 'center',
                                pointerEvents: 'none',
                            }}>
                                <div style={{
                                    width: '10px', height: '10px', borderRadius: '50%',
                                    background: '#ef4444', flexShrink: 0, marginLeft: '-5px',
                                    boxShadow: '0 0 0 3px rgba(239,68,68,0.2)',
                                }} />
                                <div style={{ flex: 1, height: '2px', background: '#ef4444' }} />
                                <div style={{
                                    fontSize: '10px', fontWeight: 700, color: '#ef4444',
                                    background: '#fff', border: '1px solid #fecaca',
                                    padding: '1px 6px', borderRadius: '4px', marginLeft: '4px', flexShrink: 0,
                                }}>
                                    {formatTime(now, timeFormat)}
                                </div>
                            </div>
                        )}

                        {/* Empty state */}
                        {dayEvents.length === 0 && allDayEvents.length === 0 && (
                            <div style={{
                                position: 'absolute', top: '50%', left: '50%',
                                transform: 'translate(-50%, -50%)',
                                textAlign: 'center', pointerEvents: 'none',
                            }}>
                                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📅</div>
                                <Text style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 500 }}>
                                    No events scheduled
                                </Text>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalenderDayView;
