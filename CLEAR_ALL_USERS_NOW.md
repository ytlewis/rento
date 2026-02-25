# 🧹 Clear Old Pending Bookings - Step by Step

## Problem
Tenants have old pending bookings from before the auto-rejection feature was implemented. These bookings are stuck in "pending_approval" status.

---

## Solution 1: Tenants Clear Their Own (EASIEST)

### Steps:
1. Tenant logs into their dashboard
2. Scrolls to their bookings
3. Finds any booking with "Awaiting Approval" status
4. Clicks the **X button** next to the status badge
5. Booking is removed immediately

**This is already working!** Each tenant can clean up their own pending bookings.

---

## Solution 2: Browser Console Script (FASTEST)

### For Individual Tenant:
1. Tenant opens RENTO app in browser
2. Presses **F12** to open Developer Console
3. Copies and pastes this script:

```javascript
// Clear all MY pending approval bookings
const clearMyPendingBookings = () => {
  const bookings = JSON.parse(localStorage.getItem('rento_bookings') || '[]');
  const currentUser = JSON.parse(localStorage.getItem('rento_current_user') || '{}');
  
  if (!currentUser.id) {
    alert('Please log in first');
    return;
  }
  
  const myBookings = bookings.filter(b => b.tenant_id === currentUser.id);
  const myPending = myBookings.filter(b => b.status === 'pending_approval');
  const filtered = bookings.filter(b => 
    b.tenant_id !== currentUser.id || b.status !== 'pending_approval'
  );
  
  localStorage.setItem('rento_bookings', JSON.stringify(filtered));
  
  console.log(`✅ Cleared ${myPending.length} of your pending bookings`);
  alert(`Cleared ${myPending.length} of your pending bookings. Page will refresh.`);
  window.location.reload();
};

clearMyPendingBookings();
```

4. Presses **Enter**
5. Page refreshes automatically
6. Old pending bookings are gone

---

### For Admin (Clear ALL Pending Bookings):
1. Admin opens RENTO app in browser
2. Presses **F12** to open Developer Console
3. Copies and pastes this script:

```javascript
// Clear ALL pending approval bookings (ADMIN ONLY)
const clearAllPendingBookings = () => {
  const bookings = JSON.parse(localStorage.getItem('rento_bookings') || '[]');
  const pending = bookings.filter(b => b.status === 'pending_approval');
  const filtered = bookings.filter(b => b.status !== 'pending_approval');
  
  localStorage.setItem('rento_bookings', JSON.stringify(filtered));
  
  console.log(`✅ Cleared ${pending.length} pending approval bookings from all tenants`);
  alert(`Cleared ${pending.length} pending bookings from all tenants. Page will refresh.`);
  window.location.reload();
};

clearAllPendingBookings();
```

4. Presses **Enter**
5. Page refreshes automatically
6. ALL pending bookings from ALL tenants are gone

---

## Solution 3: Admin Dashboard (MANUAL)

### Steps:
1. Admin logs into Admin Dashboard
2. Scrolls to **"Booking Monitor"** section
3. Filters by **"Pending Approval"** status
4. Clicks **"Delete"** button for each old booking
5. Confirms deletion

**Note:** This is manual and slower, but gives admin control over which bookings to remove.

---

## Solution 4: Nuclear Option (Clear Everything)

### ⚠️ WARNING: This clears ALL bookings and payments!

Only use if you want to start completely fresh:

```javascript
// DANGER: Clear ALL bookings and payments
const nuclearReset = () => {
  const confirm = prompt('Type "DELETE ALL" to confirm clearing all bookings and payments:');
  
  if (confirm === 'DELETE ALL') {
    localStorage.setItem('rento_bookings', JSON.stringify([]));
    localStorage.setItem('rento_payments', JSON.stringify([]));
    
    console.log('💥 All bookings and payments cleared');
    alert('All bookings and payments cleared. Page will refresh.');
    window.location.reload();
  } else {
    alert('Cancelled. Nothing was deleted.');
  }
};

nuclearReset();
```

---

## Verification

### Check How Many Pending Bookings Exist:

```javascript
// Check pending bookings count
const checkPending = () => {
  const bookings = JSON.parse(localStorage.getItem('rento_bookings') || '[]');
  const pending = bookings.filter(b => b.status === 'pending_approval');
  
  console.log(`Total bookings: ${bookings.length}`);
  console.log(`Pending approval: ${pending.length}`);
  console.log('Pending bookings:', pending);
  
  alert(`Found ${pending.length} pending approval bookings out of ${bookings.length} total.`);
};

checkPending();
```

---

## Recommended Approach

### For Individual Tenants:
1. Use the **X button** on dashboard (easiest)
2. Or run the "Clear MY pending" script

### For Admin:
1. Run the "Clear ALL pending" script (fastest)
2. Or manually delete from Booking Monitor (more control)

---

## Why This Happened

These old pending bookings were created before we implemented:
- Auto-rejection after payment
- Tenant cancel button
- Better booking status management

Now the system automatically:
- ✅ Rejects other pending bookings when one is paid
- ✅ Allows tenants to cancel their own bookings
- ✅ Gives admin delete controls

So this cleanup is a **one-time fix** for old data.

---

## After Cleanup

Once old pending bookings are cleared:
- ✅ Tenants see only relevant bookings
- ✅ No confusion about old requests
- ✅ Clean dashboard
- ✅ System works as designed

New bookings will be managed properly by the auto-rejection system.

---

## Need Help?

If you have issues:
1. Make sure you're logged in
2. Try refreshing the page
3. Check browser console for errors (F12)
4. Run the verification script to see what's there

---

**Recommended:** Have each tenant clear their own pending bookings using the X button, or admin can run the "Clear ALL pending" script once to clean everything up. 🧹✨
