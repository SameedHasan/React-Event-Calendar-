import { createStore } from 'zustand/vanilla';
import { getDayIndex, calculateWeekRange, getIsoWeekNumber } from '../utils/dateHelpers';
import { getVisibleDateRange } from '../utils/getVisibleDateRange';
import { expandRecurringEvents } from '../utils/recurrence';

const buildWeekRangeState = (date, startOfWeek) => {
    const weekNumber = getIsoWeekNumber(date);
    const { start, end, startDate, endDate } = calculateWeekRange(date, startOfWeek);

    return {
        count: weekNumber,
        range: `${start} - ${end}`,
        startDate,
        endDate,
    };
};

export const createCalendarStore = (initialState = {}) => {
    const startOfWeek = initialState.startOfWeek || 'monday';
    const today = new Date();

    return createStore((set, get) => ({
        currentDate: today.toISOString(),
        view: initialState.defaultView || 'month',
        startOfWeek,
        timeFormat: '12h',
        weekRange: buildWeekRangeState(today, startOfWeek),
        currentWeek: today.toISOString(),
        currentDayIndex: getDayIndex(today, startOfWeek),
        /** Raw events from props / CRUD (masters with RRULE). */
        sourceEvents: [],
        /** Expanded instances for the active visible range (includes recurring occurrences). */
        events: [],
        categories: ['Meeting', 'Workshop', 'Call', 'Social', 'Review', 'Planning', 'Conference'],

        onDateChange: null,
        onViewChange: null,
        onEventDrop: null,
        onEventResize: null,
        disableDrag: false,
        disableResize: false,
        hideWeekends: false,
        showWeekNumbers: false,
        showToolbar: true,
        showExportButton: false,
        showAddEventButton: true,
        allowDateClick: true,
        readOnly: false,
        eventColors: {},
        theme: 'light',
        onEventClick: null,
        onDateClick: null,
        loading: false,
        timezone: null,
        locale: null,
        antdLocale: null,
        /** Set to the resolved dayjs locale code once the async bundle is loaded. */
        localeReady: null,
        renderEvent: null,
        renderEventTooltip: null,
        renderToolbar: null,
        renderEmpty: null,

        isModalOpen: false,
        selectedEvent: null,
        prepopulatedStartDate: null,
        callbacks: {
            onAddEvent: null,
            onUpdateEvent: null,
            onDeleteEvent: null,
        },

        setLocaleReady: (code) => set({ localeReady: code }),

        setConfigs: (configs) => {
            const state = get();
            const updates = {};
            let changed = false;

            for (const key in configs) {
                const val1 = state[key];
                const val2 = configs[key];

                if (val1 && val2 && typeof val1 === 'object' && typeof val2 === 'object') {
                    if (JSON.stringify(val1) !== JSON.stringify(val2)) {
                        updates[key] = val2;
                        changed = true;
                    }
                } else if (val1 !== val2) {
                    updates[key] = val2;
                    changed = true;
                }
            }

            if (changed) {
                set(updates);
            }
        },

        setCallbacks: (callbacks) => {
            const state = get();
            const updates = {};
            let changed = false;

            for (const key in callbacks) {
                if (state.callbacks[key] !== callbacks[key]) {
                    updates[key] = callbacks[key];
                    changed = true;
                }
            }

            if (changed) {
                set({ callbacks: { ...state.callbacks, ...updates } });
            }
        },

        openCreateModal: (date) => {
            if (get().readOnly) return;
            set({
                isModalOpen: true,
                selectedEvent: null,
                prepopulatedStartDate: date ? date.toISOString() : null,
            });
        },

        openEditModal: (event) => {
            if (get().readOnly) return;
            const state = get();
            const master = event?.recurrenceMasterId
                ? state.sourceEvents.find((e) => e.id === event.recurrenceMasterId) || event
                : event;
            set({ isModalOpen: true, selectedEvent: master, prepopulatedStartDate: null });
        },

        closeModal: () => set({ isModalOpen: false, selectedEvent: null, prepopulatedStartDate: null }),

        addEvent: (newEvent) => {
            if (get().readOnly) return;
            const state = get();
            if (state.callbacks.onAddEvent) {
                state.callbacks.onAddEvent(newEvent);
            } else {
                set({ sourceEvents: [...state.sourceEvents, newEvent] });
                get().recomputeExpandedEvents();
            }
        },

        updateEvent: (updatedEvent) => {
            if (get().readOnly) return;
            const state = get();
            if (state.callbacks.onUpdateEvent) {
                state.callbacks.onUpdateEvent(updatedEvent);
            } else {
                set({
                    sourceEvents: state.sourceEvents.map((e) =>
                        e.id === updatedEvent.id ? updatedEvent : e
                    ),
                });
                get().recomputeExpandedEvents();
            }
        },

        deleteEvent: (eventId) => {
            if (get().readOnly) return;
            const state = get();
            if (state.callbacks.onDeleteEvent) {
                state.callbacks.onDeleteEvent(eventId);
            } else {
                set({ sourceEvents: state.sourceEvents.filter((e) => e.id !== eventId) });
                get().recomputeExpandedEvents();
            }
        },

        setStartOfWeek: (nextStartOfWeek) => {
            const state = get();
            const cleanedStartOfWeek = String(nextStartOfWeek || 'monday').toLowerCase();
            const activeDate = new Date(state.currentDate);

            set({
                startOfWeek: cleanedStartOfWeek,
                currentDayIndex: getDayIndex(activeDate, cleanedStartOfWeek),
                weekRange: buildWeekRangeState(activeDate, cleanedStartOfWeek),
            });
        },

        setTimeFormat: (timeFormat) => {
            set({ timeFormat: timeFormat === '24h' ? '24h' : '12h' });
        },

        setCategories: (categories) => {
            if (Array.isArray(categories)) {
                set({ categories });
            }
        },

        previousMonth: () => {
            const state = get();
            const currentDate = new Date(state.currentDate);
            const newDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() - 1,
                currentDate.getDate()
            );
            set({ currentDate: newDate.toISOString() });
            if (state.onDateChange) state.onDateChange(newDate);
        },

        nextMonth: () => {
            const state = get();
            const currentDate = new Date(state.currentDate);
            const newDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + 1,
                currentDate.getDate()
            );
            set({ currentDate: newDate.toISOString() });
            if (state.onDateChange) state.onDateChange(newDate);
        },

        previousYear: () => {
            const state = get();
            const currentDate = new Date(state.currentDate);
            const newDate = new Date(
                currentDate.getFullYear() - 1,
                currentDate.getMonth(),
                currentDate.getDate()
            );
            set({ currentDate: newDate.toISOString() });
            if (state.onDateChange) state.onDateChange(newDate);
        },

        nextYear: () => {
            const state = get();
            const currentDate = new Date(state.currentDate);
            const newDate = new Date(
                currentDate.getFullYear() + 1,
                currentDate.getMonth(),
                currentDate.getDate()
            );
            set({ currentDate: newDate.toISOString() });
            if (state.onDateChange) state.onDateChange(newDate);
        },

        setCurrentDate: (date, options = { notify: true }) => {
            const newDate = date ? new Date(date) : new Date();
            const state = get();
            const prevTime = new Date(state.currentDate).getTime();
            const nextTime = newDate.getTime();

            if (prevTime === nextTime) {
                return;
            }

            set({ currentDate: newDate.toISOString() });
            if (options.notify !== false && state.onDateChange) {
                state.onDateChange(newDate);
            }
        },

        setView: (view, options = { notify: true }) => {
            set({ view });
            const state = get();
            if (options.notify !== false && state.onViewChange) {
                state.onViewChange(view);
            }
        },

        setEvents: (events) => {
            set({ sourceEvents: Array.isArray(events) ? events : [] });
            get().recomputeExpandedEvents();
        },

        recomputeExpandedEvents: () => {
            const state = get();
            const { start, end } = getVisibleDateRange(state);
            const expanded = expandRecurringEvents(state.sourceEvents, start, end);
            set({ events: expanded });
        },

        setWeekRange: (weekRange) => {
            set({ weekRange });
        },

        /** Rebuilds the display `range` string using the active dayjs locale. */
        rebuildWeekRange: () => {
            const state = get();
            set({
                weekRange: buildWeekRangeState(new Date(state.currentWeek), state.startOfWeek),
            });
        },

        setCurrentWeek: (currentWeek) => {
            set({ currentWeek: new Date(currentWeek).toISOString() });
        },

        incrementWeek: () => {
            const state = get();
            const newWeek = new Date(state.currentWeek);
            newWeek.setDate(newWeek.getDate() + 7);
            set({
                currentWeek: newWeek.toISOString(),
                weekRange: buildWeekRangeState(newWeek, state.startOfWeek),
            });
            if (state.onDateChange) state.onDateChange(newWeek);
        },

        decrementWeek: () => {
            const state = get();
            const newWeek = new Date(state.currentWeek);
            newWeek.setDate(newWeek.getDate() - 7);
            set({
                currentWeek: newWeek.toISOString(),
                weekRange: buildWeekRangeState(newWeek, state.startOfWeek),
            });
            if (state.onDateChange) state.onDateChange(newWeek);
        },

        handleNextandPrevDay: (dayIndex) => {
            set({ currentDayIndex: dayIndex });
            const state = get();
            if (state.onDateChange) {
                const activeWeek = new Date(state.currentWeek);
                const { start } = calculateWeekRange(activeWeek, state.startOfWeek);
                const parsedStart = new Date(start);
                parsedStart.setDate(parsedStart.getDate() + dayIndex);
                state.onDateChange(parsedStart);
            }
        },

        goToToday: () => {
            const today = new Date();
            const state = get();

            set({ currentDate: today.toISOString() });

            if (state.view === 'week' || state.view === 'day' || state.view === 'list') {
                set({
                    currentWeek: today.toISOString(),
                    currentDayIndex: getDayIndex(today, state.startOfWeek),
                    weekRange: buildWeekRangeState(today, state.startOfWeek),
                });
            }
            if (state.onDateChange) state.onDateChange(today);
        },
    }));
};
