-- ==========================================
-- ShigruVedas Ecommerce Database Schema
-- Run this in your Supabase SQL Editor
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- PROFILES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'b2b')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- SECURITY DEFINER — Admin Check
-- This avoids recursion in RLS policies
-- ==========================================
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ==========================================
-- PRODUCTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  category TEXT NOT NULL DEFAULT 'moringa-powder' CHECK (category IN ('moringa-powder', 'moringa-leaves', 'drumsticks', 'seeds')),
  images TEXT[] DEFAULT '{}',
  thumbnail TEXT,
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- PRODUCT VARIANTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  weight TEXT NOT NULL, -- '100g', '250g', '500g', '1kg'
  price DECIMAL(10, 2) NOT NULL,
  compare_price DECIMAL(10, 2), -- original price for discount display
  stock INTEGER NOT NULL DEFAULT 0,
  sku TEXT UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- ADDRESSES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_email TEXT,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- ORDERS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_email TEXT,
  checkout_session_id TEXT UNIQUE,
  order_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method TEXT DEFAULT 'razorpay',
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping_amount DECIMAL(10, 2) DEFAULT 0,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  points_used INTEGER DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  -- Shipping address snapshot (in case address changes)
  shipping_name TEXT NOT NULL,
  shipping_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_state TEXT NOT NULL,
  shipping_pincode TEXT NOT NULL,
  notes TEXT,
  tracking_number TEXT,
  shiprocket_order_id TEXT,
  shiprocket_shipment_id TEXT,
  shiprocket_awb TEXT,
  shiprocket_status TEXT,
  shiprocket_last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    new_number := 'SV' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(FLOOR(RANDOM() * 9999)::TEXT, 4, '0');
    SELECT COUNT(*) > 0 INTO exists FROM public.orders WHERE order_number = new_number;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- ORDER ITEMS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  variant_weight TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- REVIEWS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  content TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- B2B INQUIRIES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.b2b_inquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  business_type TEXT, -- 'retailer', 'restaurant', 'health_store', 'exporter', 'other'
  products_interested TEXT[] DEFAULT '{}',
  monthly_quantity TEXT,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- BLOG POSTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- RECIPES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.recipes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  ingredients TEXT[] DEFAULT '{}',
  instructions TEXT[] DEFAULT '{}',
  prep_time INTEGER, -- in minutes
  cook_time INTEGER, -- in minutes
  servings INTEGER,
  difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  cuisine TEXT,
  calories INTEGER,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  rating DECIMAL(3, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- CONTACT MESSAGES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  message TEXT,
  order_type TEXT,
  products_interested JSONB DEFAULT '[]', -- List of products and quantities
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- SETTINGS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings_read_public" ON public.settings FOR SELECT USING (true);
CREATE POLICY "settings_admin_all" ON public.settings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ==========================================
-- SEED DATA — Settings Config
-- ==========================================
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
ON CONFLICT (key) DO NOTHING;

-- ==========================================
-- SEED DATA — Products
-- ==========================================
INSERT INTO public.products (name, slug, description, short_description, category, thumbnail, is_active, is_featured) VALUES
(
  'Organic Moringa Powder',
  'organic-moringa-powder',
  'Premium quality sun-dried and stone-ground moringa powder made from certified organic moringa leaves grown on our 7+ acre farm in Udaipur, Rajasthan. Rich in 90+ nutrients including 7x more Vitamin C than oranges, 4x more Calcium than milk, and 2x more Protein than yogurt. Perfect for smoothies, cooking, and daily health supplements.',
  'Pure organic moringa leaf powder, stone-ground for maximum nutrition',
  'moringa-powder',
  '/images/powder2.png',
  true, true
),
(
  'Fresh Organic Moringa Leaves',
  'fresh-organic-moringa-leaves',
  'Hand-picked daily from our organic moringa farm in Rajasthan, these fresh moringa leaves are the most nutritionally dense food on the planet. Rich in vitamins, minerals and amino acids. Perfect for cooking traditional Indian dishes, making moringa tea, or fresh consumption.',
  'Daily fresh-harvested moringa leaves from our certified organic farm',
  'moringa-leaves',
  '/images/leaves2.png',
  true, true
),
(
  'Fresh Moringa Drumsticks',
  'fresh-moringa-drumsticks',
  'Young, tender moringa drumstick pods harvested at peak maturity from our organic farm. Essential ingredient for South Indian sambar and North Indian sabzi. Rich in dietary fiber, folate, and magnesium.',
  'Tender moringa pods perfect for traditional Indian cooking',
  'drumsticks',
  '/images/drumstick2.png',
  true, false
)
ON CONFLICT (slug) DO NOTHING;

-- Seed product variants for Moringa Powder
INSERT INTO public.product_variants (product_id, weight, price, compare_price, stock, sku)
SELECT id, '100g', 149.00, 199.00, 120, 'SV-MP-100G' FROM public.products WHERE slug = 'organic-moringa-powder'
ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id, weight, price, compare_price, stock, sku)
SELECT id, '250g', 329.00, 449.00, 80, 'SV-MP-250G' FROM public.products WHERE slug = 'organic-moringa-powder'
ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id, weight, price, compare_price, stock, sku)
SELECT id, '500g', 599.00, 799.00, 60, 'SV-MP-500G' FROM public.products WHERE slug = 'organic-moringa-powder'
ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id, weight, price, compare_price, stock, sku)
SELECT id, '1kg', 1099.00, 1499.00, 40, 'SV-MP-1KG' FROM public.products WHERE slug = 'organic-moringa-powder'
ON CONFLICT (sku) DO NOTHING;

-- Seed product variants for Moringa Leaves
INSERT INTO public.product_variants (product_id, weight, price, compare_price, stock, sku)
SELECT id, '100g', 99.00, 149.00, 150, 'SV-ML-100G' FROM public.products WHERE slug = 'fresh-organic-moringa-leaves'
ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id, weight, price, compare_price, stock, sku)
SELECT id, '250g', 219.00, 299.00, 100, 'SV-ML-250G' FROM public.products WHERE slug = 'fresh-organic-moringa-leaves'
ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id, weight, price, compare_price, stock, sku)
SELECT id, '500g', 399.00, 549.00, 75, 'SV-ML-500G' FROM public.products WHERE slug = 'fresh-organic-moringa-leaves'
ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id, weight, price, compare_price, stock, sku)
SELECT id, '1kg', 749.00, 999.00, 50, 'SV-ML-1KG' FROM public.products WHERE slug = 'fresh-organic-moringa-leaves'
ON CONFLICT (sku) DO NOTHING;

-- Seed product variants for Drumsticks
INSERT INTO public.product_variants (product_id, weight, price, compare_price, stock, sku)
SELECT id, '250g', 89.00, 119.00, 200, 'SV-DS-250G' FROM public.products WHERE slug = 'fresh-moringa-drumsticks'
ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id, weight, price, compare_price, stock, sku)
SELECT id, '500g', 169.00, 219.00, 150, 'SV-DS-500G' FROM public.products WHERE slug = 'fresh-moringa-drumsticks'
ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.product_variants (product_id, weight, price, compare_price, stock, sku)
SELECT id, '1kg', 299.00, 399.00, 100, 'SV-DS-1KG' FROM public.products WHERE slug = 'fresh-moringa-drumsticks'
ON CONFLICT (sku) DO NOTHING;

-- ==========================================
-- ROW LEVEL SECURITY POLICIES
-- ==========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.b2b_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Profiles: users can view and edit their own profile; admins can view all
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id OR auth.uid() IS NULL);
CREATE POLICY "profiles_select_admin" ON public.profiles FOR SELECT USING (check_is_admin());

-- Products: publicly readable; only admins can write
CREATE POLICY "products_select_public" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "products_all_admin" ON public.products FOR ALL USING (check_is_admin());

-- Product variants: publicly readable
CREATE POLICY "variants_select_public" ON public.product_variants FOR SELECT USING (is_active = true);
CREATE POLICY "variants_all_admin" ON public.product_variants FOR ALL USING (check_is_admin());

-- Addresses: users own their addresses
CREATE POLICY "addresses_own" ON public.addresses FOR ALL USING (auth.uid() = user_id);

-- Orders: users see their own orders; admins see all
CREATE POLICY "orders_select_own" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "orders_insert_own" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "orders_all_admin" ON public.orders FOR ALL USING (check_is_admin());

-- Order items: follow order visibility
CREATE POLICY "order_items_select" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "order_items_admin" ON public.order_items FOR ALL USING (check_is_admin());

-- Reviews: approved reviews are public; users manage their own
CREATE POLICY "reviews_select_public" ON public.reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "reviews_insert_auth" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_update_own" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "reviews_admin" ON public.reviews FOR ALL USING (check_is_admin());

-- B2B: anyone can insert; only admins can read/manage
CREATE POLICY "b2b_insert" ON public.b2b_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "b2b_admin" ON public.b2b_inquiries FOR ALL USING (check_is_admin());

-- Blog: published posts are public; admin manages all
CREATE POLICY "blog_select_public" ON public.blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "blog_admin" ON public.blog_posts FOR ALL USING (check_is_admin());

-- Recipes: publicly readable; admin manages all
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "recipes_select_public" ON public.recipes FOR SELECT USING (is_active = true);
CREATE POLICY "recipes_admin" ON public.recipes FOR ALL USING (check_is_admin());

-- Contact messages: anyone can insert; only admin can read
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contact_insert_public" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "contact_admin" ON public.contact_messages FOR ALL USING (check_is_admin());

-- ==========================================
-- WISHLISTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.wishlists (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wishlists_own" ON public.wishlists
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "wishlists_admin" ON public.wishlists
  FOR ALL USING (check_is_admin());

CREATE INDEX IF NOT EXISTS wishlists_user_id_idx ON public.wishlists (user_id);
CREATE INDEX IF NOT EXISTS wishlists_product_id_idx ON public.wishlists (product_id);
