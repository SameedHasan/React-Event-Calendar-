import React, { useEffect } from 'react';
import { Row, Col, Typography, List } from 'antd';
import useCalendarStore from './store/useCalendarStore';
import dayjs from 'dayjs';
import { AudioOutlined, CustomerServiceOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import eventsData from './eventsData';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const CalenderListView = () => {
    const { weekRange, currentWeek, currentDayIndex, setWeekRange } = useCalendarStore();

    // Calculate the date for the selected day in the current week (Monday-first)
    const getDateForCurrentDay = () => {
        const weekStart = dayjs(currentWeek).startOf('week').add(1, 'day'); // Start from Monday
        return weekStart.add(currentDayIndex, 'day').toDate();
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
    
    // Sort events by date
    const sortedEvents = [...eventsData].sort((a, b) => new Date(a.start) - new Date(b.start));
    
    // Filter events for the current day
    const todaysEvents = sortedEvents.filter(event => {
        const eventDate = new Date(event.start);
        return eventDate.getDate() === currentDate.getDate() &&
               eventDate.getMonth() === currentDate.getMonth() &&
               eventDate.getFullYear() === currentDate.getFullYear();
    });

    const getIcon = (type) => {
        switch (type) {
            case 'Video':
                return <VideoCameraOutlined style={{ fontSize: '20px', color: '#2196F3' }} />;
            case 'Audio':
                return <CustomerServiceOutlined style={{ fontSize: '20px', color: 'red' }} />;
            default:
                return <UserOutlined style={{ fontSize: '20px', color: '#4CAF50' }} />;
        }
    };

    return (
        <div>
            <Row className="calendar-days-of-week">
                <Col span={24} className="day-of-week">
                    <Typography.Text>{daysOfWeek[currentDayIndex]}, {dayjs(currentDate).format('MMMM D, YYYY')}</Typography.Text>
                </Col>
                <Col span={24} className="day-of-week">
                    <List
                        dataSource={todaysEvents}
                        renderItem={(event) => (
                            <List.Item
                                key={event.id}
                                style={{ 
                                    padding: '12px 16px',
                                    border: '1px solid #e8e8e8',
                                    marginBottom: '8px',
                                    borderRadius: '4px'
                                }}
                            >
                                <List.Item.Meta
                                    avatar={getIcon(event.type)}
                                    title={<span>{event.title}</span>}
                                    description={
                                        <div>
                                            <div>{dayjs(event.start).format("h:mm A")} - {dayjs(event.end).format("h:mm A")}</div>
                                            <div>{event.description}</div>
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default CalenderListView;