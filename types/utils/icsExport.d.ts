import type { CalendarEvent } from '../index';

export interface ExportEventsToICSOptions {
  calendarName?: string;
  filename?: string;
}

export declare function eventsToICS(
  events: CalendarEvent[],
  calendarName?: string
): string;

export declare function downloadICS(
  icsContent: string,
  filename?: string
): void;

export declare function exportEventsToICS(
  events: CalendarEvent[],
  options?: ExportEventsToICSOptions
): void;
