export interface Imam {
  id: string;
  name: string;
  mosqueId: string;
  mosqueName: string;
  specialty: string;
  phone: string;
  photo: string;
  bio: string;
}

export const IMAMS: Imam[] = [
  {
    id: '1',
    name: 'Sheikh Taha Harun',
    mosqueId: '1',
    mosqueName: 'Anwar Mosque',
    specialty: 'Fiqh & Hadith',
    phone: '+251911000001',
    photo: 'https://example.com/sheikh_taha.jpg',
    bio: 'Renowned scholar at the Grand Anwar Mosque in Addis Ababa, specializing in Islamic jurisprudence.',
  },
  {
    id: '2',
    name: 'Sheikh Mohammed Sadiq',
    mosqueId: '2',
    mosqueName: 'Nur Mosque',
    specialty: 'Tafsir',
    phone: '+251911000002',
    photo: 'https://example.com/sheikh_sadiq.jpg',
    bio: 'Lead Imam at Nur Mosque, known for his deep insights into Quranic interpretation.',
  },
  {
    id: '3',
    name: 'Sheikh Abdul Qadir',
    mosqueId: '3',
    mosqueName: 'Al-Nejashi Mosque',
    specialty: 'Islamic History',
    phone: '+251911000003',
    photo: 'https://example.com/sheikh_qadir.jpg',
    bio: 'Custodian of the historic Al-Nejashi Mosque, expert in the history of Islam in Ethiopia.',
  },
];
