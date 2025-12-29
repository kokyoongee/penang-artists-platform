// Artist types
export type ArtistStatus = 'draft' | 'pending' | 'approved' | 'suspended';
export type ExperienceLevel = 'emerging' | 'established' | 'master';
export type PriceRange = 'budget' | 'mid' | 'premium' | 'contact';

export type MediumCategory =
  | 'visual-art'
  | 'photography'
  | 'craft'
  | 'illustration'
  | 'murals-street-art'
  | 'tattoo'
  | 'music'
  | 'performance';

export type Location =
  | 'georgetown'
  | 'bayan-lepas'
  | 'batu-ferringhi'
  | 'air-itam'
  | 'jelutong'
  | 'tanjung-bungah'
  | 'butterworth'
  | 'bukit-mertajam'
  | 'balik-pulau'
  | 'other';

export interface Artist {
  id: string;
  slug: string;
  display_name: string;
  profile_photo: string | null;
  tagline: string | null;
  bio: string;
  location: Location;
  email: string;

  // Art practice
  primary_medium: MediumCategory;
  secondary_mediums: MediumCategory[];
  styles: string[];
  experience: ExperienceLevel | null;

  // Portfolio
  featured_image: string | null;
  video_url: string | null;
  audio_url: string | null;

  // Contact & Social
  whatsapp: string | null;
  whatsapp_public: boolean;
  instagram: string | null;
  facebook: string | null;
  website: string | null;

  // Availability
  open_for_commissions: boolean;
  open_for_collaboration: boolean;
  open_for_events: boolean;
  price_range: PriceRange;

  // Admin
  status: ArtistStatus;
  featured: boolean;
  verified: boolean;
  created_at: string;
  updated_at: string;
  approved_at: string | null;
  approved_by: string | null;
  user_id: string | null;
}

export interface PortfolioItem {
  id: string;
  artist_id: string;
  image_url: string;
  thumbnail_url: string | null;
  title: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface Inquiry {
  id: string;
  artist_id: string;
  name: string;
  email: string;
  phone: string | null;
  inquiry_type: InquiryType;
  message: string;
  created_at: string;
}

export type InquiryType =
  | 'commission'
  | 'collaboration'
  | 'purchase'
  | 'event'
  | 'general';

// Display helpers
export const MEDIUM_LABELS: Record<MediumCategory, string> = {
  'visual-art': 'Visual Art',
  'photography': 'Photography',
  'craft': 'Craft',
  'illustration': 'Illustration',
  'murals-street-art': 'Murals & Street Art',
  'tattoo': 'Tattoo',
  'music': 'Music',
  'performance': 'Performance',
};

export const LOCATION_LABELS: Record<Location, string> = {
  'georgetown': 'Georgetown',
  'bayan-lepas': 'Bayan Lepas',
  'batu-ferringhi': 'Batu Ferringhi',
  'air-itam': 'Air Itam',
  'jelutong': 'Jelutong',
  'tanjung-bungah': 'Tanjung Bungah',
  'butterworth': 'Butterworth',
  'bukit-mertajam': 'Bukit Mertajam',
  'balik-pulau': 'Balik Pulau',
  'other': 'Other',
};

export const INQUIRY_TYPE_LABELS: Record<InquiryType, string> = {
  'commission': 'Commission Request',
  'collaboration': 'Collaboration Inquiry',
  'purchase': 'Purchase Existing Work',
  'event': 'Event/Exhibition Invitation',
  'general': 'General Inquiry',
};

export const PRICE_RANGE_LABELS: Record<PriceRange, string> = {
  'budget': 'Budget-friendly',
  'mid': 'Mid-range',
  'premium': 'Premium',
  'contact': 'Contact for pricing',
};

export const EXPERIENCE_LABELS: Record<ExperienceLevel, string> = {
  'emerging': 'Emerging Artist',
  'established': 'Established Artist',
  'master': 'Master Artist',
};
