import dayjs from 'dayjs';
import { getDayIndex } from './dateHelpers';

/**
 * Returns the date range that should have recurring instances expanded for the
 * active calendar view / navigation state.
 *
 * @param {object} state  Calendar store slice
 * @returns {{ start: Date, end: Date }}
 */
export function getVisibleDateRange(state) {
    const {
        view,
        currentDate,
        currentWeek,
        currentDayIndex,
        startOfWeek = 'monday',
    } = state;

    const anchor = dayjs(currentDate);

    switch (view) {
        case 'year':
            return {
                start: anchor.startOf('year').toDate(),
                end: anchor.endOf('year').toDate(),
            };

        case 'week':
        case 'list': {
            const weekAnchor = dayjs(currentWeek);
            const weekStart = weekAnchor.subtract(
                getDayIndex(weekAnchor.toDate(), startOfWeek),
                'day'
            );
            const weekEnd = weekStart.add(6, 'day');
            return {
                start: weekStart.startOf('day').toDate(),
                end: weekEnd.endOf('day').toDate(),
            };
        }

        case 'day': {
            const weekAnchor = dayjs(currentWeek);
            const weekStart = weekAnchor.subtract(
                getDayIndex(weekAnchor.toDate(), startOfWeek),
                'day'
            );
            const day = weekStart.add(currentDayIndex, 'day');
            return {
                start: day.startOf('day').toDate(),
                end: day.endOf('day').toDate(),
            };
        }

        case 'month':
        default: {
            const firstDay = anchor.startOf('month');
            const lastDay = anchor.endOf('month');
            const startOffset = getDayIndex(firstDay.toDate(), startOfWeek);
            const gridStart = firstDay.subtract(startOffset, 'day');
            const endOffset = 6 - getDayIndex(lastDay.toDate(), startOfWeek);
            const gridEnd = lastDay.add(endOffset, 'day');
            return {
                start: gridStart.startOf('day').toDate(),
                end: gridEnd.endOf('day').toDate(),
            };
        }
    }
}
