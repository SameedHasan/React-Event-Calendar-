/** Shared sample events for Storybook stories (June 2026). */
export const sampleEvents = [
  {
    id: 1,
    title: 'Team Standup',
    start: new Date(2026, 5, 9, 9, 0),
    end: new Date(2026, 5, 9, 9, 30),
    type: 'Meeting',
    description: 'Daily sync with the engineering team',
  },
  {
    id: 2,
    title: 'Product Review',
    start: new Date(2026, 5, 10, 14, 0),
    end: new Date(2026, 5, 10, 15, 0),
    type: 'Review',
    color: '#7c3aed',
  },
  {
    id: 3,
    title: 'Design Workshop',
    start: new Date(2026, 5, 11, 10, 0),
    end: new Date(2026, 5, 13, 12, 0),
    type: 'Workshop',
    allDay: true,
  },
  {
    id: 4,
    title: 'Late Night Deploy',
    start: new Date(2026, 5, 12, 23, 0),
    end: new Date(2026, 5, 13, 1, 0),
    type: 'Planning',
  },
];

export const storyDate = new Date(2026, 5, 9);
