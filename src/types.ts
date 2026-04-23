export interface Show {
  id: string;
  name: string;
  date: string;
  city: string;
  ticketLink: string;
  created_at: string;
}

export interface Release {
  id: string;
  title: string;
  coverUrl: string;
  spotifyLink: string;
  type: 'single' | 'ep' | 'album';
  created_at: string;
}

export interface GalleryPhoto {
  id: string;
  imageUrl: string;
  description: string;
  created_at: string;
}

export interface Metric {
  id: string;
  label: string;
  value: number;
  category: 'releases' | 'countries' | 'tours';
}
