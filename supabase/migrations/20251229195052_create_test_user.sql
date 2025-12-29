-- Create test user in auth.users with pre-hashed password
-- Password: TestPassword123!
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role
) VALUES (
  'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
  '00000000-0000-0000-0000-000000000000',
  'test@penangartists.com',
  extensions.crypt('TestPassword123!', extensions.gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Test Artist"}',
  'authenticated',
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- Create profile for test user
INSERT INTO profiles (id, full_name, email, role)
VALUES (
  'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
  'Test Artist',
  'test@penangartists.com',
  'artist'
) ON CONFLICT (id) DO UPDATE SET
  full_name = 'Test Artist',
  email = 'test@penangartists.com';

-- Delete existing artist profile if any
DELETE FROM artists WHERE user_id = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

-- Create artist profile for test user
INSERT INTO artists (
  user_id,
  display_name,
  slug,
  bio,
  email,
  status,
  location,
  primary_medium
) VALUES (
  'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
  'Test Artist',
  'test-artist',
  'A test artist for verifying the platform.',
  'test@penangartists.com',
  'draft',
  'georgetown',
  'visual-art'
);
