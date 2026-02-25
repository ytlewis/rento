# RENTO - Complete Setup Guide

## Overview
RENTO is a full-stack rental management system with real-time features, payment integration (M-Pesa & Stripe), and admin controls.

## Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier works)
- M-Pesa Daraja API credentials (for Kenya payments)
- Stripe account (for card payments)

## 1. Supabase Setup

### Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned
3. Note your project URL and anon key from Settings > API

### Run Database Migrations
1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Link your project:
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

3. Run migrations:
   ```bash
   supabase db push
   ```

   Or manually run the SQL from `supabase/migrations/001_initial_schema.sql` in the Supabase SQL Editor.

### Create Admin User
1. Go to Supabase Dashboard > Authentication > Users
2. Create a new user with email: `gathaiyalewis1122@gmail.com` and password: `Lewis001!`
3. The trigger will automatically assign admin role to this email

## 2. Environment Variables

Update `.env` file:

```env
# Supabase (already configured)
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
VITE_SUPABASE_URL="https://your-project.supabase.co"

# M-Pesa Daraja API (for production)
MPESA_CONSUMER_KEY="your-consumer-key"
MPESA_CONSUMER_SECRET="your-consumer-secret"
MPESA_SHORTCODE="your-shortcode"
MPESA_PASSKEY="your-passkey"
MPESA_CALLBACK_URL="https://your-domain.com/api/mpesa-callback"

# Stripe (for card payments)
STRIPE_SECRET_KEY="sk_test_..."
VITE_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

## 3. M-Pesa Integration Setup

### Get Daraja API Credentials
1. Go to [developer.safaricom.co.ke](https://developer.safaricom.co.ke)
2. Create an account and create a new app
3. Get your Consumer Key and Consumer Secret
4. For testing, use Sandbox credentials
5. For production, apply for production credentials

### Deploy Edge Functions
```bash
# Deploy M-Pesa STK Push function
supabase functions deploy mpesa-stk-push --no-verify-jwt

# Deploy M-Pesa Callback function
supabase functions deploy mpesa-callback --no-verify-jwt

# Set secrets
supabase secrets set MPESA_CONSUMER_KEY=your-key
supabase secrets set MPESA_CONSUMER_SECRET=your-secret
supabase secrets set MPESA_SHORTCODE=your-shortcode
supabase secrets set MPESA_PASSKEY=your-passkey
supabase secrets set MPESA_CALLBACK_URL=your-callback-url
```

### Update Payment Integration
In `src/lib/payments/mpesa.ts`, update the API endpoint to your Supabase function URL:
```typescript
const response = await fetch('https://YOUR_PROJECT.supabase.co/functions/v1/mpesa-stk-push', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${supabaseAnonKey}`,
  },
  body: JSON.stringify(request),
});
```

## 4. Stripe Integration Setup

### Get Stripe Credentials
1. Go to [stripe.com](https://stripe.com) and create an account
2. Get your API keys from Dashboard > Developers > API keys
3. Use test keys for development

### Deploy Stripe Function
```bash
# Deploy Stripe payment function
supabase functions deploy stripe-payment --no-verify-jwt

# Set secret
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
```

### Install Stripe Dependencies
```bash
npm install @stripe/stripe-js
```

## 5. Install Dependencies & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 6. Admin Account Setup

### Login as Admin
1. Navigate to `/login?role=admin`
2. Use credentials:
   - Email: `gathaiyalewis1122@gmail.com`
   - Password: `Lewis001!`

### Add Properties
1. Click "Add Property" button
2. Fill in property details
3. Upload images (use image URLs or integrate with Supabase Storage)

### Configure Bank Account
1. Go to Admin Dashboard
2. Add your bank account details for receiving payments
3. Set up M-Pesa number for withdrawals

## 7. Testing the System

### Test Tenant Flow
1. Sign up as a new tenant
2. Browse available apartments
3. Book an apartment
4. Make a payment using M-Pesa or card

### Test M-Pesa Payment (Sandbox)
- Use test phone number: 254708374149
- Use test amount: any amount
- Check callback logs in Supabase Functions logs

### Test Admin Features
1. Add/edit/delete properties
2. View tenant bookings
3. Monitor payments
4. Update property prices

## 8. Security Checklist

- [x] Row Level Security (RLS) enabled on all tables
- [x] Admin role verification for sensitive operations
- [x] Secure payment processing through backend functions
- [x] Environment variables for sensitive data
- [x] HTTPS required for production
- [x] Input validation on all forms
- [x] SQL injection protection via Supabase client

## 9. Production Deployment

### Deploy to Vercel/Netlify
```bash
# Build the app
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to Netlify
netlify deploy --prod
```

### Configure Production Environment
1. Set all environment variables in your hosting platform
2. Update M-Pesa callback URL to production domain
3. Switch to production M-Pesa credentials
4. Use production Stripe keys
5. Enable email verification in Supabase Auth settings

## 10. Monitoring & Maintenance

### Monitor Payments
- Check Supabase Dashboard > Database > payments table
- Monitor M-Pesa callback logs
- Review Stripe Dashboard for card payments

### Database Backups
- Supabase automatically backs up your database
- Enable Point-in-Time Recovery for production

### Real-time Updates
- All data updates are real-time via Supabase subscriptions
- Tenants see instant payment confirmations
- Admin sees live booking updates

## Support

For issues or questions:
- Check Supabase logs for backend errors
- Review browser console for frontend errors
- Test M-Pesa integration in sandbox first
- Verify all environment variables are set correctly

## Features Implemented

✅ User authentication (admin & tenant roles)
✅ Admin dashboard with property management
✅ Tenant dashboard with booking & payment tracking
✅ Real-time updates via Supabase subscriptions
✅ M-Pesa STK Push integration
✅ Stripe card payment integration
✅ Automatic apartment status updates
✅ Payment tracking and history
✅ Secure Row Level Security policies
✅ Responsive design for mobile & desktop
✅ Admin-specific email authentication
✅ Booking confirmation workflow
✅ Payment method selection (M-Pesa/Card)

## Next Steps

1. Add email notifications for bookings/payments
2. Implement file upload for property images
3. Add tenant reviews and ratings
4. Create maintenance request system
5. Add analytics dashboard for admin
6. Implement lease renewal workflow
7. Add document management (lease agreements)
8. Create mobile app version
