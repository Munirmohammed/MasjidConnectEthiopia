export interface Post {
  id: string;
  author: string;
  content: string;
  category: 'Announcement' | 'Lost & Found' | 'Job' | 'Service' | 'General';
  date: string;
  likes: number;
}

export interface Campaign {
  id: string;
  title: string;
  mosqueName: string;
  goal: number;
  raised: number;
  description: string;
}

export const POSTS: Post[] = [
  {
    id: '1',
    author: 'Ahmed Ali',
    content: 'Found a set of keys near the entrance of Anwar Mosque after Asr prayer today. Please contact me to claim.',
    category: 'Lost & Found',
    date: '2026-03-24T16:20:00Z',
    likes: 5,
  },
  {
    id: '2',
    author: 'Nur Mosque Admin',
    content: 'We are looking for a part-time security guard for the mosque premises. Interested candidates please visit the office.',
    category: 'Job',
    date: '2026-03-23T10:00:00Z',
    likes: 12,
  },
];

export const CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    title: 'Anwar Mosque Renovation',
    mosqueName: 'Anwar Mosque',
    goal: 500000,
    raised: 320000,
    description: 'Help us repair the main dome and upgrade the wudu area facilities.',
  },
  {
    id: '2',
    title: 'Ramadan Food Drive',
    mosqueName: 'Nur Mosque',
    goal: 100000,
    raised: 45000,
    description: 'Providing Iftar meals for 500 families in need throughout the holy month.',
  },
];
