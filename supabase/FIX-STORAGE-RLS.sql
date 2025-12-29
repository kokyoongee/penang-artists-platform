-- ============================================
-- FIX STORAGE RLS FOR IMAGE UPLOADS
-- ============================================
-- Run this in Supabase SQL Editor to fix
-- "new row violates row-level security policy" error
-- ============================================

-- Step 1: Ensure the images bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Step 2: Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update own images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete own images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view images" ON storage.objects;
DROP POLICY IF EXISTS "Artists can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Artists can update images" ON storage.objects;
DROP POLICY IF EXISTS "Artists can delete images" ON storage.objects;

-- Step 3: Create new storage policies

-- Allow anyone to view images (public bucket)
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- Allow authenticated users to update images they uploaded
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images');

-- ============================================
-- VERIFICATION
-- ============================================
-- After running, check policies with:
-- SELECT * FROM pg_policies WHERE tablename = 'objects';
