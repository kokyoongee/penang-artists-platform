-- Penang Artists Platform Database Schema
-- Run this in Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE artist_status AS ENUM ('draft', 'pending', 'approved', 'suspended');
CREATE TYPE experience_level AS ENUM ('emerging', 'established', 'master');
CREATE TYPE price_range AS ENUM ('budget', 'mid', 'premium', 'contact');
CREATE TYPE medium_category AS ENUM (
  'visual-art',
  'photography',
  'craft',
  'illustration',
  'murals-street-art',
  'tattoo',
  'music',
  'performance'
);
CREATE TYPE location_area AS ENUM (
  'georgetown',
  'bayan-lepas',
  'batu-ferringhi',
  'air-itam',
  'jelutong',
  'tanjung-bungah',
  'butterworth',
  'bukit-mertajam',
  'balik-pulau',
  'other'
);
CREATE TYPE inquiry_type AS ENUM (
  'commission',
  'collaboration',
  'purchase',
  'event',
  'general'
);
CREATE TYPE user_role AS ENUM ('admin', 'artist');

-- ============================================
-- PROFILES TABLE (extends Supabase auth.users)
-- ============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'artist',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- ARTISTS TABLE
-- ============================================

CREATE TABLE artists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  profile_photo TEXT,
  tagline TEXT,
  bio TEXT NOT NULL,
  location location_area NOT NULL,
  email TEXT NOT NULL,

  -- Art practice
  primary_medium medium_category NOT NULL,
  secondary_mediums medium_category[] DEFAULT '{}',
  styles TEXT[] DEFAULT '{}',
  experience experience_level,

  -- Portfolio
  featured_image TEXT,
  video_url TEXT,
  audio_url TEXT,

  -- Contact & Social
  whatsapp TEXT,
  whatsapp_public BOOLEAN NOT NULL DEFAULT true,
  instagram TEXT,
  facebook TEXT,
  website TEXT,

  -- Availability
  open_for_commissions BOOLEAN NOT NULL DEFAULT false,
  open_for_collaboration BOOLEAN NOT NULL DEFAULT false,
  open_for_events BOOLEAN NOT NULL DEFAULT false,
  price_range price_range NOT NULL DEFAULT 'contact',

  -- Admin
  status artist_status NOT NULL DEFAULT 'draft',
  featured BOOLEAN NOT NULL DEFAULT false,
  verified BOOLEAN NOT NULL DEFAULT false,

  -- Ownership (optional - for self-registered artists)
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,

  -- Approval tracking
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES profiles(id),
  rejection_reason TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for common queries
CREATE INDEX idx_artists_status ON artists(status);
CREATE INDEX idx_artists_featured ON artists(featured) WHERE featured = true;
CREATE INDEX idx_artists_slug ON artists(slug);
CREATE INDEX idx_artists_location ON artists(location);
CREATE INDEX idx_artists_primary_medium ON artists(primary_medium);

-- ============================================
-- PORTFOLIO ITEMS TABLE
-- ============================================

CREATE TABLE portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_portfolio_artist ON portfolio_items(artist_id);

-- ============================================
-- INQUIRIES TABLE (visitor contact tracking)
-- ============================================

CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  inquiry_type inquiry_type NOT NULL,
  message TEXT NOT NULL,

  -- Tracking
  ip_address INET,
  user_agent TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inquiries_artist ON inquiries(artist_id);
CREATE INDEX idx_inquiries_created ON inquiries(created_at DESC);

-- ============================================
-- AUDIT LOG TABLE
-- ============================================

CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_created ON audit_log(created_at DESC);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_artists_updated_at
  BEFORE UPDATE ON artists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Generate slug from display name
CREATE OR REPLACE FUNCTION generate_artist_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  new_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Generate base slug from display_name
  base_slug := LOWER(REGEXP_REPLACE(NEW.display_name, '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := TRIM(BOTH '-' FROM base_slug);
  new_slug := base_slug;

  -- Check for duplicates and append counter if needed
  WHILE EXISTS (SELECT 1 FROM artists WHERE slug = new_slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)) LOOP
    counter := counter + 1;
    new_slug := base_slug || '-' || counter;
  END LOOP;

  NEW.slug := new_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_artist_slug
  BEFORE INSERT OR UPDATE OF display_name ON artists
  FOR EACH ROW
  WHEN (NEW.slug IS NULL OR NEW.slug = '')
  EXECUTE FUNCTION generate_artist_slug();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Artists policies (public read for approved, admin full access)
CREATE POLICY "Anyone can view approved artists"
  ON artists FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Admins can view all artists"
  ON artists FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert artists"
  ON artists FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update artists"
  ON artists FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete artists"
  ON artists FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Artists can update their own profile"
  ON artists FOR UPDATE
  USING (user_id = auth.uid());

-- Portfolio items policies
CREATE POLICY "Anyone can view portfolio items of approved artists"
  ON portfolio_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM artists
      WHERE artists.id = portfolio_items.artist_id AND artists.status = 'approved'
    )
  );

CREATE POLICY "Admins can manage all portfolio items"
  ON portfolio_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Inquiries policies (anyone can insert, admins can view)
CREATE POLICY "Anyone can create inquiries"
  ON inquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all inquiries"
  ON inquiries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Audit log policies (admins only)
CREATE POLICY "Admins can view audit log"
  ON audit_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "System can insert audit log"
  ON audit_log FOR INSERT
  WITH CHECK (true);

-- ============================================
-- HANDLE NEW USER SIGNUP
-- ============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'artist')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
