# RENTO - Quick Start Guide

## Get Running in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Supabase Database

#### Option A: Using Supabase Dashboard (Easiest)
1. Go to your Supabase project: https://supabase.com/dashboard/project/lvkweqqialyykgqxmxmo
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the entire content from `supabase/migrations/001_initial_schema.sql`
5. Click "Run" to execute the migration
6. Go to "SQL Editor" again and run the content from `supabase/seed.sql` to add sample apartments

#### Option B: Using Supabase CLI
```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref lvkweqqialyykgqxmxmo

# Push the migration
supabase db push

# Run seed data
supabase db execute --file supabase/seed.sql
```

### 3. Verify Environment Variables
Your `.env` file should already have:
```env
VITE_SUPABASE_PROJECT_ID="lvkweqqialyykgqxmxmo"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
VITE_SUPABASE_URL="https://lvkweqqialyykgqxmxmo.supabase.co"
```

### 4. Start Development Server
```bash
npm run dev
```

The app will open at `http://localhost:5173`

### 5. Test the Application

#### As Admin:
1. Go to `http://localhost:5173/login?role=admin`
2. Sign up with email: `gathaiyalewis1122@gmail.com` and password: `Lewis001!`
3. You'll be automatically assigned admin role
4. Access admin dashboard to:
   - Add/edit/delete properties
   - View all tenants and bookings
   - Monitor payments

#### As Tenant:
1. Go to `http://localhost:5173/login`
2. Sign up with any email and password
3. Browse available apartments
4. Book an apartment
5. Make payments (M-Pesa/Card)

### 6. Payment Integration (Optional for Testing)

For now, the payment dialogs will show but won't process real payments until you:

#### M-Pesa Setup:
1. Get Daraja API credentials from https://developer.safaricom.co.ke
2. Deploy the edge function:
   ```bash
   supabase functions deploy mpesa-stk-push
   ```
3. Set environment secrets in Supabase Dashboard

#### Stripe Setup:
1. Get API keys from https://stripe.com
2. Deploy the edge function:
   ```bash
   supabase functions deploy stripe-payment
   ```
3. Add Stripe publishable key to `.env`

### 7. Verify Everything Works

✅ Admin can log in with specific email
✅ Admin can add/edit properties
✅ Tenants can sign up and log in
✅ Tenants can browse apartments
✅ Tenants can book apartments
✅ Real-time updates work (open admin and tenant dashboards side-by-side)
✅ Payment dialogs appear (actual processing requires API setup)

## Troubleshooting

### "Failed to load data"
- Check that migrations ran successfully in Supabase
- Verify your Supabase credentials in `.env`
- Check browser console for specific errors

### "Access denied"
- Make sure you're using the exact admin email: `gathaiyalewis1122@gmail.com`
- Check that the trigger in the migration created the profile correctly

### "No apartments showing"
- Run the seed.sql file to add sample apartments
- Or manually add apartments through the admin dashboard

### Database Connection Issues
- Verify your Supabase project is active
- Check that the URL and keys in `.env` are correct
- Ensure your IP is not blocked (check Supabase dashboard)

## Next Steps

1. Read `SETUP.md` for complete production setup
2. Configure M-Pesa and Stripe for real payments
3. Customize the design and branding
4. Add your own property images
5. Deploy to production (Vercel/Netlify)

## Support

- Supabase Docs: https://supabase.com/docs
- M-Pesa Daraja: https://developer.safaricom.co.ke
- Stripe Docs: https://stripe.com/docs

Happy renting! 🏠
