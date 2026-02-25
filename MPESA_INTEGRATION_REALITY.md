# 🚨 IMPORTANT: M-Pesa Integration Reality Check

## The Truth About M-Pesa Prompts

### ❌ What's NOT Happening Now:
- NO real M-Pesa prompt sent to tenant's phone
- NO actual PIN entry required
- NO real money transfer
- NO connection to Safaricom M-Pesa system

### ✅ What IS Happening Now:
- System SIMULATES the payment flow
- Shows realistic messages to user
- Updates booking status in the app
- Records "payment" in localStorage
- **BUT NO ACTUAL MONEY MOVES**

---

## Why No Real M-Pesa Prompt?

This is a **FRONTEND-ONLY** application using localStorage. Real M-Pesa integration requires:

### 1. Backend Server (Required)
You MUST have a backend server because:
- M-Pesa API requires server-side authentication
- Consumer Key & Secret cannot be exposed in frontend
- M-Pesa needs a callback URL to send payment results
- Security: Frontend cannot securely handle M-Pesa credentials

### 2. Safaricom Daraja API Registration
- Register at https://developer.safaricom.co.ke
- Get approved (takes 1-2 weeks for production)
- Receive credentials:
  - Consumer Key
  - Consumer Secret
  - Business Short Code
  - Lipa Na M-Pesa Passkey

### 3. SSL Certificate & Public Domain
- M-Pesa requires HTTPS
- Callback URL must be publicly accessible
- Cannot use localhost or local IP addresses

---

## What You Need to Do for REAL M-Pesa

### Option A: Quick Backend Setup (Node.js Example)

**1. Create Backend Server:**
```bash
mkdir rento-backend
cd rento-backend
npm init -y
npm install express axios dotenv cors
```

**2. Create server.js:**
```javascript
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Get M-Pesa access token
async function getAccessToken() {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64');
  
  const response = await axios.get(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    { headers: { Authorization: `Basic ${auth}` } }
  );
  
  return response.data.access_token;
}

// STK Push endpoint
app.post('/api/mpesa/stk-push', async (req, res) => {
  try {
    const { phoneNumber, amount, accountReference } = req.body;
    const token = await getAccessToken();
    
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');
    
    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phoneNumber,
        CallBackURL: `${process.env.CALLBACK_URL}/api/mpesa/callback`,
        AccountReference: accountReference,
        TransactionDesc: 'Rent Payment'
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// M-Pesa callback
app.post('/api/mpesa/callback', (req, res) => {
  console.log('M-Pesa Callback:', JSON.stringify(req.body, null, 2));
  
  // Update payment status in your database
  const { Body } = req.body;
  if (Body.stkCallback.ResultCode === 0) {
    // Payment successful
    console.log('Payment successful!');
  } else {
    // Payment failed
    console.log('Payment failed:', Body.stkCallback.ResultDesc);
  }
  
  res.json({ ResultCode: 0, ResultDesc: 'Success' });
});

app.listen(3001, () => {
  console.log('Backend running on http://localhost:3001');
});
```

**3. Create .env file:**
```env
MPESA_CONSUMER_KEY=your_consumer_key_here
MPESA_CONSUMER_SECRET=your_consumer_secret_here
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_passkey_here
CALLBACK_URL=https://yourdomain.com
```

**4. Run backend:**
```bash
node server.js
```

**5. Update Frontend (PaymentDialog.tsx):**
Replace the simulation with real API call:
```typescript
// Replace the simulation code with:
const response = await fetch('http://localhost:3001/api/mpesa/stk-push', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phoneNumber: formattedPhone,
    amount: amount,
    accountReference: booking.id
  })
});

const result = await response.json();

if (result.ResponseCode === '0') {
  toast.success('M-Pesa prompt sent! Check your phone and enter PIN.');
  // Poll for payment status or wait for callback
} else {
  toast.error('Failed to send M-Pesa prompt: ' + result.ResponseDescription);
}
```

---

## Testing with M-Pesa Sandbox

### Sandbox Test Credentials:
- **API URL:** https://sandbox.safaricom.co.ke
- **Test Phone:** 254708374149
- **Test Shortcode:** 174379
- **Test Passkey:** (Get from Daraja portal)

### Test Flow:
1. Register on Daraja portal
2. Create sandbox app
3. Get test credentials
4. Use test phone number
5. Receive real STK push on test phone
6. Enter any 4-digit PIN
7. Get success callback

---

## Production Deployment

### Requirements:
1. **Business Registration:**
   - Registered business with Safaricom
   - Till Number or Paybill Number
   - Business documents

2. **Production Approval:**
   - Submit app for review
   - Wait 1-2 weeks for approval
   - Get production credentials

3. **Infrastructure:**
   - Backend server (AWS, Heroku, DigitalOcean, etc.)
   - SSL certificate (HTTPS required)
   - Public domain name
   - Database for payment records

---

## Cost Breakdown

### M-Pesa Transaction Fees:
- **Paybill:** ~1-2% per transaction
- **Till Number:** ~1.5-3% per transaction
- **Example:** KES 2,500 rent = ~KES 25-75 fee

### Infrastructure Costs:
- **Backend Hosting:** $5-20/month (DigitalOcean, Heroku)
- **Domain:** $10-15/year
- **SSL Certificate:** Free (Let's Encrypt) or $50-200/year
- **Database:** Free tier or $5-10/month

---

## Quick Summary

### Current System:
```
✅ Beautiful UI
✅ Complete booking flow
✅ Payment simulation
❌ NO real M-Pesa prompt
❌ NO actual money transfer
```

### To Get Real M-Pesa:
```
1. Register with Safaricom Daraja
2. Set up backend server
3. Deploy to public domain with HTTPS
4. Integrate M-Pesa API
5. Test with sandbox
6. Apply for production
```

### Timeline:
- **Sandbox Setup:** 1-2 days
- **Production Approval:** 1-2 weeks
- **Full Deployment:** 1-2 weeks

---

## Alternative: Use Payment Gateway

If M-Pesa direct integration is too complex, consider:

### 1. Pesapal (Kenya)
- Handles M-Pesa, cards, bank transfers
- Easier integration
- Higher fees (~3-5%)
- Website: https://www.pesapal.com

### 2. Flutterwave
- Multi-payment support
- Good documentation
- ~3.8% + KES 50 per transaction
- Website: https://flutterwave.com

### 3. Paystack (if expanding to Nigeria)
- Similar to Flutterwave
- Good for multi-country
- Website: https://paystack.com

---

## Bottom Line

**Your current app is a SIMULATION.** 

To send REAL M-Pesa prompts to tenant phones:
1. You MUST have a backend server
2. You MUST register with Safaricom
3. You MUST deploy to a public HTTPS domain
4. You MUST integrate the Daraja API

**There is NO way to send real M-Pesa prompts from a frontend-only app.**

The simulation shows how it WOULD work, but no actual money moves until you complete the backend integration.

---

## Need Help?

**Safaricom Daraja Support:**
- Email: apisupport@safaricom.co.ke
- Portal: https://developer.safaricom.co.ke
- Phone: 0711 051 000

**Documentation:**
- API Docs: https://developer.safaricom.co.ke/docs
- STK Push: https://developer.safaricom.co.ke/lipa-na-m-pesa-online
- Sandbox Testing: https://developer.safaricom.co.ke/test_credentials

---

**Remember: The app currently SIMULATES payments. Real M-Pesa integration requires backend development and Safaricom registration.** 📱💰
