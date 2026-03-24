export interface IslamicEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  mosqueName: string;
  category: 'Lecture' | 'Ramadan' | 'Eid' | 'Fundraiser' | 'Youth';
}

export const EVENTS: IslamicEvent[] = [
  {
    id: '1',
    title: 'Ramadan Preparation Lecture',
    description: 'A special session on how to prepare spiritually and physically for the holy month of Ramadan.',
    date: '2026-03-28T18:00:00Z',
    location: 'Anwar Mosque, Addis Ababa',
    mosqueName: 'Anwar Mosque',
    category: 'Lecture',
  },
  {
    id: '2',
    title: 'Grand Iftar Gathering',
    description: 'Community for all Muslims in the neighborhood. Food and drinks will be provided.',
    date: '2026-04-10T18:30:00Z',
    location: 'Nur Mosque, Addis Ababa',
    mosqueName: 'Nur Mosque',
    category: 'Ramadan',
  },
  {
    id: '3',
    title: 'Islamic Art & History Exhibition',
    description: 'Showcasing the rich history of Islam in Ethiopia, including rare manuscripts and artifacts.',
    date: '2026-05-02T10:00:00Z',
    location: 'National Museum Area, Addis Ababa',
    mosqueName: 'Multiple Mosques',
    category: 'Youth',
  },
];
