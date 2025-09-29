import React, { useEffect } from 'react';
import { Row, Col, Typography } from 'antd';
import useCalendarStore from './store/useCalendarStore';
import dayjs from 'dayjs';
import eventsData from './eventsData';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const CalenderDayView = () => {
    const { weekRange, currentWeek, currentDayIndex, setWeekRange } = useCalendarStore();

    // Generate time slots for each hour from 7 AM to 8 PM
    const generateTimeSlots = () => {
        const timeSlots = [];
        for (let hour = 0; hour < 24; hour++) {
            const period = hour < 12 ? 'AM' : 'PM';
            const displayHour = hour % 12 === 0 ? 12 : hour % 12;
            timeSlots.push(`${displayHour} ${period}`);
        }
        return timeSlots;
    };
    const timeSlots = generateTimeSlots();

    // Calculate the date for the selected day in the current week (Monday-first)
    const getDateForCurrentDay = () => {
        const weekStart = dayjs(currentWeek).startOf('week').add(1, 'day'); // Start from Monday
        return weekStart.add(currentDayIndex, 'day').toDate();
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

    // Get events for a specific date and time
    const getEventsForDateTime = (date, time) => {
        const dateTime = combineDateAndTime(date, time);
        const nextHour = new Date(dateTime);
        nextHour.setHours(nextHour.getHours() + 1);
        
        return eventsData.filter(event => {
            return event.start >= dateTime && event.start < nextHour;
        });
    };

    useEffect(() => {
        const weekNumber = dayjs(currentWeek).week();
        const start = dayjs(currentWeek).startOf('week').add(1, 'day').format('MMM D, YYYY'); // Monday
        const end = dayjs(currentWeek).endOf('week').add(1, 'day').format('MMM D, YYYY'); // Sunday
        
        setWeekRange({
            count: weekNumber,
            range: `${start} - ${end}`
        });
    }, [setWeekRange, currentWeek]);

    const currentDate = getDateForCurrentDay(); // Fetches the date for the current day in the week

    return (
        <div>
            <Row className="calendar-days-of-week">
                <Col span={3} className="day-of-week">
                    <Typography.Text className='fw-500 fs-12'>Weeks {weekRange && weekRange.count}</Typography.Text>
                </Col>

                <Col span={21} className="day-of-week">
                    <Typography.Text>{daysOfWeek[currentDayIndex]}, {dayjs(currentDate).format('MMMM D, YYYY')}</Typography.Text>
                </Col>

                {timeSlots.map((time, index) => {
                    const timeEvents = getEventsForDateTime(currentDate, time);
                    return (
                        <React.Fragment key={index}>
                            <Col span={3} className="day-of-week week">
                                <Typography.Text className='fs-12'>{time}</Typography.Text>
                            </Col>
                            <Col span={21} className="day-of-week week">
                                {timeEvents.map((event, eventIndex) => (
                                    <div 
                                        key={eventIndex}
                                        className={event.type === "Video" ? "listStyleVideo1" : event.type === "Audio" ? "listStyleAudio1" : "listStyleInperson1"}
                                        style={{ textTransform: "capitalize", marginBottom: '4px' }}
                                    >
                                        {dayjs(event.start).format("h:mm A")} - {dayjs(event.end).format("h:mm A")}: {event.title}
                                    </div>
                                ))}
                            </Col>
                        </React.Fragment>
                    );
                })}
            </Row>
        </div>
    );
};

export default CalenderDayView;