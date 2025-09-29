import React from 'react';
import { Row, Col, Typography, Card, Badge, List } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { setView, setCurrentDate } from './store/calendarSlice';
import dayjs from 'dayjs';
import eventsData from './eventsData';

const { Title, Text } = Typography;

const CalenderYearView = () => {
    const { currentDate } = useSelector(state => state.calendar);
    const dispatch = useDispatch();
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
        dispatch(setCurrentDate(newDate.toISOString()));
        dispatch(setView('month'));
    };

    const getEventTypeCount = (events, type) => {
        return events.filter(event => event.type === type).length;
    };

    const getEventTypeIcon = (type) => {
        switch (type) {
            case 'Video':
                return '📹';
            case 'Audio':
                return '🎤';
            case 'Inperson':
                return '👥';
            default:
                return '📅';
        }
    };

    return (
        <div style={{ padding: '20px 0' }}>
            {/* <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>
                {currentYear}
            </Title> */}
            
            <Row gutter={[16, 16]}>
                {months.map((month) => {
                    const monthEvents = getEventsForMonth(month.number);
                    const isCurrentMonth = isCurrentYear && month.number === currentMonth;
                    const videoCount = getEventTypeCount(monthEvents, 'Video');
                    const audioCount = getEventTypeCount(monthEvents, 'Audio');
                    const inpersonCount = getEventTypeCount(monthEvents, 'Inperson');
                    const totalEvents = monthEvents.length;

                    return (
                        <Col xs={24} sm={12} md={8} lg={6} key={month.number}>
                            <Card
                                hoverable
                                onClick={() => handleMonthClick(month.number)}
                                style={{
                                    height: '200px',
                                    cursor: 'pointer',
                                    backgroundColor: isCurrentMonth ? '#e6f7ff' : '#fff',
                                    border: isCurrentMonth ? '2px solid #1890ff' : '1px solid #d9d9d9',
                                    borderRadius: '8px',
                                    position: 'relative'
                                }}
                                bodyStyle={{ padding: '16px', height: '100%' }}
                            >
                                {/* Month name */}
                                <div style={{ 
                                    position: 'absolute', 
                                    top: '8px', 
                                    right: '8px',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    color: isCurrentMonth ? '#1890ff' : '#666'
                                }}>
                                    {month.name}
                                </div>

                                {/* Event counts */}
                                <div style={{ marginTop: '20px' }}>
                                    <div style={{ 
                                        fontSize: '24px', 
                                        fontWeight: 'bold', 
                                        color: '#1890ff',
                                        textAlign: 'center',
                                        marginBottom: '8px'
                                    }}>
                                        {totalEvents}
                                    </div>
                                    <Text style={{ 
                                        fontSize: '12px', 
                                        color: '#666',
                                        display: 'block',
                                        textAlign: 'center',
                                        marginBottom: '12px'
                                    }}>
                                        Total Events
                                    </Text>

                                    {/* Event type breakdown */}
                                    <div style={{ fontSize: '11px', color: '#666' }}>
                                        {videoCount > 0 && (
                                            <div style={{ marginBottom: '4px' }}>
                                                <span style={{ marginRight: '4px' }}>📹</span>
                                                <span>{videoCount} Video</span>
                                            </div>
                                        )}
                                        {audioCount > 0 && (
                                            <div style={{ marginBottom: '4px' }}>
                                                <span style={{ marginRight: '4px' }}>🎤</span>
                                                <span>{audioCount} Audio</span>
                                            </div>
                                        )}
                                        {inpersonCount > 0 && (
                                            <div style={{ marginBottom: '4px' }}>
                                                <span style={{ marginRight: '4px' }}>👥</span>
                                                <span>{inpersonCount} In-person</span>
                                            </div>
                                        )}
                                        {totalEvents === 0 && (
                                            <div style={{ textAlign: 'center', color: '#ccc', fontSize: '10px' }}>
                                                No events
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Recent events preview */}
                                {monthEvents.length > 0 && (
                                    <div style={{ 
                                        position: 'absolute', 
                                        bottom: '8px', 
                                        left: '8px', 
                                        right: '8px',
                                        fontSize: '10px',
                                        color: '#999'
                                    }}>
                                        <div style={{ 
                                            overflow: 'hidden', 
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            Latest: {dayjs(monthEvents[monthEvents.length - 1]?.start).format('MMM D')}
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        </div>
    );
};

export default CalenderYearView;
