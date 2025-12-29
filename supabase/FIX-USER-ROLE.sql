-- Fix existing user profiles that don't have 'artist' role
-- This ensures users who signed up before the fix can access the dashboard

-- Update kokyoongee@gmail.com to have artist role
UPDATE profiles
SET role = 'artist'
WHERE email = 'kokyoongee@gmail.com';

-- Also update any other profiles that might be missing the role
UPDATE profiles
SET role = 'artist'
WHERE role IS NULL OR role::text = '';
