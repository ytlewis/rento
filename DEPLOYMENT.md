# RENTO Deployment Checklist

## Pre-Deployment Checklist

### Database Setup
- [ ] Supabase project created
- [ ] Database migrations run (`001_initial_schema.sql`)
- [ ] Seed data loaded (`seed.sql`)
- [ ] Row Level Security (RLS) policies verified
- [ ] Database backups enabled

### Authentication
- [ ] Admin user created (gathaiyalewis1122@gmail.com)
- [ ] Email verification configured (optional)
- [ ] Password reset flow tested
- [ ] Auth redirect URLs configured

### Environment Variables
- [ ] `VITE_SUPABASE_URL` set
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY` set
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY` set (if using Stripe)
- [ ] All secrets verified in hosting platform

### Payment Integration

#### M-Pesa Setup
- [ ] Daraja API account created
- [ ] Consumer Key obtained
- [ ] Consumer Secret obtained
- [ ] Shortcode configured
- [ ] Passkey obtained
- [ ] Callback URL configured
- [ ] Edge function deployed (`mpesa-stk-push`)
- [ ] Callback function deployed (`mpesa-callback`)
- [ ] Secrets set in Supabase:
  - [ ] `MPESA_CONSUMER_KEY`
  - [ ] `MPESA_CONSUMER_SECRET`
  - [ ] `MPESA_SHORTCODE`
  - [ ] `MPESA_PASSKEY`
  - [ ] `MPESA_CALLBACK_URL`
- [ ] Tested in sandbox environment
- [ ] Production credentials configured (when ready)

#### Stripe Setup
- [ ] Stripe account created
- [ ] API keys obtained (test & production)
- [ ] Edge function deployed (`stripe-payment`)
- [ ] Secret set in Supabase: `STRIPE_SECRET_KEY`
- [ ] Webhook endpoint configured
- [ ] Test payments verified
- [ ] Production mode enabled (when ready)

### Frontend Deployment

#### Build & Test
- [ ] Production build successful (`npm run build`)
- [ ] No TypeScript errors
- [ ] No console errors in production build
- [ ] All routes accessible
- [ ] Mobile responsiveness verified

#### Hosting Platform (Vercel/Netlify)
- [ ] Project connected to Git repository
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Node version: 18+
- [ ] Environment variables configured
- [ ] Custom domain connected (optional)
- [ ] SSL certificate active
- [ ] Redirects configured for SPA routing

### Backend Deployment

#### Supabase Edge Functions
- [ ] All functions deployed:
  ```bash
  supabase functions deploy mpesa-stk-push
  supabase functions deploy mpesa-callback
  supabase functions deploy stripe-payment
  ```
- [ ] Function logs monitored
- [ ] CORS headers configured
- [ ] Rate limiting considered
- [ ] Error handling verified

### Security

#### Application Security
- [ ] RLS policies tested for all tables
- [ ] Admin-only routes protected
- [ ] API keys not exposed in frontend
- [ ] Input validation on all forms
- [ ] SQL injection protection verified
- [ ] XSS protection enabled
- [ ] CSRF protection considered

#### Payment Security
- [ ] Payment processing through backend only
- [ ] No sensitive data in frontend
- [ ] PCI compliance for card payments
- [ ] M-Pesa credentials secured
- [ ] Webhook signatures verified

### Testing

#### Functional Testing
- [ ] Admin login works
- [ ] Tenant signup/login works
- [ ] Browse apartments works
- [ ] Booking flow complete
- [ ] Payment dialogs appear
- [ ] Real-time updates working
- [ ] Dashboard data loads correctly

#### Payment Testing
- [ ] M-Pesa STK push triggers
- [ ] M-Pesa callback processes
- [ ] Stripe payment intent creates
- [ ] Payment status updates correctly
- [ ] Booking confirms after payment
- [ ] Apartment status updates

#### Cross-Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

### Monitoring & Analytics

#### Logging
- [ ] Supabase logs monitored
- [ ] Edge function logs reviewed
- [ ] Payment callback logs checked
- [ ] Error tracking configured (optional: Sentry)

#### Analytics
- [ ] User analytics configured (optional)
- [ ] Payment tracking setup
- [ ] Conversion funnel monitored

### Documentation

- [ ] README.md updated
- [ ] SETUP.md reviewed
- [ ] QUICKSTART.md tested
- [ ] API documentation created (if needed)
- [ ] Admin guide written
- [ ] Tenant guide written

### Post-Deployment

#### Immediate Actions
- [ ] Test admin login in production
- [ ] Create first property
- [ ] Test tenant signup
- [ ] Test booking flow
- [ ] Verify payment processing
- [ ] Check email notifications (if configured)

#### Monitoring (First 24 Hours)
- [ ] Monitor error logs
- [ ] Check payment success rate
- [ ] Verify real-time updates
- [ ] Test mobile experience
- [ ] Monitor database performance

#### Week 1 Tasks
- [ ] Gather user feedback
- [ ] Fix any reported bugs
- [ ] Optimize performance
- [ ] Review payment reconciliation
- [ ] Update documentation

### Rollback Plan

If issues occur:
1. Revert to previous deployment
2. Check Supabase logs for errors
3. Verify environment variables
4. Test payment integrations
5. Review recent code changes

### Production URLs

- Frontend: `https://your-domain.com`
- Admin: `https://your-domain.com/login?role=admin`
- Supabase: `https://your-project.supabase.co`
- Edge Functions: `https://your-project.supabase.co/functions/v1/`

### Support Contacts

- Supabase Support: https://supabase.com/support
- M-Pesa Support: https://developer.safaricom.co.ke/support
- Stripe Support: https://support.stripe.com

### Maintenance Schedule

- Daily: Monitor logs and payments
- Weekly: Review user feedback, update content
- Monthly: Security updates, performance optimization
- Quarterly: Feature updates, major improvements

---

## Quick Deploy Commands

### Frontend (Vercel)
```bash
npm run build
vercel --prod
```

### Frontend (Netlify)
```bash
npm run build
netlify deploy --prod
```

### Backend (Supabase)
```bash
# Deploy all functions
supabase functions deploy mpesa-stk-push
supabase functions deploy mpesa-callback
supabase functions deploy stripe-payment

# Set secrets
supabase secrets set MPESA_CONSUMER_KEY=xxx
supabase secrets set MPESA_CONSUMER_SECRET=xxx
supabase secrets set MPESA_SHORTCODE=xxx
supabase secrets set MPESA_PASSKEY=xxx
supabase secrets set STRIPE_SECRET_KEY=xxx
```

---

## Emergency Contacts

- Technical Lead: [Your Contact]
- Payment Issues: [Payment Support]
- Database Issues: [Database Admin]
- Security Issues: [Security Team]

---

**Last Updated**: [Date]
**Deployed By**: [Name]
**Version**: 1.0.0
