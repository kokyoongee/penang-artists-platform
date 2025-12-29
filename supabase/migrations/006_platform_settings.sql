-- Platform Settings Table
-- Stores key-value pairs for platform configuration
-- Uses a single-row pattern for simplicity

CREATE TABLE IF NOT EXISTS platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- General Settings
  site_name TEXT NOT NULL DEFAULT 'Penang Artists',
  contact_email TEXT NOT NULL DEFAULT 'hello@penangartists.com',
  site_description TEXT NOT NULL DEFAULT 'Connecting Penang''s vibrant creative community',

  -- Artist Profile Settings
  auto_approve_artists BOOLEAN NOT NULL DEFAULT false,
  allow_portfolio_uploads BOOLEAN NOT NULL DEFAULT true,
  max_portfolio_items INTEGER NOT NULL DEFAULT 20,

  -- Notification Settings
  notify_new_registration BOOLEAN NOT NULL DEFAULT true,
  notify_new_inquiry BOOLEAN NOT NULL DEFAULT true,

  -- Security Settings
  require_email_verification BOOLEAN NOT NULL DEFAULT true,

  -- Metadata
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES profiles(id)
);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_platform_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_platform_settings_timestamp
  BEFORE UPDATE ON platform_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_platform_settings_updated_at();

-- Insert default settings row
INSERT INTO platform_settings (id)
VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- RLS Policies
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (for client-side checks)
CREATE POLICY "Platform settings are publicly readable"
  ON platform_settings FOR SELECT
  USING (true);

-- Only admins can update settings
CREATE POLICY "Only admins can update settings"
  ON platform_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Prevent insert/delete (we use a single-row pattern)
CREATE POLICY "No insert allowed"
  ON platform_settings FOR INSERT
  WITH CHECK (false);

CREATE POLICY "No delete allowed"
  ON platform_settings FOR DELETE
  USING (false);

-- Grant permissions
GRANT SELECT ON platform_settings TO anon, authenticated;
GRANT UPDATE ON platform_settings TO authenticated;
