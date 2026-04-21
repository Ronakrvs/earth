-- ============================================================
-- ShigruVedas — COMPLETE DATABASE SCHEMA (schema + migrations)
-- Paste this entire file into Supabase SQL Editor and Run.
-- Safe to re-run: uses IF NOT EXISTS / ON CONFLICT DO NOTHING.
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing policies so re-running doesn't error
DO $$ DECLARE r RECORD;
BEGIN
  FOR r IN SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;


-- ==========================================
-- PROFILES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
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
-- This avoids recursion in RLS policies by bypassing the policy check
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

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

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
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
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
  helpful_count INTEGER DEFAULT 0,
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
-- FARM VISITS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.farm_visits (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT NOT NULL,
  visit_date  DATE NOT NULL,
  group_size  TEXT DEFAULT '1',
  visit_type  TEXT DEFAULT 'general'
    CHECK (visit_type IN ('general','learning','harvesting','b2b','photography')),
  message     TEXT,
  status      TEXT DEFAULT 'pending'
    CHECK (status IN ('pending','confirmed','cancelled','completed')),
  notes       TEXT,   -- admin internal notes
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.farm_visits ENABLE ROW LEVEL SECURITY;
-- Anyone can book (insert); only admins can read/manage
CREATE POLICY "farm_visits_insert_public" ON public.farm_visits
  FOR INSERT WITH CHECK (true);
CREATE POLICY "farm_visits_admin" ON public.farm_visits
  FOR ALL USING (check_is_admin());

-- ==========================================
-- ShigruVedas — Additional Tables Migration
-- Run this AFTER the existing schema.sql
-- ==========================================

-- ==========================================
-- NEWSLETTER SUBSCRIBERS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  first_name    TEXT,
  source        TEXT DEFAULT 'footer',         -- footer | popup | checkout | blog
  status        TEXT DEFAULT 'active'
    CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  tags          TEXT[] DEFAULT '{}',
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
-- Anyone can subscribe (insert); only admin can read list
CREATE POLICY "newsletter_insert_public" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);
CREATE POLICY "newsletter_admin" ON public.newsletter_subscribers
  FOR ALL USING (check_is_admin());

-- ==========================================
-- COUPONS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.coupons (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code            TEXT UNIQUE NOT NULL,
  type            TEXT NOT NULL
    CHECK (type IN ('percent', 'fixed', 'free_shipping')),
  value           DECIMAL(10,2) NOT NULL DEFAULT 0,
  min_order_value DECIMAL(10,2) DEFAULT 0,
  max_uses        INT,                         -- NULL = unlimited
  uses_per_user   INT DEFAULT 1,
  start_date      TIMESTAMPTZ,
  end_date        TIMESTAMPTZ,
  is_active       BOOLEAN DEFAULT TRUE,
  product_ids     UUID[] DEFAULT NULL,         -- NULL = all products
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
-- Coupons publicly readable (so frontend can validate); admin writes
CREATE POLICY "coupons_select_public" ON public.coupons
  FOR SELECT USING (is_active = true);
CREATE POLICY "coupons_admin" ON public.coupons
  FOR ALL USING (check_is_admin());

-- ==========================================
-- COUPON USAGE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.coupon_usage (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  coupon_id  UUID REFERENCES public.coupons(id) ON DELETE CASCADE NOT NULL,
  user_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  order_id   UUID,                              -- FK added below once orders table is confirmed
  used_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(coupon_id, user_id)                   -- enforce 1 use per user by default
);

-- Add FK to orders only if the orders table already exists and constraint doesn't exist
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'orders'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint WHERE conname = 'coupon_usage_order_fk'
    ) THEN
      ALTER TABLE public.coupon_usage
        ADD CONSTRAINT coupon_usage_order_fk
        FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE SET NULL
        NOT VALID;
    END IF;
  END IF;
END $$;

ALTER TABLE public.coupon_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "coupon_usage_own" ON public.coupon_usage
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "coupon_usage_insert_auth" ON public.coupon_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "coupon_usage_admin" ON public.coupon_usage
  FOR ALL USING (check_is_admin());

-- ==========================================
-- SUBSCRIPTIONS (recurring delivery)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id           UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id        UUID REFERENCES public.products(id) ON DELETE SET NULL,
  variant_id        UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  quantity          INT NOT NULL DEFAULT 1,
  frequency_days    INT NOT NULL DEFAULT 30,   -- 30, 60, 90
  status            TEXT DEFAULT 'active'
    CHECK (status IN ('active', 'paused', 'cancelled')),
  discount_percent  DECIMAL(5,2) DEFAULT 15,
  price_locked      DECIMAL(10,2) NOT NULL,    -- price at subscription time
  next_billing_date DATE NOT NULL,
  razorpay_sub_id   TEXT UNIQUE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  cancelled_at      TIMESTAMPTZ,
  pause_until       DATE
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subscriptions_own" ON public.subscriptions
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "subscriptions_admin" ON public.subscriptions
  FOR ALL USING (check_is_admin());

-- Add subscription_id / coupon_id / source to orders (only if the orders table exists)
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'orders'
  ) THEN
    ALTER TABLE public.orders
      ADD COLUMN IF NOT EXISTS subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS coupon_id       UUID REFERENCES public.coupons(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS source          TEXT DEFAULT 'website';
  END IF;
END $$;

-- ==========================================
-- REFERRALS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.referrals (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  referrer_id   UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  referee_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  status        TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'rewarded', 'expired')),
  rewarded_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "referrals_own" ON public.referrals
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referee_id);
CREATE POLICY "referrals_insert_auth" ON public.referrals
  FOR INSERT WITH CHECK (true);
CREATE POLICY "referrals_admin" ON public.referrals
  FOR ALL USING (check_is_admin());

-- Add referral_code to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS referred_by   UUID REFERENCES public.profiles(id);

-- ==========================================
-- LOYALTY POINTS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.loyalty_points (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  points     INT NOT NULL,                     -- positive = earned, negative = redeemed
  reason     TEXT NOT NULL,
  -- 'order_placed' | 'referral' | 'review_left' | 'newsletter' | 'redeemed'
  order_id   UUID,                             -- FK added below once orders table is confirmed
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add FK to orders only if the orders table already exists and constraint doesn't exist
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'orders'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint WHERE conname = 'loyalty_points_order_fk'
    ) THEN
      ALTER TABLE public.loyalty_points
        ADD CONSTRAINT loyalty_points_order_fk
        FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE SET NULL
        NOT VALID;
    END IF;
  END IF;
END $$;

ALTER TABLE public.loyalty_points ENABLE ROW LEVEL SECURITY;
CREATE POLICY "loyalty_own" ON public.loyalty_points
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "loyalty_admin" ON public.loyalty_points
  FOR ALL USING (check_is_admin());

-- Convenience view: current balance per user
CREATE OR REPLACE VIEW public.loyalty_balances AS
  SELECT user_id, COALESCE(SUM(points), 0) AS balance
  FROM public.loyalty_points
  GROUP BY user_id;

-- ==========================================
-- BUNDLES
-- ==========================================
CREATE TABLE IF NOT EXISTS public.bundles (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name          TEXT NOT NULL,                 -- "Moringa Starter Kit"
  slug          TEXT UNIQUE NOT NULL,
  description   TEXT,
  image_url     TEXT,
  discount_pct  DECIMAL(5,2) DEFAULT 20,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bundle_items (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  bundle_id  UUID REFERENCES public.bundles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  quantity   INT DEFAULT 1
);

ALTER TABLE public.bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundle_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bundles_select_public" ON public.bundles FOR SELECT USING (is_active = true);
CREATE POLICY "bundles_admin" ON public.bundles FOR ALL USING (check_is_admin());
CREATE POLICY "bundle_items_select_public" ON public.bundle_items FOR SELECT USING (true);
CREATE POLICY "bundle_items_admin" ON public.bundle_items FOR ALL USING (check_is_admin());

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
CREATE POLICY "settings_admin_all" ON public.settings FOR ALL USING (check_is_admin());

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
-- SEED: Example coupon codes
-- ==========================================
INSERT INTO public.coupons (code, type, value, min_order_value, uses_per_user, is_active)
VALUES
  ('WELLNESS10', 'percent', 10, 199, 1, true),
  ('FIRST15',    'percent', 15,   0, 1, true),
  ('FREESHIP',   'free_shipping', 0, 499, 1, true)
ON CONFLICT (code) DO NOTHING;

-- ==========================================
-- SEED: Moringa Starter Kit bundle
-- ==========================================
INSERT INTO public.bundles (name, slug, description, discount_pct, is_active)
VALUES (
  'Moringa Starter Kit',
  'moringa-starter-kit',
  'The perfect introduction to Shigruvedas. Get our bestselling Moringa Powder (100g), Fresh Leaves (100g), and Drumsticks (250g) at 20% off the combined price.',
  20,
  true
) ON CONFLICT (slug) DO NOTHING;

-- Add helpful_count to reviews (if missing from older schema runs)
ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS helpful_count INTEGER DEFAULT 0;
