-- RENTO Setup Verification Script
-- Run this in Supabase SQL Editor to verify everything is set up correctly

-- Check 1: Verify all tables exist
SELECT 
  'Tables Check' as check_name,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) >= 6 THEN '✅ PASS - All tables exist'
    ELSE '❌ FAIL - Missing tables'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'apartments', 'bookings', 'payments', 'admin_accounts', 'withdrawals');

-- Check 2: Verify apartments data
SELECT 
  'Apartments Check' as check_name,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) >= 6 THEN '✅ PASS - Sample apartments loaded'
    ELSE '❌ FAIL - No apartments found'
  END as status
FROM apartments;

-- Check 3: Verify admin user exists
SELECT 
  'Admin User Check' as check_name,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ PASS - Admin user exists'
    ELSE '❌ FAIL - Admin user not found'
  END as status
FROM profiles 
WHERE email = 'gathaiyalewis1122@gmail.com' AND role = 'admin';

-- Check 4: Verify RLS is enabled
SELECT 
  'RLS Check' as check_name,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) >= 6 THEN '✅ PASS - RLS enabled on all tables'
    ELSE '❌ FAIL - RLS not enabled'
  END as status
FROM pg_tables 
WHERE schemaname = 'public' 
  AND rowsecurity = true
  AND tablename IN ('profiles', 'apartments', 'bookings', 'payments', 'admin_accounts', 'withdrawals');

-- Check 5: Verify triggers exist
SELECT 
  'Triggers Check' as check_name,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) >= 2 THEN '✅ PASS - Triggers created'
    ELSE '❌ FAIL - Triggers missing'
  END as status
FROM pg_trigger 
WHERE tgname IN ('on_auth_user_created', 'booking_status_trigger');

-- Detailed apartment list
SELECT 
  '--- APARTMENTS LIST ---' as info,
  name,
  bedrooms,
  price,
  status
FROM apartments
ORDER BY price;

-- Admin user details (if exists)
SELECT 
  '--- ADMIN USER ---' as info,
  p.email,
  p.role,
  p.full_name,
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL THEN 'Confirmed'
    ELSE 'Not Confirmed'
  END as email_status
FROM profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE p.email = 'gathaiyalewis1122@gmail.com';

-- Summary
SELECT 
  '=== SETUP SUMMARY ===' as summary,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public') as total_tables,
  (SELECT COUNT(*) FROM apartments) as total_apartments,
  (SELECT COUNT(*) FROM profiles WHERE role = 'admin') as admin_users,
  (SELECT COUNT(*) FROM profiles WHERE role = 'tenant') as tenant_users;
