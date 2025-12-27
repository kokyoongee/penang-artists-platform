-- Allow artists to insert their own profiles
CREATE POLICY "Artists can create their own profile"
  ON artists FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Allow artists to view their own artist profile (even when not approved)
CREATE POLICY "Artists can view their own profile"
  ON artists FOR SELECT
  USING (user_id = auth.uid());

-- Artists can manage their own portfolio items
CREATE POLICY "Artists can view their own portfolio items"
  ON portfolio_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM artists
      WHERE artists.id = portfolio_items.artist_id AND artists.user_id = auth.uid()
    )
  );

CREATE POLICY "Artists can insert their own portfolio items"
  ON portfolio_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM artists
      WHERE artists.id = portfolio_items.artist_id AND artists.user_id = auth.uid()
    )
  );

CREATE POLICY "Artists can update their own portfolio items"
  ON portfolio_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM artists
      WHERE artists.id = portfolio_items.artist_id AND artists.user_id = auth.uid()
    )
  );

CREATE POLICY "Artists can delete their own portfolio items"
  ON portfolio_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM artists
      WHERE artists.id = portfolio_items.artist_id AND artists.user_id = auth.uid()
    )
  );

-- Artists can view their own inquiries
CREATE POLICY "Artists can view their own inquiries"
  ON inquiries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM artists
      WHERE artists.id = inquiries.artist_id AND artists.user_id = auth.uid()
    )
  );
