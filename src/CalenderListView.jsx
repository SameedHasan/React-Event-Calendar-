import React, { useEffect, useMemo } from 'react';
import { Typography, Badge, Empty, Tag } from 'antd';
import useCalendarStore from './store/useCalendarStore';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { ClockCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import { getEventStyle } from './utils/eventColors';
import { isEventOnDay, formatTime, getDayIndex } from './utils/dateHelpers';

dayjs.extend(isoWeek);

const { Text, Title } = Typography;

const getDayEvents = (date, events) => {
    return events.filter(event => isEventOnDay(event, date));
};

const EventCard = ({ event, isFirst, date, timeFormat }) => {
    const { openEditModal, onEventClick } = useCalendarStore();
    const config = getEventStyle(event);
    const dayStart = dayjs(date).startOf('day');
    const dayEnd = dayjs(date).endOf('day');
    const eventStart = dayjs(event.start);
    const eventEnd = dayjs(event.end);

    const isSpanningFromPrev = eventStart.isBefore(dayStart);
    const isSpanningToNext = eventEnd.isAfter(dayEnd);

    const duration = eventEnd.diff(eventStart, 'minute');
    const hours = Math.floor(duration / 60);
    const mins = duration % 60;
    const durationStr = hours > 0
        ? `${hours}h${mins > 0 ? ` ${mins}m` : ''}`
        : `${mins}m`;

    return (
        <div
            className="list-event-card"
            onClick={() => {
                if (onEventClick) {
                    const res = onEventClick(event);
                    if (res === false) return;
                }
                openEditModal(event);
            }}
            style={{
                display: 'flex',
                gap: '14px',
                padding: '14px 16px',
                marginBottom: '10px',
                background: 'var(--white-color)',
                borderRadius: '10px',
                border: `1px solid ${config.border}`,
                borderLeft: `4px solid ${config.color}`,
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
                e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            {/* Time column */}
            <div style={{ minWidth: '95px', display: 'flex', flexDirection: 'column', gap: '2px', justifyContent: 'center' }}>
                <Text style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {isSpanningFromPrev ? eventStart.format(timeFormat === '24h' ? 'MMM D, HH:mm' : 'MMM D, h:mm A') : formatTime(eventStart, timeFormat)}
                </Text>
                <Text style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {isSpanningToNext ? eventEnd.format(timeFormat === '24h' ? 'MMM D, HH:mm' : 'MMM D, h:mm A') : formatTime(eventEnd, timeFormat)}
                </Text>
                {(isSpanningFromPrev || isSpanningToNext) && (
                    <Text style={{ fontSize: '9px', color: '#e11d48', fontWeight: 700, textTransform: 'uppercase', marginTop: '2px' }}>
                        Spanning
                    </Text>
                )}
            </div>

            {/* Divider */}
            <div style={{
                width: '1px',
                background: config.border,
                borderRadius: '2px',
                flexShrink: 0,
            }} />

            {/* Icon circle */}
            <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: config.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                alignSelf: 'center',
            }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: config.color }} />
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <Text style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    display: 'block',
                    marginBottom: '4px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1,
                }}>
                    {event.title}
                </Text>
                <Text style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {event.description}
                </Text>
            </div>

            {/* Right meta */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                <Tag
                    style={{
                        margin: 0, fontSize: '11px', fontWeight: 600, borderRadius: '6px',
                        background: config.bg, borderColor: config.border, color: config.color,
                    }}
                >
                    {event.type}
                </Tag>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ClockCircleOutlined style={{ fontSize: '11px', color: 'var(--text-secondary)' }} />
                    <Text style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{durationStr}</Text>
                </div>
            </div>
        </div>
    );
};

const DaySection = ({ date, events, isToday, timeFormat }) => {
    const dayEvents = getDayEvents(date, events);
    if (dayEvents.length === 0) return null;

    return (
        <div style={{ marginBottom: '24px' }}>
            {/* Day header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px',
                padding: '8px 0',
                borderBottom: '1px solid var(--border-color)',
            }}>
                <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: isToday ? 'var(--primary-color)' : 'var(--bg-color)',
                    border: isToday ? 'none' : '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    <Text style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: isToday ? 'rgba(255,255,255,0.85)' : 'var(--text-secondary)',
                        textTransform: 'uppercase',
                        lineHeight: 1,
                    }}>
                        {date.format('ddd')}
                    </Text>
                    <Text style={{
                        fontSize: '18px',
                        fontWeight: 800,
                        color: isToday ? '#fff' : 'var(--text-primary)',
                        lineHeight: 1.1,
                        marginTop: '2px',
                    }}>
                        {date.date()}
                    </Text>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {date.format('MMMM YYYY')}
                    </Text>
                    <Text style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}
                    </Text>
                </div>
            </div>

            {/* Events */}
            <div style={{ paddingLeft: '4px' }}>
                {dayEvents
                    .sort((a, b) => new Date(a.start) - new Date(b.start))
                    .map((event, i) => (
                        <EventCard key={event.id} event={event} isFirst={i === 0} date={date} timeFormat={timeFormat} />
                    ))}
            </div>
        </div>
    );
};

const CalenderListView = () => {
    const { weekRange, currentWeek, setWeekRange, events, startOfWeek, timeFormat, hideWeekends } = useCalendarStore();

    useEffect(() => {
        const weekNumber = dayjs(currentWeek).isoWeek();
        const startDay = dayjs(currentWeek).subtract(getDayIndex(dayjs(currentWeek).toDate(), startOfWeek), 'day');
        const start = startDay.format('MMM D, YYYY');
        const end = startDay.add(6, 'day').format('MMM D, YYYY');
        setWeekRange({ count: weekNumber, range: `${start} - ${end}` });
    }, [setWeekRange, currentWeek, startOfWeek]);

    // Build the days of the current week starting on startOfWeek
    const weekDays = useMemo(() => {
        const startDay = dayjs(currentWeek).subtract(getDayIndex(dayjs(currentWeek).toDate(), startOfWeek), 'day');
        const baseDays = Array.from({ length: 7 }, (_, i) => startDay.add(i, 'day'));
        if (hideWeekends) {
            return baseDays.filter(d => d.day() !== 0 && d.day() !== 6);
        }
        return baseDays;
    }, [currentWeek, startOfWeek, hideWeekends]);

    const today = dayjs();

    // Summary stats for the week
    const weekEvents = useMemo(() => {
        return events.filter(event => {
            return weekDays.some(wd => isEventOnDay(event, wd));
        });
    }, [weekDays, events]);

    const typeCounts = useMemo(() => {
        const counts = {};
        weekEvents.forEach(e => {
            counts[e.type] = (counts[e.type] || 0) + 1;
        });
        return Object.entries(counts).map(([type, count]) => ({
            type,
            count,
            style: getEventStyle({ type })
        }));
    }, [weekEvents]);

    return (
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '8px 0 24px' }}>
            {/* Week summary bar */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                background: 'linear-gradient(135deg, var(--bg-color) 0%, var(--tag-bg) 100%)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                marginBottom: '28px',
                flexWrap: 'wrap',
                gap: '12px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CalendarOutlined style={{ fontSize: '18px', color: 'var(--primary-color)' }} />
                    <div>
                        <Text style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block' }}>
                            Week {weekRange.count}
                        </Text>
                        <Text style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {weekRange.range}
                        </Text>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {weekEvents.length === 0 ? (
                        <Tag style={{ borderRadius: '8px', fontSize: '12px' }}>No events this week</Tag>
                    ) : (
                        <>
                            <Tag color="default" style={{ borderRadius: '8px', fontSize: '12px', fontWeight: 600 }}>
                                {weekEvents.length} Total
                            </Tag>
                            {typeCounts.map(({ type, count, style }) => (
                                <Tag
                                    key={type}
                                    style={{
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                        background: style.bg,
                                        borderColor: style.border,
                                        color: style.color,
                                        fontWeight: 600,
                                    }}
                                >
                                    {count} {type}
                                </Tag>
                            ))}
                        </>
                    )}
                </div>
            </div>

            {/* Days with events */}
            {weekEvents.length === 0 ? (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                        <div style={{ textAlign: 'center' }}>
                            <Text style={{ fontSize: '15px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                No events this week
                            </Text>
                            <Text style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                Navigate to another week to see your schedule
                            </Text>
                        </div>
                    }
                    style={{ padding: '48px 0' }}
                />
            ) : (
                weekDays.map(day => (
                    <DaySection
                        key={day.toString()}
                        date={day}
                        events={events}
                        isToday={day.isSame(today, 'day')}
                        timeFormat={timeFormat}
                    />
                ))
            )}
        </div>
    );
};

export default CalenderListView;