import React from 'react';
import { useSelector } from 'react-redux';
import { Typography, Badge, Row, Col, Tag } from 'antd';
import dayjs from 'dayjs';
import eventsData from './eventsData';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const getWeekNumber = (date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - startOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
};

const CalenderMonthView = () => {
    const currentDate = useSelector((state) => state.calendar.currentDate);
    const currentDate_ = new Date(currentDate);

    // Function to get events for a specific date
    const getEventsForDate = (date) => {
        return eventsData.filter(event => {
            const eventDate = new Date(event.start);
            return eventDate.getDate() === date.getDate() &&
                   eventDate.getMonth() === date.getMonth() &&
                   eventDate.getFullYear() === date.getFullYear();
        });
    };

    const renderDaysOfWeek = () => {
        return daysOfWeek.map((day, index) => (
            <Col key={index} className="day-of-week">
                <Typography.Text>{day}</Typography.Text>
            </Col>
        ));
    };

    const renderDaysOfMonth = () => {
        const startOfMonth = new Date(currentDate_.getFullYear(), currentDate_.getMonth(), 1);
        const endOfMonth = new Date(currentDate_.getFullYear(), currentDate_.getMonth() + 1, 0);
        const daysInMonth = [];
        let currentWeekNumber = getWeekNumber(startOfMonth);
        
        // Previous month days (Monday-first week)
        const startDay = startOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const mondayOffset = startDay === 0 ? 6 : startDay - 1; // Convert to Monday-first (0 = Monday)
        
        for (let i = 0; i < mondayOffset; i++) {
            const daysBeforeStart = mondayOffset - i;
            const prevMonthDate = new Date(currentDate_.getFullYear(), currentDate_.getMonth(), -daysBeforeStart + 1);
            if (i === 0) {
                daysInMonth.push(
                    <Col key={`empty-start-${i}`} className="day empty">
                        <Tag color='geekblue' style={{ padding: "0px 10px", position: "absolute", left: 3, top: 3 }}>Week {currentWeekNumber}</Tag>
                        <div className='daycount prev-month'>{prevMonthDate.getDate()}</div>
                    </Col>
                );
            } else {
                daysInMonth.push(
                    <Col key={`empty-start-${i}`} className="day empty">
                        <div className='daycount prev-month'>{prevMonthDate.getDate()}</div>
                    </Col>
                );
            }
        }
        
        // Current month days
        for (let day = 1; day <= endOfMonth.getDate(); day++) {
            const date = new Date(currentDate_.getFullYear(), currentDate_.getMonth(), day);
            const today = new Date();
            const isToday = today.toDateString() === date.toDateString();
            const isMonday = date.getDay() === 1;
            const dayEvents = getEventsForDate(date);
            
            if (isMonday) {
                currentWeekNumber = getWeekNumber(date);
                daysInMonth.push(
                    <Col key={day} className="day" style={{ backgroundColor: isToday ? "#2263a712" : "" }}>
                        <Tag color='geekblue' style={{ padding: "0px 10px", position: "absolute", left: 3, top: 3 }}>Week {currentWeekNumber}</Tag>
                        <div className='daycount'>{day}</div>
                        <ul style={{ marginTop: "12px" }}>
                            {dayEvents.slice(0, 3).map((event, i) => (
                                <li 
                                    key={i} 
                                    className={event.type === "Video" ? "listStyleVideo" : event.type === "Audio" ? "listStyleAudio" : "listStyleInperson"}
                                    style={{ textTransform: "capitalize" }}
                                >
                                    {dayjs(event.start).format("h:mm A")} {event.title}
                                </li>
                            ))}
                            {dayEvents.length > 3 && (
                                <li className="listStyleInperson" style={{ textTransform: "capitalize" }}>
                                    +{dayEvents.length - 3} more
                                </li>
                            )}
                        </ul>
                    </Col>
                );
            } else {
                daysInMonth.push(
                    <Col key={day} className="day" style={{ backgroundColor: isToday ? "#2263a712" : "" }}>
                        <div className='daycount'>{day}</div>
                        <ul style={{ marginTop: "15px" }}>
                            {dayEvents.slice(0, 3).map((event, i) => (
                                <li 
                                    key={i} 
                                    className={event.type === "Video" ? "listStyleVideo" : event.type === "Audio" ? "listStyleAudio" : "listStyleInperson"}
                                    style={{ textTransform: "capitalize" }}
                                >
                                    {dayjs(event.start).format("h:mm A")} {event.title}
                                </li>
                            ))}
                            {dayEvents.length > 3 && (
                                <li className="listStyleInperson" style={{ textTransform: "capitalize" }}>
                                    +{dayEvents.length - 3} more
                                </li>
                            )}
                        </ul>
                    </Col>
                );
            }
        }

        // Next month days (Monday-first week) - only add if week is incomplete
        const endDay = endOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const totalDaysInGrid = mondayOffset + endOfMonth.getDate(); // Total days already in grid
        const remainingDays = (7 - (totalDaysInGrid % 7)) % 7; // Days needed to complete the week
        
        // Only add next month days if there are remaining days to complete the week
        if (remainingDays > 0) {
            for (let i = 0, day = 1; i < remainingDays; i++, day++) {
                if (i === 0 && endDay === 0) { // If month ends on Sunday, next Monday starts new week
                    currentWeekNumber = getWeekNumber(new Date(currentDate_.getFullYear(), currentDate_.getMonth() + 1, 0));
                    daysInMonth.push(
                        <Col key={`empty-end-${i}`} className="day empty">
                            <Badge count={`W ${currentWeekNumber}`} style={{ backgroundColor: 'green' }} />
                            <div className='daycount next-month'>{day}</div>
                        </Col>
                    );
                } else {
                    daysInMonth.push(
                        <Col key={`empty-end-${i}`} className="day empty">
                            <div className='daycount next-month'>{day}</div>
                        </Col>
                    );
                }
            }
        }

        return daysInMonth;
    };

    return (
        <>
            <Row className="calendar-days-of-week">
                {renderDaysOfWeek()}
            </Row>
            <Row className="calendar-days">
                {renderDaysOfMonth()}
            </Row>
        </>
    );
};

export default CalenderMonthView;