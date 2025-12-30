-- ============================================
-- SOCIAL FEATURES: COMMENTS TABLE
-- Comments on portfolio items with threading
-- ============================================

-- ============================================
-- COMMENTS TABLE
-- ============================================
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  portfolio_item_id UUID NOT NULL REFERENCES portfolio_items(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- For replies
  content TEXT NOT NULL CHECK (length(content) <= 1000),
  is_edited BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_comments_portfolio_item ON comments(portfolio_item_id);
CREATE INDEX idx_comments_artist ON comments(artist_id);
CREATE INDEX idx_comments_parent ON comments(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX idx_comments_created ON comments(created_at DESC);

-- Updated at trigger
CREATE TRIGGER trigger_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Public can view comments on approved artists' portfolio items
CREATE POLICY "Anyone can view comments on approved portfolios"
  ON comments FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM portfolio_items pi
      JOIN artists a ON a.id = pi.artist_id
      WHERE pi.id = comments.portfolio_item_id AND a.status = 'approved'
    )
  );

-- Artists can create comments on approved artists' items
CREATE POLICY "Artists can create comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM artists
      WHERE artists.id = comments.artist_id AND artists.user_id = auth.uid()
    )
    AND EXISTS (
      SELECT 1 FROM portfolio_items pi
      JOIN artists a ON a.id = pi.artist_id
      WHERE pi.id = comments.portfolio_item_id AND a.status = 'approved'
    )
  );

-- Artists can update their own comments
CREATE POLICY "Artists can update own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM artists
      WHERE artists.id = comments.artist_id AND artists.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM artists
      WHERE artists.id = comments.artist_id AND artists.user_id = auth.uid()
    )
  );

-- Artists can delete their own comments
CREATE POLICY "Artists can delete own comments"
  ON comments FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM artists
      WHERE artists.id = comments.artist_id AND artists.user_id = auth.uid()
    )
  );

-- Portfolio owners can delete comments on their items
CREATE POLICY "Portfolio owners can delete comments on their items"
  ON comments FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM portfolio_items pi
      JOIN artists a ON a.id = pi.artist_id
      WHERE pi.id = comments.portfolio_item_id AND a.user_id = auth.uid()
    )
  );

-- Admins have full access
CREATE POLICY "Admins full access to comments"
  ON comments FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================
-- TRIGGER: UPDATE COMMENT COUNTS
-- ============================================
CREATE OR REPLACE FUNCTION update_comment_counts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE portfolio_items SET comment_count = comment_count + 1 WHERE id = NEW.portfolio_item_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE portfolio_items SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.portfolio_item_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER trigger_update_comment_counts
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_comment_counts();
