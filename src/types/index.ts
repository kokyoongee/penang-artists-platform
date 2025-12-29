// Artist types
export type ArtistStatus = 'draft' | 'pending' | 'approved' | 'suspended';
export type ExperienceLevel = 'emerging' | 'established' | 'master';
export type PriceRange = 'budget' | 'mid' | 'premium' | 'contact';

// Service types
export type ServiceType =
  | 'commission'
  | 'workshop'
  | 'performance'
  | 'consultation'
  | 'print'
  | 'original'
  | 'merchandise'
  | 'other';

export type PriceType = 'fixed' | 'from' | 'range' | 'hourly' | 'quote';

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

// Service interfaces and labels
export interface Service {
  id: string;
  artist_id: string;
  title: string;
  description: string | null;
  service_type: ServiceType;
  price_type: PriceType;
  price_min: number | null;
  price_max: number | null;
  currency: string;
  delivery_time: string | null;
  image_url: string | null;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  'commission': 'Commission',
  'workshop': 'Workshop',
  'performance': 'Performance',
  'consultation': 'Consultation',
  'print': 'Art Print',
  'original': 'Original Artwork',
  'merchandise': 'Merchandise',
  'other': 'Other',
};

export const PRICE_TYPE_LABELS: Record<PriceType, string> = {
  'fixed': 'Fixed Price',
  'from': 'Starting From',
  'range': 'Price Range',
  'hourly': 'Per Hour',
  'quote': 'Contact for Quote',
};

// Event types
export type EventType =
  | 'exhibition'
  | 'workshop'
  | 'performance'
  | 'talk'
  | 'market'
  | 'opening'
  | 'meetup'
  | 'other';

export interface Event {
  id: string;
  artist_id: string;
  title: string;
  description: string | null;
  event_type: EventType;
  start_date: string;
  end_date: string | null;
  is_all_day: boolean;
  venue: string | null;
  address: string | null;
  location: Location | null;
  image_url: string | null;
  ticket_url: string | null;
  is_free: boolean;
  price_info: string | null;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

// Extended event with artist info for public listings
export interface EventWithArtist extends Event {
  artist: {
    id: string;
    slug: string;
    display_name: string;
    profile_photo: string | null;
    primary_medium: MediumCategory;
  };
}

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  'exhibition': 'Exhibition',
  'workshop': 'Workshop',
  'performance': 'Performance',
  'talk': 'Talk / Lecture',
  'market': 'Art Market',
  'opening': 'Opening Night',
  'meetup': 'Artist Meetup',
  'other': 'Other',
};

export const EVENT_TYPE_ICONS: Record<EventType, string> = {
  'exhibition': '🖼️',
  'workshop': '🎨',
  'performance': '🎭',
  'talk': '🎤',
  'market': '🛍️',
  'opening': '🥂',
  'meetup': '👥',
  'other': '📅',
};

// Platform Settings
export interface PlatformSettings {
  id: string;
  // General
  site_name: string;
  contact_email: string;
  site_description: string;
  // Artist Profiles
  auto_approve_artists: boolean;
  allow_portfolio_uploads: boolean;
  max_portfolio_items: number;
  // Notifications
  notify_new_registration: boolean;
  notify_new_inquiry: boolean;
  // Security
  require_email_verification: boolean;
  // Metadata
  updated_at: string;
  updated_by: string | null;
}

// Default settings (used when table doesn't exist or is empty)
export const DEFAULT_SETTINGS: PlatformSettings = {
  id: '00000000-0000-0000-0000-000000000001',
  site_name: 'Penang Artists',
  contact_email: 'hello@penangartists.com',
  site_description: "Connecting Penang's vibrant creative community",
  auto_approve_artists: false,
  allow_portfolio_uploads: true,
  max_portfolio_items: 20,
  notify_new_registration: true,
  notify_new_inquiry: true,
  require_email_verification: true,
  updated_at: new Date().toISOString(),
  updated_by: null,
};
