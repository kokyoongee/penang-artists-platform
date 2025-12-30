-- ============================================
-- SOCIAL FEATURES: LIKES TABLE
-- Likes on portfolio items
-- ============================================

-- ============================================
-- LIKES TABLE
-- ============================================
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  portfolio_item_id UUID NOT NULL REFERENCES portfolio_items(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- One like per artist per item
  CONSTRAINT likes_unique_artist_item UNIQUE (artist_id, portfolio_item_id)
);

-- Indexes
CREATE INDEX idx_likes_portfolio_item ON likes(portfolio_item_id);
CREATE INDEX idx_likes_artist ON likes(artist_id);
CREATE INDEX idx_likes_created ON likes(created_at DESC);

-- ============================================
-- DENORMALIZED COUNTS ON PORTFOLIO_ITEMS
-- ============================================
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS like_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS comment_count INTEGER NOT NULL DEFAULT 0;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Public can view likes on approved artists' portfolio items
CREATE POLICY "Anyone can view likes on approved portfolios"
  ON likes FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM portfolio_items pi
      JOIN artists a ON a.id = pi.artist_id
      WHERE pi.id = likes.portfolio_item_id AND a.status = 'approved'
    )
  );

-- Artists can like portfolio items of approved artists
CREATE POLICY "Artists can create likes"
  ON likes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM artists
      WHERE artists.id = likes.artist_id AND artists.user_id = auth.uid()
    )
    AND EXISTS (
      SELECT 1 FROM portfolio_items pi
      JOIN artists a ON a.id = pi.artist_id
      WHERE pi.id = likes.portfolio_item_id AND a.status = 'approved'
    )
  );

-- Artists can unlike
CREATE POLICY "Artists can delete own likes"
  ON likes FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM artists
      WHERE artists.id = likes.artist_id AND artists.user_id = auth.uid()
    )
  );

-- Admins have full access
CREATE POLICY "Admins full access to likes"
  ON likes FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================
-- TRIGGER: UPDATE LIKE COUNTS
-- ============================================
CREATE OR REPLACE FUNCTION update_like_counts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE portfolio_items SET like_count = like_count + 1 WHERE id = NEW.portfolio_item_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE portfolio_items SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.portfolio_item_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER trigger_update_like_counts
  AFTER INSERT OR DELETE ON likes
  FOR EACH ROW EXECUTE FUNCTION update_like_counts();

-- ============================================
-- HELPER FUNCTION
-- ============================================

-- Check if current user has liked a portfolio item
CREATE OR REPLACE FUNCTION has_liked(target_portfolio_item_id UUID)
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
    SELECT 1 FROM likes
    WHERE artist_id = my_artist_id AND portfolio_item_id = target_portfolio_item_id
  );
END;
$$;

GRANT EXECUTE ON FUNCTION has_liked(UUID) TO authenticated;
