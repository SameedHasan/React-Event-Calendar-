import type { CSSProperties, FC } from 'react';

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
  eventColors?: Record<string, string>;
  theme?: CalendarTheme;
  onEventClick?: (event: CalendarEvent) => void | boolean;
  onDateClick?: (date: Date) => void | boolean;
  onAddEvent?: (event: CalendarEvent) => void;
  onUpdateEvent?: (event: CalendarEvent) => void;
  onDeleteEvent?: (id: string | number) => void;
  className?: string;
  style?: CSSProperties;
}

declare const Calendar: FC<CalendarProps>;

export default Calendar;
