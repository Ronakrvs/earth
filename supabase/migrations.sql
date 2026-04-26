-- ==========================================
-- ShigruVedas — Additional Tables Migration
-- Run this AFTER the existing schema.sql
-- ==========================================

-- ==========================================
-- PROFILES TABLE DECOUPLE
-- ==========================================
-- Remove the auth.users foreign key so NextAuth/Google users can be stored in profiles too.
DO $$ BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.profiles'::regclass
      AND confrelid = 'auth.users'::regclass
  ) THEN
    ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
  END IF;
EXCEPTION WHEN undefined_table THEN
  NULL;
END $$;

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
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

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
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

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
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

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
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ==========================================
-- ADDRESSES (email-backed for NextAuth users)
-- ==========================================
ALTER TABLE public.addresses
  ADD COLUMN IF NOT EXISTS user_email TEXT;

CREATE INDEX IF NOT EXISTS addresses_user_email_idx ON public.addresses (user_email);

DROP POLICY IF EXISTS "addresses_own" ON public.addresses;
CREATE POLICY "addresses_own" ON public.addresses
  FOR ALL USING (
    (auth.uid() = user_id) OR (user_email = auth.jwt() ->> 'email')
  );

-- Add subscription_id / coupon_id / source to orders (only if the orders table exists)
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'orders'
  ) THEN
    ALTER TABLE public.orders
      ADD COLUMN IF NOT EXISTS user_email       TEXT,
      ADD COLUMN IF NOT EXISTS checkout_session_id TEXT,
      ADD COLUMN IF NOT EXISTS subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS coupon_id       UUID REFERENCES public.coupons(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS source          TEXT DEFAULT 'website',
      ADD COLUMN IF NOT EXISTS points_used     INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS shiprocket_order_id TEXT,
      ADD COLUMN IF NOT EXISTS shiprocket_shipment_id TEXT,
      ADD COLUMN IF NOT EXISTS shiprocket_awb TEXT,
      ADD COLUMN IF NOT EXISTS shiprocket_status TEXT,
      ADD COLUMN IF NOT EXISTS shiprocket_last_synced_at TIMESTAMPTZ;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'orders_checkout_session_id_key'
      ) THEN
        ALTER TABLE public.orders ADD CONSTRAINT orders_checkout_session_id_key UNIQUE (checkout_session_id);
      END IF;
    END $$;
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
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

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
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

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
CREATE POLICY "bundles_admin" ON public.bundles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "bundle_items_select_public" ON public.bundle_items FOR SELECT USING (true);
CREATE POLICY "bundle_items_admin" ON public.bundle_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

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

-- Add helpful_count to reviews (if missing)
ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS helpful_count INTEGER DEFAULT 0;

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
ON CONFLICT (key) DO NOTHING;

-- ==========================================
-- RECURSION FIX (EMERGENCY)
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

-- Update Policies to use the function instead of subqueries
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
CREATE POLICY "profiles_select_admin" ON public.profiles FOR SELECT USING (check_is_admin());

-- Allow service-role inserts (for OAuth bootstrap via NextAuth session callback)
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "products_all_admin" ON public.products;
CREATE POLICY "products_all_admin" ON public.products FOR ALL USING (check_is_admin());

DROP POLICY IF EXISTS "variants_all_admin" ON public.product_variants;
CREATE POLICY "variants_all_admin" ON public.product_variants FOR ALL USING (check_is_admin());

DROP POLICY IF EXISTS "orders_all_admin" ON public.orders;
CREATE POLICY "orders_all_admin" ON public.orders FOR ALL USING (check_is_admin());

DROP POLICY IF EXISTS "order_items_admin" ON public.order_items;
CREATE POLICY "order_items_admin" ON public.order_items FOR ALL USING (check_is_admin());

DROP POLICY IF EXISTS "settings_admin_all" ON public.settings;
CREATE POLICY "settings_admin_all" ON public.settings FOR ALL USING (check_is_admin());

-- ==========================================
-- WISHLISTS
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
