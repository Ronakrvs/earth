-- ==========================================
-- SUPABASE STORAGE SETUP for ShigruVedas
-- Run this in your Supabase SQL Editor
-- ==========================================

-- 1. Create the 'products' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true),
       ('blog', 'blog', true),
       ('recipes', 'recipes', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public read access to images in all buckets
CREATE POLICY "Public Read Access Products" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Public Read Access Blog" ON storage.objects FOR SELECT USING (bucket_id = 'blog');
CREATE POLICY "Public Read Access Recipes" ON storage.objects FOR SELECT USING (bucket_id = 'recipes');

-- 3. Allow admins to upload and manage images in the 'products' bucket
-- This uses the is_admin() function we created earlier
CREATE POLICY "Admin CRUD Access" 
ON storage.objects FOR ALL 
USING (
  bucket_id IN ('products', 'blog', 'recipes') 
  AND public.is_admin()
)
WITH CHECK (
  bucket_id IN ('products', 'blog', 'recipes') 
  AND public.is_admin()
);
