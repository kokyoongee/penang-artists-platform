-- ============================================
-- FIX: Create missing profile for existing user
-- ============================================
-- Run this if you can login but get redirected to homepage
-- (means your profile entry is missing)
-- ============================================

-- Replace 'your-email@example.com' with your actual email
DO $$
DECLARE
  user_record RECORD;
BEGIN
  -- Find user by email (change this to your email)
  SELECT id, email, raw_user_meta_data->>'full_name' as full_name
  INTO user_record
  FROM auth.users
  WHERE email = 'kokyoongee@gmail.com';  -- <-- CHANGE THIS TO YOUR EMAIL

  IF user_record.id IS NULL THEN
    RAISE EXCEPTION 'User not found with that email';
  END IF;

  -- Create profile entry
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    user_record.id,
    user_record.email,
    COALESCE(user_record.full_name, user_record.email),
    'artist'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name);

  RAISE NOTICE 'Profile created/updated for user: %', user_record.email;
END $$;

-- Verify the profile was created
SELECT * FROM public.profiles WHERE email = 'kokyoongee@gmail.com';
