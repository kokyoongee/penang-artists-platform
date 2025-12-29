-- ============================================
-- SETUP SERVICES TABLE
-- ============================================
-- Run this in Supabase SQL Editor to add the services feature
-- This should be run AFTER the initial schema is set up

-- Check if service_type enum already exists
DO $$ BEGIN
    CREATE TYPE service_type AS ENUM (
        'commission',
        'workshop',
        'performance',
        'consultation',
        'print',
        'original',
        'merchandise',
        'other'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Check if price_type enum already exists
DO $$ BEGIN
    CREATE TYPE price_type AS ENUM (
        'fixed',
        'from',
        'range',
        'hourly',
        'quote'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create services table if not exists
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,

    -- Basic info
    title TEXT NOT NULL,
    description TEXT,
    service_type service_type NOT NULL DEFAULT 'commission',

    -- Pricing
    price_type price_type NOT NULL DEFAULT 'quote',
    price_min DECIMAL(10, 2),
    price_max DECIMAL(10, 2),
    currency TEXT NOT NULL DEFAULT 'MYR',

    -- Details
    delivery_time TEXT,
    image_url TEXT,

    -- Status
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_services_artist ON services(artist_id);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_services_type ON services(service_type);

-- Updated at trigger
DROP TRIGGER IF EXISTS trigger_services_updated_at ON services;
CREATE TRIGGER trigger_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can view active services of approved artists" ON services;
DROP POLICY IF EXISTS "Artists can view their own services" ON services;
DROP POLICY IF EXISTS "Artists can insert their own services" ON services;
DROP POLICY IF EXISTS "Artists can update their own services" ON services;
DROP POLICY IF EXISTS "Artists can delete their own services" ON services;
DROP POLICY IF EXISTS "Admins can manage all services" ON services;

-- Create policies
CREATE POLICY "Anyone can view active services of approved artists"
    ON services FOR SELECT
    USING (
        is_active = true AND
        EXISTS (
            SELECT 1 FROM artists
            WHERE artists.id = services.artist_id AND artists.status = 'approved'
        )
    );

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

CREATE POLICY "Admins can manage all services"
    ON services FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ============================================
-- VERIFY SETUP
-- ============================================
SELECT 'Services table created successfully!' as status;
