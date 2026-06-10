import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Creates a timezone-aware dayjs object from a date value.
 * When `tz` is provided, the returned dayjs instance reports
 * hour/minute/day in that IANA timezone rather than the browser locale.
 *
 * @param {Date|string|number} date
 * @param {string|null|undefined} tz  IANA timezone string, e.g. 'America/New_York'
 * @returns {import('dayjs').Dayjs}
 */
export const toDayjs = (date, tz) => (tz ? dayjs.tz(date, tz) : dayjs(date));

/**
 * Returns the current moment as a timezone-aware dayjs object.
 *
 * @param {string|null|undefined} tz  IANA timezone string
 * @returns {import('dayjs').Dayjs}
 */
export const nowInTz = (tz) => (tz ? dayjs().tz(tz) : dayjs());

/**
 * Formats an IANA timezone string into a human-readable UTC offset label.
 * e.g.  'America/New_York' → 'America/New_York (UTC-5)'
 *       null/undefined     → 'Local time'
 *
 * @param {string|null|undefined} tz
 * @returns {string}
 */
export const tzLabel = (tz) => {
    if (!tz) return 'Local time';
    try {
        const offset = dayjs().tz(tz).utcOffset();
        const sign = offset >= 0 ? '+' : '-';
        const abs = Math.abs(offset);
        const h = String(Math.floor(abs / 60)).padStart(2, '0');
        const m = String(abs % 60).padStart(2, '0');
        return `${tz} (UTC${sign}${h}:${m})`;
    } catch {
        return tz;
    }
};
