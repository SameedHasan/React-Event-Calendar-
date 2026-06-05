import React, { useMemo } from 'react';
import { Typography, Badge, Tooltip } from 'antd';
import useCalendarStore from './store/useCalendarStore';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { CalendarOutlined } from '@ant-design/icons';
import { getEventStyle } from './utils/eventColors';
import { isEventOnDay } from './utils/dateHelpers';

dayjs.extend(isoWeek);

const { Text, Title } = Typography;

const DOW_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// Get all days to display in a month grid (Mon-first, 6 weeks)
const getMonthGridDays = (year, month) => {
    const firstDay = dayjs(new Date(year, month, 1));
    const startOffset = firstDay.isoWeekday() - 1; // 0 for Mon, 6 for Sun
    const gridStart = firstDay.subtract(startOffset, 'day');
    return Array.from({ length: 42 }, (_, i) => gridStart.add(i, 'day'));
};

const MiniMonthCalendar = ({ year, monthNumber, monthName, onClick, isCurrentMonth, eventsForYear }) => {
    const today = dayjs();
    const days = useMemo(() => getMonthGridDays(year, monthNumber), [year, monthNumber]);

    // Build a map: "YYYY-MM-DD" -> [events]
    const eventMap = useMemo(() => {
        const map = {};
        days.forEach(day => {
            if (day.month() === monthNumber && day.year() === year) {
                const key = day.format('YYYY-MM-DD');
                eventsForYear.forEach(event => {
                    if (isEventOnDay(event, day)) {
                        if (!map[key]) map[key] = [];
                        map[key].push(event);
                    }
                });
            }
        });
        return map;
    }, [eventsForYear, days, year, monthNumber]);

    const totalEvents = Object.values(eventMap).reduce((sum, arr) => sum + arr.length, 0);

    // Dynamic legend for this specific month
    const monthLegend = useMemo(() => {
        const counts = {};
        Object.values(eventMap).flat().forEach(e => {
            counts[e.type] = (counts[e.type] || 0) + 1;
        });
        return Object.entries(counts).map(([type, count]) => ({
            type,
            count,
            style: getEventStyle({ type })
        }));
    }, [eventMap]);

    return (
        <div
            className="year-month-card"
            onClick={() => onClick(monthNumber)}
            style={{
                background: '#fff',
                borderRadius: '14px',
                border: isCurrentMonth ? '2px solid #1272bf' : '1px solid #e2e8f0',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.22s ease',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: isCurrentMonth
                    ? '0 4px 20px rgba(18,114,191,0.18)'
                    : '0 1px 4px rgba(0,0,0,0.06)',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = isCurrentMonth
                    ? '0 8px 28px rgba(18,114,191,0.25)'
                    : '0 6px 20px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = isCurrentMonth
                    ? '0 4px 20px rgba(18,114,191,0.18)'
                    : '0 1px 4px rgba(0,0,0,0.06)';
            }}
        >
            {/* Decorative accent for current month */}
            {isCurrentMonth && (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, #1272bf, #38bdf8)',
                    borderRadius: '14px 14px 0 0',
                }} />
            )}

            {/* Month header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                    <Text style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: isCurrentMonth ? '#1272bf' : '#1e293b',
                        display: 'block',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                    }}>
                        {monthName}
                    </Text>
                    {totalEvents > 0 && (
                        <Text style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1px', display: 'block' }}>
                            {totalEvents} event{totalEvents !== 1 ? 's' : ''}
                        </Text>
                    )}
                </div>
                {isCurrentMonth && (
                    <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: '#1272bf',
                        background: '#eff6ff',
                        padding: '2px 7px',
                        borderRadius: '20px',
                        border: '1px solid #bfdbfe',
                    }}>
                        NOW
                    </span>
                )}
            </div>

            {/* Day-of-week labels */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', marginBottom: '4px' }}>
                {DOW_LABELS.map((d, i) => (
                    <div key={i} style={{
                        textAlign: 'center',
                        fontSize: '9px',
                        fontWeight: 700,
                        color: i >= 5 ? '#94a3b8' : '#cbd5e1',
                        paddingBottom: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.3px',
                    }}>
                        {d}
                    </div>
                ))}
            </div>

            {/* Day cells */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                {days.map((day, i) => {
                    const isThisMonth = day.month() === monthNumber;
                    const isTodayCell = day.isSame(today, 'day');
                    const key = day.format('YYYY-MM-DD');
                    const dayEvs = eventMap[key] || [];
                    const hasEvents = dayEvs.length > 0;

                    const cellContent = (
                        <div
                            key={i}
                            style={{
                                width: '100%',
                                aspectRatio: '1',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '5px',
                                position: 'relative',
                                background: isTodayCell
                                    ? '#1272bf'
                                    : hasEvents && isThisMonth
                                        ? '#f0f7ff'
                                        : 'transparent',
                                cursor: hasEvents && isThisMonth ? 'pointer' : 'default',
                            }}
                        >
                            <Text style={{
                                fontSize: '10px',
                                fontWeight: isTodayCell ? 700 : hasEvents && isThisMonth ? 600 : 400,
                                color: isTodayCell
                                    ? '#fff'
                                    : isThisMonth
                                        ? (hasEvents ? '#1272bf' : '#475569')
                                        : '#d1d5db',
                                lineHeight: 1,
                             }}>
                                {day.date()}
                            </Text>
                            {/* Event dots */}
                            {hasEvents && isThisMonth && (
                                <div style={{
                                    display: 'flex',
                                    gap: '1.5px',
                                    marginTop: '1.5px',
                                    flexWrap: 'nowrap',
                                    maxWidth: '100%',
                                    justifyContent: 'center',
                                }}>
                                    {dayEvs.slice(0, 3).map((ev, idx) => {
                                        const style = getEventStyle(ev);
                                        return (
                                            <div key={idx} style={{
                                                width: '3.5px',
                                                height: '3.5px',
                                                borderRadius: '50%',
                                                background: isTodayCell ? '#fff' : style.color,
                                                flexShrink: 0,
                                            }} />
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );

                    if (hasEvents && isThisMonth) {
                        return (
                            <Tooltip
                                key={i}
                                title={
                                    <div>
                                        <div style={{ fontWeight: 700, marginBottom: '8px', fontSize: '12px', color: '#1e293b' }}>
                                            {day.format('MMM D, YYYY')}
                                        </div>
                                        {dayEvs.map(ev => {
                                            const style = getEventStyle(ev);
                                            return (
                                                <div key={ev.id} style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    fontSize: '11px',
                                                    marginBottom: '4px',
                                                    padding: '3px 6px',
                                                    background: style.bg,
                                                    borderRadius: '4px',
                                                    border: `1px solid ${style.border}`,
                                                }}>
                                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: style.color }} />
                                                    <span style={{ fontWeight: 600, color: '#1e293b' }}>{ev.title}</span>
                                                    <span style={{ color: '#64748b', marginLeft: 'auto' }}>
                                                        {dayjs(ev.start).format('h:mm A')}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                }
                                overlayStyle={{ maxWidth: '240px' }}
                                color="#fff"
                                overlayInnerStyle={{ color: '#1e293b', padding: '10px 12px' }}
                                placement="top"
                            >
                                {cellContent}
                            </Tooltip>
                        );
                    }
                    return cellContent;
                })}
            </div>

            {/* Event type legend at bottom */}
            {totalEvents > 0 && (
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginTop: '12px',
                    paddingTop: '10px',
                    borderTop: '1px solid #f1f5f9',
                    flexWrap: 'wrap',
                }}>
                    {monthLegend.map(({ type, count, style }) => (
                        <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <div style={{
                                width: '6px', height: '6px', borderRadius: '50%',
                                background: style.color, flexShrink: 0,
                            }} />
                            <Text style={{ fontSize: '10px', color: '#64748b', fontWeight: 500 }}>
                                {count} {type}
                            </Text>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const MONTHS = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December',
];

const CalenderYearView = () => {
    const { currentDate, setView, setCurrentDate, events } = useCalendarStore();
    const currentYear = dayjs(currentDate).year();
    const today = dayjs();
    const isCurrentYear = today.year() === currentYear;
    const currentMonth = today.month();

    // Filter events for the current year (including events that span across this year)
    const eventsForYear = useMemo(() => {
        return events.filter(e => {
            const startYear = dayjs(e.start).year();
            const endYear = dayjs(e.end).year();
            return startYear <= currentYear && endYear >= currentYear;
        });
    }, [currentYear, events]);

    const totalYearEvents = eventsForYear.length;

    const handleMonthClick = (monthNumber) => {
        const newDate = new Date(currentYear, monthNumber, 1);
        setCurrentDate(newDate.toISOString());
        setView('month');
    };

    // Dynamic Top 3 Stats breakdown for this Year
    const dynamicStats = useMemo(() => {
        const counts = {};
        eventsForYear.forEach(e => {
            counts[e.type] = (counts[e.type] || 0) + 1;
        });
        return Object.entries(counts)
            .map(([type, count]) => ({
                type,
                count,
                style: getEventStyle({ type }),
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);
    }, [eventsForYear]);

    const busyMonths = useMemo(() => {
        return MONTHS
            .map((name, i) => ({
                name,
                count: eventsForYear.filter(e => dayjs(e.start).month() === i).length,
            }))
            .filter(m => m.count > 0)
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);
    }, [eventsForYear]);

    return (
        <div style={{ padding: '4px 0 32px' }}>
            {/* Year stats header */}
            <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '28px',
                flexWrap: 'wrap',
            }}>
                {/* Total events */}
                <div style={{
                    flex: '1 1 180px',
                    background: 'linear-gradient(135deg, #1272bf 0%, #0ea5e9 100%)',
                    borderRadius: '14px',
                    padding: '18px 20px',
                    color: '#fff',
                    boxShadow: '0 4px 16px rgba(18,114,191,0.25)',
                }}>
                    <Text style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                        {currentYear} Total
                    </Text>
                    <div style={{ fontSize: '36px', fontWeight: 800, lineHeight: 1.1, marginTop: '4px' }}>
                        {totalYearEvents}
                    </div>
                    <Text style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
                        events scheduled
                    </Text>
                </div>

                {/* Dynamic breakdown cards (top 3 event types) */}
                {dynamicStats.map(({ type, count, style }) => (
                    <div key={type} style={{
                        flex: '1 1 120px',
                        background: style.bg,
                        borderRadius: '14px',
                        padding: '18px 20px',
                        border: `1px solid ${style.border}`,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}>
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '8px',
                            background: '#fff', border: `1px solid ${style.border}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '8px',
                        }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: style.color }} />
                        </div>
                        <div>
                            <div style={{ fontSize: '26px', fontWeight: 800, color: style.color, lineHeight: 1 }}>
                                {count}
                            </div>
                            <Text style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                                {type}
                            </Text>
                        </div>
                    </div>
                ))}

                {/* Busiest months */}
                {busyMonths.length > 0 && (
                    <div style={{
                        flex: '1 1 160px',
                        background: '#f8fafc',
                        borderRadius: '14px',
                        padding: '18px 20px',
                        border: '1px solid #e2e8f0',
                    }}>
                        <Text style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, display: 'block', marginBottom: '10px' }}>
                            Busiest Months
                        </Text>
                        {busyMonths.map((m, i) => (
                            <div key={m.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                <Text style={{ fontSize: '13px', color: '#475569', fontWeight: 500 }}>
                                    {i + 1}. {m.name}
                                </Text>
                                <span style={{
                                    fontSize: '11px', fontWeight: 700,
                                    color: '#1272bf', background: '#eff6ff',
                                    padding: '1px 8px', borderRadius: '20px',
                                }}>
                                    {m.count}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Month grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '16px',
            }}>
                {MONTHS.map((name, i) => (
                    <MiniMonthCalendar
                        key={i}
                        year={currentYear}
                        monthNumber={i}
                        monthName={name}
                        onClick={handleMonthClick}
                        isCurrentMonth={isCurrentYear && i === currentMonth}
                        eventsForYear={eventsForYear}
                    />
                ))}
            </div>
        </div>
    );
};

export default CalenderYearView;
