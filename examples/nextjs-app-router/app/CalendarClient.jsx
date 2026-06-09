'use client';

import React, { useState } from 'react';
import Calendar from 'react-event-calendar-suite';
import 'react-event-calendar-suite/style.css';

const initialEvents = [
  {
    id: 1,
    title: 'Sprint Planning',
    start: new Date(2026, 5, 9, 10, 0),
    end: new Date(2026, 5, 9, 11, 30),
    type: 'Planning',
  },
  {
    id: 2,
    title: 'Design Review',
    start: new Date(2026, 5, 11, 15, 0),
    end: new Date(2026, 5, 11, 16, 0),
    type: 'Review',
  },
];

export default function CalendarClient() {
  const [events, setEvents] = useState(initialEvents);

  return (
    <Calendar
      events={events}
      defaultView="week"
      readOnly
      onEventClick={(event) => {
        console.log('Event clicked:', event.title);
        return false;
      }}
    />
  );
}
