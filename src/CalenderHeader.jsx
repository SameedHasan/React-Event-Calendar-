import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Col, Row, Space, Typography } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nextMonth, previousMonth, nextYear, previousYear, setView, decrementWeek, incrementWeek, handleNextandPrevDay } from './store/calendarSlice';
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
                <Typography.Title level={4} className='mb-0' style={{ textAlign: "center" }}>
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
            </Col>

            <Col span={6} className='text-right'>
                  <Space.Compact>
                <Button
                    onClick={() => dispatch(setView('month'))}
                    type='primary'
                >
                    Month View
                </Button>
                <Button
                    onClick={() => dispatch(setView('week'))}
                    type='primary'
                >
                    Week View
                </Button>
                <Button
                    onClick={() => dispatch(setView('day'))}
                    type='primary'
                >
                    Day View
                </Button>
                <Button
                    onClick={() => dispatch(setView('list'))}
                    type='primary'
                >
                    List View
                </Button>
                <Button
                    onClick={() => dispatch(setView('year'))}
                    type='primary'
                >
                    Year View
                </Button>
            </Space.Compact>
            </Col>


        </Row>
    );
}

export default CalendarHeader;