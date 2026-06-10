import dayjs from 'dayjs';

export const VIEW_LABELS = {
    month: 'Month',
    week: 'Week',
    day: 'Day',
    list: 'List',
    year: 'Year',
};

export const CALENDAR_SHORTCUTS = [
    { keys: 'T', description: 'Go to today' },
    { keys: 'M', description: 'Switch to month view' },
    { keys: 'W', description: 'Switch to week view' },
    { keys: 'D', description: 'Switch to day view' },
    { keys: 'L', description: 'Switch to list view' },
    { keys: 'Y', description: 'Switch to year view' },
    { keys: '← / →', description: 'Previous / next period' },
    { keys: '?', description: 'Show keyboard shortcuts' },
];

export const CALENDAR_KEYSHORTCUTS_ATTR = 'T M W D L Y ArrowLeft ArrowRight ?';

export function buildCalendarTitle(view, { currentDate, weekRange, currentDayIndex }) {
    const d = dayjs(currentDate);

    switch (view) {
        case 'month':
            return d.format('MMMM YYYY');
        case 'year':
            return d.format('YYYY');
        case 'week':
        case 'list':
            return weekRange?.range || '';
        case 'day': {
            if (!weekRange?.startDate) return '';
            return dayjs(weekRange.startDate).add(currentDayIndex, 'day').format('dddd, MMMM D YYYY');
        }
        default:
            return '';
    }
}

export function buildLiveAnnouncement(view, title) {
    const viewLabel = VIEW_LABELS[view] || view;
    return title ? `${viewLabel} view, ${title}` : `${viewLabel} view`;
}
