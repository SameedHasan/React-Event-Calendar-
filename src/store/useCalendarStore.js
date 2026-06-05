import { create } from 'zustand';
import { getDayIndex, calculateWeekRange } from '../utils/dateHelpers';

const getWeekNumber = (date) => {
    const start = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - start) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + start.getDay() + 1) / 7);
};

const useCalendarStore = create((set, get) => ({
    // Initial state
    currentDate: new Date().toISOString(),
    view: "month",
    startOfWeek: "monday",
    timeFormat: "12h",
    weekRange: {
        count: "",
        range: ""
    },
    currentWeek: new Date().toISOString(),
    currentDayIndex: getDayIndex(new Date(), "monday"),
    events: [], // Populated via setEvents — pass your own events array as a prop

    // Configuration Actions
    setStartOfWeek: (startOfWeek) => {
        const state = get();
        const cleanedStartOfWeek = String(startOfWeek || 'monday').toLowerCase();
        const today = new Date(state.currentDate);
        const weekNumber = getWeekNumber(today);
        const { start, end } = calculateWeekRange(today, cleanedStartOfWeek);
        const currentDayIndex = getDayIndex(today, cleanedStartOfWeek);
        
        set({
            startOfWeek: cleanedStartOfWeek,
            currentDayIndex,
            weekRange: {
                count: weekNumber,
                range: `${start} - ${end}`
            }
        });
    },

    setTimeFormat: (timeFormat) => {
        set({ timeFormat: timeFormat === '24h' ? '24h' : '12h' });
    },

    // Actions
    previousMonth: () => {
        const state = get();
        const currentDate = new Date(state.currentDate);
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
        set({ currentDate: newDate.toISOString() });
    },

    nextMonth: () => {
        const state = get();
        const currentDate = new Date(state.currentDate);
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
        set({ currentDate: newDate.toISOString() });
    },

    previousYear: () => {
        const state = get();
        const currentDate = new Date(state.currentDate);
        const newDate = new Date(currentDate.getFullYear() - 1, currentDate.getMonth());
        set({ currentDate: newDate.toISOString() });
    },

    nextYear: () => {
        const state = get();
        const currentDate = new Date(state.currentDate);
        const newDate = new Date(currentDate.getFullYear() + 1, currentDate.getMonth());
        set({ currentDate: newDate.toISOString() });
    },

    setCurrentDate: (date) => {
        set({ currentDate: date ? new Date(date).toISOString() : new Date().toISOString() });
    },

    setView: (view) => {
        set({ view });
    },

    setEvents: (events) => {
        set({ events: Array.isArray(events) ? events : [] });
    },

    setWeekRange: (weekRange) => {
        set({ weekRange });
    },

    setCurrentWeek: (currentWeek) => {
        set({ currentWeek: new Date(currentWeek).toISOString() });
    },

    incrementWeek: () => {
        const state = get();
        const newWeek = new Date(state.currentWeek);
        newWeek.setDate(newWeek.getDate() + 7);
        const weekNumber = getWeekNumber(newWeek);
        const { start, end } = calculateWeekRange(newWeek, state.startOfWeek);
        set({
            currentWeek: newWeek.toISOString(),
            weekRange: {
                count: weekNumber,
                range: `${start} - ${end}`
            }
        });
    },

    decrementWeek: () => {
        const state = get();
        const newWeek = new Date(state.currentWeek);
        newWeek.setDate(newWeek.getDate() - 7);
        const weekNumber = getWeekNumber(newWeek);
        const { start, end } = calculateWeekRange(newWeek, state.startOfWeek);
        set({
            currentWeek: newWeek.toISOString(),
            weekRange: {
                count: weekNumber,
                range: `${start} - ${end}`
            }
        });
    },

    handleNextandPrevDay: (dayIndex) => {
        set({ currentDayIndex: dayIndex });
    },

    // Helper function to reset to today
    goToToday: () => {
        const today = new Date();
        const state = get();
        
        set({ currentDate: today.toISOString() });
        
        if (state.view === 'week' || state.view === 'day' || state.view === 'list') {
            const currentDayIndex = getDayIndex(today, state.startOfWeek);
            const weekNumber = getWeekNumber(today);
            const { start, end } = calculateWeekRange(today, state.startOfWeek);
            set({
                currentWeek: today.toISOString(),
                currentDayIndex: currentDayIndex,
                weekRange: {
                    count: weekNumber,
                    range: `${start} - ${end}`
                }
            });
        }
    }
}));


export default useCalendarStore;
