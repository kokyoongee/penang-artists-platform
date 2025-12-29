-- ============================================
-- SERVICES TABLE - Artist Offerings
-- ============================================
-- Allows artists to list their services/products
-- e.g., commissions, workshops, performances, etc.

-- Service type enum
CREATE TYPE service_type AS ENUM (
  'commission',      -- Custom artwork
  'workshop',        -- Teaching/classes
  'performance',     -- Live performance
  'consultation',    -- Art consultation
  'print',           -- Art prints for sale
  'original',        -- Original artwork for sale
  'merchandise',     -- Merch/products
  'other'            -- Other services
);

-- Price type enum (how pricing is displayed)
CREATE TYPE price_type AS ENUM (
  'fixed',           -- Fixed price
  'from',            -- Starting from price
  'range',           -- Price range
  'hourly',          -- Per hour
  'quote'            -- Contact for quote
);

-- ============================================
-- SERVICES TABLE
-- ============================================

CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,

  -- Basic info
  title TEXT NOT NULL,
  description TEXT,
  service_type service_type NOT NULL DEFAULT 'commission',

  -- Pricing
  price_type price_type NOT NULL DEFAULT 'quote',
  price_min DECIMAL(10, 2),          -- Minimum price (or fixed price)
  price_max DECIMAL(10, 2),          -- Maximum price (for range)
  currency TEXT NOT NULL DEFAULT 'MYR',

  -- Details
  delivery_time TEXT,                 -- e.g., "2-4 weeks", "Same day"
  image_url TEXT,                     -- Service/example image

  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_services_artist ON services(artist_id);
CREATE INDEX idx_services_active ON services(is_active) WHERE is_active = true;
CREATE INDEX idx_services_type ON services(service_type);

-- Updated at trigger
CREATE TRIGGER trigger_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Public can view services of approved artists (active services only)
CREATE POLICY "Anyone can view active services of approved artists"
  ON services FOR SELECT
  USING (
    is_active = true AND
    EXISTS (
      SELECT 1 FROM artists
      WHERE artists.id = services.artist_id AND artists.status = 'approved'
    )
  );

-- Artists can manage their own services
CREATE POLICY "Artists can view their own services"
  ON services FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM artists
      WHERE artists.id = services.artist_id AND artists.user_id = auth.uid()
    )
  );

CREATE POLICY "Artists can insert their own services"
  ON services FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM artists
      WHERE artists.id = services.artist_id AND artists.user_id = auth.uid()
    )
  );

CREATE POLICY "Artists can update their own services"
  ON services FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM artists
      WHERE artists.id = services.artist_id AND artists.user_id = auth.uid()
    )
  );

CREATE POLICY "Artists can delete their own services"
  ON services FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM artists
      WHERE artists.id = services.artist_id AND artists.user_id = auth.uid()
    )
  );

-- Admins can do everything
CREATE POLICY "Admins can manage all services"
  ON services FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
