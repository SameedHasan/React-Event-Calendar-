import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentDate: new Date().toISOString(),
    view: "month",
    weekRange: {
        count: "",
        range: ""
    },
    currentWeek: new Date().toISOString(),
    currentDayIndex: new Date().getDay() === 0 ? 6 : new Date().getDay() - 1 // Convert to Monday-first (0=Mon, 6=Sun)
};

const getWeekNumber = (date) => {
    const start = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - start) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + start.getDay() + 1) / 7);
};

const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const calculateWeekRange = (date) => {
    const start = new Date(date);
    const end = new Date(date);
    const day = start.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const mondayOffset = day === 0 ? -6 : 1 - day; // Convert to Monday-first
    
    start.setDate(start.getDate() + mondayOffset); // Set to Monday
    end.setDate(start.getDate() + 6); // Set to Sunday

    return {
        start: formatDate(start),
        end: formatDate(end)
    };
};

const calendarSlice = createSlice({
    name: 'calendar',
    initialState,
    reducers: {
        previousMonth: (state) => {
            const currentDate = new Date(state.currentDate);
            state.currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1).toISOString();
        },
        nextMonth: (state) => {
            const currentDate = new Date(state.currentDate);
            state.currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1).toISOString();
        },
        setCurrentDate: (state, action) => {
            state.currentDate = new Date().toISOString();
        },
        setView: (state, action) => {
            state.view = action.payload;
        },
        setWeekRange: (state, action) => {
            state.weekRange = action.payload;
        },
        setCurrentWeek: (state, action) => {
            state.currentWeek = new Date(action.payload).toISOString();
        },
        incrementWeek: (state) => {
            const newWeek = new Date(state.currentWeek);
            newWeek.setDate(newWeek.getDate() + 7);
            state.currentWeek = newWeek.toISOString();
            const weekNumber = getWeekNumber(newWeek);
            const { start, end } = calculateWeekRange(newWeek);
            state.weekRange = {
                count: weekNumber,
                range: `${start} - ${end}`
            };
        },
        decrementWeek: (state) => {
            const newWeek = new Date(state.currentWeek);
            newWeek.setDate(newWeek.getDate() - 7);
            state.currentWeek = newWeek.toISOString();
            const weekNumber = getWeekNumber(newWeek);
            const { start, end } = calculateWeekRange(newWeek);
            state.weekRange = {
                count: weekNumber,
                range: `${start} - ${end}`
            };
        },
        handleNextandPrevDay: (state, action) => {
            state.currentDayIndex = action.payload;
        }
    },
});

export const { previousMonth, nextMonth, handleNextandPrevDay, setCurrentDate, setView, setWeekRange, setCurrentWeek, incrementWeek, decrementWeek } = calendarSlice.actions;
export default calendarSlice.reducer;
