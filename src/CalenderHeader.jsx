import { LeftOutlined, RightOutlined, AimOutlined } from '@ant-design/icons';
import { Button, Col, Row, Space, Typography, Select } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nextMonth, previousMonth, nextYear, previousYear, setView, decrementWeek, incrementWeek, handleNextandPrevDay, setCurrentDate, setCurrentWeek } from './store/calendarSlice';
import dayjs from 'dayjs';

function CalendarHeader() {
    const { currentDate, view, weekRange, currentDayIndex } = useSelector((state) => state.calendar);
    const dispatch = useDispatch();

    const handlePreviousMonth = () => {
        dispatch(previousMonth());
    };
    const handleNextMonth = () => {
        dispatch(nextMonth());
    };
    const handlePreviousYear = () => {
        dispatch(previousYear());
    };
    const handleNextYear = () => {
        dispatch(nextYear());
    };

    const handleGoToToday = () => {
        const today = new Date();
        
        // Reset to current date based on view
        dispatch(setCurrentDate(today.toISOString()));
        
        if (view === 'week' || view === 'day' || view === 'list') {
            // For week/day/list views, also reset the current week and day index
            dispatch(setCurrentWeek(today.toISOString()));
            
            // Calculate current day index for Monday-first week (0=Monday, 6=Sunday)
            const currentDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
            dispatch(handleNextandPrevDay(currentDayIndex));
        }
    };

    const [startDateStr] = weekRange.range.split(" - ");
    const startDate = new Date(startDateStr);
    const getCurrentDayDate = () => {
        const weekStartDate = new Date(startDate);
        const dayOfWeek = weekStartDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Convert to Monday-first
        weekStartDate.setDate(weekStartDate.getDate() + mondayOffset); // Set to Monday
        
        const currentDayDate = new Date(weekStartDate);
        currentDayDate.setDate(weekStartDate.getDate() + currentDayIndex);
        return currentDayDate.toLocaleDateString('default', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        // Fixed header alignment with better flex properties
        <Row className='mb-24' style={{ display: 'flex', alignItems: 'center' }}>
            <Col span={12}>
                {view === 'month' && (
                    <Space.Compact>
                        <Button
                            type='primary'
                            style={{ border: 'none', minWidth: '50px' }}
                            onClick={handlePreviousMonth}
                        >
                            <LeftOutlined />
                        </Button>
                        <Button
                            onClick={handleNextMonth}
                            type='primary'
                            style={{ border: 'none', minWidth: '50px' }}
                        >
                            <RightOutlined />
                        </Button>
                    </Space.Compact>
                )}
                {view === 'year' && (
                    <Space.Compact>
                        <Button
                            type='primary'
                            style={{ border: 'none', minWidth: '50px' }}
                            onClick={handlePreviousYear}
                        >
                            <LeftOutlined />
                        </Button>
                        <Button
                            onClick={handleNextYear}
                            type='primary'
                            style={{ border: 'none', minWidth: '50px' }}
                        >
                            <RightOutlined />
                        </Button>
                    </Space.Compact>
                )}
                {view === 'week' && (
                    <Space.Compact>
                        <Button
                            type='primary'
                            onClick={() => dispatch(decrementWeek())}
                        >
                            <LeftOutlined />
                        </Button>
                        <Button
                            type='primary'
                            onClick={() => dispatch(incrementWeek())}
                        >
                            <RightOutlined />
                        </Button>
                    </Space.Compact>
                )}
                {view === 'day' && (
                    <Space.Compact>
                        <Button
                            type='primary'
                            onClick={() => {
                                if (currentDayIndex > 0) {
                                    dispatch(handleNextandPrevDay(currentDayIndex - 1));
                                } else {
                                    dispatch(handleNextandPrevDay(6));
                                    dispatch(decrementWeek());
                                }
                            }}
                        >
                            <LeftOutlined />
                        </Button>
                        <Button
                            onClick={() => {
                                if (currentDayIndex < 6) {
                                    dispatch(handleNextandPrevDay(currentDayIndex + 1));
                                } else {
                                    dispatch(handleNextandPrevDay(0));
                                    dispatch(incrementWeek());
                                }
                            }}
                            type='primary'
                        >
                            <RightOutlined />
                        </Button>
                    </Space.Compact>
                )}
                {view === 'list' && (
                    <Space.Compact>
                        <Button
                            type='primary'
                            onClick={() => {
                                if (currentDayIndex > 0) {
                                    dispatch(handleNextandPrevDay(currentDayIndex - 1));
                                } else {
                                    dispatch(handleNextandPrevDay(6));
                                    dispatch(decrementWeek());
                                }
                            }}
                        >
                            <LeftOutlined />
                        </Button>
                        <Button
                            type='primary'
                            onClick={() => {
                                if (currentDayIndex < 6) {
                                    dispatch(handleNextandPrevDay(currentDayIndex + 1));
                                } else {
                                    dispatch(handleNextandPrevDay(0));
                                    dispatch(incrementWeek());
                                }
                            }}
                        >
                            <RightOutlined />
                        </Button>
                    </Space.Compact>
                )}
            </Col>

            <Col span={6} className='text-center'>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                    <Typography.Title level={4} className='mb-0' style={{ textAlign: "center", margin: 0 }}>
                        {view === 'month' && (
                            <>
                                {dayjs(currentDate).format('MMM-YYYY')}
                            </>
                        )}
                        {view === 'year' && (
                            <>
                                {dayjs(currentDate).format('YYYY')}
                            </>
                        )}
                        {view === 'week' && <>{weekRange.range}</>}
                        {view === 'day' && <>{getCurrentDayDate()}</>}
                        {view === 'list' && <>{getCurrentDayDate()}</>}
                    </Typography.Title>
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<AimOutlined />}
                        onClick={handleGoToToday}
                        style={{
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                        title="Go to Today"
                    />
                </div>
            </Col>

            <Col span={6} className='text-right'>
                <Select
                    value={view}
                    onChange={(value) => dispatch(setView(value))}
                    style={{ width: 200 }}
                    options={[
                        { value: 'month', label: 'Month View' },
                        { value: 'week', label: 'Week View' },
                        { value: 'day', label: 'Day View' },
                        { value: 'list', label: 'List View' },
                        { value: 'year', label: 'Year View' }
                    ]}
                />
            </Col>


        </Row>
    );
}

export default CalendarHeader;