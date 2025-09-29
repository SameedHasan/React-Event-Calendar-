import { LeftOutlined, RightOutlined, AimOutlined } from '@ant-design/icons';
import { Button, Col, Row, Space, Typography, Select } from 'antd';
import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import useCalendarStore from './store/useCalendarStore';

function CalendarHeader() {
    const {
        currentDate,
        view,
        weekRange,
        currentDayIndex,
        previousMonth,
        nextMonth,
        previousYear,
        nextYear,
        setView,
        decrementWeek,
        incrementWeek,
        handleNextandPrevDay,
        goToToday
    } = useCalendarStore();

    // Memoized navigation handlers
    const navigationHandlers = useMemo(() => ({
        month: { prev: previousMonth, next: nextMonth },
        year: { prev: previousYear, next: nextYear },
        week: { prev: decrementWeek, next: incrementWeek },
        day: {
            prev: () => {
                if (currentDayIndex > 0) {
                    handleNextandPrevDay(currentDayIndex - 1);
                } else {
                    handleNextandPrevDay(6);
                    decrementWeek();
                }
            },
            next: () => {
                if (currentDayIndex < 6) {
                    handleNextandPrevDay(currentDayIndex + 1);
                } else {
                    handleNextandPrevDay(0);
                    incrementWeek();
                }
            }
        },
        list: {
            prev: () => {
                if (currentDayIndex > 0) {
                    handleNextandPrevDay(currentDayIndex - 1);
                } else {
                    handleNextandPrevDay(6);
                    decrementWeek();
                }
            },
            next: () => {
                if (currentDayIndex < 6) {
                    handleNextandPrevDay(currentDayIndex + 1);
                } else {
                    handleNextandPrevDay(0);
                    incrementWeek();
                }
            }
        }
    }), [currentDayIndex, previousMonth, nextMonth, previousYear, nextYear, decrementWeek, incrementWeek, handleNextandPrevDay]);

    // Memoized current day date calculation
    const currentDayDate = useMemo(() => {
        if (view !== 'day' && view !== 'list') return null;

        const [startDateStr] = weekRange.range.split(" - ");
        const startDate = new Date(startDateStr);
        const weekStartDate = new Date(startDate);
        const dayOfWeek = weekStartDate.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        weekStartDate.setDate(weekStartDate.getDate() + mondayOffset);

        const currentDayDate = new Date(weekStartDate);
        currentDayDate.setDate(weekStartDate.getDate() + currentDayIndex);
        return currentDayDate.toLocaleDateString('default', { year: 'numeric', month: 'long', day: 'numeric' });
    }, [weekRange.range, currentDayIndex, view]);

    // Memoized title content
    const titleContent = useMemo(() => {
        switch (view) {
            case 'month':
                return dayjs(currentDate).format('MMM-YYYY');
            case 'year':
                return dayjs(currentDate).format('YYYY');
            case 'week':
                return weekRange.range;
            case 'day':
            case 'list':
                return currentDayDate;
            default:
                return '';
        }
    }, [view, currentDate, weekRange.range, currentDayDate]);

    // Navigation button component
    const NavigationButtons = () => {
        const handlers = navigationHandlers[view];
        if (!handlers) return null;

        const buttonStyle = view === 'month' || view === 'year'
            ? { border: 'none', minWidth: '50px' }
            : {};

        return (
            <Space.Compact>
                <Button
                    type='primary'
                    style={buttonStyle}
                    onClick={handlers.prev}
                >
                    <LeftOutlined />
                </Button>
                <Button
                    type='primary'
                    style={buttonStyle}
                    onClick={handlers.next}
                >
                    <RightOutlined />
                </Button>
            </Space.Compact>
        );
    };

    return (
        <Row className='mb-24' style={{ display: 'flex', alignItems: 'center' }}>
            <Col span={12}>
                <NavigationButtons />
            </Col>

            <Col span={6} className='text-center'>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                    <Typography.Title level={4} className='mb-0' style={{ textAlign: "center", margin: 0 }}>
                        {titleContent}
                    </Typography.Title>
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<AimOutlined />}
                        onClick={goToToday}
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
                    onChange={setView}
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