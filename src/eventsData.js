// Hardcoded events data with multiple months
const eventsData = [
  // January Events
  {
    id: 1,
    title: 'New Year Planning',
    start: new Date(2024, 0, 2, 9, 0), // Jan 2, 2024
    end: new Date(2024, 0, 2, 10, 0),
    type: 'Video',
    description: 'Annual planning meeting'
  },
  {
    id: 2,
    title: 'Team Kickoff',
    start: new Date(2024, 0, 8, 14, 0), // Jan 8, 2024
    end: new Date(2024, 0, 8, 15, 30),
    type: 'Inperson',
    description: 'Q1 team kickoff meeting'
  },
  {
    id: 3,
    title: 'Client Review',
    start: new Date(2024, 0, 15, 10, 0), // Jan 15, 2024
    end: new Date(2024, 0, 15, 11, 0),
    type: 'Audio',
    description: 'Monthly client review'
  },
  {
    id: 4,
    title: 'Product Demo',
    start: new Date(2024, 0, 22, 15, 0), // Jan 22, 2024
    end: new Date(2024, 0, 22, 16, 0),
    type: 'Video',
    description: 'New feature demonstration'
  },

  // February Events
  {
    id: 5,
    title: 'Valentine Team Lunch',
    start: new Date(2024, 1, 14, 12, 0), // Feb 14, 2024
    end: new Date(2024, 1, 14, 13, 0),
    type: 'Inperson',
    description: 'Team bonding lunch'
  },
  {
    id: 6,
    title: 'Sprint Planning',
    start: new Date(2024, 1, 5, 9, 0), // Feb 5, 2024
    end: new Date(2024, 1, 5, 10, 30),
    type: 'Video',
    description: 'Sprint planning session'
  },
  {
    id: 7,
    title: 'Code Review Session',
    start: new Date(2024, 1, 12, 14, 0), // Feb 12, 2024
    end: new Date(2024, 1, 12, 15, 0),
    type: 'Video',
    description: 'Weekly code review'
  },
  {
    id: 8,
    title: 'Customer Support Call',
    start: new Date(2024, 1, 20, 11, 0), // Feb 20, 2024
    end: new Date(2024, 1, 20, 12, 0),
    type: 'Audio',
    description: 'Customer issue resolution'
  },

  // March Events
  {
    id: 9,
    title: 'Spring Planning',
    start: new Date(2024, 2, 1, 9, 0), // Mar 1, 2024
    end: new Date(2024, 2, 1, 10, 0),
    type: 'Inperson',
    description: 'Spring quarter planning'
  },
  {
    id: 10,
    title: 'Design Review',
    start: new Date(2024, 2, 8, 15, 0), // Mar 8, 2024
    end: new Date(2024, 2, 8, 16, 0),
    type: 'Video',
    description: 'UI/UX design review'
  },
  {
    id: 11,
    title: 'Team Building',
    start: new Date(2024, 2, 15, 13, 0), // Mar 15, 2024
    end: new Date(2024, 2, 15, 17, 0),
    type: 'Inperson',
    description: 'Team building activity'
  },
  {
    id: 12,
    title: 'Performance Review',
    start: new Date(2024, 2, 25, 10, 0), // Mar 25, 2024
    end: new Date(2024, 2, 25, 11, 0),
    type: 'Audio',
    description: 'Quarterly performance review'
  },

  // April Events
  {
    id: 13,
    title: 'Easter Holiday',
    start: new Date(2024, 3, 1, 0, 0), // Apr 1, 2024
    end: new Date(2024, 3, 1, 23, 59),
    type: 'Inperson',
    description: 'Easter holiday'
  },
  {
    id: 14,
    title: 'Project Milestone',
    start: new Date(2024, 3, 10, 14, 0), // Apr 10, 2024
    end: new Date(2024, 3, 10, 15, 0),
    type: 'Video',
    description: 'Project milestone review'
  },
  {
    id: 15,
    title: 'Training Session',
    start: new Date(2024, 3, 18, 9, 0), // Apr 18, 2024
    end: new Date(2024, 3, 18, 12, 0),
    type: 'Video',
    description: 'Technical training session'
  },

  // May Events
  {
    id: 16,
    title: 'May Day Celebration',
    start: new Date(2024, 4, 1, 12, 0), // May 1, 2024
    end: new Date(2024, 4, 1, 13, 0),
    type: 'Inperson',
    description: 'May Day team celebration'
  },
  {
    id: 17,
    title: 'Product Launch',
    start: new Date(2024, 4, 15, 10, 0), // May 15, 2024
    end: new Date(2024, 4, 15, 11, 0),
    type: 'Video',
    description: 'New product launch announcement'
  },
  {
    id: 18,
    title: 'Customer Feedback',
    start: new Date(2024, 4, 22, 14, 0), // May 22, 2024
    end: new Date(2024, 4, 22, 15, 0),
    type: 'Audio',
    description: 'Customer feedback session'
  },

  // June Events
  {
    id: 19,
    title: 'Summer Planning',
    start: new Date(2024, 5, 3, 9, 0), // Jun 3, 2024
    end: new Date(2024, 5, 3, 10, 0),
    type: 'Video',
    description: 'Summer quarter planning'
  },
  {
    id: 20,
    title: 'Team Retreat',
    start: new Date(2024, 5, 20, 9, 0), // Jun 20, 2024
    end: new Date(2024, 5, 20, 17, 0),
    type: 'Inperson',
    description: 'Annual team retreat'
  },

  // July Events
  {
    id: 21,
    title: 'Independence Day',
    start: new Date(2024, 6, 4, 0, 0), // Jul 4, 2024
    end: new Date(2024, 6, 4, 23, 59),
    type: 'Inperson',
    description: 'Independence Day holiday'
  },
  {
    id: 22,
    title: 'Mid-Year Review',
    start: new Date(2024, 6, 15, 10, 0), // Jul 15, 2024
    end: new Date(2024, 6, 15, 11, 0),
    type: 'Video',
    description: 'Mid-year performance review'
  },

  // August Events
  {
    id: 23,
    title: 'Summer Break',
    start: new Date(2024, 7, 12, 0, 0), // Aug 12, 2024
    end: new Date(2024, 7, 12, 23, 59),
    type: 'Inperson',
    description: 'Summer break'
  },
  {
    id: 24,
    title: 'Back to School',
    start: new Date(2024, 7, 26, 9, 0), // Aug 26, 2024
    end: new Date(2024, 7, 26, 10, 0),
    type: 'Video',
    description: 'Back to school planning'
  },

  // September Events
  {
    id: 25,
    title: 'Fall Kickoff',
    start: new Date(2024, 8, 2, 9, 0), // Sep 2, 2024
    end: new Date(2024, 8, 2, 10, 0),
    type: 'Inperson',
    description: 'Fall quarter kickoff'
  },
  {
    id: 26,
    title: 'Product Roadmap',
    start: new Date(2024, 8, 10, 14, 0), // Sep 10, 2024
    end: new Date(2024, 8, 10, 15, 0),
    type: 'Video',
    description: 'Product roadmap review'
  },
  {
    id: 27,
    title: 'Team Meeting',
    start: new Date(2024, 8, 17, 10, 0), // Sep 17, 2024
    end: new Date(2024, 8, 17, 11, 0),
    type: 'Video',
    description: 'Weekly team sync'
  },

  // October Events
  {
    id: 28,
    title: 'Halloween Party',
    start: new Date(2024, 9, 31, 15, 0), // Oct 31, 2024
    end: new Date(2024, 9, 31, 17, 0),
    type: 'Inperson',
    description: 'Halloween team party'
  },
  {
    id: 29,
    title: 'Q4 Planning',
    start: new Date(2024, 9, 7, 9, 0), // Oct 7, 2024
    end: new Date(2024, 9, 7, 10, 0),
    type: 'Video',
    description: 'Q4 planning session'
  },

  // November Events
  {
    id: 30,
    title: 'Thanksgiving',
    start: new Date(2024, 10, 28, 0, 0), // Nov 28, 2024
    end: new Date(2024, 10, 28, 23, 59),
    type: 'Inperson',
    description: 'Thanksgiving holiday'
  },
  {
    id: 31,
    title: 'Black Friday Prep',
    start: new Date(2024, 10, 22, 14, 0), // Nov 22, 2024
    end: new Date(2024, 10, 22, 15, 0),
    type: 'Video',
    description: 'Black Friday preparation'
  },

  // December Events
  {
    id: 32,
    title: 'Holiday Party',
    start: new Date(2024, 11, 20, 17, 0), // Dec 20, 2024
    end: new Date(2024, 11, 20, 21, 0),
    type: 'Inperson',
    description: 'Annual holiday party'
  },
  {
    id: 33,
    title: 'Year End Review',
    start: new Date(2024, 11, 15, 10, 0), // Dec 15, 2024
    end: new Date(2024, 11, 15, 11, 0),
    type: 'Video',
    description: 'Year-end performance review'
  },
  {
    id: 34,
    title: 'Christmas Holiday',
    start: new Date(2024, 11, 25, 0, 0), // Dec 25, 2024
    end: new Date(2024, 11, 25, 23, 59),
    type: 'Inperson',
    description: 'Christmas holiday'
  },

  // Current Month Events (Dynamic)
  {
    id: 35,
    title: 'Team Meeting',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 10, 0),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 11, 0),
    type: 'Video',
    description: 'Weekly team sync'
  },
  {
    id: 36,
    title: 'Client Call',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 14, 30),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 15, 30),
    type: 'Audio',
    description: 'Project discussion with client'
  },
  {
    id: 37,
    title: 'Lunch Break',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 13, 0),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 14, 0),
    type: 'Inperson',
    description: 'Lunch with colleagues'
  },
  {
    id: 38,
    title: 'Code Review',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 9, 0),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 10, 0),
    type: 'Video',
    description: 'Review pull requests'
  },
  {
    id: 39,
    title: 'Product Planning',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1, 15, 0),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1, 16, 0),
    type: 'Inperson',
    description: 'Plan next quarter features'
  }
];

export default eventsData;