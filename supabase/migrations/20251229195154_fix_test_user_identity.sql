-- Add identity for test user (required for email login)
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
  'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
  '{"sub": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee", "email": "test@penangartists.com"}',
  'email',
  'test@penangartists.com',
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (provider, provider_id) DO NOTHING;
