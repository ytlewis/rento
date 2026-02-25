# 🧹 Clear All Pending Bookings

## Quick Script to Remove All Pending Bookings

This will remove all bookings with status `pending_approval` from the system.

---

## 🔥 Run This in Browser Console (F12)

Copy and paste this entire script:

```javascript
// CLEAR ALL PENDING BOOKINGS
(function clearPendingBookings() {
  console.log('🧹 Clearing all pending bookings...');
  
  // Get all bookings
  const bookingsRaw = localStorage.getItem('rento_bookings');
  
  if (!bookingsRaw) {
    console.log('❌ No bookings found in storage');
    return;
  }
  
  const allBookings = JSON.parse(bookingsRaw);
  const beforeCount = allBookings.length;
  
  // Count pending bookings
  const pendingCount = allBookings.filter(b => b.status === 'pending_approval').length;
  
  console.log('📊 Current bookings:', beforeCount);
  console.log('⏳ Pending approval:', pendingCount);
  
  if (pendingCount === 0) {
    console.log('✅ No pending bookings to remove');
    return;
  }
  
  // Remove all pending_approval bookings
  const filteredBookings = allBookings.filter(b => b.status !== 'pending_approval');
  
  // Save back to storage
  localStorage.setItem('rento_bookings', JSON.stringify(filteredBookings));
  
  const afterCount = filteredBookings.length;
  const removedCount = beforeCount - afterCount;
  
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ CLEANUP COMPLETE!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Removed:', removedCount, 'pending bookings');
  console.log('Remaining:', afterCount, 'bookings');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('🔄 Reloading page in 2 seconds...');
  
  setTimeout(() => {
    location.reload();
  }, 2000);
})();
```

---

## 📋 What This Does

1. ✅ Finds all bookings in localStorage
2. ✅ Filters out bookings with status `pending_approval`
3. ✅ Keeps all other bookings (confirmed, pending_payment, rejected, cancelled)
4. ✅ Saves the filtered list back to storage
5. ✅ Shows summary of what was removed
6. ✅ Reloads the page automatically

---

## 🎯 What Gets Removed

**Removed:**
- ❌ All bookings with status: `pending_approval`

**Kept:**
- ✅ Confirmed (active) bookings
- ✅ Pending payment bookings
- ✅ Rejected bookings
- ✅ Cancelled bookings

---

## 🔍 Verify It Worked

After the page reloads, run this to check:

```javascript
// Check remaining bookings
const bookings = JSON.parse(localStorage.getItem('rento_bookings') || '[]');
const pending = bookings.filter(b => b.status === 'pending_approval');

console.log('Total bookings:', bookings.length);
console.log('Pending approval:', pending.length);
console.log('Should be 0 pending!');
```

---

## 🆘 Alternative: Clear ALL Bookings

If you want to remove ALL bookings (not just pending):

```javascript
// CLEAR ALL BOOKINGS (USE WITH CAUTION!)
localStorage.setItem('rento_bookings', '[]');
console.log('✅ All bookings cleared');
location.reload();
```

⚠️ **Warning:** This removes EVERYTHING including active leases!

---

## 🔄 Alternative: Clear Specific Status

To clear bookings with a different status:

```javascript
// Clear rejected bookings
const bookings = JSON.parse(localStorage.getItem('rento_bookings') || '[]');
const filtered = bookings.filter(b => b.status !== 'rejected');
localStorage.setItem('rento_bookings', JSON.stringify(filtered));
console.log('✅ Rejected bookings cleared');
location.reload();
```

Replace `'rejected'` with:
- `'pending_approval'` - Pending approval
- `'pending_payment'` - Pending payment
- `'cancelled'` - Cancelled
- `'confirmed'` - Active (be careful!)

---

## 📊 Check Current Bookings

To see what bookings exist before clearing:

```javascript
// View all bookings
const bookings = JSON.parse(localStorage.getItem('rento_bookings') || '[]');

console.log('Total bookings:', bookings.length);
console.log('');

// Count by status
const statusCounts = bookings.reduce((acc, b) => {
  acc[b.status] = (acc[b.status] || 0) + 1;
  return acc;
}, {});

console.log('Bookings by status:');
Object.entries(statusCounts).forEach(([status, count]) => {
  console.log(`  ${status}: ${count}`);
});
```

---

## ✅ Summary

**To clear all pending bookings:**
1. Press F12 to open console
2. Paste the first script
3. Wait for page to reload
4. All pending approval bookings are gone!

**Safe to use:**
- ✅ Keeps active leases
- ✅ Keeps payment records
- ✅ Only removes pending approvals

---

**Run the script and your pending bookings will be cleared!** 🧹
