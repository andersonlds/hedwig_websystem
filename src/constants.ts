import { Release, Show, GalleryPhoto, Metric } from './types';

export const MOCK_RELEASES: Release[] = [
  {
    id: '1',
    title: 'NEURAL ECHOES',
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=800',
    spotifyLink: '#',
    type: 'album',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'INFINITE PULSE',
    coverUrl: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&q=80&w=800',
    spotifyLink: '#',
    type: 'single',
    created_at: new Date().toISOString()
  }
];

export const MOCK_SHOWS: Show[] = [
  {
    id: '1',
    name: 'BOOM FESTIVAL',
    date: new Date(2026, 6, 20).toISOString(),
    city: 'IDANHA-A-NOVA, PT',
    ticketLink: '#',
    created_at: new Date().toISOString()
  }
];

export const MOCK_GALLERY: GalleryPhoto[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800',
    description: 'MAIN STAGE ENERGY',
    created_at: new Date().toISOString()
  }
];

export const MOCK_METRICS: Metric[] = [
  { id: 'releases', label: 'RELEASES', value: 24, category: 'releases' },
  { id: 'countries', label: 'COUNTRIES', value: 15, category: 'countries' },
  { id: 'tours', label: 'TOURS', value: 5, category: 'tours' }
];
