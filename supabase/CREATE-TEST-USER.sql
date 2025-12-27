-- ============================================
-- CREATE TEST USER
-- ============================================
-- Run this in Supabase SQL Editor to create a test user
-- that bypasses email confirmation.
--
-- After running, you can login with:
-- Email: admin@penangartists.com
-- Password: admin123
-- ============================================

-- Create test user in auth.users
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
  is_super_admin,
  role,
  aud,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@penangartists.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Admin User"}',
  FALSE,
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
)
ON CONFLICT (email) DO NOTHING;

-- Get the user ID we just created
DO $$
DECLARE
  user_id UUID;
BEGIN
  SELECT id INTO user_id FROM auth.users WHERE email = 'admin@penangartists.com';

  -- Create profile for this user
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (user_id, 'admin@penangartists.com', 'Admin User', 'admin')
  ON CONFLICT (id) DO UPDATE SET role = 'admin';

  RAISE NOTICE 'Created user with ID: %', user_id;
END $$;

-- Verify the user was created
SELECT id, email, email_confirmed_at FROM auth.users WHERE email = 'admin@penangartists.com';
