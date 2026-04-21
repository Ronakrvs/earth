-- ==========================================
-- ShigruVedas — EMERGENCY REPAIR MIGRATION
-- Run this in your Supabase SQL Editor
-- Fixes: Missing settings table, RLS recursion, and Auth
-- ==========================================

-- 1. Create a security definer function to check for admin status
-- This avoids recursion because it executes with bypass-RLS privileges
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Clean the Profiles policies to prevent infinite loops
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
CREATE POLICY "profiles_select_admin" ON public.profiles FOR SELECT USING (check_is_admin());
DROP POLICY IF EXISTS "profiles_all_admin" ON public.profiles;
CREATE POLICY "profiles_all_admin" ON public.profiles FOR ALL USING (check_is_admin());

-- 3. Create the missing SETTINGS table
CREATE TABLE IF NOT EXISTS public.settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed defaults
INSERT INTO public.settings (key, value) VALUES
('config', '{
  "storeName": "SHIGRUVEDAS",
  "announcement_text": "🌿 Premium Moringa - Direct from our Organic Farm",
  "announcement_link": "/shop",
  "loyalty_enabled": true,
  "bundles_enabled": true,
  "subscription_enabled": true,
  "referral_enabled": true,
  "coupon_enabled": true
}')
ON CONFLICT (key) DO UPDATE SET value = public.settings.value || '{"announcement_text": "🌿 Premium Moringa - Direct from our Organic Farm"}'; 

-- RLS for Settings
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "settings_read_public" ON public.settings;
CREATE POLICY "settings_read_public" ON public.settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "settings_admin_all" ON public.settings;
CREATE POLICY "settings_admin_all" ON public.settings FOR ALL USING (check_is_admin());

-- 4. Products & Variants visibility fixes
DROP POLICY IF EXISTS "products_select_public" ON public.products;
CREATE POLICY "products_select_public" ON public.products FOR SELECT USING (COALESCE(is_active, true) = true);

DROP POLICY IF EXISTS "variants_select_public" ON public.product_variants;
CREATE POLICY "variants_select_public" ON public.product_variants FOR SELECT USING (COALESCE(is_active, true) = true);

-- 5. Final verification of admin access to products
DROP POLICY IF EXISTS "products_all_admin" ON public.products;
CREATE POLICY "products_all_admin" ON public.products FOR ALL USING (check_is_admin());

SELECT 'Emergency Repair SQL executed' as message;
