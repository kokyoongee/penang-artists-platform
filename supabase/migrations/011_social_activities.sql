-- ============================================
-- SOCIAL FEATURES: ACTIVITIES TABLE
-- Activity feed for following updates
-- ============================================

-- ============================================
-- ACTIVITY TYPE ENUM
-- ============================================
CREATE TYPE activity_type AS ENUM (
  'portfolio_item_added',   -- Artist added new portfolio item
  'portfolio_item_updated', -- Artist updated portfolio item
  'service_added',          -- Artist added new service
  'event_created',          -- Artist created new event
  'event_updated',          -- Artist updated event
  'profile_updated'         -- Artist updated their profile
);

-- ============================================
-- ACTIVITIES TABLE
-- ============================================
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  activity_type activity_type NOT NULL,

  -- Reference to the entity
  entity_type TEXT NOT NULL, -- 'portfolio_item', 'service', 'event', 'artist'
  entity_id UUID NOT NULL,

  -- Denormalized data for feed display (avoid JOINs)
  entity_data JSONB NOT NULL DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for feed queries
CREATE INDEX idx_activities_artist ON activities(artist_id);
CREATE INDEX idx_activities_created ON activities(created_at DESC);
CREATE INDEX idx_activities_type ON activities(activity_type);

-- Composite index for feed query: get activities from followed artists
CREATE INDEX idx_activities_feed ON activities(artist_id, created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Public can view activities of approved artists
CREATE POLICY "Anyone can view activities of approved artists"
  ON activities FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM artists
      WHERE artists.id = activities.artist_id AND artists.status = 'approved'
    )
  );

-- System/triggers can insert activities
CREATE POLICY "System can insert activities"
  ON activities FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Admins have full access
CREATE POLICY "Admins full access to activities"
  ON activities FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================
-- ACTIVITY TRIGGER FUNCTIONS
-- ============================================

-- Log activity for new portfolio item
CREATE OR REPLACE FUNCTION log_portfolio_item_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO activities (
      artist_id,
      activity_type,
      entity_type,
      entity_id,
      entity_data
    ) VALUES (
      NEW.artist_id,
      'portfolio_item_added',
      'portfolio_item',
      NEW.id,
      jsonb_build_object(
        'title', NEW.title,
        'image_url', NEW.image_url,
        'thumbnail_url', NEW.thumbnail_url,
        'description', NEW.description
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_log_portfolio_activity
  AFTER INSERT ON portfolio_items
  FOR EACH ROW EXECUTE FUNCTION log_portfolio_item_activity();

-- Log activity for new service
CREATE OR REPLACE FUNCTION log_service_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO activities (
      artist_id,
      activity_type,
      entity_type,
      entity_id,
      entity_data
    ) VALUES (
      NEW.artist_id,
      'service_added',
      'service',
      NEW.id,
      jsonb_build_object(
        'title', NEW.title,
        'service_type', NEW.service_type,
        'price_type', NEW.price_type,
        'price_min', NEW.price_min,
        'image_url', NEW.image_url
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_log_service_activity
  AFTER INSERT ON services
  FOR EACH ROW EXECUTE FUNCTION log_service_activity();

-- Log activity for new event
CREATE OR REPLACE FUNCTION log_event_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO activities (
      artist_id,
      activity_type,
      entity_type,
      entity_id,
      entity_data
    ) VALUES (
      NEW.artist_id,
      'event_created',
      'event',
      NEW.id,
      jsonb_build_object(
        'title', NEW.title,
        'event_type', NEW.event_type,
        'start_date', NEW.start_date,
        'venue', NEW.venue,
        'image_url', NEW.image_url
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_log_event_activity
  AFTER INSERT ON events
  FOR EACH ROW EXECUTE FUNCTION log_event_activity();

-- ============================================
-- ACTIVITY FEED FUNCTION
-- ============================================
-- Returns paginated feed of activities from followed artists

CREATE OR REPLACE FUNCTION get_activity_feed(
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  artist_id UUID,
  artist_name TEXT,
  artist_slug TEXT,
  artist_photo TEXT,
  activity_type activity_type,
  entity_type TEXT,
  entity_id UUID,
  entity_data JSONB,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  my_artist_id UUID;
BEGIN
  -- Get current user's artist ID
  SELECT art.id INTO my_artist_id FROM artists art WHERE art.user_id = auth.uid() LIMIT 1;

  IF my_artist_id IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    a.id,
    a.artist_id,
    art.display_name AS artist_name,
    art.slug AS artist_slug,
    art.profile_photo AS artist_photo,
    a.activity_type,
    a.entity_type,
    a.entity_id,
    a.entity_data,
    a.created_at
  FROM activities a
  INNER JOIN artists art ON art.id = a.artist_id
  WHERE
    -- Activity is from someone we follow
    a.artist_id IN (
      SELECT following_id FROM follows WHERE follower_id = my_artist_id
    )
    -- And the artist is approved
    AND art.status = 'approved'
  ORDER BY a.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

GRANT EXECUTE ON FUNCTION get_activity_feed(INTEGER, INTEGER) TO authenticated;

-- ============================================
-- DISCOVERY FUNCTIONS
-- ============================================

-- Get similar artists based on medium and location
CREATE OR REPLACE FUNCTION get_similar_artists(
  p_artist_id UUID,
  p_limit INTEGER DEFAULT 6
)
RETURNS TABLE (
  id UUID,
  display_name TEXT,
  slug TEXT,
  profile_photo TEXT,
  tagline TEXT,
  primary_medium medium_category,
  location location_area,
  follower_count INTEGER,
  match_score INTEGER
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_primary_medium medium_category;
  v_secondary_mediums medium_category[];
  v_location location_area;
  my_artist_id UUID;
BEGIN
  -- Get the reference artist's attributes
  SELECT art.primary_medium, art.secondary_mediums, art.location
  INTO v_primary_medium, v_secondary_mediums, v_location
  FROM artists art WHERE art.id = p_artist_id;

  -- Get current user's artist ID for excluding already followed
  SELECT art.id INTO my_artist_id FROM artists art WHERE art.user_id = auth.uid() LIMIT 1;

  RETURN QUERY
  SELECT
    a.id,
    a.display_name,
    a.slug,
    a.profile_photo,
    a.tagline,
    a.primary_medium,
    a.location,
    a.follower_count,
    (
      CASE WHEN a.primary_medium = v_primary_medium THEN 3 ELSE 0 END +
      CASE WHEN a.location = v_location THEN 2 ELSE 0 END +
      CASE WHEN a.primary_medium = ANY(v_secondary_mediums) THEN 1 ELSE 0 END
    )::INTEGER AS match_score
  FROM artists a
  WHERE
    a.id != p_artist_id
    AND a.status = 'approved'
    AND (
      a.primary_medium = v_primary_medium
      OR a.location = v_location
      OR a.primary_medium = ANY(v_secondary_mediums)
    )
    -- Exclude already followed (if logged in)
    AND (
      my_artist_id IS NULL
      OR NOT EXISTS (
        SELECT 1 FROM follows
        WHERE follower_id = my_artist_id AND following_id = a.id
      )
    )
  ORDER BY match_score DESC, a.follower_count DESC
  LIMIT p_limit;
END;
$$;

GRANT EXECUTE ON FUNCTION get_similar_artists(UUID, INTEGER) TO anon, authenticated;

-- Get trending artists (most followed in last 7 days)
CREATE OR REPLACE FUNCTION get_trending_artists(
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  display_name TEXT,
  slug TEXT,
  profile_photo TEXT,
  tagline TEXT,
  primary_medium medium_category,
  new_followers BIGINT,
  total_followers INTEGER
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id,
    a.display_name,
    a.slug,
    a.profile_photo,
    a.tagline,
    a.primary_medium,
    COALESCE(recent.count, 0) AS new_followers,
    a.follower_count AS total_followers
  FROM artists a
  LEFT JOIN (
    SELECT following_id, COUNT(*) as count
    FROM follows
    WHERE created_at > NOW() - INTERVAL '7 days'
    GROUP BY following_id
  ) recent ON recent.following_id = a.id
  WHERE a.status = 'approved'
  ORDER BY new_followers DESC, a.follower_count DESC
  LIMIT p_limit;
END;
$$;

GRANT EXECUTE ON FUNCTION get_trending_artists(INTEGER) TO anon, authenticated;
