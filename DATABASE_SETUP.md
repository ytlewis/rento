# Database Setup - Quick Guide

## Step 1: Run the Database Migration

1. **Go to Supabase SQL Editor:**
   - Open: https://supabase.com/dashboard/project/lvkweqqialyykgqxmxmo/sql/new

2. **Copy and Paste the SQL:**
   - Open the file: `supabase/migrations/000_setup.sql`
   - Copy ALL the content
   - Paste it into the Supabase SQL Editor
   - Click the green "Run" button

3. **Verify Success:**
   - You should see a success message
   - Check that tables were created: Go to "Table Editor" in the sidebar
   - You should see: profiles, apartments, bookings, payments, admin_accounts, withdrawals

## Step 2: Disable Email Confirmation

1. **Go to Authentication Settings:**
   - Open: https://supabase.com/dashboard/project/lvkweqqialyykgqxmxmo/auth/settings

2. **Disable Email Confirmation:**
   - Scroll down to "Email Auth"
   - Find "Enable email confirmations"
   - **UNCHECK** this option
   - Click "Save"

## Step 3: Create Admin User

### Option A: Sign Up Through the App (Recommended)
1. Go to: http://localhost:8080/login?role=admin
2. Click "Sign up" at the bottom
3. Enter:
   - Full Name: Lewis Gathaiya (or any name)
   - Phone: 254712345678 (or any phone)
   - Email: **gathaiyalewis1122@gmail.com** (MUST be exact)
   - Password: **Lewis001!** (MUST be exact)
4. Click "Sign Up"
5. You'll be automatically logged in as admin

### Option B: Create Manually in Supabase
1. Go to: https://supabase.com/dashboard/project/lvkweqqialyykgqxmxmo/auth/users
2. Click "Add user" > "Create new user"
3. Enter:
   - Email: gathaiyalewis1122@gmail.com
   - Password: Lewis001!
   - Auto Confirm User: **YES** (check this box)
4. Click "Create user"
5. The trigger will automatically assign admin role

## Step 4: Verify Everything Works

1. **Check Tables:**
   ```sql
   -- Run in SQL Editor
   SELECT * FROM apartments; -- Should show 6 sample apartments
   SELECT * FROM profiles WHERE email = 'gathaiyalewis1122@gmail.com'; -- Should show admin user
   ```

2. **Test Login:**
   - Go to: http://localhost:8080/login?role=admin
   - Email: gathaiyalewis1122@gmail.com
   - Password: Lewis001!
   - Should redirect to admin dashboard

3. **Test Tenant Signup:**
   - Go to: http://localhost:8080/login
   - Click "Sign up"
   - Create a test tenant account
   - Should work without email verification

## Troubleshooting

### "Could not find the table 'public.profiles'"
- The migration didn't run successfully
- Go back to Step 1 and run the SQL again
- Check for any error messages in the SQL Editor

### "Email not confirmed"
- Email confirmation is still enabled
- Go back to Step 2 and disable it
- Make sure to click "Save"

### Admin login not working
- Verify the email is EXACTLY: gathaiyalewis1122@gmail.com
- Verify the password is EXACTLY: Lewis001!
- Check the user exists in Authentication > Users
- Check the profile has admin role:
  ```sql
  SELECT id, email, role FROM profiles WHERE email = 'gathaiyalewis1122@gmail.com';
  ```

### No apartments showing
- The seed data didn't insert
- Run this in SQL Editor:
  ```sql
  SELECT COUNT(*) FROM apartments;
  ```
- If 0, run the INSERT statements from the migration again

### "Invalid login credentials"
- User doesn't exist yet
- Create the user through signup or manually in Supabase
- Make sure email confirmation is disabled

## Quick SQL Commands

### Check if tables exist:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

### Check admin user:
```sql
SELECT p.id, p.email, p.role, u.email_confirmed_at
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.email = 'gathaiyalewis1122@gmail.com';
```

### Manually set admin role (if needed):
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'gathaiyalewis1122@gmail.com';
```

### Check apartments:
```sql
SELECT id, name, status, price FROM apartments;
```

## Success Checklist

- [ ] SQL migration ran without errors
- [ ] 6 tables created (profiles, apartments, bookings, payments, admin_accounts, withdrawals)
- [ ] Email confirmation disabled in Auth settings
- [ ] Admin user created (gathaiyalewis1122@gmail.com)
- [ ] Admin user has 'admin' role in profiles table
- [ ] 6 sample apartments inserted
- [ ] Can login as admin
- [ ] Can signup as tenant
- [ ] Can browse apartments

Once all checkboxes are complete, your RENTO app is fully functional! 🎉
