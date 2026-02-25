# ⚠️ M-Pesa Real Integration Required

## Current Situation

**The system is SIMULATING M-Pesa payments.**

No actual M-Pesa prompt is sent to the tenant's phone because:
- ❌ No real M-Pesa API connection
- ❌ No Safaricom Daraja API credentials
- ❌ No backend server to handle M-Pesa requests

The payment flow you see is a **simulation** to show how it would work.

---

## Why No Real Prompt?

### What's Happening Now:
```
Tenant clicks "Pay" 
    ↓
System shows messages (simulated)
    ↓
Payment marked as complete (in app only)
    ↓
NO ACTUAL MONEY TRANSFER
```

### What's Needed for Real Prompts:
```
Tenant clicks "Pay"
    ↓
Backend calls M-Pesa API
    ↓
M-Pesa sends STK Push to phone
    ↓
Tenant enters PIN on phone
    ↓
M-Pesa transfers money
    ↓
Backend receives confirmation
    ↓
Payment marked as complete
```

---

## 🔧 To Enable REAL M-Pesa Prompts

### Step 1: Register with Safaricom
1. Go to https://developer.safaricom.co.ke
2. Create account
3. Create an app
4. Get credentials:
   - Consumer Key
   - Consumer Secret
   - Business Short Code
   - Lipa Na M-Pesa Online Passkey

### Step 2: Set Up Backend Server
You need a backend server (Node.js, Python, PHP, etc.) to:
- Generate M-Pesa access tokens
- Call M-Pesa STK Push API
- Receive M-Pesa callbacks
- Update payment status

**Example Backend (Node.js):**
```javascript
// server.js
const express = require('express');
const axios = require('axios');

app.post('/api/mpesa/stk-push', async (req, res) => {
  // 1. Get access token from M-Pesa
  const token = await getMpesaToken();
  
  // 2. Call STK Push API
  const response = await axios.post(
    'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
    {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: generatePassword(),
      Timestamp: getTimestamp(),
      TransactionType: 'CustomerPayBillOnline',
      Amount: req.body.amount,
      PartyA: req.body.phoneNumber,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: req.body.phoneNumber,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: req.body.accountReference,
      TransactionDesc: req.body.transactionDesc
    },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  
  res.json(response.data);
});

// Callback endpoint
app.post('/api/mpesa/callback', (req, res) => {
  // M-Pesa sends payment result here
  const result = req.body;
  
  // Update payment status in database
  updatePaymentStatus(result);
  
  res.json({ ResultCode: 0, ResultDesc: 'Success' });
});
```

### Step 3: Update Frontend
Replace simulation with real API call:

```typescript
// In PaymentDialog.tsx
const response = await fetch('/api/mpesa/stk-push', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phoneNumber: formattedPhone,
    amount: amount,
    accountReference: booking.id,
    transactionDesc: `Rent payment for ${periodMonth}`
  })
});
```

### Step 4: Environment Variables
```env
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORTCODE=your_shortcode
MPESA_PASSKEY=your_passkey
MPESA_CALLBACK_URL=https://yourapp.com/api/mpesa/callback
```

---

## 🧪 Testing with M-Pesa Sandbox

### Sandbox Credentials:
- **URL:** https://sandbox.safaricom.co.ke
- **Test Phone:** 254708374149
- **Test Amount:** Any amount
- **Test PIN:** Any 4 digits

### Test Flow:
1. Use sandbox credentials
2. Call STK Push API
3. Check phone for prompt
4. Enter any PIN
5. Receive success callback

---

## 💰 Cost

### M-Pesa Charges:
- **Transaction Fee:** ~1-2% per transaction
- **API Access:** Free (Daraja API)
- **Shortcode:** One-time setup fee

### Example:
- Tenant pays: KES 2,500
- M-Pesa fee: ~KES 25-50
- Admin receives: KES 2,450-2,475

---

## 🚨 Important Notes

### Current System:
- ✅ Shows realistic payment flow
- ✅ Updates booking status
- ✅ Records payments
- ❌ NO actual money transfer
- ❌ NO real M-Pesa prompt
- ❌ NO PIN entry required

### With Real Integration:
- ✅ Actual M-Pesa prompt sent to phone
- ✅ Real PIN entry required
- ✅ Actual money transfer
- ✅ M-Pesa confirmation SMS
- ✅ Real transaction records

---

## 📋 Quick Summary

**Q: Why no M-Pesa prompt on phone?**
A: System is simulating. Need real M-Pesa API integration.

**Q: Is money actually transferred?**
A: No. It's a simulation for demonstration.

**Q: How to enable real payments?**
A: Register with Safaricom, set up backend, integrate API.

**Q: Can I test without real money?**
A: Yes, use M-Pesa sandbox environment.

**Q: How long to set up?**
A: 1-2 days for sandbox, 1-2 weeks for production approval.

---

## 🎯 Next Steps

1. **For Testing:**
   - Use current simulation
   - Understand the flow
   - Test user experience

2. **For Production:**
   - Register with Safaricom
   - Set up backend server
   - Integrate M-Pesa API
   - Test with sandbox
   - Apply for production access

---

## 📞 Need Help?

**Safaricom Support:**
- Email: apisupport@safaricom.co.ke
- Portal: https://developer.safaricom.co.ke

**Documentation:**
- API Docs: https://developer.safaricom.co.ke/docs
- STK Push Guide: https://developer.safaricom.co.ke/lipa-na-m-pesa-online

---

**The current system simulates the flow. For REAL M-Pesa prompts and money transfer, you need to integrate with Safaricom's Daraja API.** 📱💰
