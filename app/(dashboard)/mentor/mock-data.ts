// Mock data for mentor dashboard development

export const mockMentorMetrics = [
  { value: '8', label: 'Active Mentees' },
  { value: '32', label: 'Sessions' },
  { value: '24h', label: 'Hours/Month' },
  { value: '4.8', label: 'Rating' },
];

export const mockPendingRequests = [
  {
    id: '1',
    name: 'Ama Asante',
    role: 'Computer Science Student',
    program: 'BSc Computer Science',
    initials: 'AA',
    status: 'pending' as const,
    lastInteraction: '2 days ago',
  },
  {
    id: '2',
    name: 'Kwame Osei',
    role: 'Business Student',
    program: 'BSc Business Administration',
    initials: 'KO',
    status: 'pending' as const,
    lastInteraction: '1 week ago',
  },
  {
    id: '3',
    name: 'Nada Mensah',
    role: 'Engineering Student',
    program: 'BSc Engineering',
    initials: 'NM',
    status: 'pending' as const,
    lastInteraction: '3 days ago',
  },
];

export const mockActiveMentees = [
  {
    id: '1',
    name: 'Abena Amoah',
    role: 'CS Final Year',
    program: 'Computer Science',
    initials: 'AA',
    status: 'active' as const,
    lastInteraction: 'Today',
  },
  {
    id: '2',
    name: 'Kofi Mensah',
    role: 'Business Year 2',
    program: 'Business Administration',
    initials: 'KM',
    status: 'active' as const,
    lastInteraction: 'Yesterday',
  },
  {
    id: '3',
    name: 'Esia Owusu',
    role: 'Engineering Year 1',
    program: 'Engineering',
    initials: 'EO',
    status: 'active' as const,
    lastInteraction: '2 days ago',
  },
  {
    id: '4',
    name: 'Yaa Boateng',
    role: 'Law Year 3',
    program: 'Law',
    initials: 'YB',
    status: 'matched' as const,
    lastInteraction: '1 week ago',
  },
];

export const mockUpcomingSessions = [
  {
    id: '1',
    mentee: 'Abena Amoah',
    date: 'Mar 31, 2026',
    time: '2:00 PM',
    topic: 'Career planning after graduation',
    notes: 'Review portfolio and job applications',
  },
  {
    id: '2',
    mentee: 'Kofi Mensah',
    date: 'Apr 2, 2026',
    time: '3:30 PM',
    topic: 'Interview prep',
    notes: 'Mock interviews for summer internships',
  },
  {
    id: '3',
    mentee: 'Esia Owusu',
    date: 'Apr 5, 2026',
    time: '1:00 PM',
    topic: 'Course selection',
    notes: 'Discuss semester 2 course load',
  },
];
