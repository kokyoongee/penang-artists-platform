-- Fix existing user profiles that don't have 'artist' role
-- This ensures users who signed up before the fix can access the dashboard

-- Update profiles to have artist role (default per schema, but ensure it's set)
UPDATE profiles
SET role = 'artist'
WHERE role IS NULL;

-- Specifically fix known user
UPDATE profiles
SET role = 'artist'
WHERE email = 'kokyoongee@gmail.com';
