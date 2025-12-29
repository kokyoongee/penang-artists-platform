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
