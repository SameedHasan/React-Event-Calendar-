import type { CalendarEvent } from '../index';

export declare function unfoldIcsLines(content: string): string;

export declare function parseIcsDate(
  value: string,
  params?: Record<string, string>
): Date;

export declare function extractIcsComponents(content: string, name: string): string[];

export declare function parseVeventBlock(block: string): CalendarEvent | null;

export declare function parseICS(content: string): CalendarEvent[];

export declare function parseICSFile(file: File | Blob): Promise<CalendarEvent[]>;

export declare function pickAndParseICSFile(): Promise<CalendarEvent[] | null>;
