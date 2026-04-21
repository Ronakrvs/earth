-- ==========================================
-- 🚀 SIGNUP RECOVERY (VERSION 3 - ULTRA RESILIENT)
-- ==========================================

-- Ensure extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Ensure 'profiles' table has required columns
-- We do this in a DO block to prevent any errors if they already exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='referral_code') THEN
    ALTER TABLE public.profiles ADD COLUMN referral_code TEXT UNIQUE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='referred_by') THEN
    ALTER TABLE public.profiles ADD COLUMN referred_by UUID REFERENCES public.profiles(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='phone') THEN
    ALTER TABLE public.profiles ADD COLUMN phone TEXT;
  END IF;
END $$;

-- 2. Ensure 'loyalty_points' table exists
CREATE TABLE IF NOT EXISTS public.loyalty_points (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  points INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  order_id UUID 
);

-- 3. Ensure 'loyalty_balances' view exists
CREATE OR REPLACE VIEW public.loyalty_balances AS
  SELECT user_id, COALESCE(SUM(points), 0) AS balance
  FROM public.loyalty_points
  GROUP BY user_id;

-- 4. Secure basic loyalty select permissions
ALTER TABLE public.loyalty_points ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "loyalty_own" ON public.loyalty_points;
CREATE POLICY "loyalty_own" ON public.loyalty_points
  FOR SELECT USING (auth.uid() = user_id);

-- 5. Helper function for referral code generation
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := 'SHIGRU-';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 6. Updated handle_new_user (The most resilient version)
-- We set search_path = public to ensure it find tables when called from 'auth' schema
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  ref_code TEXT;
  referrer_user_id UUID;
BEGIN
  -- PHASE 1: PREPARE DATA
  ref_code := generate_referral_code();
  
  -- Try to find the referrer
  IF (NEW.raw_user_meta_data->>'referral_code') IS NOT NULL AND (NEW.raw_user_meta_data->>'referral_code') <> '' THEN
    SELECT id INTO referrer_user_id 
    FROM public.profiles 
    WHERE referral_code = (NEW.raw_user_meta_data->>'referral_code')
    LIMIT 1;
  END IF;

  -- PHASE 2: INSERT PROFILE (Isolated to prevent rollback)
  BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url, phone, referral_code, referred_by)
    VALUES (
      NEW.id,
      COALESCE(NEW.email, 'botanist_' || NEW.id || '@shigruvedas.com'),
      COALESCE(NEW.raw_user_meta_data->>'full_name', 'Botanist'),
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'phone',
      ref_code,
      referrer_user_id
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
      phone = COALESCE(EXCLUDED.phone, public.profiles.phone);
  EXCEPTION WHEN OTHERS THEN
    -- If profile fails, we still want to RETURN NEW so the user isn't locked out of Auth
    RAISE WARNING 'Profile creation failed for user %: %', NEW.id, SQLERRM;
  END;

  -- PHASE 3: REWARD REFERRER (Isolated)
  IF referrer_user_id IS NOT NULL THEN
    BEGIN
      INSERT INTO public.loyalty_points (user_id, points, reason)
      VALUES (referrer_user_id, 500, 'referral');
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Referral Reward failed for user %: %', NEW.id, SQLERRM;
    END;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 7. Reset the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
