import { useEffect, useCallback } from 'react';
import useCalendarStore from '../store/useCalendarStore';

/**
 * Keyboard shortcuts for the calendar.
 *
 * Navigation
 * ──────────
 *   T        → Jump to today
 *   ← / →   → Navigate backwards / forwards (prev/next period)
 *
 * View switching
 * ──────────────
 *   M   → Month view
 *   W   → Week view
 *   D   → Day view
 *   L   → List view
 *   Y   → Year view
 *
 * All shortcuts are ignored when the user is typing in an input,
 * textarea, select, or any element with [contenteditable].
 */
const useKeyboardShortcuts = () => {
    const {
        view,
        currentDayIndex,
        setView,
        goToToday,
        previousMonth,
        nextMonth,
        previousYear,
        nextYear,
        decrementWeek,
        incrementWeek,
        handleNextandPrevDay,
    } = useCalendarStore();

    const handleKeyDown = useCallback((e) => {
        // Skip when the user is typing inside an input / editable element
        const tag = e.target.tagName;
        if (
            tag === 'INPUT' ||
            tag === 'TEXTAREA' ||
            tag === 'SELECT' ||
            e.target.isContentEditable
        ) {
            return;
        }

        // Don't intercept combos (Ctrl+S, etc.)
        if (e.ctrlKey || e.metaKey || e.altKey) return;

        const key = e.key.toLowerCase();

        switch (key) {
            // ── View switching ──────────────────────────
            case 'm':
                e.preventDefault();
                setView('month');
                break;
            case 'w':
                e.preventDefault();
                setView('week');
                break;
            case 'd':
                e.preventDefault();
                setView('day');
                break;
            case 'l':
                e.preventDefault();
                setView('list');
                break;
            case 'y':
                e.preventDefault();
                setView('year');
                break;

            // ── Today ───────────────────────────────────
            case 't':
                e.preventDefault();
                goToToday();
                break;

            // ── Left / Right arrows → prev / next ───────
            case 'arrowleft':
                e.preventDefault();
                navigatePrev(view, currentDayIndex, {
                    previousMonth,
                    previousYear,
                    decrementWeek,
                    handleNextandPrevDay,
                });
                break;

            case 'arrowright':
                e.preventDefault();
                navigateNext(view, currentDayIndex, {
                    nextMonth,
                    nextYear,
                    incrementWeek,
                    handleNextandPrevDay,
                });
                break;

            default:
                break;
        }
    }, [
        view,
        currentDayIndex,
        setView,
        goToToday,
        previousMonth,
        nextMonth,
        previousYear,
        nextYear,
        decrementWeek,
        incrementWeek,
        handleNextandPrevDay,
    ]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
};

// ── Directional navigation helpers ──────────────────────
export function navigatePrev(view, currentDayIndex, actions) {
    switch (view) {
        case 'month':
            actions.previousMonth();
            break;
        case 'year':
            actions.previousYear();
            break;
        case 'week':
        case 'list':
            actions.decrementWeek();
            break;
        case 'day':
            if (currentDayIndex > 0) {
                actions.handleNextandPrevDay(currentDayIndex - 1);
            } else {
                actions.handleNextandPrevDay(6);
                actions.decrementWeek();
            }
            break;
        default:
            break;
    }
}

export function navigateNext(view, currentDayIndex, actions) {
    switch (view) {
        case 'month':
            actions.nextMonth();
            break;
        case 'year':
            actions.nextYear();
            break;
        case 'week':
        case 'list':
            actions.incrementWeek();
            break;
        case 'day':
            if (currentDayIndex < 6) {
                actions.handleNextandPrevDay(currentDayIndex + 1);
            } else {
                actions.handleNextandPrevDay(0);
                actions.incrementWeek();
            }
            break;
        default:
            break;
    }
}

export default useKeyboardShortcuts;
