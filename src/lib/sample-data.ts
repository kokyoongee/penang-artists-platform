import { Artist, PortfolioItem } from '@/types';

// Sample artists for development (before Supabase is connected)
export const sampleArtists: Artist[] = [
  {
    id: '1',
    slug: 'chen-wei-lin',
    display_name: 'Chen Wei Lin',
    profile_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    tagline: 'Capturing the soul of Penang through watercolors',
    bio: 'A Georgetown-based watercolor artist with over 15 years of experience capturing the heritage architecture and street life of Penang. My work has been exhibited internationally and is collected by art lovers worldwide.',
    location: 'georgetown',
    email: 'chenwei@example.com',
    primary_medium: 'visual-art',
    secondary_mediums: ['illustration'],
    styles: ['Traditional', 'Heritage', 'Landscape'],
    experience: 'established',
    featured_image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=600&fit=crop',
    video_url: null,
    audio_url: null,
    whatsapp: '60123456789',
    whatsapp_public: true,
    instagram: 'https://instagram.com/chenwei',
    facebook: 'https://facebook.com/chenwei',
    website: 'https://chenweilin.art',
    open_for_commissions: true,
    open_for_collaboration: true,
    open_for_events: true,
    price_range: 'mid',
    status: 'approved',
    featured: true,
    verified: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-03-20T14:30:00Z',
    approved_at: '2024-01-16T09:00:00Z',
    approved_by: 'admin',
    user_id: null,
  },
  {
    id: '2',
    slug: 'maya-tan',
    display_name: 'Maya Tan',
    profile_photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    tagline: 'Contemporary ceramics with Peranakan influences',
    bio: 'Blending traditional Peranakan motifs with modern ceramic techniques. Each piece tells a story of cultural heritage meeting contemporary design. Studio visits welcome by appointment.',
    location: 'air-itam',
    email: 'maya@example.com',
    primary_medium: 'craft',
    secondary_mediums: [],
    styles: ['Contemporary', 'Heritage', 'Minimalist'],
    experience: 'established',
    featured_image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&h=600&fit=crop',
    video_url: null,
    audio_url: null,
    whatsapp: '60198765432',
    whatsapp_public: true,
    instagram: 'https://instagram.com/mayaceramics',
    facebook: null,
    website: 'https://mayatan.studio',
    open_for_commissions: true,
    open_for_collaboration: false,
    open_for_events: true,
    price_range: 'premium',
    status: 'approved',
    featured: true,
    verified: true,
    created_at: '2024-02-01T08:00:00Z',
    updated_at: '2024-03-15T16:00:00Z',
    approved_at: '2024-02-02T10:00:00Z',
    approved_by: 'admin',
    user_id: null,
  },
  {
    id: '3',
    slug: 'ahmad-razak',
    display_name: 'Ahmad Razak',
    profile_photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    tagline: 'Street art that tells our stories',
    bio: 'From the walls of Hin Bus Depot to international murals, I bring Penang\'s multicultural spirit to life through large-scale street art. Commissioned works available.',
    location: 'georgetown',
    email: 'ahmad.razak@example.com',
    primary_medium: 'murals-street-art',
    secondary_mediums: ['illustration'],
    styles: ['Urban', 'Contemporary', 'Folk'],
    experience: 'established',
    featured_image: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800&h=600&fit=crop',
    video_url: null,
    audio_url: null,
    whatsapp: '60112223344',
    whatsapp_public: false,
    instagram: 'https://instagram.com/ahmadrazakart',
    facebook: 'https://facebook.com/ahmadrazakart',
    website: null,
    open_for_commissions: true,
    open_for_collaboration: true,
    open_for_events: false,
    price_range: 'contact',
    status: 'approved',
    featured: true,
    verified: true,
    created_at: '2024-01-20T12:00:00Z',
    updated_at: '2024-03-10T09:00:00Z',
    approved_at: '2024-01-21T11:00:00Z',
    approved_by: 'admin',
    user_id: null,
  },
  {
    id: '4',
    slug: 'lim-siew-mei',
    display_name: 'Lim Siew Mei',
    profile_photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    tagline: 'Documentary photography of everyday life',
    bio: 'I document the changing face of Penang — from its hawker culture to disappearing trades. My photographs have been published in National Geographic and featured in major exhibitions.',
    location: 'georgetown',
    email: 'siewmei@example.com',
    primary_medium: 'photography',
    secondary_mediums: [],
    styles: ['Documentary', 'Portrait', 'Heritage'],
    experience: 'master',
    featured_image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=600&fit=crop',
    video_url: null,
    audio_url: null,
    whatsapp: '60177889900',
    whatsapp_public: true,
    instagram: 'https://instagram.com/siewmeiphoto',
    facebook: null,
    website: 'https://limsiewmei.com',
    open_for_commissions: true,
    open_for_collaboration: true,
    open_for_events: true,
    price_range: 'premium',
    status: 'approved',
    featured: false,
    verified: true,
    created_at: '2024-02-15T14:00:00Z',
    updated_at: '2024-03-05T10:00:00Z',
    approved_at: '2024-02-16T08:00:00Z',
    approved_by: 'admin',
    user_id: null,
  },
  {
    id: '5',
    slug: 'raj-kumar',
    display_name: 'Raj Kumar',
    profile_photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    tagline: 'Traditional Indian art meets Penang',
    bio: 'Trained in classical Indian art forms, I create vibrant paintings that celebrate the Indian diaspora in Penang. Workshop instructor at local art centers.',
    location: 'jelutong',
    email: 'raj@example.com',
    primary_medium: 'visual-art',
    secondary_mediums: [],
    styles: ['Traditional', 'Folk', 'Contemporary'],
    experience: 'established',
    featured_image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&h=600&fit=crop',
    video_url: null,
    audio_url: null,
    whatsapp: '60165544332',
    whatsapp_public: true,
    instagram: 'https://instagram.com/rajkumarart',
    facebook: 'https://facebook.com/rajkumarart',
    website: null,
    open_for_commissions: true,
    open_for_collaboration: false,
    open_for_events: true,
    price_range: 'mid',
    status: 'approved',
    featured: false,
    verified: true,
    created_at: '2024-03-01T09:00:00Z',
    updated_at: '2024-03-18T15:00:00Z',
    approved_at: '2024-03-02T10:00:00Z',
    approved_by: 'admin',
    user_id: null,
  },
  {
    id: '6',
    slug: 'sarah-wong',
    display_name: 'Sarah Wong',
    profile_photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    tagline: 'Emerging batik artist with modern twist',
    bio: 'Fresh graduate from USM Fine Arts, exploring new expressions of traditional batik. Looking to connect with fellow artists and opportunities to showcase work.',
    location: 'bayan-lepas',
    email: 'sarah.wong@example.com',
    primary_medium: 'craft',
    secondary_mediums: ['visual-art'],
    styles: ['Contemporary', 'Abstract', 'Nature'],
    experience: 'emerging',
    featured_image: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800&h=600&fit=crop',
    video_url: null,
    audio_url: null,
    whatsapp: '60143322110',
    whatsapp_public: true,
    instagram: 'https://instagram.com/sarahbatik',
    facebook: null,
    website: null,
    open_for_commissions: true,
    open_for_collaboration: true,
    open_for_events: true,
    price_range: 'budget',
    status: 'approved',
    featured: false,
    verified: false,
    created_at: '2024-03-10T11:00:00Z',
    updated_at: '2024-03-19T14:00:00Z',
    approved_at: '2024-03-11T09:00:00Z',
    approved_by: 'admin',
    user_id: null,
  },
];

// Sample portfolio items
export const samplePortfolioItems: Record<string, PortfolioItem[]> = {
  '1': [
    {
      id: 'p1-1',
      artist_id: '1',
      image_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
      thumbnail_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400',
      title: 'Armenian Street Heritage',
      description: 'Watercolor painting capturing the iconic shophouses and street art of Armenian Street in Georgetown.',
      sort_order: 0,
      created_at: '2024-01-15T10:00:00Z',
    },
    {
      id: 'p1-2',
      artist_id: '1',
      image_url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800',
      thumbnail_url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400',
      title: 'Clan Jetties at Dawn',
      description: 'Early morning light over the historic Chew Jetty, one of Penang\'s UNESCO heritage sites.',
      sort_order: 1,
      created_at: '2024-01-15T10:00:00Z',
    },
    {
      id: 'p1-3',
      artist_id: '1',
      image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800',
      thumbnail_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400',
      title: 'Kopitiam Morning',
      description: 'A typical morning scene at a traditional Penang coffee shop, capturing the essence of local life.',
      sort_order: 2,
      created_at: '2024-01-15T10:00:00Z',
    },
    {
      id: 'p1-4',
      artist_id: '1',
      image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
      thumbnail_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400',
      title: 'Temple Street Scene',
      description: 'Vibrant depiction of the temples and traditional architecture along Penang Road.',
      sort_order: 3,
      created_at: '2024-01-15T10:00:00Z',
    },
  ],
  '2': [
    {
      id: 'p2-1',
      artist_id: '2',
      image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800',
      thumbnail_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400',
      title: 'Peranakan Vase Collection',
      description: 'A series of hand-crafted vases featuring traditional Nyonya motifs with a contemporary twist.',
      sort_order: 0,
      created_at: '2024-02-01T08:00:00Z',
    },
    {
      id: 'p2-2',
      artist_id: '2',
      image_url: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=800',
      thumbnail_url: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=400',
      title: 'Tea Set Series',
      description: 'Functional art pieces designed for everyday use, celebrating the tea culture of Penang.',
      sort_order: 1,
      created_at: '2024-02-01T08:00:00Z',
    },
  ],
};

// Helper functions to simulate database queries
export function getArtists(filters?: {
  medium?: string;
  location?: string;
  featured?: boolean;
  search?: string;
}): Artist[] {
  let results = sampleArtists.filter((a) => a.status === 'approved');

  if (filters?.medium) {
    results = results.filter(
      (a) =>
        a.primary_medium === filters.medium ||
        a.secondary_mediums.includes(filters.medium as any)
    );
  }

  if (filters?.location) {
    results = results.filter((a) => a.location === filters.location);
  }

  if (filters?.featured) {
    results = results.filter((a) => a.featured);
  }

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    results = results.filter(
      (a) =>
        a.display_name.toLowerCase().includes(searchLower) ||
        a.tagline?.toLowerCase().includes(searchLower) ||
        a.bio.toLowerCase().includes(searchLower)
    );
  }

  return results;
}

export function getArtistBySlug(slug: string): Artist | undefined {
  return sampleArtists.find((a) => a.slug === slug);
}

export function getPortfolioItems(artistId: string): PortfolioItem[] {
  return samplePortfolioItems[artistId] || [];
}

export function getFeaturedArtists(limit: number = 4): Artist[] {
  return sampleArtists
    .filter((a) => a.status === 'approved' && a.featured)
    .slice(0, limit);
}
