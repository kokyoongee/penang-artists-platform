-- ============================================
-- EVENTS TABLE MIGRATION
-- ============================================
-- Allows artists to promote exhibitions, workshops, performances

-- Create event_type enum
CREATE TYPE event_type AS ENUM (
    'exhibition',
    'workshop',
    'performance',
    'talk',
    'market',
    'opening',
    'meetup',
    'other'
);

-- Create events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,

    -- Basic info
    title TEXT NOT NULL,
    description TEXT,
    event_type event_type NOT NULL DEFAULT 'exhibition',

    -- Date and time
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    is_all_day BOOLEAN NOT NULL DEFAULT false,

    -- Location
    venue TEXT,
    address TEXT,
    location location_area, -- Reuse existing location enum (george_town, bayan_lepas, etc.)

    -- Media
    image_url TEXT,

    -- Links and pricing
    ticket_url TEXT,
    is_free BOOLEAN NOT NULL DEFAULT true,
    price_info TEXT, -- e.g., "RM 50" or "RM 30-50" or "Free entry"

    -- Status
    is_published BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_events_artist ON events(artist_id);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_location ON events(location);
CREATE INDEX idx_events_published ON events(is_published) WHERE is_published = true;
CREATE INDEX idx_events_featured ON events(is_featured) WHERE is_featured = true;

-- Updated at trigger
CREATE TRIGGER trigger_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Public can view published events of approved artists
CREATE POLICY "Anyone can view published events of approved artists"
    ON events FOR SELECT
    USING (
        is_published = true AND
        EXISTS (
            SELECT 1 FROM artists
            WHERE artists.id = events.artist_id AND artists.status = 'approved'
        )
    );

-- Artists can view their own events
CREATE POLICY "Artists can view their own events"
    ON events FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM artists
            WHERE artists.id = events.artist_id AND artists.user_id = auth.uid()
        )
    );

-- Artists can insert their own events
CREATE POLICY "Artists can insert their own events"
    ON events FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM artists
            WHERE artists.id = events.artist_id AND artists.user_id = auth.uid()
        )
    );

-- Artists can update their own events
CREATE POLICY "Artists can update their own events"
    ON events FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM artists
            WHERE artists.id = events.artist_id AND artists.user_id = auth.uid()
        )
    );

-- Artists can delete their own events
CREATE POLICY "Artists can delete their own events"
    ON events FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM artists
            WHERE artists.id = events.artist_id AND artists.user_id = auth.uid()
        )
    );

-- Admins can manage all events
CREATE POLICY "Admins can manage all events"
    ON events FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
