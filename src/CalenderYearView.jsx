import React from 'react';
import { Row, Col, Typography, Card, Badge, List, Flex } from 'antd';
import useCalendarStore from './store/useCalendarStore';
import dayjs from 'dayjs';
import eventsData from './eventsData';

const { Title, Text } = Typography;

const CalenderYearView = () => {
    const { currentDate, setView, setCurrentDate } = useCalendarStore();
    const currentYear = new Date(currentDate).getFullYear();

    const months = [
        { name: 'Jan', number: 0 },
        { name: 'Feb', number: 1 },
        { name: 'Mar', number: 2 },
        { name: 'Apr', number: 3 },
        { name: 'May', number: 4 },
        { name: 'Jun', number: 5 },
        { name: 'Jul', number: 6 },
        { name: 'Aug', number: 7 },
        { name: 'Sep', number: 8 },
        { name: 'Oct', number: 9 },
        { name: 'Nov', number: 10 },
        { name: 'Dec', number: 11 }
    ];

    // Get events for a specific month
    const getEventsForMonth = (monthNumber) => {
        return eventsData.filter(event => {
            const eventDate = new Date(event.start);
            return eventDate.getMonth() === monthNumber &&
                eventDate.getFullYear() === currentYear;
        });
    };

    // Get current month (highlighted)
    const currentMonth = new Date().getMonth();
    const isCurrentYear = new Date().getFullYear() === currentYear;

    const handleMonthClick = (monthNumber) => {
        const newDate = new Date(currentYear, monthNumber, 1);
        setCurrentDate(newDate.toISOString());
        setView('month');
    };

    const getEventTypeCount = (events, type) => {
        return events.filter(event => event.type === type).length;
    };

    return (
        <div style={{ padding: '20px 0' }}>
            <Row gutter={[16, 16]}>
                {months.map((month) => {
                    const monthEvents = getEventsForMonth(month.number);
                    const isCurrentMonth = isCurrentYear && month.number === currentMonth;
                    const totalEvents = monthEvents.length;

                    return (
                        <Col xs={24} sm={12} md={8} lg={6} key={month.number}>
                            <Card
                                hoverable
                                onClick={() => handleMonthClick(month.number)}
                                style={{
                                    cursor: 'pointer',
                                    fontFamily: 'Neue Haas Grotesk Display, sans-serif',
                                    backgroundColor: isCurrentMonth ? '#e6f7ff' : '#fff',
                                    border: isCurrentMonth ? '1px solid #1272bf' : '1px solid #d9d9d9',
                                    borderRadius: '8px',
                                    position: 'relative',
                                }}
                            >
                                {/* Month name */}
                                <div
                                    style={{
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: isCurrentMonth ? '#1272bf' : '#666',
                                    }}
                                >
                                    {month.name}
                                </div>

                                {/* Event counts */}
                                <Flex align='center' vertical>
                                    <Title level={2} className={isCurrentMonth ? 'text-center text-themePrimary' : 'text-center'} style={{ margin: 0 }}>
                                        {totalEvents}
                                    </Title>
                                    <small className='text-center'> Total Sessions</small>

                                </Flex>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        </div>
    );
};

export default CalenderYearView;
