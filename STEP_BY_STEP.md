# RENTO - Step by Step Setup (5 Minutes)

Follow these exact steps to get your RENTO app running.

---

## 🔴 STEP 1: Setup Database (2 minutes)

### 1.1 Open Supabase SQL Editor
Click this link: https://supabase.com/dashboard/project/lvkweqqialyykgqxmxmo/sql/new

### 1.2 Run the Migration
1. Open the file `supabase/migrations/000_setup.sql` in your code editor
2. Press `Ctrl+A` (Windows) or `Cmd+A` (Mac) to select all
3. Press `Ctrl+C` (Windows) or `Cmd+C` (Mac) to copy
4. Go back to Supabase SQL Editor
5. Click in the editor area
6. Press `Ctrl+V` (Windows) or `Cmd+V` (Mac) to paste
7. Click the green **"RUN"** button (or press `Ctrl+Enter`)
8. Wait for "Success. No rows returned" message

### 1.3 Verify Tables Created
1. Click **"Table Editor"** in the left sidebar
2. You should see these tables:
   - ✅ profiles
   - ✅ apartments
   - ✅ bookings
   - ✅ payments
   - ✅ admin_accounts
   - ✅ withdrawals

3. Click on **"apartments"** table
4. You should see 6 apartments listed

**If you don't see the tables, go back to 1.2 and run the SQL again.**

---

## 🔴 STEP 2: Disable Email Verification (1 minute)

### 2.1 Open Authentication Settings
Click this link: https://supabase.com/dashboard/project/lvkweqqialyykgqxmxmo/auth/settings

### 2.2 Disable Email Confirmation
1. Scroll down to find **"Email Auth"** section
2. Look for **"Enable email confirmations"** toggle
3. **TURN IT OFF** (make sure it's gray/disabled)
4. Scroll to the bottom
5. Click the green **"Save"** button

**This is CRITICAL - without this, you can't login!**

---

## 🔴 STEP 3: Create Admin Account (1 minute)

### Option A: Through the App (Easier)

1. Make sure your dev server is running at http://localhost:8080
2. Open this link: http://localhost:8080/login?role=admin
3. Click **"Sign up"** at the bottom of the form
4. Fill in the form:
   - **Full Name:** Lewis Gathaiya (or any name you want)
   - **Phone Number:** 254712345678 (or any phone)
   - **Email:** `gathaiyalewis1122@gmail.com` ⚠️ MUST BE EXACT
   - **Password:** `Lewis001!` ⚠️ MUST BE EXACT
5. Click **"Sign Up"**
6. You should be automatically logged in and see the Admin Dashboard

### Option B: Through Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/lvkweqqialyykgqxmxmo/auth/users
2. Click **"Add user"** button (top right)
3. Select **"Create new user"**
4. Fill in:
   - **Email:** `gathaiyalewis1122@gmail.com`
   - **Password:** `Lewis001!`
   - **Auto Confirm User:** ✅ CHECK THIS BOX
5. Click **"Create user"**

---

## 🔴 STEP 4: Test Everything (1 minute)

### 4.1 Test Admin Login
1. Go to: http://localhost:8080/login?role=admin
2. Enter:
   - Email: `gathaiyalewis1122@gmail.com`
   - Password: `Lewis001!`
3. Click **"Log In"**
4. You should see the **Admin Dashboard** with:
   - Statistics cards at the top
   - Properties table
   - Tenants & Bookings section
   - Recent Payments section

### 4.2 Test Adding a Property
1. In the Admin Dashboard, click **"Add Property"** button
2. Fill in any details you want
3. Click **"Create"**
4. The new property should appear in the table

### 4.3 Test Tenant Signup
1. Click **"Sign Out"** in the admin dashboard
2. Go to: http://localhost:8080/login
3. Click **"Sign up"**
4. Create a test tenant account with any email
5. You should see the **Tenant Dashboard**

### 4.4 Test Booking
1. Go to: http://localhost:8080
2. You should see 6+ apartments
3. Click **"Book Now"** on any apartment
4. Select a lease start date
5. Click **"Confirm Booking"**
6. You should be redirected to tenant dashboard

---

## ✅ Success Checklist

Check all these items:

- [ ] Database tables created (6 tables visible in Supabase)
- [ ] Sample apartments loaded (6 apartments in apartments table)
- [ ] Email confirmation disabled in Auth settings
- [ ] Admin user created (gathaiyalewis1122@gmail.com)
- [ ] Can login as admin
- [ ] Can see admin dashboard
- [ ] Can add new properties
- [ ] Can signup as tenant
- [ ] Can browse apartments
- [ ] Can book apartments

---

## 🆘 Troubleshooting

### Problem: "Could not find the table 'public.profiles'"
**Solution:** The database migration didn't run. Go back to STEP 1 and run it again.

### Problem: "Email not confirmed"
**Solution:** Email verification is still enabled. Go back to STEP 2 and disable it.

### Problem: Admin login says "Invalid credentials"
**Solution:** 
1. Make sure you're using EXACTLY: `gathaiyalewis1122@gmail.com` and `Lewis001!`
2. Check the user exists: Go to https://supabase.com/dashboard/project/lvkweqqialyykgqxmxmo/auth/users
3. If not, create it using Option B in STEP 3

### Problem: No apartments showing
**Solution:** Run this SQL in Supabase SQL Editor:
```sql
SELECT COUNT(*) FROM apartments;
```
If it returns 0, run the INSERT statements from `000_setup.sql` again.

### Problem: Can't see admin dashboard after login
**Solution:** Check the user has admin role:
```sql
SELECT email, role FROM profiles WHERE email = 'gathaiyalewis1122@gmail.com';
```
If role is not 'admin', run:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'gathaiyalewis1122@gmail.com';
```

---

## 🎉 You're Done!

Your RENTO app is now fully functional with:
- ✅ Working authentication
- ✅ Admin dashboard
- ✅ Tenant dashboard
- ✅ Property management
- ✅ Booking system
- ✅ Real-time updates

### What's Next?

1. **Add more properties** through the admin dashboard
2. **Test the booking flow** with different tenant accounts
3. **Configure payments** (M-Pesa & Stripe) when ready for production
4. **Customize the design** to match your brand
5. **Deploy to production** when ready

### Need Help?

- Check `TROUBLESHOOTING.md` for common issues
- Review `DATABASE_SETUP.md` for detailed database info
- Run `verify-setup.sql` in Supabase to check your setup

---

**Estimated Total Time: 5 minutes**

**Current Status:** Development server running at http://localhost:8080
