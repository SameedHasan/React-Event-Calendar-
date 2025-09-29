import React, { useEffect } from 'react';
import { Row, Col, Typography } from 'antd';
import useCalendarStore from './store/useCalendarStore';
import dayjs from 'dayjs';
import eventsData from './eventsData';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DaysOfWeek = () => {
    const { weekRange, currentWeek, setWeekRange } = useCalendarStore();
    const today = new Date().getDay();

    // Generate 24-hour time slots in 12-hour format with AM/PM
    const generateTimeSlots = () => {
        const timeSlots = [];
        for (let hour = 0; hour < 24; hour++) {
            const period = hour < 12 ? 'AM' : 'PM';
            const displayHour = hour % 12 === 0 ? 12 : hour % 12;
            timeSlots.push(`${displayHour} ${period}`);
        }
        return timeSlots;
    };

    const getWeekNumber = (date) => {
        const currentDate_ = new Date(date);
        const start = new Date(currentDate_.getFullYear(), 0, 1);
        const days = Math.floor((currentDate_ - start) / (24 * 60 * 60 * 1000));
        return Math.ceil((days + start.getDay() + 1) / 7);
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const calculateWeekRange = (date) => {
        const start = new Date(date);
        const end = new Date(date);
        const day = start.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const mondayOffset = day === 0 ? -6 : 1 - day; // Convert to Monday-first
        
        start.setDate(start.getDate() + mondayOffset); // Set to Monday
        end.setDate(start.getDate() + 6); // Set to Sunday

        return {
            start: formatDate(start),
            end: formatDate(end)
        };
    };

    const combineDateAndTime = (date, time) => {
        const [hourStr, period] = time.split(' ');
        let hours = parseInt(hourStr);
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;

        const combined = new Date(date);
        combined.setHours(hours, 0, 0, 0); // Set hours, minutes, seconds, milliseconds
        return combined;
    };

    // Generate dates for each day in the week based on the current week (Monday-first)
    const getDisplayedDates = (currentWeek) => {
        const start = new Date(currentWeek);
        const dayOfWeek = start.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Convert to Monday-first
        start.setDate(start.getDate() + mondayOffset); // Set to Monday of the week
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            return formatDate(date);
        });
    };

    // Get events for a specific date and time
    const getEventsForDateTime = (date, time) => {
        const dateTime = combineDateAndTime(date, time);
        const nextHour = new Date(dateTime);
        nextHour.setHours(nextHour.getHours() + 1);
        
        return eventsData.filter(event => {
            return event.start >= dateTime && event.start < nextHour;
        });
    };

    const timeSlots = generateTimeSlots();
    const weekNumber = getWeekNumber(currentWeek);
    const { start, end } = calculateWeekRange(currentWeek);
    const displayedDates = getDisplayedDates(currentWeek);

    useEffect(() => {
        setWeekRange({
            count: weekNumber,
            range: `${start} - ${end}`
        });
    }, [setWeekRange, weekNumber, start, end]);

    return (
        <div>
            <Row className="calendar-days-of-week">
                <Col span={3} className="day-of-week">
                    <Typography.Text className='fs-12 fw-500'>Weeks {weekRange?.count}</Typography.Text>
                </Col>
                {daysOfWeek.map((day, index) => (
                    <Col span={3} key={index} className="day-of-week" style={{ backgroundColor: dayjs(displayedDates[index]).format('DD MM YYYY') === dayjs().format('DD MM YYYY') && "rgba(34, 99, 167, 0.07)" }}>
                        <Typography.Text style={{ color: today === index ? 'black' : 'inherit' }}>
                            {day} 
                        </Typography.Text>
                        {/* <div>{dayjs(displayedDates[index]).format('DD')}</div> */}
                    </Col>
                ))}
                <Col span={3} className="day-of-week week">
                    <Typography.Text className='fs-12 fw-500'>All Days</Typography.Text>
                </Col>
                {daysOfWeek.map((day, index) => (
                    <Col span={3} key={`date-${index}`} className="day-of-week week" style={{ backgroundColor: dayjs(displayedDates[index]).format('DD MM YYYY') === dayjs().format('DD MM YYYY') && "rgba(34, 99, 167, 0.07)" }}>
                        <Typography.Text>{dayjs(displayedDates[index]).format('DD')}</Typography.Text>
                    </Col>
                ))}
                {timeSlots.map((time, index) => (
                    <React.Fragment key={index}>
                        <Col span={3} className="day-of-week week">
                            <Typography.Text className='fs-12'>{time}</Typography.Text>
                        </Col>
                        {displayedDates.map((date, dayIndex) => {
                            const dayEvents = getEventsForDateTime(new Date(date), time);
                            return (
                                <Col 
                                    span={3} 
                                    key={`${index}-${dayIndex}`} 
                                    className="day-of-week week" 
                                    style={{ backgroundColor: dayjs(date).format('DD MM YYYY') === dayjs().format('DD MM YYYY') && "rgba(34, 99, 167, 0.07)" }}
                                >
                                    {dayEvents.map((event, eventIndex) => (
                                        <div 
                                            key={eventIndex}
                                            className={event.type === "Video" ? "listStyleVideo1" : event.type === "Audio" ? "listStyleAudio1" : "listStyleInperson1"}
                                            style={{ textTransform: "capitalize", marginBottom: '2px' }}
                                        >
                                            {event.title}
                                        </div>
                                    ))}
                                </Col>
                            );
                        })}
                    </React.Fragment>
                ))}
            </Row>
        </div>
    );
};

export default DaysOfWeek;