import React, { useMemo } from 'react';
import useCalendarStore from './store/useCalendarStore';
import { Typography, Tooltip } from 'antd';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { getEventStyle } from './utils/eventColors';
import { isEventOnDay } from './utils/dateHelpers';

dayjs.extend(isoWeek);

const { Text } = Typography;

const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const TooltipContent = ({ events, day }) => (
    <div style={{ padding: '2px 0' }}>
        <div style={{ fontWeight: 700, fontSize: '12px', marginBottom: '8px', color: '#1e293b' }}>
            All Events ({events.length})
        </div>
        {events.map(ev => {
            const cfg = getEventStyle(ev);
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
                        {isStartDay ? dayjs(ev.start).format('h:mm A') : '← Cont.'}
                    </span>
                </div>
            );
        })}
    </div>
);

const EventPill = ({ event, day }) => {
    const cfg = getEventStyle(event);
    const isStartDay = dayjs(event.start).isSame(day, 'day');
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '2px 6px', marginBottom: '3px',
            background: cfg.bg, borderRadius: '5px',
            borderLeft: `3px solid ${cfg.color}`,
            overflow: 'hidden', cursor: 'pointer',
            transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
            <Text style={{
                fontSize: '11px', fontWeight: 600, color: '#1e293b',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
            }}>
                {event.title}
            </Text>
            <Text style={{ fontSize: '10px', color: '#64748b', flexShrink: 0 }}>
                {isStartDay ? dayjs(event.start).format('h:mm A') : '← Cont.'}
            </Text>
        </div>
    );
};

const CalenderMonthView = () => {
    const { currentDate, events } = useCalendarStore();
    const today = dayjs();
    const current = dayjs(currentDate);

    const getEventsForDate = (date) =>
        events.filter(ev => isEventOnDay(ev, date))
               .sort((a, b) => new Date(a.start) - new Date(b.start));

    // Build grid: days from Mon of week containing 1st to Sun of week containing last
    const gridDays = useMemo(() => {
        const firstDay = current.startOf('month');
        const lastDay = current.endOf('month');
        const gridStart = firstDay.isoWeekday(1); // Monday of that week
        const gridEnd = lastDay.isoWeekday(7);   // Sunday of that week
        const days = [];
        let d = gridStart;
        while (d.isBefore(gridEnd) || d.isSame(gridEnd, 'day')) {
            days.push(d);
            d = d.add(1, 'day');
        }
        return days;
    }, [currentDate]);

    return (
        <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            {/* Day-of-week header */}
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f0f7ff 100%)',
                borderBottom: '1px solid #e2e8f0',
            }}>
                {DOW.map((d, i) => (
                    <div key={d} style={{
                        padding: '12px 0', textAlign: 'center',
                        borderRight: i < 6 ? '1px solid #e2e8f0' : 'none',
                    }}>
                        <Text style={{
                            fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px',
                            textTransform: 'uppercase',
                            color: i >= 5 ? '#94a3b8' : '#64748b',
                        }}>
                            {d}
                        </Text>
                    </div>
                ))}
            </div>

            {/* Day grid */}
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
                background: '#fff',
            }}>
                {gridDays.map((day, i) => {
                    const isCurrentMonth = day.month() === current.month();
                    const isToday = day.isSame(today, 'day');
                    const isWeekend = day.isoWeekday() >= 6;
                    const dayEvents = getEventsForDate(day);
                    const col = i % 7;

                    return (
                        <div
                            key={day.toString()}
                            style={{
                                minHeight: '110px',
                                padding: '8px 6px 6px',
                                borderRight: col < 6 ? '1px solid #f1f5f9' : 'none',
                                borderBottom: '1px solid #f1f5f9',
                                background: isToday
                                    ? '#f0f7ff'
                                    : !isCurrentMonth
                                        ? '#fafafa'
                                        : isWeekend
                                            ? '#fdfcff'
                                            : '#fff',
                                transition: 'background 0.15s',
                                position: 'relative',
                                cursor: 'default',
                            }}
                            onMouseEnter={e => {
                                if (!isToday) e.currentTarget.style.background = '#f8fafc';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = isToday
                                    ? '#f0f7ff'
                                    : !isCurrentMonth ? '#fafafa'
                                    : isWeekend ? '#fdfcff'
                                    : '#fff';
                            }}
                        >
                            {/* Day number */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '6px' }}>
                                <div style={{
                                    width: '26px', height: '26px',
                                    borderRadius: '50%',
                                    background: isToday ? '#1272bf' : 'transparent',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Text style={{
                                        fontSize: '13px',
                                        fontWeight: isToday ? 700 : isCurrentMonth ? 500 : 400,
                                        color: isToday ? '#fff' : isCurrentMonth ? '#1e293b' : '#c1c9d4',
                                    }}>
                                        {day.date()}
                                    </Text>
                                </div>
                            </div>

                            {/* Events */}
                            <div>
                                {dayEvents.slice(0, 2).map(ev => (
                                    isCurrentMonth
                                        ? <EventPill key={ev.id} event={ev} day={day} />
                                        : null
                                ))}
                                {isCurrentMonth && dayEvents.length > 2 && (
                                    <Tooltip
                                        title={<TooltipContent events={dayEvents} day={day} />}
                                        overlayInnerStyle={{ background: '#fff', padding: '12px', borderRadius: '10px', minWidth: '220px' }}
                                        color="#fff"
                                        placement="top"
                                    >
                                        <div style={{
                                            fontSize: '11px', fontWeight: 600,
                                            color: '#1272bf', background: '#eff6ff',
                                            padding: '2px 6px', borderRadius: '5px',
                                            cursor: 'pointer', display: 'inline-block',
                                            border: '1px solid #bfdbfe',
                                        }}>
                                            +{dayEvents.length - 2} more
                                        </div>
                                    </Tooltip>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalenderMonthView;
