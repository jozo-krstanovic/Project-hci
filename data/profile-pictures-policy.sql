-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow users to upload their own profile picture" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own profile picture" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to view their own profile picture" ON storage.objects;
DROP POLICY IF EXISTS "Allow anyone to view public profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own profile picture" ON storage.objects;

-- Create a bucket for profile pictures
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-pictures', 'profile-pictures', true) ON CONFLICT (id) DO NOTHING;

-- Allow users to upload to their own folder
CREATE POLICY "Allow users to upload to their own folder" ON storage.objects
FOR INSERT WITH CHECK ( bucket_id = 'profile-pictures' AND (storage.foldername(name))[1] = auth.uid()::text );

-- Allow users to update their own profile picture
CREATE POLICY "Allow users to update their own profile picture" ON storage.objects
FOR UPDATE USING ( bucket_id = 'profile-pictures' AND (storage.foldername(name))[1] = auth.uid()::text );

-- Allow users to view their own profile picture
CREATE POLICY "Allow users to view their own profile picture" ON storage.objects
FOR SELECT USING ( bucket_id = 'profile-pictures' AND (storage.foldername(name))[1] = auth.uid()::text );

-- Allow anyone to view public profile pictures
CREATE POLICY "Allow anyone to view public profile pictures" ON storage.objects
FOR SELECT USING (bucket_id = 'profile-pictures');

-- Allow users to delete their own profile picture
CREATE POLICY "Allow users to delete their own profile picture" ON storage.objects
FOR DELETE USING ( bucket_id = 'profile-pictures' AND (storage.foldername(name))[1] = auth.uid()::text );