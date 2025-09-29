import { create } from 'zustand';

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

const useCalendarStore = create((set, get) => ({
    // Initial state
    currentDate: new Date().toISOString(),
    view: "month",
    weekRange: {
        count: "",
        range: ""
    },
    currentWeek: new Date().toISOString(),
    currentDayIndex: new Date().getDay() === 0 ? 6 : new Date().getDay() - 1, // Convert to Monday-first (0=Mon, 6=Sun)

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

    setCurrentDate: () => {
        set({ currentDate: new Date().toISOString() });
    },

    setView: (view) => {
        set({ view });
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
        const { start, end } = calculateWeekRange(newWeek);
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
        const { start, end } = calculateWeekRange(newWeek);
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
            const currentDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
            set({
                currentWeek: today.toISOString(),
                currentDayIndex: currentDayIndex
            });
        }
    }
}));

export default useCalendarStore;
