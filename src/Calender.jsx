// src/components/Calendar.js
import React from 'react';

import CalenderHeader from './CalenderHeader';
import CalenderMonthView from './CalenderMonthView';
import { useSelector } from 'react-redux';
import DaysOfWeek from './DaysOfWeek';
import CalenderDayView from './CalenderDayView';
import CalenderListView from './CalenderListView';


const Calendar = () => {
    const { view } = useSelector(state => state.calendar)
    return (
        <div style={{ margin: "20px 16px", padding: "20px", height: `calc(100vh - 104px)`, overflow: "auto", backgroundColor: "var(--white-color)" }}>
            <CalenderHeader />
            {view === "month" &&
                <CalenderMonthView />
            }
            {view === "week" &&
                <DaysOfWeek />}
            {view === "day" &&
                <CalenderDayView />}
            {view === "list" &&
                <CalenderListView />}
        </div>
    );
};

export default Calendar;