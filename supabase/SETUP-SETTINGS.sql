-- ===========================================
-- PLATFORM SETTINGS SETUP SCRIPT
-- Run this in Supabase SQL Editor
-- ===========================================

-- Platform Settings Table
CREATE TABLE IF NOT EXISTS platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT NOT NULL DEFAULT 'Penang Artists',
  contact_email TEXT NOT NULL DEFAULT 'hello@penangartists.com',
  site_description TEXT NOT NULL DEFAULT 'Connecting Penang''s vibrant creative community',
  auto_approve_artists BOOLEAN NOT NULL DEFAULT false,
  allow_portfolio_uploads BOOLEAN NOT NULL DEFAULT true,
  max_portfolio_items INTEGER NOT NULL DEFAULT 20,
  notify_new_registration BOOLEAN NOT NULL DEFAULT true,
  notify_new_inquiry BOOLEAN NOT NULL DEFAULT true,
  require_email_verification BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES profiles(id)
);

-- Update trigger
CREATE OR REPLACE FUNCTION update_platform_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_platform_settings_timestamp ON platform_settings;
CREATE TRIGGER update_platform_settings_timestamp
  BEFORE UPDATE ON platform_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_platform_settings_updated_at();

-- Insert default settings row (single-row pattern)
INSERT INTO platform_settings (id)
VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Platform settings are publicly readable" ON platform_settings;
DROP POLICY IF EXISTS "Only admins can update settings" ON platform_settings;
DROP POLICY IF EXISTS "No insert allowed" ON platform_settings;
DROP POLICY IF EXISTS "No delete allowed" ON platform_settings;

-- Create policies
CREATE POLICY "Platform settings are publicly readable"
  ON platform_settings FOR SELECT
  USING (true);

CREATE POLICY "Only admins can update settings"
  ON platform_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "No insert allowed"
  ON platform_settings FOR INSERT
  WITH CHECK (false);

CREATE POLICY "No delete allowed"
  ON platform_settings FOR DELETE
  USING (false);

-- Grant permissions
GRANT SELECT ON platform_settings TO anon, authenticated;
GRANT UPDATE ON platform_settings TO authenticated;

-- Verify setup
SELECT 'Platform settings table created successfully!' AS status;
SELECT * FROM platform_settings;
