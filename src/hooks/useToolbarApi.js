import { useMemo, useCallback } from 'react';
import useCalendarStore from '../store/useCalendarStore';
import { exportEventsToICS } from '../utils/icsExport';
import { navigateNext, navigatePrev } from './useKeyboardShortcuts';

export function useToolbarApi() {
    const {
        view,
        currentDate,
        weekRange,
        currentDayIndex,
        events,
        sourceEvents,
        setView,
        goToToday,
        previousMonth,
        nextMonth,
        previousYear,
        nextYear,
        decrementWeek,
        incrementWeek,
        handleNextandPrevDay,
        openCreateModal,
        showExportButton,
        showAddEventButton,
        readOnly,
    } = useCalendarStore();

    const navActions = useMemo(() => ({
        previousMonth,
        nextMonth,
        previousYear,
        nextYear,
        decrementWeek,
        incrementWeek,
        handleNextandPrevDay,
    }), [
        previousMonth,
        nextMonth,
        previousYear,
        nextYear,
        decrementWeek,
        incrementWeek,
        handleNextandPrevDay,
    ]);

    const previous = useCallback(() => {
        navigatePrev(view, currentDayIndex, navActions);
    }, [view, currentDayIndex, navActions]);

    const next = useCallback(() => {
        navigateNext(view, currentDayIndex, navActions);
    }, [view, currentDayIndex, navActions]);

    const exportEvents = useCallback(() => {
        exportEventsToICS(sourceEvents, { calendarName: 'React Event Calendar Suite' });
    }, [sourceEvents]);

    return useMemo(() => ({
        view,
        currentDate: new Date(currentDate),
        weekRange,
        events,
        setView,
        goToToday,
        previous,
        next,
        openCreateModal: () => openCreateModal(null),
        exportEvents,
        showExportButton,
        showAddEventButton,
        readOnly,
    }), [
        view,
        currentDate,
        weekRange,
        events,
        setView,
        goToToday,
        previous,
        next,
        openCreateModal,
        exportEvents,
        showExportButton,
        showAddEventButton,
        readOnly,
    ]);
}
