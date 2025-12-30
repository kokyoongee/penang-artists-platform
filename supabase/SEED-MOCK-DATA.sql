-- ============================================
-- SEED MOCK DATA FOR SOCIAL FEATURES
-- ============================================
-- This script creates test users, artists, portfolio items,
-- follows, likes, comments, notifications, and activities
-- to demonstrate the social features.
-- ============================================

-- ============================================
-- STEP 1: Create Test Auth Users
-- ============================================

-- User 1: Maya Chen (Photographer)
INSERT INTO auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at,
  created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
  is_super_admin, role, aud, confirmation_token
)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'maya@penangartists.com',
  crypt('artist123', gen_salt('bf')),
  NOW(), NOW(), NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Maya Chen"}',
  FALSE, 'authenticated', 'authenticated', ''
)
ON CONFLICT (id) DO NOTHING;

-- User 2: Ahmad Rizal (Muralist)
INSERT INTO auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at,
  created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
  is_super_admin, role, aud, confirmation_token
)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  '00000000-0000-0000-0000-000000000000',
  'ahmad@penangartists.com',
  crypt('artist123', gen_salt('bf')),
  NOW(), NOW(), NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Ahmad Rizal"}',
  FALSE, 'authenticated', 'authenticated', ''
)
ON CONFLICT (id) DO NOTHING;

-- User 3: Sarah Lim (Craft Artist)
INSERT INTO auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at,
  created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
  is_super_admin, role, aud, confirmation_token
)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  '00000000-0000-0000-0000-000000000000',
  'sarah@penangartists.com',
  crypt('artist123', gen_salt('bf')),
  NOW(), NOW(), NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Sarah Lim"}',
  FALSE, 'authenticated', 'authenticated', ''
)
ON CONFLICT (id) DO NOTHING;

-- User 4: James Tan (Illustrator)
INSERT INTO auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at,
  created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
  is_super_admin, role, aud, confirmation_token
)
VALUES (
  '44444444-4444-4444-4444-444444444444',
  '00000000-0000-0000-0000-000000000000',
  'james@penangartists.com',
  crypt('artist123', gen_salt('bf')),
  NOW(), NOW(), NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "James Tan"}',
  FALSE, 'authenticated', 'authenticated', ''
)
ON CONFLICT (id) DO NOTHING;

-- User 5: Priya Nair (Visual Artist)
INSERT INTO auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at,
  created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
  is_super_admin, role, aud, confirmation_token
)
VALUES (
  '55555555-5555-5555-5555-555555555555',
  '00000000-0000-0000-0000-000000000000',
  'priya@penangartists.com',
  crypt('artist123', gen_salt('bf')),
  NOW(), NOW(), NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Priya Nair"}',
  FALSE, 'authenticated', 'authenticated', ''
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 2: Create Profiles for Users
-- ============================================

INSERT INTO public.profiles (id, email, full_name, role) VALUES
  ('11111111-1111-1111-1111-111111111111', 'maya@penangartists.com', 'Maya Chen', 'artist'),
  ('22222222-2222-2222-2222-222222222222', 'ahmad@penangartists.com', 'Ahmad Rizal', 'artist'),
  ('33333333-3333-3333-3333-333333333333', 'sarah@penangartists.com', 'Sarah Lim', 'artist'),
  ('44444444-4444-4444-4444-444444444444', 'james@penangartists.com', 'James Tan', 'artist'),
  ('55555555-5555-5555-5555-555555555555', 'priya@penangartists.com', 'Priya Nair', 'artist')
ON CONFLICT (id) DO UPDATE SET role = 'artist';

-- ============================================
-- STEP 3: Create Artist Profiles
-- ============================================

-- Maya Chen - Photographer
INSERT INTO public.artists (
  id, user_id, slug, display_name, email, bio, tagline,
  primary_medium, secondary_mediums, styles, location,
  experience, price_range, status, verified, featured,
  open_for_commissions, open_for_collaboration, open_for_events,
  profile_photo, featured_image, instagram, website,
  follower_count, following_count
) VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '11111111-1111-1111-1111-111111111111',
  'maya-chen',
  'Maya Chen',
  'maya@penangartists.com',
  'Award-winning photographer capturing the soul of Penang through my lens. Specializing in street photography, heritage architecture, and cultural events. My work has been featured in National Geographic and various international exhibitions.',
  'Capturing moments that tell stories',
  'photography',
  ARRAY['visual-art']::medium_category[],
  ARRAY['Street Photography', 'Documentary', 'Portrait', 'Heritage'],
  'georgetown',
  'established',
  'premium',
  'approved',
  true,
  true,
  true,
  true,
  true,
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop',
  'https://instagram.com/mayachen',
  'https://mayachen.com',
  156,
  42
)
ON CONFLICT (id) DO UPDATE SET
  follower_count = EXCLUDED.follower_count,
  following_count = EXCLUDED.following_count;

-- Ahmad Rizal - Muralist
INSERT INTO public.artists (
  id, user_id, slug, display_name, email, bio, tagline,
  primary_medium, secondary_mediums, styles, location,
  experience, price_range, status, verified, featured,
  open_for_commissions, open_for_collaboration, open_for_events,
  profile_photo, featured_image, instagram,
  follower_count, following_count
) VALUES (
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '22222222-2222-2222-2222-222222222222',
  'ahmad-rizal',
  'Ahmad Rizal',
  'ahmad@penangartists.com',
  'Street artist and muralist transforming Penang walls into vibrant canvases. My work blends traditional Malay motifs with contemporary urban art, creating pieces that celebrate our cultural heritage while embracing modern expression.',
  'Painting stories on city walls',
  'murals-street-art',
  ARRAY['visual-art', 'illustration']::medium_category[],
  ARRAY['Street Art', 'Murals', 'Graffiti', 'Cultural Fusion'],
  'georgetown',
  'established',
  'mid',
  'approved',
  true,
  true,
  true,
  true,
  true,
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1561059488-916d69792237?w=1200&h=600&fit=crop',
  'https://instagram.com/ahmadrizal',
  89,
  67
)
ON CONFLICT (id) DO UPDATE SET
  follower_count = EXCLUDED.follower_count,
  following_count = EXCLUDED.following_count;

-- Sarah Lim - Craft Artist
INSERT INTO public.artists (
  id, user_id, slug, display_name, email, bio, tagline,
  primary_medium, secondary_mediums, styles, location,
  experience, price_range, status, verified, featured,
  open_for_commissions, open_for_collaboration, open_for_events,
  profile_photo, featured_image, instagram, whatsapp, whatsapp_public,
  follower_count, following_count
) VALUES (
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  '33333333-3333-3333-3333-333333333333',
  'sarah-lim',
  'Sarah Lim',
  'sarah@penangartists.com',
  'Ceramic artist and pottery instructor creating functional art inspired by Penang''s natural beauty. Each piece is handcrafted using traditional techniques passed down through generations, combined with contemporary designs.',
  'Handcrafted beauty from earth and fire',
  'craft',
  ARRAY['visual-art']::medium_category[],
  ARRAY['Ceramics', 'Pottery', 'Functional Art', 'Traditional Craft'],
  'balik-pulau',
  'master',
  'premium',
  'approved',
  true,
  false,
  true,
  true,
  true,
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&h=600&fit=crop',
  'https://instagram.com/sarahlim',
  '+60123456789',
  true,
  234,
  28
)
ON CONFLICT (id) DO UPDATE SET
  follower_count = EXCLUDED.follower_count,
  following_count = EXCLUDED.following_count;

-- James Tan - Illustrator
INSERT INTO public.artists (
  id, user_id, slug, display_name, email, bio, tagline,
  primary_medium, secondary_mediums, styles, location,
  experience, price_range, status, verified, featured,
  open_for_commissions, open_for_collaboration, open_for_events,
  profile_photo, featured_image, instagram, website,
  follower_count, following_count
) VALUES (
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  '44444444-4444-4444-4444-444444444444',
  'james-tan',
  'James Tan',
  'james@penangartists.com',
  'Digital illustrator and concept artist creating whimsical worlds inspired by Malaysian folklore and Penang heritage. Working with local publishers, game studios, and international clients to bring imagination to life.',
  'Illustrating dreams, one pixel at a time',
  'illustration',
  ARRAY['visual-art']::medium_category[],
  ARRAY['Digital Art', 'Concept Art', 'Character Design', 'Fantasy'],
  'bayan-lepas',
  'established',
  'mid',
  'approved',
  false,
  true,
  true,
  true,
  false,
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=600&fit=crop',
  'https://instagram.com/jamestan',
  'https://jamestan.art',
  312,
  156
)
ON CONFLICT (id) DO UPDATE SET
  follower_count = EXCLUDED.follower_count,
  following_count = EXCLUDED.following_count;

-- Priya Nair - Visual Artist
INSERT INTO public.artists (
  id, user_id, slug, display_name, email, bio, tagline,
  primary_medium, secondary_mediums, styles, location,
  experience, price_range, status, verified, featured,
  open_for_commissions, open_for_collaboration, open_for_events,
  profile_photo, featured_image, instagram,
  follower_count, following_count
) VALUES (
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  '55555555-5555-5555-5555-555555555555',
  'priya-nair',
  'Priya Nair',
  'priya@penangartists.com',
  'Contemporary visual artist exploring themes of identity, migration, and cultural fusion through mixed media. My installations and paintings have been exhibited across Southeast Asia and Europe.',
  'Art that questions, challenges, and inspires',
  'visual-art',
  ARRAY['craft']::medium_category[],
  ARRAY['Contemporary', 'Mixed Media', 'Installation', 'Abstract'],
  'tanjung-bungah',
  'emerging',
  'contact',
  'approved',
  false,
  false,
  true,
  true,
  true,
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&h=600&fit=crop',
  'https://instagram.com/priyanair',
  78,
  89
)
ON CONFLICT (id) DO UPDATE SET
  follower_count = EXCLUDED.follower_count,
  following_count = EXCLUDED.following_count;

-- ============================================
-- STEP 4: Create Portfolio Items
-- ============================================

-- Maya Chen's portfolio
INSERT INTO public.portfolio_items (id, artist_id, title, description, image_url, sort_order) VALUES
  ('p1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   'Morning Light at Clan Jetties',
   'The first light of day casting golden hues over the historic Clan Jetties, where Penang''s fishing communities have lived for generations.',
   'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&h=600&fit=crop', 1),
  ('p1111111-1111-1111-1111-111111111112', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   'Heritage Shophouses',
   'The colorful facades of George Town''s UNESCO-listed shophouses, each telling a story of generations past.',
   'https://images.unsplash.com/photo-1595435742656-5272d0b3fa82?w=800&h=600&fit=crop', 2),
  ('p1111111-1111-1111-1111-111111111113', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   'Street Food Stories',
   'Capturing the essence of Penang''s famous hawker culture - the steam, the flames, and the passion of local cooks.',
   'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop', 3)
ON CONFLICT (id) DO NOTHING;

-- Ahmad Rizal's portfolio
INSERT INTO public.portfolio_items (id, artist_id, title, description, image_url, sort_order) VALUES
  ('p2222222-2222-2222-2222-222222222221', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
   'The Trishaw Rider',
   'A tribute to Penang''s iconic trishaw riders, blending traditional Malay patterns with contemporary street art style.',
   'https://images.unsplash.com/photo-1569172122301-bc5008bc09c5?w=800&h=600&fit=crop', 1),
  ('p2222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
   'Cultural Fusion Wall',
   'A 50-meter mural celebrating the multicultural harmony of Penang - Chinese, Malay, Indian, and Peranakan elements dancing together.',
   'https://images.unsplash.com/photo-1561059488-916d69792237?w=800&h=600&fit=crop', 2)
ON CONFLICT (id) DO NOTHING;

-- Sarah Lim's portfolio
INSERT INTO public.portfolio_items (id, artist_id, title, description, image_url, sort_order) VALUES
  ('p3333333-3333-3333-3333-333333333331', 'cccccccc-cccc-cccc-cccc-cccccccccccc',
   'Ocean Wave Collection',
   'A series of ceramic bowls inspired by the waves of Penang''s beaches, finished with a unique blue glaze developed over years.',
   'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&h=600&fit=crop', 1),
  ('p3333333-3333-3333-3333-333333333332', 'cccccccc-cccc-cccc-cccc-cccccccccccc',
   'Tea Ceremony Set',
   'Handcrafted tea set featuring traditional Hokkien patterns, perfect for the meditative practice of tea drinking.',
   'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&h=600&fit=crop', 2)
ON CONFLICT (id) DO NOTHING;

-- James Tan's portfolio
INSERT INTO public.portfolio_items (id, artist_id, title, description, image_url, sort_order) VALUES
  ('p4444444-4444-4444-4444-444444444441', 'dddddddd-dddd-dddd-dddd-dddddddddddd',
   'Legend of Penang Hill',
   'Digital illustration reimagining the folk tales of Penang Hill, featuring mythical creatures from local legends.',
   'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop', 1),
  ('p4444444-4444-4444-4444-444444444442', 'dddddddd-dddd-dddd-dddd-dddddddddddd',
   'Nyonya Kitchen',
   'Whimsical illustration of a Peranakan kitchen, with magical ingredients and ancestral spirits watching over the cooking.',
   'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', 2),
  ('p4444444-4444-4444-4444-444444444443', 'dddddddd-dddd-dddd-dddd-dddddddddddd',
   'Guardians of Georgetown',
   'Character designs for a proposed game featuring protectors of George Town''s heritage sites.',
   'https://images.unsplash.com/photo-1569172122301-bc5008bc09c5?w=800&h=600&fit=crop', 3)
ON CONFLICT (id) DO NOTHING;

-- Priya Nair's portfolio
INSERT INTO public.portfolio_items (id, artist_id, title, description, image_url, sort_order) VALUES
  ('p5555555-5555-5555-5555-555555555551', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
   'Migration Patterns',
   'Mixed media installation exploring the journeys of Penang''s immigrant communities over the centuries.',
   'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop', 1),
  ('p5555555-5555-5555-5555-555555555552', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
   'Identity Fragments',
   'Abstract painting series examining the fragmented nature of cultural identity in a globalized world.',
   'https://images.unsplash.com/photo-1549887534-1541e9326642?w=800&h=600&fit=crop', 2)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 5: Create Follows Between Artists
-- ============================================

INSERT INTO public.follows (id, follower_id, following_id, created_at) VALUES
  -- Maya follows Ahmad, Sarah, James
  ('f1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', NOW() - INTERVAL '7 days'),
  ('f1111111-1111-1111-1111-111111111112', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccccccc-cccc-cccc-cccc-cccccccccccc', NOW() - INTERVAL '5 days'),
  ('f1111111-1111-1111-1111-111111111113', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'dddddddd-dddd-dddd-dddd-dddddddddddd', NOW() - INTERVAL '3 days'),

  -- Ahmad follows Maya, Sarah, Priya
  ('f2222222-2222-2222-2222-222222222221', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW() - INTERVAL '6 days'),
  ('f2222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'cccccccc-cccc-cccc-cccc-cccccccccccc', NOW() - INTERVAL '4 days'),
  ('f2222222-2222-2222-2222-222222222223', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', NOW() - INTERVAL '2 days'),

  -- Sarah follows Maya, James
  ('f3333333-3333-3333-3333-333333333331', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW() - INTERVAL '8 days'),
  ('f3333333-3333-3333-3333-333333333332', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'dddddddd-dddd-dddd-dddd-dddddddddddd', NOW() - INTERVAL '1 day'),

  -- James follows everyone
  ('f4444444-4444-4444-4444-444444444441', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW() - INTERVAL '10 days'),
  ('f4444444-4444-4444-4444-444444444442', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', NOW() - INTERVAL '9 days'),
  ('f4444444-4444-4444-4444-444444444443', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'cccccccc-cccc-cccc-cccc-cccccccccccc', NOW() - INTERVAL '8 days'),
  ('f4444444-4444-4444-4444-444444444444', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', NOW() - INTERVAL '7 days'),

  -- Priya follows Maya, Ahmad, Sarah
  ('f5555555-5555-5555-5555-555555555551', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW() - INTERVAL '4 days'),
  ('f5555555-5555-5555-5555-555555555552', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', NOW() - INTERVAL '3 days'),
  ('f5555555-5555-5555-5555-555555555553', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'cccccccc-cccc-cccc-cccc-cccccccccccc', NOW() - INTERVAL '2 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 6: Create Likes on Portfolio Items
-- ============================================

INSERT INTO public.likes (id, artist_id, portfolio_item_id, created_at) VALUES
  -- Likes on Maya's "Morning Light at Clan Jetties"
  ('l1111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'p1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '6 days'),
  ('l1111111-1111-1111-1111-111111111112', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'p1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '5 days'),
  ('l1111111-1111-1111-1111-111111111113', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'p1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '4 days'),
  ('l1111111-1111-1111-1111-111111111114', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'p1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '3 days'),

  -- Likes on Maya's "Heritage Shophouses"
  ('l1111111-1111-1111-1111-111111111121', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'p1111111-1111-1111-1111-111111111112', NOW() - INTERVAL '4 days'),
  ('l1111111-1111-1111-1111-111111111122', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'p1111111-1111-1111-1111-111111111112', NOW() - INTERVAL '3 days'),

  -- Likes on Ahmad's murals
  ('l2222222-2222-2222-2222-222222222221', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'p2222222-2222-2222-2222-222222222221', NOW() - INTERVAL '5 days'),
  ('l2222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'p2222222-2222-2222-2222-222222222221', NOW() - INTERVAL '4 days'),
  ('l2222222-2222-2222-2222-222222222223', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'p2222222-2222-2222-2222-222222222221', NOW() - INTERVAL '3 days'),

  -- Likes on Sarah's ceramics
  ('l3333333-3333-3333-3333-333333333331', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'p3333333-3333-3333-3333-333333333331', NOW() - INTERVAL '4 days'),
  ('l3333333-3333-3333-3333-333333333332', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'p3333333-3333-3333-3333-333333333331', NOW() - INTERVAL '3 days'),
  ('l3333333-3333-3333-3333-333333333333', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'p3333333-3333-3333-3333-333333333331', NOW() - INTERVAL '2 days'),

  -- Likes on James's illustrations
  ('l4444444-4444-4444-4444-444444444441', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'p4444444-4444-4444-4444-444444444441', NOW() - INTERVAL '3 days'),
  ('l4444444-4444-4444-4444-444444444442', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'p4444444-4444-4444-4444-444444444441', NOW() - INTERVAL '2 days'),
  ('l4444444-4444-4444-4444-444444444443', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'p4444444-4444-4444-4444-444444444441', NOW() - INTERVAL '1 day'),
  ('l4444444-4444-4444-4444-444444444444', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'p4444444-4444-4444-4444-444444444441', NOW() - INTERVAL '12 hours'),

  -- Likes on Priya's work
  ('l5555555-5555-5555-5555-555555555551', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'p5555555-5555-5555-5555-555555555551', NOW() - INTERVAL '2 days'),
  ('l5555555-5555-5555-5555-555555555552', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'p5555555-5555-5555-5555-555555555551', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- Update like_count on portfolio items
UPDATE public.portfolio_items SET like_count = 4 WHERE id = 'p1111111-1111-1111-1111-111111111111';
UPDATE public.portfolio_items SET like_count = 2 WHERE id = 'p1111111-1111-1111-1111-111111111112';
UPDATE public.portfolio_items SET like_count = 3 WHERE id = 'p2222222-2222-2222-2222-222222222221';
UPDATE public.portfolio_items SET like_count = 3 WHERE id = 'p3333333-3333-3333-3333-333333333331';
UPDATE public.portfolio_items SET like_count = 4 WHERE id = 'p4444444-4444-4444-4444-444444444441';
UPDATE public.portfolio_items SET like_count = 2 WHERE id = 'p5555555-5555-5555-5555-555555555551';

-- ============================================
-- STEP 7: Create Comments on Portfolio Items
-- ============================================

INSERT INTO public.comments (id, artist_id, portfolio_item_id, parent_id, content, created_at) VALUES
  -- Comments on Maya's "Morning Light at Clan Jetties"
  ('c1111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'p1111111-1111-1111-1111-111111111111', NULL,
   'Absolutely stunning capture! The golden hour lighting is perfect. Would love to collaborate on a project combining photography and murals.', NOW() - INTERVAL '5 days'),
  ('c1111111-1111-1111-1111-111111111112', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'p1111111-1111-1111-1111-111111111111', NULL,
   'This makes me want to create a ceramic series inspired by the Clan Jetties. Beautiful work!', NOW() - INTERVAL '4 days'),
  ('c1111111-1111-1111-1111-111111111113', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'p1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111',
   'Thank you Ahmad! I would love to explore that collaboration idea. Let''s connect!', NOW() - INTERVAL '4 days 12 hours'),

  -- Comments on Ahmad's "Trishaw Rider"
  ('c2222222-2222-2222-2222-222222222221', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'p2222222-2222-2222-2222-222222222221', NULL,
   'I photographed the same trishaw rider last month! Your interpretation is amazing. The colors really pop.', NOW() - INTERVAL '4 days'),
  ('c2222222-2222-2222-2222-222222222222', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'p2222222-2222-2222-2222-222222222221', NULL,
   'The blend of traditional patterns with street art style is so unique. Very inspiring for my character designs!', NOW() - INTERVAL '3 days'),

  -- Comments on James's "Legend of Penang Hill"
  ('c4444444-4444-4444-4444-444444444441', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'p4444444-4444-4444-4444-444444444441', NULL,
   'The way you reimagined local folklore is incredible. Would you be open to discussing a gallery exhibition together?', NOW() - INTERVAL '2 days'),
  ('c4444444-4444-4444-4444-444444444442', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'p4444444-4444-4444-4444-444444444441', NULL,
   'I love the mystical atmosphere! Reminds me of bedtime stories from my grandmother.', NOW() - INTERVAL '1 day'),
  ('c4444444-4444-4444-4444-444444444443', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'p4444444-4444-4444-4444-444444444441', 'c4444444-4444-4444-4444-444444444441',
   'Absolutely, Priya! Let''s set up a meeting. I think our styles would complement each other well.', NOW() - INTERVAL '1 day 6 hours')
ON CONFLICT (id) DO NOTHING;

-- Update comment_count on portfolio items
UPDATE public.portfolio_items SET comment_count = 3 WHERE id = 'p1111111-1111-1111-1111-111111111111';
UPDATE public.portfolio_items SET comment_count = 2 WHERE id = 'p2222222-2222-2222-2222-222222222221';
UPDATE public.portfolio_items SET comment_count = 3 WHERE id = 'p4444444-4444-4444-4444-444444444441';

-- ============================================
-- STEP 8: Create Notifications
-- ============================================

INSERT INTO public.notifications (id, recipient_id, actor_id, notification_type, entity_type, entity_id, payload, is_read, created_at) VALUES
  -- Maya's notifications
  ('n1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'new_follower', 'artist', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '{}', false, NOW() - INTERVAL '10 days'),
  ('n1111111-1111-1111-1111-111111111112', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'portfolio_like', 'portfolio_item', 'p1111111-1111-1111-1111-111111111111', '{"portfolio_item_title": "Morning Light at Clan Jetties"}', false, NOW() - INTERVAL '6 days'),
  ('n1111111-1111-1111-1111-111111111113', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'portfolio_comment', 'portfolio_item', 'p1111111-1111-1111-1111-111111111111', '{"portfolio_item_title": "Morning Light at Clan Jetties", "comment_preview": "Absolutely stunning capture! The golden hour lighting..."}', false, NOW() - INTERVAL '5 days'),
  ('n1111111-1111-1111-1111-111111111114', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'new_follower', 'artist', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '{}', false, NOW() - INTERVAL '4 days'),
  ('n1111111-1111-1111-1111-111111111115', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'portfolio_like', 'portfolio_item', 'p1111111-1111-1111-1111-111111111111', '{"portfolio_item_title": "Morning Light at Clan Jetties"}', false, NOW() - INTERVAL '5 days'),

  -- Ahmad's notifications
  ('n2222222-2222-2222-2222-222222222221', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'new_follower', 'artist', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '{}', true, NOW() - INTERVAL '7 days'),
  ('n2222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'portfolio_like', 'portfolio_item', 'p2222222-2222-2222-2222-222222222221', '{"portfolio_item_title": "The Trishaw Rider"}', false, NOW() - INTERVAL '5 days'),
  ('n2222222-2222-2222-2222-222222222223', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'new_follower', 'artist', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '{}', false, NOW() - INTERVAL '9 days'),
  ('n2222222-2222-2222-2222-222222222224', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'new_follower', 'artist', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '{}', false, NOW() - INTERVAL '3 days'),

  -- James's notifications
  ('n4444444-4444-4444-4444-444444444441', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'portfolio_like', 'portfolio_item', 'p4444444-4444-4444-4444-444444444441', '{"portfolio_item_title": "Legend of Penang Hill"}', false, NOW() - INTERVAL '3 days'),
  ('n4444444-4444-4444-4444-444444444442', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'portfolio_comment', 'portfolio_item', 'p4444444-4444-4444-4444-444444444441', '{"portfolio_item_title": "Legend of Penang Hill", "comment_preview": "The way you reimagined local folklore is incredible..."}', false, NOW() - INTERVAL '2 days'),
  ('n4444444-4444-4444-4444-444444444443', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'new_follower', 'artist', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '{}', false, NOW() - INTERVAL '1 day'),
  ('n4444444-4444-4444-4444-444444444444', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'new_follower', 'artist', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '{}', false, NOW() - INTERVAL '3 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 9: Create Activities for Feed
-- ============================================

INSERT INTO public.activities (id, artist_id, activity_type, entity_type, entity_id, entity_data, created_at) VALUES
  -- Maya's activities
  ('a1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'portfolio_item_added', 'portfolio_item', 'p1111111-1111-1111-1111-111111111111',
   '{"title": "Morning Light at Clan Jetties", "description": "The first light of day casting golden hues over the historic Clan Jetties...", "image_url": "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&h=600&fit=crop"}',
   NOW() - INTERVAL '7 days'),
  ('a1111111-1111-1111-1111-111111111112', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'portfolio_item_added', 'portfolio_item', 'p1111111-1111-1111-1111-111111111112',
   '{"title": "Heritage Shophouses", "description": "The colorful facades of George Town''s UNESCO-listed shophouses...", "image_url": "https://images.unsplash.com/photo-1595435742656-5272d0b3fa82?w=800&h=600&fit=crop"}',
   NOW() - INTERVAL '5 days'),

  -- Ahmad's activities
  ('a2222222-2222-2222-2222-222222222221', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'portfolio_item_added', 'portfolio_item', 'p2222222-2222-2222-2222-222222222221',
   '{"title": "The Trishaw Rider", "description": "A tribute to Penang''s iconic trishaw riders...", "image_url": "https://images.unsplash.com/photo-1569172122301-bc5008bc09c5?w=800&h=600&fit=crop"}',
   NOW() - INTERVAL '6 days'),

  -- Sarah's activities
  ('a3333333-3333-3333-3333-333333333331', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'portfolio_item_added', 'portfolio_item', 'p3333333-3333-3333-3333-333333333331',
   '{"title": "Ocean Wave Collection", "description": "A series of ceramic bowls inspired by the waves of Penang''s beaches...", "image_url": "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&h=600&fit=crop"}',
   NOW() - INTERVAL '4 days'),

  -- James's activities
  ('a4444444-4444-4444-4444-444444444441', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'portfolio_item_added', 'portfolio_item', 'p4444444-4444-4444-4444-444444444441',
   '{"title": "Legend of Penang Hill", "description": "Digital illustration reimagining the folk tales of Penang Hill...", "image_url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop"}',
   NOW() - INTERVAL '3 days'),
  ('a4444444-4444-4444-4444-444444444442', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'portfolio_item_added', 'portfolio_item', 'p4444444-4444-4444-4444-444444444442',
   '{"title": "Nyonya Kitchen", "description": "Whimsical illustration of a Peranakan kitchen...", "image_url": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"}',
   NOW() - INTERVAL '2 days'),

  -- Priya's activities
  ('a5555555-5555-5555-5555-555555555551', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'portfolio_item_added', 'portfolio_item', 'p5555555-5555-5555-5555-555555555551',
   '{"title": "Migration Patterns", "description": "Mixed media installation exploring the journeys of Penang''s immigrant communities...", "image_url": "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop"}',
   NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 10: Create Services for Artists
-- ============================================

INSERT INTO public.services (id, artist_id, title, description, service_type, price_type, price_min, price_max, currency, delivery_time, is_active, is_featured, sort_order) VALUES
  -- Maya's services
  ('s1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   'Portrait Photography Session',
   'Professional portrait session at a location of your choice in Penang. Includes 20 edited photos.',
   'commission', 'fixed', 500, NULL, 'MYR', '3-5 days', true, true, 1),
  ('s1111111-1111-1111-1111-111111111112', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   'Heritage Photography Workshop',
   'Learn the art of heritage photography in a 4-hour hands-on workshop around Georgetown.',
   'workshop', 'fixed', 250, NULL, 'MYR', NULL, true, false, 2),

  -- Ahmad's services
  ('s2222222-2222-2222-2222-222222222221', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
   'Custom Mural Commission',
   'Transform your wall into a work of art. Price depends on size and complexity.',
   'commission', 'from', 2000, NULL, 'MYR', '2-4 weeks', true, true, 1),

  -- Sarah's services
  ('s3333333-3333-3333-3333-333333333331', 'cccccccc-cccc-cccc-cccc-cccccccccccc',
   'Pottery Workshop',
   'Beginner-friendly pottery class. Create your own ceramic piece to take home.',
   'workshop', 'fixed', 180, NULL, 'MYR', NULL, true, true, 1),
  ('s3333333-3333-3333-3333-333333333332', 'cccccccc-cccc-cccc-cccc-cccccccccccc',
   'Custom Ceramic Piece',
   'Commission a unique handcrafted ceramic piece tailored to your specifications.',
   'commission', 'range', 300, 1500, 'MYR', '4-6 weeks', true, false, 2),

  -- James's services
  ('s4444444-4444-4444-4444-444444444441', 'dddddddd-dddd-dddd-dddd-dddddddddddd',
   'Character Design',
   'Custom character design for games, books, or personal projects. Includes 3 revision rounds.',
   'commission', 'from', 400, NULL, 'MYR', '1-2 weeks', true, true, 1),
  ('s4444444-4444-4444-4444-444444444442', 'dddddddd-dddd-dddd-dddd-dddddddddddd',
   'Digital Illustration Prints',
   'High-quality prints of selected artworks. Various sizes available.',
   'print', 'range', 50, 200, 'MYR', '3-5 days', true, false, 2)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 11: Create Upcoming Events
-- ============================================

INSERT INTO public.events (id, artist_id, title, description, event_type, start_date, end_date, venue, address, location, is_free, price_info, is_published, is_featured) VALUES
  -- Maya's event
  ('e1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   'Penang Through My Lens - Photo Exhibition',
   'A solo exhibition showcasing 50 photographs capturing the essence of Penang''s heritage and people.',
   'exhibition', NOW() + INTERVAL '14 days', NOW() + INTERVAL '28 days',
   'Hin Bus Depot', '31A Jalan Gurdwara, 10300 George Town',
   'georgetown', false, 'RM15 entry', true, true),

  -- Ahmad's event
  ('e2222222-2222-2222-2222-222222222221', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
   'Live Mural Painting Session',
   'Watch as I create a new mural live! Interactive session where you can learn about street art techniques.',
   'performance', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days',
   'Armenian Street', 'Armenian Street, Georgetown',
   'georgetown', true, NULL, true, true),

  -- Sarah's event
  ('e3333333-3333-3333-3333-333333333331', 'cccccccc-cccc-cccc-cccc-cccccccccccc',
   'Weekend Pottery Workshop',
   'Two-day intensive pottery workshop for beginners. All materials provided.',
   'workshop', NOW() + INTERVAL '10 days', NOW() + INTERVAL '11 days',
   'Sarah Lim Pottery Studio', '45 Jalan Balik Pulau',
   'balik-pulau', false, 'RM350 for 2 days', true, false),

  -- James's event
  ('e4444444-4444-4444-4444-444444444441', 'dddddddd-dddd-dddd-dddd-dddddddddddd',
   'Digital Art for Beginners Workshop',
   'Learn the basics of digital illustration using Procreate. Bring your own iPad.',
   'workshop', NOW() + INTERVAL '21 days', NULL,
   'The Habitat Penang Hill', 'Penang Hill',
   'air-itam', false, 'RM120', true, false)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Count all new records
SELECT 'Artists' as table_name, COUNT(*) as count FROM public.artists
UNION ALL SELECT 'Portfolio Items', COUNT(*) FROM public.portfolio_items
UNION ALL SELECT 'Follows', COUNT(*) FROM public.follows
UNION ALL SELECT 'Likes', COUNT(*) FROM public.likes
UNION ALL SELECT 'Comments', COUNT(*) FROM public.comments
UNION ALL SELECT 'Notifications', COUNT(*) FROM public.notifications
UNION ALL SELECT 'Activities', COUNT(*) FROM public.activities
UNION ALL SELECT 'Services', COUNT(*) FROM public.services
UNION ALL SELECT 'Events', COUNT(*) FROM public.events;

-- ============================================
-- TEST LOGIN CREDENTIALS
-- ============================================
-- All artists can login with password: artist123
--
-- Email: maya@penangartists.com (Photographer, Georgetown)
-- Email: ahmad@penangartists.com (Muralist, Georgetown)
-- Email: sarah@penangartists.com (Ceramics, Balik Pulau)
-- Email: james@penangartists.com (Illustrator, Bayan Lepas)
-- Email: priya@penangartists.com (Visual Artist, Tanjung Bungah)
-- ============================================
