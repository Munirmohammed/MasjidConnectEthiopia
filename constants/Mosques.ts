export interface Mosque {
  id: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  address: string;
  imam: string;
  phone: string;
  features: string[];
  photos: string[];
}

export const MOSQUES: Mosque[] = [
  {
    id: '1',
    name: 'Anwar Mosque (Grand Mosque)',
    city: 'Addis Ababa',
    latitude: 9.0345,
    longitude: 38.7495,
    address: 'Merkato, Addis Ababa',
    imam: 'Sheikh Taha Harun',
    phone: '+251911000001',
    features: ['Wudu Area', 'Friday Khutbah', 'Library', 'Parking'],
    photos: ['https://example.com/anwar1.jpg'],
  },
  {
    id: '2',
    name: 'Nur Mosque (Beni Mosque)',
    city: 'Addis Ababa',
    latitude: 9.0227,
    longitude: 38.7523,
    address: 'Piazza, Addis Ababa',
    imam: 'Sheikh Mohammed Sadiq',
    phone: '+251911000002',
    features: ['Wudu Area', 'Friday Khutbah'],
    photos: ['https://example.com/nur1.jpg'],
  },
  {
    id: '3',
    name: 'Al-Nejashi Mosque',
    city: 'Negash',
    latitude: 13.8821,
    longitude: 39.6015,
    address: 'Negash, Tigray',
    imam: 'Sheikh Abdul Qadir',
    phone: '+251911000003',
    features: ['Historic', 'Wudu Area', 'Guest House'],
    photos: ['https://example.com/nejashi1.jpg'],
  },
  {
    id: '4',
    name: 'Jama Mosque',
    city: 'Harar',
    latitude: 9.3117,
    longitude: 42.1288,
    address: 'Old Town, Harar',
    imam: 'Sheikh Harar',
    phone: '+251911000004',
    features: ['Historic', 'Wudu Area'],
    photos: ['https://example.com/harar1.jpg'],
  },
  {
    id: '5',
    name: 'Bilal Mosque',
    city: 'Dire Dawa',
    latitude: 9.5931,
    longitude: 41.8661,
    address: 'Kezira, Dire Dawa',
    imam: 'Sheikh Bilal',
    phone: '+251911000005',
    features: ['Wudu Area', 'Parking'],
    photos: ['https://example.com/bilal1.jpg'],
  },
  // Adding more mosques placeholders to meet the "real" feel
  {
    id: '6',
    name: 'Abu Bakr Mosque',
    city: 'Adama',
    latitude: 8.5414,
    longitude: 39.2689,
    address: 'Center, Adama',
    imam: 'Sheikh Faisal',
    phone: '+251911000006',
    features: ['Wudu Area', 'Friday Khutbah'],
    photos: [],
  },
  {
    id: '7',
    name: 'Omar Mosque',
    city: 'Jimma',
    latitude: 7.6733,
    longitude: 36.8344,
    address: 'Hirmata, Jimma',
    imam: 'Sheikh Omar',
    phone: '+251911000007',
    features: ['Wudu Area', 'Library'],
    photos: [],
  },
  {
    id: '8',
    name: 'Uthman Mosque',
    city: 'Hawassa',
    latitude: 7.0522,
    longitude: 38.4714,
    address: 'Tabor, Hawassa',
    imam: 'Sheikh Uthman',
    phone: '+251911000008',
    features: ['Wudu Area', 'Friday Khutbah'],
    photos: [],
  },
];
