import React, { useMemo } from 'react';
import { Text } from './components/ui/Text';
import Tooltip from './components/ui/Tooltip';
import useCalendarStore from './store/useCalendarStore';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import localeData from 'dayjs/plugin/localeData';
import { getEventStyle } from './utils/eventColors';
import { isEventOnDay, formatTime, getDayIndex, getLocalizedSingleDOW, nowInTz } from './utils/dateHelpers';
import { toDayjs } from './utils/tz';

dayjs.extend(isoWeek);
dayjs.extend(localeData);

/**
 * Returns the 12 localized full month names for the currently active dayjs locale.
 * Falls back to the English names if localeData is unavailable.
 *
 * IMPORTANT: depends on `localeReady` (the resolved code written to the store
 * AFTER the async bundle loads), NOT on `locale` (the raw prop, which is set
 * before the bundle is ready). This ensures dayjs.months() returns the right names.
 */
function useLocaleMonths() {
    useCalendarStore((s) => s.localeReady); // re-render when async locale bundle loads
    // No useMemo — dayjs.months() is O(1) and must be fresh after each locale load
    try {
        const months = dayjs.months();
        if (Array.isArray(months) && months.length === 12) return months;
    } catch {/* ignore */}
    return [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December',
    ];
}

// Get all days to display in a month grid (Mon/Sun-first, 6 weeks)
const getMonthGridDays = (year, month, startOfWeek = 'monday') => {
    const firstDay = dayjs(new Date(year, month, 1));
    const startOffset = getDayIndex(firstDay.toDate(), startOfWeek);
    const gridStart = firstDay.subtract(startOffset, 'day');
    return Array.from({ length: 42 }, (_, i) => gridStart.add(i, 'day'));
};

const MiniMonthCalendar = ({ year, monthNumber, monthName, onClick, isCurrentMonth, eventsForYear, startOfWeek, timeFormat, eventColors, timezone }) => {
    const today = nowInTz(timezone);
    const days = useMemo(() => getMonthGridDays(year, monthNumber, startOfWeek), [year, monthNumber, startOfWeek]);

    // Build a map: "YYYY-MM-DD" -> [events]
    const eventMap = useMemo(() => {
        const map = {};
        days.forEach(day => {
            if (day.month() === monthNumber && day.year() === year) {
                const key = day.format('YYYY-MM-DD');
                eventsForYear.forEach(event => {
                    if (isEventOnDay(event, day, timezone)) {
                        if (!map[key]) map[key] = [];
                        map[key].push(event);
                    }
                });
            }
        });
        return map;
    }, [eventsForYear, days, year, monthNumber, timezone]);

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
            style: getEventStyle({ type }, eventColors)
        }));
    }, [eventMap, eventColors]);

    return (
        <div
            className="year-month-card"
            onClick={() => onClick(monthNumber)}
            style={{
                background: 'var(--white-color)',
                borderRadius: '14px',
                border: isCurrentMonth ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.22s ease',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: isCurrentMonth
                    ? '0 4px 20px color-mix(in srgb, var(--primary-color) 18%, transparent)'
                    : '0 1px 4px rgba(0,0,0,0.06)',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = isCurrentMonth
                    ? '0 8px 28px color-mix(in srgb, var(--primary-color) 25%, transparent)'
                    : '0 6px 20px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = isCurrentMonth
                    ? '0 4px 20px color-mix(in srgb, var(--primary-color) 18%, transparent)'
                    : '0 1px 4px rgba(0,0,0,0.06)';
            }}
        >
            {/* Decorative accent for current month */}
            {isCurrentMonth && (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, var(--primary-color), color-mix(in srgb, var(--primary-color) 40%, #fff))',
                    borderRadius: '14px 14px 0 0',
                }} />
            )}

            {/* Month header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                    <Text style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: isCurrentMonth ? 'var(--primary-color)' : 'var(--text-primary)',
                        display: 'block',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                    }}>
                        {monthName}
                    </Text>
                    {totalEvents > 0 && (
                        <Text style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '1px', display: 'block' }}>
                            {totalEvents} event{totalEvents !== 1 ? 's' : ''}
                        </Text>
                    )}
                </div>
                {isCurrentMonth && (
                    <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: 'var(--primary-color)',
                        background: 'var(--color-active-menu-bg)',
                        padding: '2px 7px',
                        borderRadius: '20px',
                        border: '1px solid color-mix(in srgb, var(--primary-color) 25%, var(--white-color))',
                    }}>
                        NOW
                    </span>
                )}
            </div>

            {/* Day-of-week labels */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', marginBottom: '4px' }}>
                {getLocalizedSingleDOW(startOfWeek).map((d, i) => (
                    <div key={i} style={{
                        textAlign: 'center',
                        fontSize: '9px',
                        fontWeight: 700,
                        color: 'var(--text-secondary)',
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
                                    ? 'var(--primary-color)'
                                    : hasEvents && isThisMonth
                                        ? 'var(--color-active-menu-bg)'
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
                                        ? (hasEvents ? 'var(--primary-color)' : 'var(--text-primary)')
                                        : 'var(--text-secondary)',
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
                                        const style = getEventStyle(ev, eventColors);
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
                                        <div style={{ fontWeight: 700, marginBottom: '8px', fontSize: '12px', color: 'var(--text-primary)' }}>
                                            {day.format('MMM D, YYYY')}
                                        </div>
                                        {dayEvs.map(ev => {
                                            const style = getEventStyle(ev, eventColors);
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
                                                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{ev.title}</span>
                                                    <span style={{ color: 'var(--text-secondary)', marginLeft: 'auto' }}>
                                                        {formatTime(ev.start, timeFormat, timezone)}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                }
                                overlayStyle={{ maxWidth: '240px' }}
                                color="var(--white-color)"
                                overlayInnerStyle={{ color: 'var(--text-primary)', padding: '10px 12px', background: 'var(--white-color)', border: '1px solid var(--border-color)' }}
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
                    borderTop: '1px solid var(--border-color)',
                    flexWrap: 'wrap',
                }}>
                    {monthLegend.map(({ type, count, style }) => (
                        <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <div style={{
                                width: '6px', height: '6px', borderRadius: '50%',
                                background: style.color, flexShrink: 0,
                            }} />
                            <Text style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                {count} {type}
                            </Text>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const CalenderYearView = () => {
    const { currentDate, setView, setCurrentDate, events, startOfWeek, timeFormat, eventColors, renderEmpty, timezone } = useCalendarStore();
    const months = useLocaleMonths();
    const currentYear = dayjs(currentDate).year();
    const today = nowInTz(timezone);
    const isCurrentYear = today.year() === currentYear;
    const currentMonth = today.month();

    // Filter events for the current year (including events that span across this year)
    const eventsForYear = useMemo(() => {
        return events.filter(e => {
            const startYear = toDayjs(e.start, timezone).year();
            const endYear = toDayjs(e.end, timezone).year();
            return startYear <= currentYear && endYear >= currentYear;
        });
    }, [currentYear, events, timezone]);

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
                style: getEventStyle({ type }, eventColors),
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);
    }, [eventsForYear, eventColors]);

    const busyMonths = useMemo(() => {
        return months
            .map((name, i) => ({
                name,
                count: eventsForYear.filter(e => dayjs(e.start).month() === i).length,
            }))
            .filter(m => m.count > 0)
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);
    }, [eventsForYear, months]);

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
                    background: 'linear-gradient(135deg, var(--primary-color) 0%, color-mix(in srgb, var(--primary-color) 60%, #fff) 100%)',
                    borderRadius: '14px',
                    padding: '18px 20px',
                    color: '#fff',
                    boxShadow: '0 4px 16px color-mix(in srgb, var(--primary-color) 25%, transparent)',
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
                            background: 'var(--white-color)', border: `1px solid ${style.border}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '8px',
                        }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: style.color }} />
                        </div>
                        <div>
                            <div style={{ fontSize: '26px', fontWeight: 800, color: style.color, lineHeight: 1 }}>
                                {count}
                            </div>
                            <Text style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                {type}
                            </Text>
                        </div>
                    </div>
                ))}

                {/* Busiest months */}
                {busyMonths.length > 0 && (
                    <div style={{
                        flex: '1 1 160px',
                        background: 'var(--bg-color)',
                        borderRadius: '14px',
                        padding: '18px 20px',
                        border: '1px solid var(--border-color)',
                    }}>
                        <Text style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, display: 'block', marginBottom: '10px' }}>
                            Busiest Months
                        </Text>
                        {busyMonths.map((m, i) => (
                            <div key={m.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                <Text style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
                                    {i + 1}. {m.name}
                                </Text>
                                <span style={{
                                    fontSize: '11px', fontWeight: 700,
                                    color: 'var(--primary-color)', background: 'var(--color-active-menu-bg)',
                                    padding: '1px 8px', borderRadius: '20px',
                                }}>
                                    {m.count}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {totalYearEvents === 0 && renderEmpty && (
                <div style={{ marginBottom: '24px' }}>
                    {renderEmpty('year')}
                </div>
            )}

            {/* Month grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '16px',
            }}>
                {months.map((name, i) => (
                    <MiniMonthCalendar
                        key={i}
                        year={currentYear}
                        monthNumber={i}
                        monthName={name}
                        onClick={handleMonthClick}
                        isCurrentMonth={isCurrentYear && i === currentMonth}
                        eventsForYear={eventsForYear}
                        startOfWeek={startOfWeek}
                        timeFormat={timeFormat}
                        eventColors={eventColors}
                        timezone={timezone}
                    />
                ))}
            </div>
        </div>
    );
};

export default CalenderYearView;
