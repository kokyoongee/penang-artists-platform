-- ============================================
-- SOCIAL FEATURES: FOLLOWS TABLE
-- Artist-to-artist following system
-- ============================================

-- ============================================
-- FOLLOWS TABLE
-- ============================================
CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Prevent self-follows and duplicates
  CONSTRAINT follows_no_self_follow CHECK (follower_id != following_id),
  CONSTRAINT follows_unique_pair UNIQUE (follower_id, following_id)
);

-- Indexes for performance
CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);
CREATE INDEX idx_follows_created ON follows(created_at DESC);

-- ============================================
-- DENORMALIZED COUNTS ON ARTISTS
-- ============================================
ALTER TABLE artists ADD COLUMN IF NOT EXISTS follower_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE artists ADD COLUMN IF NOT EXISTS following_count INTEGER NOT NULL DEFAULT 0;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- Anyone can view follow relationships for approved artists
CREATE POLICY "Anyone can view follows of approved artists"
  ON follows FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM artists
      WHERE artists.id = follows.following_id AND artists.status = 'approved'
    )
  );

-- Artists can view their own follow relationships
CREATE POLICY "Artists can view own follows"
  ON follows FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM artists
      WHERE artists.id = follows.follower_id AND artists.user_id = auth.uid()
    )
  );

-- Artists can follow other approved artists
CREATE POLICY "Artists can create follows"
  ON follows FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM artists
      WHERE artists.id = follows.follower_id AND artists.user_id = auth.uid()
    )
    AND EXISTS (
      SELECT 1 FROM artists
      WHERE artists.id = follows.following_id AND artists.status = 'approved'
    )
  );

-- Artists can unfollow
CREATE POLICY "Artists can delete own follows"
  ON follows FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM artists
      WHERE artists.id = follows.follower_id AND artists.user_id = auth.uid()
    )
  );

-- Admins have full access
CREATE POLICY "Admins full access to follows"
  ON follows FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================
-- TRIGGER: UPDATE FOLLOW COUNTS
-- ============================================
CREATE OR REPLACE FUNCTION update_follow_counts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE artists SET follower_count = follower_count + 1 WHERE id = NEW.following_id;
    UPDATE artists SET following_count = following_count + 1 WHERE id = NEW.follower_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE artists SET follower_count = GREATEST(follower_count - 1, 0) WHERE id = OLD.following_id;
    UPDATE artists SET following_count = GREATEST(following_count - 1, 0) WHERE id = OLD.follower_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER trigger_update_follow_counts
  AFTER INSERT OR DELETE ON follows
  FOR EACH ROW EXECUTE FUNCTION update_follow_counts();

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Get current user's artist ID
CREATE OR REPLACE FUNCTION get_my_artist_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
DECLARE
  artist_id UUID;
BEGIN
  SELECT id INTO artist_id
  FROM artists
  WHERE user_id = auth.uid()
  LIMIT 1;
  RETURN artist_id;
END;
$$;

GRANT EXECUTE ON FUNCTION get_my_artist_id() TO authenticated;

-- Check if current user is following an artist
CREATE OR REPLACE FUNCTION is_following(target_artist_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
DECLARE
  my_artist_id UUID;
BEGIN
  SELECT id INTO my_artist_id FROM artists WHERE user_id = auth.uid() LIMIT 1;

  IF my_artist_id IS NULL THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM follows
    WHERE follower_id = my_artist_id AND following_id = target_artist_id
  );
END;
$$;

GRANT EXECUTE ON FUNCTION is_following(UUID) TO authenticated;
