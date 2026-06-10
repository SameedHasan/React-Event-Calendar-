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
  showExportButton: boolean;
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
  showAddEventButton?: boolean;
  allowDateClick?: boolean;
  readOnly?: boolean;
  loading?: boolean;
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
  renderEvent?: (event: CalendarEvent, context: EventRenderContext) => ReactNode;
  renderEventTooltip?: (events: CalendarEvent[], date: Date) => ReactNode;
  renderToolbar?: (api: CalendarToolbarApi) => ReactNode;
  renderEmpty?: (view: CalendarView) => ReactNode;
  className?: string;
  style?: CSSProperties;
}

declare const Calendar: FC<CalendarProps>;

export default Calendar;
