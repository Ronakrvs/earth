-- ==========================================
-- SETTINGS TABLE RLS REINFORCEMENT
-- ==========================================

-- 1. Ensure RLS is enabled
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "settings_read_public" ON public.settings;
DROP POLICY IF EXISTS "settings_admin_all" ON public.settings;

-- 3. Policy: Public can read settings (for shop config)
CREATE POLICY "settings_read_public" ON public.settings
FOR SELECT USING (true);

-- 4. Policy: Admin has full access (for dashboard updates)
-- This includes SELECT, INSERT, UPDATE, and DELETE
CREATE POLICY "settings_admin_all" ON public.settings
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
