# RENTO Troubleshooting Guide

## Common Issues & Solutions

### Installation Issues

#### "npm install" fails
**Problem**: Dependencies fail to install
**Solutions**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Or use yarn
yarn install
```

#### TypeScript errors during build
**Problem**: Type errors prevent compilation
**Solutions**:
- Check that all dependencies are installed
- Verify TypeScript version: `npm list typescript`
- Clear TypeScript cache: `rm -rf node_modules/.cache`
- Rebuild: `npm run build`

### Database Issues

#### "Failed to load data"
**Problem**: Cannot fetch data from Supabase
**Solutions**:
1. Verify Supabase credentials in `.env`:
   ```env
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
   ```
2. Check Supabase project is active
3. Verify migrations ran successfully
4. Check browser console for specific errors
5. Test Supabase connection:
   ```javascript
   import { supabase } from '@/integrations/supabase/client';
   const { data, error } = await supabase.from('apartments').select('*');
   console.log(data, error);
   ```

#### "Row Level Security policy violation"
**Problem**: RLS blocks data access
**Solutions**:
1. Verify user is authenticated
2. Check RLS policies in Supabase dashboard
3. Ensure admin user has correct role
4. Review policy conditions in migration file
5. Test with RLS disabled (development only):
   ```sql
   ALTER TABLE apartments DISABLE ROW LEVEL SECURITY;
   ```

#### Migrations won't run
**Problem**: SQL migration fails
**Solutions**:
1. Check for syntax errors in SQL
2. Verify extensions are enabled
3. Run migrations one at a time
4. Check Supabase logs for specific errors
5. Manually run in SQL Editor if CLI fails

### Authentication Issues

#### Admin login fails
**Problem**: Cannot log in as admin
**Solutions**:
1. Verify exact email: `gathaiyalewis1122@gmail.com`
2. Check password: `Lewis001!`
3. Ensure user exists in Supabase Auth
4. Verify trigger created profile with admin role:
   ```sql
   SELECT * FROM profiles WHERE email = 'gathaiyalewis1122@gmail.com';
   ```
5. Manually set admin role if needed:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'gathaiyalewis1122@gmail.com';
   ```

#### "Access denied" for admin
**Problem**: Admin user doesn't have admin role
**Solutions**:
1. Check profile role in database
2. Verify trigger function is working
3. Manually update role:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE id = 'user-id';
   ```
4. Log out and log back in

#### Email verification required
**Problem**: Supabase requires email verification
**Solutions**:
1. Check email for verification link
2. Disable email verification in Supabase:
   - Go to Authentication > Settings
   - Disable "Enable email confirmations"
3. Manually confirm user:
   ```sql
   UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = 'user@email.com';
   ```

### Payment Issues

#### M-Pesa STK Push not working
**Problem**: Payment prompt doesn't appear
**Solutions**:
1. Verify M-Pesa credentials are set
2. Check edge function is deployed:
   ```bash
   supabase functions list
   ```
3. Review function logs:
   ```bash
   supabase functions logs mpesa-stk-push
   ```
4. Verify phone number format (254XXXXXXXXX)
5. Check M-Pesa API status
6. Test in sandbox first
7. Verify callback URL is accessible

#### M-Pesa callback not received
**Problem**: Payment completes but status doesn't update
**Solutions**:
1. Check callback function logs
2. Verify callback URL is correct
3. Ensure callback function is deployed
4. Check database for payment record
5. Manually update payment status:
   ```sql
   UPDATE payments SET status = 'completed' WHERE id = 'payment-id';
   ```

#### Stripe payment fails
**Problem**: Card payment doesn't process
**Solutions**:
1. Verify Stripe keys are correct
2. Check edge function is deployed
3. Review Stripe dashboard for errors
4. Test with test card: 4242 4242 4242 4242
5. Check function logs
6. Verify webhook is configured

### Real-time Issues

#### Updates not appearing instantly
**Problem**: Real-time subscriptions not working
**Solutions**:
1. Check Supabase real-time is enabled
2. Verify subscriptions are set up correctly
3. Check browser console for subscription errors
4. Test with manual refresh
5. Verify RLS policies allow real-time access
6. Check network tab for websocket connection

#### "Too many subscriptions"
**Problem**: Subscription limit reached
**Solutions**:
1. Unsubscribe when component unmounts
2. Use cleanup functions in useEffect
3. Consolidate subscriptions
4. Check for subscription leaks

### UI/UX Issues

#### Blank page on load
**Problem**: Application doesn't render
**Solutions**:
1. Check browser console for errors
2. Verify all routes are configured
3. Check for JavaScript errors
4. Clear browser cache
5. Test in incognito mode
6. Verify build completed successfully

#### Images not loading
**Problem**: Property images don't display
**Solutions**:
1. Check image URLs are valid
2. Verify CORS settings
3. Use placeholder images
4. Check network tab for 404s
5. Verify image URLs in database

#### Mobile layout broken
**Problem**: Responsive design issues
**Solutions**:
1. Test with browser dev tools
2. Check Tailwind breakpoints
3. Verify viewport meta tag
4. Test on actual devices
5. Check for CSS conflicts

### Performance Issues

#### Slow page loads
**Problem**: Application is sluggish
**Solutions**:
1. Check network tab for slow requests
2. Optimize images (use CDN)
3. Implement pagination
4. Add loading states
5. Use React.memo for expensive components
6. Check Supabase query performance

#### High database usage
**Problem**: Too many database queries
**Solutions**:
1. Implement caching
2. Use select() to limit columns
3. Add indexes to frequently queried columns
4. Batch requests where possible
5. Use real-time subscriptions instead of polling

### Deployment Issues

#### Build fails in production
**Problem**: Production build errors
**Solutions**:
1. Check for environment-specific code
2. Verify all environment variables are set
3. Test build locally: `npm run build`
4. Check for TypeScript errors
5. Review build logs for specific errors

#### Environment variables not working
**Problem**: Config values not loading
**Solutions**:
1. Verify variables start with `VITE_`
2. Restart dev server after changes
3. Check hosting platform configuration
4. Use `import.meta.env.VITE_*` to access
5. Don't commit `.env` to git

#### CORS errors in production
**Problem**: API requests blocked
**Solutions**:
1. Configure CORS in edge functions
2. Add allowed origins in Supabase
3. Check API endpoint URLs
4. Verify HTTPS is used
5. Review browser console for details

### Data Issues

#### Apartments not showing
**Problem**: No properties displayed
**Solutions**:
1. Check if seed data was loaded
2. Verify RLS policies allow access
3. Check apartment status filter
4. Review database query
5. Manually add apartments via admin dashboard

#### Bookings not creating
**Problem**: Cannot book apartments
**Solutions**:
1. Verify user is authenticated
2. Check booking table constraints
3. Review RLS policies
4. Check for duplicate bookings
5. Review browser console errors

#### Payments not recording
**Problem**: Payment records not created
**Solutions**:
1. Check payment table structure
2. Verify foreign key constraints
3. Review RLS policies
4. Check for required fields
5. Review payment creation code

## Debugging Tips

### Enable Detailed Logging
```typescript
// In src/lib/api.ts
const { data, error } = await supabase.from('table').select('*');
console.log('Query result:', { data, error });
```

### Check Supabase Logs
1. Go to Supabase Dashboard
2. Click "Logs" in sidebar
3. Filter by function or table
4. Look for errors or warnings

### Test Database Queries
```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check RLS policies
SELECT * FROM pg_policies WHERE schemaname = 'public';

-- View all apartments
SELECT * FROM apartments;

-- Check user roles
SELECT id, email, role FROM profiles;
```

### Browser DevTools
1. Open Console tab for JavaScript errors
2. Check Network tab for failed requests
3. Use Application tab to inspect storage
4. Check Sources tab for breakpoints

### Common Error Messages

#### "Invalid API key"
- Check `.env` file
- Verify Supabase credentials
- Restart dev server

#### "Permission denied"
- Check RLS policies
- Verify user authentication
- Review role assignments

#### "Foreign key constraint violation"
- Check related records exist
- Verify IDs are correct
- Review table relationships

#### "Unique constraint violation"
- Check for duplicate records
- Review unique indexes
- Verify data before insert

## Getting Help

### Before Asking for Help
1. Check this troubleshooting guide
2. Review browser console errors
3. Check Supabase logs
4. Test in incognito mode
5. Try with a fresh database

### Information to Provide
- Error message (full text)
- Browser console logs
- Supabase logs
- Steps to reproduce
- Environment (dev/production)
- Browser and version

### Resources
- Supabase Docs: https://supabase.com/docs
- React Docs: https://react.dev
- Tailwind Docs: https://tailwindcss.com
- M-Pesa Docs: https://developer.safaricom.co.ke
- Stripe Docs: https://stripe.com/docs

## Emergency Fixes

### Reset Database
```sql
-- WARNING: This deletes all data
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
-- Then run migrations again
```

### Reset Authentication
```sql
-- Clear all users (development only)
DELETE FROM auth.users;
```

### Clear All Data
```sql
-- Keep structure, delete data
TRUNCATE profiles, apartments, bookings, payments CASCADE;
```

### Disable RLS (Development Only)
```sql
-- Temporarily disable RLS
ALTER TABLE apartments DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
```

## Prevention

### Best Practices
1. Always test in development first
2. Keep backups of database
3. Use version control
4. Document changes
5. Test before deploying
6. Monitor logs regularly
7. Keep dependencies updated
8. Use environment variables
9. Implement error boundaries
10. Add comprehensive logging

---

**Still having issues?** Check the project documentation or review the code comments for additional guidance.
