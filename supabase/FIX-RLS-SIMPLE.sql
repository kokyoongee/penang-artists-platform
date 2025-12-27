-- SIMPLIFIED RLS POLICIES FOR PROFILES TABLE
-- The previous policies may have recursion issues with subqueries
-- This version uses a simpler approach

-- ============================================
-- STEP 1: DISABLE RLS TEMPORARILY
-- ============================================
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 2: DROP ALL EXISTING POLICIES
-- ============================================
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- ============================================
-- STEP 3: CREATE SIMPLE NON-RECURSIVE POLICIES
-- ============================================

-- Simple policy: authenticated users can view their own profile
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Simple policy: authenticated users can update their own profile
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- For admin access, use service_role key in server components instead of RLS
-- This avoids recursive subquery issues

-- ============================================
-- STEP 4: RE-ENABLE RLS
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 5: VERIFY
-- ============================================
SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'profiles';
