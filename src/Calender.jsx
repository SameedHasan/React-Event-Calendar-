// src/components/Calendar.js
import React from 'react';
import CalenderHeader from './CalenderHeader';
import CalenderMonthView from './CalenderMonthView';
import useCalendarStore from './store/useCalendarStore';
import DaysOfWeek from './DaysOfWeek';
import CalenderDayView from './CalenderDayView';
import CalenderListView from './CalenderListView';
import CalenderYearView from './CalenderYearView';


const Calendar = () => {
    const { view } = useCalendarStore();
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
            {view === "year" &&
                <CalenderYearView />}
        </div>
    );
};

export default Calendar;