// Database types generated from schema
export type ArtistStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'suspended';
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
export type LocationArea =
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
export type InquiryType =
  | 'commission'
  | 'collaboration'
  | 'purchase'
  | 'event'
  | 'general';
export type UserRole = 'admin' | 'artist';
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
export type EventType =
  | 'exhibition'
  | 'workshop'
  | 'performance'
  | 'talk'
  | 'market'
  | 'opening'
  | 'meetup'
  | 'other';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
      };
      artists: {
        Row: {
          id: string;
          slug: string;
          display_name: string;
          profile_photo: string | null;
          tagline: string | null;
          bio: string;
          location: LocationArea;
          email: string;
          primary_medium: MediumCategory;
          secondary_mediums: MediumCategory[];
          styles: string[];
          experience: ExperienceLevel | null;
          featured_image: string | null;
          video_url: string | null;
          audio_url: string | null;
          whatsapp: string | null;
          whatsapp_public: boolean;
          instagram: string | null;
          facebook: string | null;
          website: string | null;
          open_for_commissions: boolean;
          open_for_collaboration: boolean;
          open_for_events: boolean;
          price_range: PriceRange;
          status: ArtistStatus;
          featured: boolean;
          verified: boolean;
          user_id: string | null;
          approved_at: string | null;
          approved_by: string | null;
          rejection_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug?: string;
          display_name: string;
          profile_photo?: string | null;
          tagline?: string | null;
          bio: string;
          location: LocationArea;
          email: string;
          primary_medium: MediumCategory;
          secondary_mediums?: MediumCategory[];
          styles?: string[];
          experience?: ExperienceLevel | null;
          featured_image?: string | null;
          video_url?: string | null;
          audio_url?: string | null;
          whatsapp?: string | null;
          whatsapp_public?: boolean;
          instagram?: string | null;
          facebook?: string | null;
          website?: string | null;
          open_for_commissions?: boolean;
          open_for_collaboration?: boolean;
          open_for_events?: boolean;
          price_range?: PriceRange;
          status?: ArtistStatus;
          featured?: boolean;
          verified?: boolean;
          user_id?: string | null;
          approved_at?: string | null;
          approved_by?: string | null;
          rejection_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          display_name?: string;
          profile_photo?: string | null;
          tagline?: string | null;
          bio?: string;
          location?: LocationArea;
          email?: string;
          primary_medium?: MediumCategory;
          secondary_mediums?: MediumCategory[];
          styles?: string[];
          experience?: ExperienceLevel | null;
          featured_image?: string | null;
          video_url?: string | null;
          audio_url?: string | null;
          whatsapp?: string | null;
          whatsapp_public?: boolean;
          instagram?: string | null;
          facebook?: string | null;
          website?: string | null;
          open_for_commissions?: boolean;
          open_for_collaboration?: boolean;
          open_for_events?: boolean;
          price_range?: PriceRange;
          status?: ArtistStatus;
          featured?: boolean;
          verified?: boolean;
          user_id?: string | null;
          approved_at?: string | null;
          approved_by?: string | null;
          rejection_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      portfolio_items: {
        Row: {
          id: string;
          artist_id: string;
          image_url: string;
          thumbnail_url: string | null;
          title: string;
          description: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          artist_id: string;
          image_url: string;
          thumbnail_url?: string | null;
          title: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          artist_id?: string;
          image_url?: string;
          thumbnail_url?: string | null;
          title?: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
        };
      };
      inquiries: {
        Row: {
          id: string;
          artist_id: string;
          name: string;
          email: string;
          phone: string | null;
          inquiry_type: InquiryType;
          message: string;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          artist_id: string;
          name: string;
          email: string;
          phone?: string | null;
          inquiry_type: InquiryType;
          message: string;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          artist_id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          inquiry_type?: InquiryType;
          message?: string;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };
      audit_log: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          old_data: Record<string, unknown> | null;
          new_data: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          old_data?: Record<string, unknown> | null;
          new_data?: Record<string, unknown> | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          entity_type?: string;
          entity_id?: string | null;
          old_data?: Record<string, unknown> | null;
          new_data?: Record<string, unknown> | null;
          created_at?: string;
        };
      };
      services: {
        Row: {
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
        };
        Insert: {
          id?: string;
          artist_id: string;
          title: string;
          description?: string | null;
          service_type?: ServiceType;
          price_type?: PriceType;
          price_min?: number | null;
          price_max?: number | null;
          currency?: string;
          delivery_time?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          artist_id?: string;
          title?: string;
          description?: string | null;
          service_type?: ServiceType;
          price_type?: PriceType;
          price_min?: number | null;
          price_max?: number | null;
          currency?: string;
          delivery_time?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      events: {
        Row: {
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
          location: LocationArea | null;
          image_url: string | null;
          ticket_url: string | null;
          is_free: boolean;
          price_info: string | null;
          is_published: boolean;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          artist_id: string;
          title: string;
          description?: string | null;
          event_type?: EventType;
          start_date: string;
          end_date?: string | null;
          is_all_day?: boolean;
          venue?: string | null;
          address?: string | null;
          location?: LocationArea | null;
          image_url?: string | null;
          ticket_url?: string | null;
          is_free?: boolean;
          price_info?: string | null;
          is_published?: boolean;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          artist_id?: string;
          title?: string;
          description?: string | null;
          event_type?: EventType;
          start_date?: string;
          end_date?: string | null;
          is_all_day?: boolean;
          venue?: string | null;
          address?: string | null;
          location?: LocationArea | null;
          image_url?: string | null;
          ticket_url?: string | null;
          is_free?: boolean;
          price_info?: string | null;
          is_published?: boolean;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Enums: {
      artist_status: ArtistStatus;
      experience_level: ExperienceLevel;
      price_range: PriceRange;
      medium_category: MediumCategory;
      location_area: LocationArea;
      inquiry_type: InquiryType;
      user_role: UserRole;
      service_type: ServiceType;
      price_type: PriceType;
      event_type: EventType;
    };
  };
}

// Helper types
export type Artist = Database['public']['Tables']['artists']['Row'];
export type ArtistInsert = Database['public']['Tables']['artists']['Insert'];
export type ArtistUpdate = Database['public']['Tables']['artists']['Update'];
export type PortfolioItem = Database['public']['Tables']['portfolio_items']['Row'];
export type PortfolioItemInsert = Database['public']['Tables']['portfolio_items']['Insert'];
export type Inquiry = Database['public']['Tables']['inquiries']['Row'];
export type InquiryInsert = Database['public']['Tables']['inquiries']['Insert'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Service = Database['public']['Tables']['services']['Row'];
export type ServiceInsert = Database['public']['Tables']['services']['Insert'];
export type ServiceUpdate = Database['public']['Tables']['services']['Update'];
export type Event = Database['public']['Tables']['events']['Row'];
export type EventInsert = Database['public']['Tables']['events']['Insert'];
export type EventUpdate = Database['public']['Tables']['events']['Update'];

// ============================================
// SOCIAL FEATURES TYPES
// ============================================

export type NotificationType =
  | 'new_follower'
  | 'portfolio_like'
  | 'portfolio_comment'
  | 'comment_reply'
  | 'mention'
  | 'event_reminder'
  | 'system';

export type ActivityType =
  | 'portfolio_item_added'
  | 'portfolio_item_updated'
  | 'service_added'
  | 'event_created'
  | 'event_updated'
  | 'profile_updated';

// Follows
export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface FollowInsert {
  id?: string;
  follower_id: string;
  following_id: string;
  created_at?: string;
}

// Likes
export interface Like {
  id: string;
  artist_id: string;
  portfolio_item_id: string;
  created_at: string;
}

export interface LikeInsert {
  id?: string;
  artist_id: string;
  portfolio_item_id: string;
  created_at?: string;
}

// Comments
export interface Comment {
  id: string;
  artist_id: string;
  portfolio_item_id: string;
  parent_id: string | null;
  content: string;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
}

export interface CommentInsert {
  id?: string;
  artist_id: string;
  portfolio_item_id: string;
  parent_id?: string | null;
  content: string;
  is_edited?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CommentUpdate {
  content?: string;
  is_edited?: boolean;
  updated_at?: string;
}

export interface CommentWithAuthor extends Comment {
  artist: {
    id: string;
    display_name: string;
    slug: string;
    profile_photo: string | null;
  };
  replies?: CommentWithAuthor[];
}

// Notifications
export interface Notification {
  id: string;
  recipient_id: string;
  actor_id: string | null;
  notification_type: NotificationType;
  entity_type: string | null;
  entity_id: string | null;
  payload: Record<string, unknown>;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface NotificationWithActor extends Notification {
  actor?: {
    id: string;
    display_name: string;
    slug: string;
    profile_photo: string | null;
  } | null;
}

// Activities
export interface Activity {
  id: string;
  artist_id: string;
  activity_type: ActivityType;
  entity_type: string;
  entity_id: string;
  entity_data: Record<string, unknown>;
  created_at: string;
}

export interface ActivityFeedItem extends Activity {
  artist_name: string;
  artist_slug: string;
  artist_photo: string | null;
}

// Artist with social counts (extended)
export interface ArtistWithSocialCounts extends Artist {
  follower_count: number;
  following_count: number;
}

// Portfolio item with engagement counts
export interface PortfolioItemWithEngagement extends PortfolioItem {
  like_count: number;
  comment_count: number;
  is_liked?: boolean; // For current user
}

// Similar artist result
export interface SimilarArtist {
  id: string;
  display_name: string;
  slug: string;
  profile_photo: string | null;
  tagline: string | null;
  primary_medium: MediumCategory;
  location: LocationArea;
  follower_count: number;
  match_score: number;
}

// Trending artist result
export interface TrendingArtist {
  id: string;
  display_name: string;
  slug: string;
  profile_photo: string | null;
  tagline: string | null;
  primary_medium: MediumCategory;
  new_followers: number;
  total_followers: number;
}
