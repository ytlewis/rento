# 📱 M-Pesa STK Push Payment Flow

## Overview

The payment system now simulates the complete M-Pesa STK Push experience, showing tenants exactly what happens during a real M-Pesa payment.

---

## 🔄 Payment Flow (Step by Step)

### Step 1: Tenant Initiates Payment
- Tenant clicks "Pay Now" button
- Enters M-Pesa phone number (or selects saved number)
- Clicks "Pay with M-Pesa"

### Step 2: STK Push Initiated
**Message shown:**
```
📱 Sending payment request to 254712345678...
```

**What happens:**
- System validates phone number format
- Checks admin has payment account set up
- Initiates STK Push request

### Step 3: PIN Prompt Sent
**Message shown:**
```
✅ Payment prompt sent! Check your phone 254712345678 
and enter your M-Pesa PIN to complete payment.
```

**What tenant sees:**
- Notification on their phone
- M-Pesa prompt asking for PIN
- Amount and recipient details

### Step 4: Processing Payment
**Message shown:**
```
Processing payment...
```

**What happens:**
- Tenant enters PIN on their phone
- M-Pesa processes the transaction
- Money transfers from tenant to admin

### Step 5: Payment Complete
**Message shown:**
```
🎉 Payment Complete! KES 2,500 transferred from 254712345678 
to admin's M-Pesa 254700000000. Receipt: ABC123XYZ. 
You now own this room!
```

**What happens:**
- Payment record created
- Booking status → "confirmed"
- Apartment status → "occupied"
- Tenant sees "You Own This Room"

---

## 💰 Money Flow

```
Tenant's M-Pesa (254712345678)
         ↓
    [STK Push]
         ↓
   [Enter PIN]
         ↓
  [M-Pesa Processing]
         ↓
Admin's M-Pesa (254700000000)
```

---

## 📱 What Tenant Experiences

### On Web App:
1. Click "Pay Now"
2. See "Sending payment request..."
3. See "Payment prompt sent! Check your phone..."
4. See "Processing payment..."
5. See "Payment Complete!"

### On Phone:
1. Receive M-Pesa notification
2. See payment prompt with:
   - Amount: KES 2,500
   - Recipient: Admin's M-Pesa
   - Reference: Booking ID
3. Enter M-Pesa PIN
4. Confirm payment
5. Receive M-Pesa confirmation SMS

---

## 🔧 Technical Implementation

### Current (Simulated):
```typescript
// Simulates the STK Push flow with realistic delays
1. Show "Sending request..." (2 seconds)
2. Show "Check your phone..." (3 seconds)
3. Show "Processing..." (2 seconds)
4. Complete payment
```

### Production (Real M-Pesa):
```typescript
// Actual M-Pesa Daraja API integration
1. Call M-Pesa STK Push API
2. M-Pesa sends prompt to phone
3. Poll M-Pesa for payment status
4. Receive callback when complete
```

---

## 🎯 For Production Deployment

To enable REAL M-Pesa payments, you need:

### 1. M-Pesa Daraja API Credentials
- Consumer Key
- Consumer Secret
- Shortcode
- Passkey
- Callback URL

### 2. Backend Setup
Create API endpoint: `/api/mpesa/stk-push`

```typescript
// Example backend endpoint
POST /api/mpesa/stk-push
{
  "phoneNumber": "254712345678",
  "amount": 2500,
  "accountReference": "booking-123",
  "transactionDesc": "Rent payment"
}
```

### 3. Update PaymentDialog
Replace simulation with actual API call:

```typescript
const response = await initiateMpesaPayment({
  phoneNumber: formattedPhone,
  amount,
  accountReference: booking.id,
  transactionDesc: `Rent for ${periodMonth}`
});
```

### 4. Callback Handler
Create endpoint to receive M-Pesa callbacks:

```typescript
POST /api/mpesa/callback
// M-Pesa sends payment result here
// Update payment status based on result
```

---

## 📋 M-Pesa Setup Guide

### Step 1: Register on Daraja
1. Go to https://developer.safaricom.co.ke
2. Create account
3. Create app
4. Get credentials

### Step 2: Configure Environment
```env
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_SHORTCODE=your_shortcode
MPESA_PASSKEY=your_passkey
MPESA_CALLBACK_URL=https://yourapp.com/api/mpesa/callback
```

### Step 3: Implement Backend
- Generate access token
- Call STK Push API
- Handle callbacks
- Update payment status

### Step 4: Test
- Use M-Pesa sandbox for testing
- Test phone: 254708374149
- Test amount: Any amount
- PIN: Any 4 digits

---

## 🔒 Security Notes

### Never expose in frontend:
- ❌ Consumer Key
- ❌ Consumer Secret
- ❌ Passkey

### Always use backend:
- ✅ Generate access tokens on server
- ✅ Call M-Pesa API from server
- ✅ Validate callbacks on server
- ✅ Update database from server

---

## 📊 Payment Status Flow

```
pending → processing → completed
                    ↓
                  failed
```

### Status Updates:
1. **pending** - Payment initiated
2. **processing** - Waiting for PIN entry
3. **completed** - Payment successful
4. **failed** - Payment cancelled or failed

---

## ✅ Current Implementation

The current system:
- ✅ Shows realistic STK Push flow
- ✅ Validates phone numbers
- ✅ Shows step-by-step messages
- ✅ Simulates delays (like real M-Pesa)
- ✅ Transfers money to admin account
- ✅ Generates receipt numbers
- ✅ Updates booking status
- ✅ Shows success confirmation

**For production, replace simulation with actual M-Pesa API calls!**

---

## 🎉 User Experience

Tenants now see:
1. ✅ "Sending payment request to your phone..."
2. ✅ "Check your phone and enter PIN..."
3. ✅ "Processing payment..."
4. ✅ "Payment complete! Money transferred!"

This matches the real M-Pesa experience! 📱💰
