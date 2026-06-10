import type { CSSProperties, FC, ReactNode } from 'react';

export type CalendarView = 'month' | 'week' | 'day' | 'list' | 'year';

export type WeekStartDay =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

export type TimeFormat = '12h' | '24h';

export type CalendarTheme = 'light' | 'dark';

export interface CalendarEvent {
  id: string | number;
  title: string;
  start: Date | string;
  end: Date | string;
  type: string;
  color?: string;
  description?: string;
  location?: string;
  allDay?: boolean;
  /**
   * RFC 5545 RRULE body (without the `RRULE:` prefix), e.g. `FREQ=WEEKLY;BYDAY=MO`.
   * The calendar expands occurrences for the visible date range only.
   */
  recurrence?: string;
  /** Present on expanded instances — id of the master recurring event. */
  recurrenceMasterId?: string | number;
  metadata?: Record<string, unknown>;
}

export interface EventRenderContext {
  view: CalendarView;
  date: Date;
  isMultiDay: boolean;
  isStartDay: boolean;
  isEndDay: boolean;
  onClick: () => void;
}

export interface EventScheduleChangePayload {
  event: CalendarEvent;
  start: Date;
  end: Date;
}

export interface CalendarToolbarApi {
  view: CalendarView;
  currentDate: Date;
  weekRange: { count: number; range: string };
  events: CalendarEvent[];
  setView: (view: CalendarView) => void;
  goToToday: () => void;
  previous: () => void;
  next: () => void;
  openCreateModal: () => void;
  exportEvents: () => void;
  importEvents: () => void;
  showExportButton: boolean;
  showImportButton: boolean;
  showAddEventButton: boolean;
  readOnly: boolean;
}

export interface CalendarProps {
  events?: CalendarEvent[];
  defaultView?: CalendarView;
  view?: CalendarView;
  startOfWeek?: WeekStartDay;
  timeFormat?: TimeFormat;
  categories?: string[];
  primaryColor?: string;
  currentDate?: Date | string;
  onDateChange?: (date: Date) => void;
  onViewChange?: (view: CalendarView) => void;
  hideWeekends?: boolean;
  showWeekNumbers?: boolean;
  showToolbar?: boolean;
  showExportButton?: boolean;
  /** Renders the toolbar "Import" iCal button. Opt-in. Default: `false`. */
  showImportButton?: boolean;
  showAddEventButton?: boolean;
  allowDateClick?: boolean;
  readOnly?: boolean;
  loading?: boolean;
  /**
   * IANA timezone string, e.g. `'America/New_York'`, `'Europe/London'`, `'Asia/Tokyo'`.
   * When set, all event times and the "today" indicator are displayed in this timezone.
   * ICS exports will include `DTSTART;TZID=...` instead of UTC.
   * Default: `null` (browser local time).
   */
  timezone?: string | null;
  /**
   * BCP-47 locale tag, e.g. `'de'`, `'fr'`, `'zh-cn'`, `'ja'`, `'ar'`.
   * When set:
   * - All date / time labels (month names, weekday abbreviations, formatted dates) are
   *   rendered in that locale via dayjs locale bundles.
   * - Ant Design UI elements (date picker, modals) are rendered in the matching antd locale.
   * - `startOfWeek` defaults to the locale's natural week-start day (Mon vs Sun) unless
   *   you explicitly pass the `startOfWeek` prop to override it.
   *
   * Locale bundles are loaded asynchronously on first use; the calendar renders in English
   * during the brief load period and re-renders once the bundle is ready.
   * Default: `null` (browser / English).
   */
  locale?: string | null;
  eventColors?: Record<string, string>;
  theme?: CalendarTheme;
  onEventClick?: (event: CalendarEvent) => void | boolean;
  onEventDrop?: (payload: EventScheduleChangePayload) => void;
  onEventResize?: (payload: EventScheduleChangePayload) => void;
  /** Disable moving events via drag-and-drop while keeping other handlers active. Default: false. */
  disableDrag?: boolean;
  /** Disable extending/resizing events via the edge handles while keeping other handlers active. Default: false. */
  disableResize?: boolean;
  onDateClick?: (date: Date) => void | boolean;
  onAddEvent?: (event: CalendarEvent) => void;
  onUpdateEvent?: (event: CalendarEvent) => void;
  onDeleteEvent?: (id: string | number) => void;
  /** Called when the user imports a .ics file via the toolbar. Receives parsed master events. */
  onImportEvents?: (events: CalendarEvent[]) => void;
  renderEvent?: (event: CalendarEvent, context: EventRenderContext) => ReactNode;
  renderEventTooltip?: (events: CalendarEvent[], date: Date) => ReactNode;
  renderToolbar?: (api: CalendarToolbarApi) => ReactNode;
  renderEmpty?: (view: CalendarView) => ReactNode;
  className?: string;
  style?: CSSProperties;
}

declare const Calendar: FC<CalendarProps>;

export default Calendar;
