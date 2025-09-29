// Hardcoded events data
const eventsData = [
  {
    id: 1,
    title: 'Team Meeting',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 10, 0),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 11, 0),
    type: 'Video',
    description: 'Weekly team sync'
  },
  {
    id: 2,
    title: 'Client Call',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 14, 30),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 15, 30),
    type: 'Audio',
    description: 'Project discussion with client'
  },
  {
    id: 3,
    title: 'Lunch Break',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 13, 0),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 14, 0),
    type: 'Inperson',
    description: 'Lunch with colleagues'
  },
  {
    id: 4,
    title: 'Code Review',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 9, 0),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 10, 0),
    type: 'Video',
    description: 'Review pull requests'
  },
  {
    id: 5,
    title: 'Product Planning',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1, 15, 0),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1, 16, 0),
    type: 'Inperson',
    description: 'Plan next quarter features'
  }
];

export default eventsData;