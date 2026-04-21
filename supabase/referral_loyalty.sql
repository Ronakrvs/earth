-- ==========================================
-- LOYALTY & REFERRAL SYSTEM ENHANCEMENTS
-- ==========================================

-- 1. Helper function to generate a random referral code
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

-- 2. Enhanced handle_new_user function to support referrals
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  ref_code TEXT;
  referrer_user_id UUID;
BEGIN
  -- Generate a referral code for the NEW user
  ref_code := generate_referral_code();
  
  -- Check if they were referred by someone
  IF (NEW.raw_user_meta_data->>'referral_code') IS NOT NULL THEN
    SELECT id INTO referrer_user_id 
    FROM public.profiles 
    WHERE referral_code = (NEW.raw_user_meta_data->>'referral_code')
    LIMIT 1;
  END IF;

  -- Insert profile
  INSERT INTO public.profiles (id, email, full_name, avatar_url, phone, referral_code, referred_by)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'phone',
    ref_code,
    referrer_user_id
  );

  -- If referred, credit points to the REFERRER
  IF referrer_user_id IS NOT NULL THEN
    INSERT INTO public.loyalty_points (user_id, points, reason)
    VALUES (referrer_user_id, 500, 'referral');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-apply trigger to ensure it uses the latest function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
