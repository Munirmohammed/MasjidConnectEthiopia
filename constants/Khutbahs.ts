export interface Khutbah {
  id: string;
  title: string;
  imamName: string;
  mosqueName: string;
  date: string;
  duration: string;
  audioUrl: string;
}

export const KHUTBAHS: Khutbah[] = [
  {
    id: '1',
    title: 'The Importance of Community in Islam',
    imamName: 'Sheikh Taha Harun',
    mosqueName: 'Anwar Mosque',
    date: '2026-03-20T12:30:00Z',
    duration: '24:15',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder audio
  },
  {
    id: '2',
    title: 'Patience and Perseverance',
    imamName: 'Sheikh Mohammed Sadiq',
    mosqueName: 'Nur Mosque',
    date: '2026-03-13T12:30:00Z',
    duration: '18:45',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: '3',
    title: 'Gratitude (Shukr)',
    imamName: 'Sheikh Abdul Qadir',
    mosqueName: 'Al-Nejashi Mosque',
    date: '2026-03-06T12:30:00Z',
    duration: '22:10',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];
