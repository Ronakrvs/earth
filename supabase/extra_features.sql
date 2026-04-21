-- ==========================================
-- ShigruVedas — MAJOR ENHANCEMENTS MIGRATION
-- Run this in your Supabase SQL Editor
-- This file handles new tables and RLS fixes
-- ==========================================

-- 1. Create a security definer function to check for admin status
-- This avoids potential RLS recursion issues
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ==========================================
-- SETTINGS TABLE (Item 1 & 5)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial settings
INSERT INTO public.settings (key, value) VALUES
('config', '{
  "storeName": "SHIGRUVEDAS",
  "supportEmail": "hello@shigruvedas.com",
  "storeDescription": "Premium organic moringa products directly from our farm in India.",
  "metaTitle": "Shigruvedas - Organic Moringa Farm",
  "metaKeywords": "organic, moringa, health, ayurveda",
  "announcement_text": "🌿 Free shipping on orders above ₹499 · Use code WELLNESS10 for 10% off",
  "announcement_link": "/shop",
  "subscription_enabled": true,
  "referral_enabled": true,
  "loyalty_enabled": true,
  "coupon_enabled": true,
  "bundles_enabled": true
}')
ON CONFLICT (key) DO NOTHING;

-- RLS for settings (Admin all, public read)
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "settings_read_public" ON public.settings;
CREATE POLICY "settings_read_public" ON public.settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "settings_admin_all" ON public.settings;
CREATE POLICY "settings_admin_all" ON public.settings FOR ALL USING (is_admin());

-- ==========================================
-- CONTRACT FARMING SUBMISSIONS (Item 12)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.contract_farming_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  land_size TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'contacted', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for contract farming (Public insert, admin all)
ALTER TABLE public.contract_farming_submissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "contract_farming_insert_public" ON public.contract_farming_submissions;
CREATE POLICY "contract_farming_insert_public" ON public.contract_farming_submissions FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "contract_farming_admin_all" ON public.contract_farming_submissions;
CREATE POLICY "contract_farming_admin_all" ON public.contract_farming_submissions FOR ALL USING (is_admin());

-- ==========================================
-- PRODUCT VISIBILITY FIXES (Item 2)
-- ==========================================
-- Ensure products are visible even if is_active is null
DROP POLICY IF EXISTS "products_select_public" ON public.products;
CREATE POLICY "products_select_public" ON public.products FOR SELECT USING (COALESCE(is_active, true) = true);

DROP POLICY IF EXISTS "variants_select_public" ON public.product_variants;
CREATE POLICY "variants_select_public" ON public.product_variants FOR SELECT USING (COALESCE(is_active, true) = true);

-- Update all admin policies to use the new is_admin() function to prevent recursion
DROP POLICY IF EXISTS "products_all_admin" ON public.products;
CREATE POLICY "products_all_admin" ON public.products FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "variants_all_admin" ON public.product_variants;
CREATE POLICY "variants_all_admin" ON public.product_variants FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
CREATE POLICY "profiles_select_admin" ON public.profiles FOR SELECT USING (is_admin());

DROP POLICY IF EXISTS "orders_all_admin" ON public.orders;
CREATE POLICY "orders_all_admin" ON public.orders FOR ALL USING (is_admin());
