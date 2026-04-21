-- ==========================================
-- RLS RECURSION FIX for ShigruVedas
-- Run this in your Supabase SQL Editor
-- ==========================================

-- 1. Create a security definer function to check for admin status
-- This avoids recursion because it executes with bypass-RLS privileges
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Update Profiles policies
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
CREATE POLICY "profiles_select_admin" ON public.profiles FOR SELECT USING (is_admin());

-- 3. Update Products policies
DROP POLICY IF EXISTS "products_select_public" ON public.products;
CREATE POLICY "products_select_public" ON public.products FOR SELECT USING (COALESCE(is_active, true) = true);
DROP POLICY IF EXISTS "products_all_admin" ON public.products;
CREATE POLICY "products_all_admin" ON public.products FOR ALL USING (is_admin());

-- 4. Update Product Variants policies
DROP POLICY IF EXISTS "variants_select_public" ON public.product_variants;
CREATE POLICY "variants_select_public" ON public.product_variants FOR SELECT USING (COALESCE(is_active, true) = true);
DROP POLICY IF EXISTS "variants_all_admin" ON public.product_variants;
CREATE POLICY "variants_all_admin" ON public.product_variants FOR ALL USING (is_admin());

-- 5. Update Orders policies
DROP POLICY IF EXISTS "orders_all_admin" ON public.orders;
CREATE POLICY "orders_all_admin" ON public.orders FOR ALL USING (is_admin());

-- 6. Update Order Items policies
DROP POLICY IF EXISTS "order_items_admin" ON public.order_items;
CREATE POLICY "order_items_admin" ON public.order_items FOR ALL USING (is_admin());

-- 7. Update Reviews policies
DROP POLICY IF EXISTS "reviews_admin" ON public.reviews;
CREATE POLICY "reviews_admin" ON public.reviews FOR ALL USING (is_admin());

-- 8. Update B2B Inquiries policies
DROP POLICY IF EXISTS "b2b_admin" ON public.b2b_inquiries;
CREATE POLICY "b2b_admin" ON public.b2b_inquiries FOR ALL USING (is_admin());

-- 9. Update Blog Posts policies
DROP POLICY IF EXISTS "blog_admin" ON public.blog_posts;
CREATE POLICY "blog_admin" ON public.blog_posts FOR ALL USING (is_admin());

-- 10. Update Recipes policies
DROP POLICY IF EXISTS "recipes_admin" ON public.recipes;
CREATE POLICY "recipes_admin" ON public.recipes FOR ALL USING (is_admin());

-- 11. Update Contact Messages policies
DROP POLICY IF EXISTS "contact_admin" ON public.contact_messages;
CREATE POLICY "contact_admin" ON public.contact_messages FOR ALL USING (is_admin());

-- Success message
-- SELECT 'RLS recursion fixed successfully' as message;
