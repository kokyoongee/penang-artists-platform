-- Fix RLS policies for artists table
CREATE POLICY "Artists can create own profile"
  ON artists FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    NOT EXISTS (SELECT 1 FROM artists WHERE user_id = auth.uid())
  );

CREATE POLICY "Artists can view own profile"
  ON artists FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
