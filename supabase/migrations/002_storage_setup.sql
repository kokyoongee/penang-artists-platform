-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to the images bucket
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated Upload" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'images'
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to update their own images
CREATE POLICY "Authenticated Update" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'images'
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to delete their own images
CREATE POLICY "Authenticated Delete" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'images'
    AND auth.role() = 'authenticated'
  );
