/**
 * Sample events data for 2024, 2025, 2026.
 * When used as an npm package, pass your own events array as the `events` prop
 * to the <Calendar> component. Each event must follow this shape:
 *
 * {
 *   id:           number | string    – unique identifier
 *   title:        string             – event name
 *   start:        Date               – start datetime
 *   end:          Date               – end datetime
 *   type:         string             – any category label (e.g. 'Meeting', 'Workshop', 'Call')
 *   color?:       string             – optional hex/css color override (e.g. '#e11d48')
 *   description?: string             – optional short description
 * }
 *
 * The calendar renders any type string — there are no fixed/required type values.
 */

const ev = (id, title, year, month, day, startHour, endHour, type, description) => ({
    id,
    title,
    start: new Date(year, month, day, startHour, 0),
    end:   new Date(year, month, day, endHour,   0),
    type,
    description,
});

// Types used in sample data — purely illustrative, use any strings you like:
// 'Meeting' | 'Workshop' | 'Call' | 'Social' | 'Review' | 'Planning' | 'Conference'

const eventsData = [
    // ── 2024 ──────────────────────────────────────────────
    // Jan
    ev(1,  'New Year Planning',     2024, 0,  2,  9, 10, 'Planning',    'Annual planning session'),
    ev(2,  'Team Kickoff',          2024, 0,  8, 14, 16, 'Meeting',     'Q1 team kickoff'),
    ev(3,  'Client Review',         2024, 0, 15, 10, 11, 'Call',        'Monthly client review'),
    ev(4,  'Product Demo',          2024, 0, 22, 15, 16, 'Meeting',     'New feature demo'),
    ev(5,  'Onboarding Session',    2024, 0, 29, 10, 12, 'Workshop',    'New hire onboarding'),
    // Feb
    ev(6,  'Sprint Planning',       2024, 1,  5,  9, 11, 'Planning',    'Sprint 8 planning'),
    ev(7,  'Code Review',           2024, 1, 12, 14, 15, 'Review',      'Weekly code review'),
    ev(8,  'Customer Support',      2024, 1, 20, 11, 12, 'Call',        'Customer issue resolution'),
    ev(9,  'Valentine Lunch',       2024, 1, 14, 12, 13, 'Social',      'Team bonding lunch'),
    ev(10, 'Architecture Review',   2024, 1, 27,  9, 11, 'Review',      'System architecture review'),
    // Mar
    ev(11, 'Spring Planning',       2024, 2,  1,  9, 10, 'Planning',    'Spring quarter planning'),
    ev(12, 'Design Review',         2024, 2,  8, 15, 16, 'Review',      'UI/UX design review'),
    ev(13, 'Team Building',         2024, 2, 15, 13, 17, 'Social',      'Team building activity'),
    ev(14, 'Performance Review',    2024, 2, 25, 10, 11, 'Review',      'Quarterly performance review'),
    ev(15, 'Roadmap Session',       2024, 2, 29, 14, 16, 'Planning',    'Q2 roadmap discussion'),
    // Apr
    ev(16, 'Project Milestone',     2024, 3, 10, 14, 15, 'Meeting',     'Project milestone review'),
    ev(17, 'Training Session',      2024, 3, 18,  9, 12, 'Workshop',    'Technical training'),
    ev(18, 'Stakeholder Update',    2024, 3, 24, 15, 16, 'Call',        'Quarterly stakeholder update'),
    ev(19, 'Bug Bash',              2024, 3,  4, 10, 13, 'Workshop',    'Team bug fixing session'),
    // May
    ev(20, 'Product Launch',        2024, 4, 15, 10, 12, 'Meeting',     'v2.0 product launch'),
    ev(21, 'Customer Feedback',     2024, 4, 22, 14, 15, 'Call',        'Customer feedback session'),
    ev(22, 'Team Outing',           2024, 4,  1, 12, 17, 'Social',      'May Day team outing'),
    ev(23, 'Release Planning',      2024, 4, 29,  9, 11, 'Planning',    'Release 2.1 planning'),
    // Jun
    ev(24, 'Summer Planning',       2024, 5,  3,  9, 10, 'Planning',    'Summer quarter planning'),
    ev(25, 'Team Retreat',          2024, 5, 20,  9, 17, 'Social',      'Annual team retreat'),
    ev(26, 'Mid-Year Review',       2024, 5, 28, 14, 16, 'Review',      'Mid-year performance check'),
    // Jul
    ev(27, 'Mid-Year Review',       2024, 6, 15, 10, 11, 'Review',      'Mid-year performance review'),
    ev(28, 'Q3 Planning',           2024, 6,  8, 14, 16, 'Planning',    'Q3 planning session'),
    ev(29, 'User Research',         2024, 6, 23, 10, 12, 'Call',        'User interview sessions'),
    // Aug
    ev(30, 'Back to School Prep',   2024, 7, 26,  9, 10, 'Planning',    'Back to school planning'),
    ev(31, 'Security Audit',        2024, 7, 12, 13, 15, 'Workshop',    'Annual security audit'),
    ev(32, 'API Design Review',     2024, 7, 19,  9, 11, 'Review',      'New API design review'),
    // Sep
    ev(33, 'Fall Kickoff',          2024, 8,  2,  9, 10, 'Meeting',     'Fall quarter kickoff'),
    ev(34, 'Product Roadmap',       2024, 8, 10, 14, 15, 'Planning',    'Product roadmap review'),
    ev(35, 'Team Sync',             2024, 8, 17, 10, 11, 'Meeting',     'Weekly team sync'),
    ev(36, 'Investor Meeting',      2024, 8, 24, 15, 17, 'Call',        'Quarterly investor update'),
    // Oct
    ev(37, 'Q4 Planning',           2024, 9,  7,  9, 10, 'Planning',    'Q4 planning session'),
    ev(38, 'Halloween Party',       2024, 9, 31, 15, 18, 'Social',      'Halloween team party'),
    ev(39, 'Sales Review',          2024, 9, 21, 14, 15, 'Review',      'Q3 sales review meeting'),
    ev(40, 'UX Workshop',           2024, 9, 14, 10, 13, 'Workshop',    'UX improvement workshop'),
    // Nov
    ev(41, 'Black Friday Prep',     2024, 10, 22, 14, 15, 'Planning',   'Black Friday preparation'),
    ev(42, 'Year-End Planning',     2024, 10, 11,  9, 11, 'Planning',   'Year-end strategy session'),
    ev(43, 'Budget Review',         2024, 10,  5, 15, 16, 'Review',     'Annual budget review'),
    ev(44, 'Thanksgiving Brunch',   2024, 10, 28, 11, 14, 'Social',     'Team Thanksgiving brunch'),
    // Dec
    ev(45, 'Year End Review',       2024, 11, 15, 10, 11, 'Review',     'Year-end performance review'),
    ev(46, 'Holiday Party',         2024, 11, 20, 17, 21, 'Social',     'Annual holiday party'),
    ev(47, 'Retrospective',         2024, 11,  6, 14, 16, 'Meeting',    'Annual retrospective'),
    ev(48, 'Client Appreciation',   2024, 11, 12, 12, 14, 'Social',     'Client appreciation lunch'),

    // ── 2025 ──────────────────────────────────────────────
    // Jan
    ev(49, 'New Year Kickoff',      2025, 0,  6,  9, 11, 'Meeting',     '2025 company kickoff'),
    ev(50, 'OKR Setting',           2025, 0, 13, 14, 16, 'Planning',    'OKR goal-setting session'),
    ev(51, 'Tech Stack Review',     2025, 0, 20,  9, 11, 'Review',      'Annual tech stack audit'),
    ev(52, 'Client Onboarding',     2025, 0, 27, 10, 12, 'Call',        'New client onboarding'),
    // Feb
    ev(53, 'Sprint Review',         2025, 1,  3, 14, 15, 'Review',      'Sprint 12 review'),
    ev(54, 'Design System Update',  2025, 1, 10, 10, 12, 'Workshop',    'Design system v3 review'),
    ev(55, 'Customer Success Call', 2025, 1, 18, 11, 12, 'Call',        'Customer success review'),
    ev(56, 'Team Lunch',            2025, 1, 14, 12, 13, 'Social',      'Valentine team lunch'),
    ev(57, 'Data Migration Review', 2025, 1, 25,  9, 11, 'Review',      'Database migration plan'),
    // Mar
    ev(58, 'Q1 Business Review',    2025, 2, 31, 14, 16, 'Review',      'Q1 business review'),
    ev(59, 'Product Workshop',      2025, 2, 10,  9, 12, 'Workshop',    'Product strategy workshop'),
    ev(60, 'Accessibility Audit',   2025, 2, 17, 14, 16, 'Review',      'Accessibility compliance'),
    ev(61, 'Hiring Panel',          2025, 2, 24, 10, 13, 'Meeting',     'Engineering hiring panel'),
    // Apr
    ev(62, 'Q2 Kickoff',            2025, 3,  1,  9, 11, 'Meeting',     'Q2 kickoff session'),
    ev(63, 'User Testing',          2025, 3, 14, 10, 13, 'Workshop',    'User testing sessions'),
    ev(64, 'Architecture Summit',   2025, 3, 22, 14, 17, 'Conference',  'Engineering architecture summit'),
    ev(65, 'Customer Panel',        2025, 3, 29, 11, 12, 'Call',        'Customer advisory panel'),
    // May
    ev(66, 'Product Release',       2025, 4, 12, 10, 11, 'Meeting',     'v3.0 product release'),
    ev(67, 'Engineering All-Hands', 2025, 4, 19,  9, 11, 'Meeting',     'Engineering all-hands'),
    ev(68, 'Summer Planning',       2025, 4, 27, 14, 15, 'Planning',    'Summer internship planning'),
    ev(69, 'API Partner Sync',      2025, 4,  5, 15, 16, 'Call',        'API partner integration sync'),
    // Jun
    ev(70, 'Mid-Year Goals',        2025, 5,  9, 10, 12, 'Review',      'Mid-year goal review'),
    ev(71, 'Team Retreat',          2025, 5, 19,  9, 17, 'Social',      'Annual team retreat'),
    ev(72, 'Infra Review',          2025, 5, 26, 14, 16, 'Review',      'Infrastructure scaling review'),
    ev(73, 'UX Research Sync',      2025, 5,  3, 11, 12, 'Call',        'UX research findings'),
    // Jul
    ev(74, 'Q3 Kickoff',            2025, 6,  7,  9, 11, 'Meeting',     'Q3 kickoff session'),
    ev(75, 'Security Training',     2025, 6, 15, 10, 12, 'Workshop',    'Annual security training'),
    ev(76, 'Investor Update',       2025, 6, 24, 15, 16, 'Call',        'Q2 investor update'),
    ev(77, 'Release Planning',      2025, 6, 29, 14, 16, 'Planning',    'v3.5 release planning'),
    // Aug
    ev(78, 'Platform Migration',    2025, 7,  4,  9, 11, 'Workshop',    'Cloud platform migration'),
    ev(79, 'Back to School',        2025, 7, 25, 10, 11, 'Meeting',     'Back to school planning'),
    ev(80, 'Performance Tuning',    2025, 7, 12, 14, 16, 'Review',      'App performance review'),
    ev(81, 'Sales Enablement',      2025, 7, 19, 11, 12, 'Call',        'Sales enablement session'),
    // Sep
    ev(82, 'Fall Planning',         2025, 8,  2, 14, 16, 'Planning',    'Fall quarter planning'),
    ev(83, 'Design Sprint',         2025, 8,  8,  9, 17, 'Workshop',    'Design sprint week kickoff'),
    ev(84, 'Q3 Review',             2025, 8, 22, 10, 12, 'Review',      'Q3 business review'),
    ev(85, 'Partner Summit',        2025, 8, 30, 14, 17, 'Conference',  'Annual partner summit'),
    // Oct
    ev(86, 'Q4 Planning',           2025, 9,  6,  9, 11, 'Planning',    'Q4 planning session'),
    ev(87, 'Hackathon Kickoff',     2025, 9, 13,  9, 18, 'Social',      'Annual internal hackathon'),
    ev(88, 'Customer Interview',    2025, 9, 21, 11, 12, 'Call',        'Customer discovery interview'),
    ev(89, 'Budget Planning',       2025, 9, 28, 14, 16, 'Planning',    '2026 budget planning'),
    // Nov
    ev(90, 'Company All-Hands',     2025, 10,  3,  9, 11, 'Meeting',    'Company all-hands meeting'),
    ev(91, 'Product Beta Launch',   2025, 10, 10, 14, 15, 'Meeting',    'v4.0 beta launch'),
    ev(92, 'Leadership Summit',     2025, 10, 18,  9, 17, 'Conference', 'Annual leadership summit'),
    ev(93, 'Year-End Planning',     2025, 10, 25, 14, 16, 'Planning',   'Year-end strategy session'),
    // Dec
    ev(94, 'Retrospective',         2025, 11,  1, 10, 12, 'Meeting',    '2025 annual retrospective'),
    ev(95, 'Team Awards',           2025, 11,  8, 15, 17, 'Social',     'Annual team awards ceremony'),
    ev(96, 'Client Wrap-Up',        2025, 11, 16, 11, 12, 'Call',       'Year-end client wrap-up'),
    ev(97, 'Holiday Party',         2025, 11, 19, 17, 21, 'Social',     'Annual holiday party'),

    // ── 2026 ──────────────────────────────────────────────
    // Jan
    ev(98,  'New Year Kickoff',     2026, 0,  5,  9, 11, 'Meeting',     '2026 company kickoff'),
    ev(99,  'OKR Setting',          2026, 0, 12, 14, 16, 'Planning',    '2026 OKR goal-setting'),
    ev(100, 'Roadmap Workshop',     2026, 0, 19,  9, 12, 'Workshop',    'Annual roadmap workshop'),
    ev(101, 'Hiring Planning',      2026, 0, 26, 10, 11, 'Planning',    '2026 hiring plan session'),
    // Feb
    ev(102, 'Sprint Review',        2026, 1,  2, 14, 15, 'Review',      'Sprint 1 review'),
    ev(103, 'Brand Refresh',        2026, 1,  9, 10, 12, 'Workshop',    'Brand refresh workshop'),
    ev(104, 'Customer Roundtable',  2026, 1, 18, 11, 12, 'Call',        'Customer roundtable session'),
    ev(105, 'Team Brunch',          2026, 1, 13, 12, 13, 'Social',      'Valentine team brunch'),
    ev(106, 'Tech Vision Talk',     2026, 1, 25,  9, 11, 'Meeting',     'Engineering tech vision talk'),
    // Mar
    ev(107, 'Q1 Review',            2026, 2, 30, 14, 16, 'Review',      'Q1 business review'),
    ev(108, 'Design Workshop',      2026, 2,  9,  9, 12, 'Workshop',    'Product design workshop'),
    ev(109, 'Compliance Audit',     2026, 2, 16, 14, 16, 'Review',      'Annual compliance audit'),
    ev(110, 'Engineering All-Hands',2026, 2, 23, 10, 12, 'Meeting',     'Engineering all-hands'),
    // Apr
    ev(111, 'Q2 Kickoff',           2026, 3,  1,  9, 11, 'Meeting',     'Q2 kickoff session'),
    ev(112, 'User Research',        2026, 3, 13, 10, 13, 'Workshop',    'User research sessions'),
    ev(113, 'Infra Summit',         2026, 3, 20, 14, 17, 'Conference',  'Infrastructure summit 2026'),
    ev(114, 'Partner Sync',         2026, 3, 28, 11, 12, 'Call',        'Strategic partner sync'),
    // May
    ev(115, 'v5.0 Launch',          2026, 4, 11, 10, 12, 'Meeting',     'Major product v5.0 launch'),
    ev(116, 'Company Picnic',       2026, 4,  1, 12, 17, 'Social',      'Annual company picnic'),
    ev(117, 'Platform Review',      2026, 4, 18, 14, 16, 'Review',      'Platform architecture review'),
    ev(118, 'Sales Strategy',       2026, 4, 26, 11, 12, 'Call',        'H2 sales strategy session'),
    // Jun — current month, denser data for demo
    ev(119, 'Product Planning',     2026, 5,  4, 15, 16, 'Planning',    'Plan next quarter features'),
    ev(120, 'Team Meeting',         2026, 5,  5, 10, 11, 'Meeting',     'Weekly team sync'),
    ev(121, 'Lunch Break',          2026, 5,  5, 13, 14, 'Social',      'Lunch with colleagues'),
    ev(122, 'Client Call',          2026, 5,  5, 14, 15, 'Call',        'Project discussion with client'),
    ev(123, 'Code Review',          2026, 5,  6,  9, 10, 'Review',      'Review pull requests'),
    {
        id: 201,
        title: 'Global Developer Conference',
        start: new Date(2026, 5, 2, 9, 0),
        end: new Date(2026, 5, 4, 18, 0),
        type: 'Conference',
        description: 'Annual global developer conference and keynote'
    },
    {
        id: 202,
        title: 'Overnight Code-a-Thon',
        start: new Date(2026, 5, 4, 22, 0),
        end: new Date(2026, 5, 5, 3, 0),
        type: 'Workshop',
        description: 'Overnight collaborative hack and coding challenge'
    },
    {
        id: 203,
        title: 'Strategy & Leadership Retreat',
        start: new Date(2026, 5, 8, 8, 0),
        end: new Date(2026, 5, 12, 17, 0),
        type: 'Planning',
        description: 'Offsite planning and strategy formulation'
    },
    ev(124, 'Sprint Review',        2026, 5,  9, 14, 15, 'Review',      'Sprint 4 review'),
    ev(125, 'Mid-Year Planning',    2026, 5, 15, 10, 12, 'Planning',    'Mid-year planning session'),
    ev(126, 'Team Retreat',         2026, 5, 19,  9, 17, 'Social',      'Annual team retreat'),
    ev(127, 'Investor Update',      2026, 5, 23, 15, 16, 'Call',        'H1 investor update call'),
    ev(128, 'Release Planning',     2026, 5, 30, 14, 16, 'Planning',    'v5.1 release planning'),
    // Jul
    ev(129, 'Q3 Kickoff',           2026, 6,  6,  9, 11, 'Meeting',     'Q3 kickoff session'),
    ev(130, 'Leadership Offsite',   2026, 6, 14,  9, 17, 'Conference',  'Leadership strategy offsite'),
    ev(131, 'Customer Advisory',    2026, 6, 22, 11, 12, 'Call',        'Customer advisory board'),
    ev(132, 'Hackathon',            2026, 6, 27,  9, 18, 'Social',      'Summer hackathon'),
    // Aug
    ev(133, 'Performance Review',   2026, 7,  3, 14, 16, 'Review',      'Mid-year performance review'),
    ev(134, 'Back to School',       2026, 7, 24, 10, 11, 'Meeting',     'Back to school planning'),
    ev(135, 'API Partner Sync',     2026, 7, 10, 15, 16, 'Call',        'API partner meeting'),
    ev(136, 'DevOps Review',        2026, 7, 17,  9, 11, 'Review',      'DevOps pipeline review'),
    // Sep
    ev(137, 'Fall Kickoff',         2026, 8,  1,  9, 11, 'Meeting',     'Fall quarter kickoff'),
    ev(138, 'Design Sprint',        2026, 8,  7,  9, 17, 'Workshop',    'Product design sprint'),
    ev(139, 'Q3 Review',            2026, 8, 21, 14, 16, 'Review',      'Q3 business review'),
    ev(140, 'Sales Enablement',     2026, 8, 28, 11, 12, 'Call',        'Sales enablement workshop'),
    // Oct
    ev(141, 'Q4 Planning',          2026, 9,  5,  9, 11, 'Planning',    'Q4 planning session'),
    ev(142, 'Annual Hackathon',     2026, 9, 12,  9, 18, 'Social',      'Annual internal hackathon'),
    ev(143, 'Customer Summit',      2026, 9, 20, 14, 17, 'Conference',  'Annual customer summit'),
    ev(144, 'Budget Review',        2026, 9, 27, 10, 12, 'Review',      '2027 budget planning'),
    // Nov
    ev(145, 'All-Hands Meeting',    2026, 10,  2,  9, 11, 'Meeting',    'Company all-hands'),
    ev(146, 'Product Beta Launch',  2026, 10,  9, 14, 15, 'Meeting',    'v6.0 beta launch'),
    ev(147, 'Leadership Summit',    2026, 10, 17,  9, 17, 'Conference', 'Annual leadership summit'),
    ev(148, 'Year-End Strategy',    2026, 10, 24, 14, 16, 'Planning',   'Year-end strategy session'),
    // Dec
    ev(149, 'Annual Retrospective', 2026, 11,  1, 10, 12, 'Meeting',    '2026 annual retrospective'),
    ev(150, 'Team Awards',          2026, 11,  7, 15, 17, 'Social',     'Annual team awards night'),
    ev(151, 'Client Wrap-Up',       2026, 11, 15, 11, 12, 'Call',       'Year-end client wrap-up'),
    ev(152, 'Holiday Party',        2026, 11, 18, 17, 21, 'Social',     'Annual holiday party'),
];

export default eventsData;
