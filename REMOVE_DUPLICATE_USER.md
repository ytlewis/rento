# Remove Duplicate Admin User

## 🗑️ Quick Fix - Remove Duplicate User

If you have a tenant account using the admin email `gathaiyalewis1122@gmail.com`, run this command to remove it:

### Step 1: Open Browser Console
- Press **F12** (Windows/Linux) or **Cmd+Option+J** (Mac)
- Or right-click → "Inspect" → "Console" tab

### Step 2: Run This Command

```javascript
// Remove duplicate users with admin email
const adminEmail = 'gathaiyalewis1122@gmail.com';
const users = JSON.parse(localStorage.getItem('rento_users') || '[]');
const duplicates = users.filter(u => u.email === adminEmail);

console.log('Found', duplicates.length, 'user(s) with admin email');

// Keep only the admin user
const adminUser = duplicates.find(u => u.role === 'admin');
const otherUsers = users.filter(u => u.email !== adminEmail);

if (adminUser) {
  const cleanedUsers = [...otherUsers, adminUser];
  localStorage.setItem('rento_users', JSON.stringify(cleanedUsers));
  console.log('✅ Removed duplicate(s), kept admin account');
} else if (duplicates.length > 0) {
  // Make the first one admin
  duplicates[0].role = 'admin';
  const cleanedUsers = [...otherUsers, duplicates[0]];
  localStorage.setItem('rento_users', JSON.stringify(cleanedUsers));
  console.log('✅ Removed duplicate(s), promoted first to admin');
}

// Log out if current user is a duplicate tenant
const currentUser = JSON.parse(localStorage.getItem('rento_current_user') || 'null');
if (currentUser && currentUser.email === adminEmail && currentUser.role !== 'admin') {
  localStorage.removeItem('rento_current_user');
  console.log('✅ Logged out duplicate tenant user');
}

location.reload();
```

### Step 3: Page Will Reload
The page will refresh with only the admin account remaining.

---

## 🔍 Check for Duplicates

To see if you have duplicate users:

```javascript
const users = JSON.parse(localStorage.getItem('rento_users') || '[]');
const adminEmail = 'gathaiyalewis1122@gmail.com';
const duplicates = users.filter(u => u.email === adminEmail);

console.log('Users with admin email:', duplicates.length);
console.table(duplicates);
```

---

## ✅ Verify Clean Up

After running the cleanup:

```javascript
const users = JSON.parse(localStorage.getItem('rento_users') || '[]');
const adminUsers = users.filter(u => u.email === 'gathaiyalewis1122@gmail.com');

console.log('Admin users remaining:', adminUsers.length); // Should be 1
console.log('Admin user:', adminUsers[0]);
```

---

## 🚫 Prevent Tenants from Using Admin Portal

The app now prevents tenants from logging in through the admin portal:

### What Happens:
1. Tenant tries to login at `/login?role=admin`
2. System checks their role
3. If role is 'tenant', they're logged out immediately
4. Error message: "Access denied. This portal is for administrators only."

### Admin Portal Protection:
- ✅ Only users with `role: 'admin'` can access
- ✅ Tenants are automatically logged out
- ✅ Clear error message shown
- ✅ Redirected to login page

---

## 📋 Complete Cleanup Script

For a complete cleanup (removes duplicates + logs out):

```javascript
// Complete cleanup function
(function cleanupAdminEmail() {
  const adminEmail = 'gathaiyalewis1122@gmail.com';
  const users = JSON.parse(localStorage.getItem('rento_users') || '[]');
  
  // Find duplicates
  const withAdminEmail = users.filter(u => u.email === adminEmail);
  const withoutAdminEmail = users.filter(u => u.email !== adminEmail);
  
  console.log('Found', withAdminEmail.length, 'user(s) with admin email');
  
  if (withAdminEmail.length === 0) {
    console.log('No users with admin email found');
    return;
  }
  
  // Keep only admin user
  const adminUser = withAdminEmail.find(u => u.role === 'admin');
  
  if (adminUser) {
    // Admin exists, keep it
    localStorage.setItem('rento_users', JSON.stringify([...withoutAdminEmail, adminUser]));
    console.log('✅ Kept admin user, removed', withAdminEmail.length - 1, 'duplicate(s)');
  } else {
    // No admin, promote first user
    withAdminEmail[0].role = 'admin';
    localStorage.setItem('rento_users', JSON.stringify([...withoutAdminEmail, withAdminEmail[0]]));
    console.log('✅ Promoted first user to admin, removed', withAdminEmail.length - 1, 'duplicate(s)');
  }
  
  // Log out if current user is duplicate tenant
  const currentUser = JSON.parse(localStorage.getItem('rento_current_user') || 'null');
  if (currentUser && currentUser.email === adminEmail && currentUser.role !== 'admin') {
    localStorage.removeItem('rento_current_user');
    console.log('✅ Logged out duplicate tenant');
  }
  
  console.log('✅ Cleanup complete!');
  location.reload();
})();
```

---

## 🎯 What Gets Fixed

### Before:
- ❌ Multiple users with admin email
- ❌ Tenant can login through admin portal
- ❌ Confusion about which account is admin

### After:
- ✅ Only ONE user with admin email
- ✅ That user has admin role
- ✅ Tenants blocked from admin portal
- ✅ Clear access control

---

## 🔐 Admin Portal Security

### New Protection:
1. **Login Check** - Verifies role after login
2. **Auto Logout** - Logs out non-admin users
3. **Error Message** - Clear feedback
4. **Redirect** - Sends back to login

### Code Added:
```javascript
// Check if trying to access admin portal but not admin
if (isAdminHint && user.role !== 'admin') {
  await signOut();
  toast.error("Access denied. This portal is for administrators only.");
  return;
}
```

---

## 🆘 Troubleshooting

### "Still see duplicate users"
- Run the cleanup script again
- Hard refresh: Ctrl+Shift+R
- Check console for errors

### "Can't login as admin"
- Make sure you're using admin email: `gathaiyalewis1122@gmail.com`
- Check the user has `role: 'admin'`
- Run verification script above

### "Tenant still accessing admin"
- Clear browser cache
- Refresh the page
- Check you're on latest code

---

## 📝 Summary

✅ Duplicate users removed
✅ Admin email protected
✅ Tenants blocked from admin portal
✅ Clear error messages
✅ Automatic logout for non-admins

**Your admin portal is now secure!** 🔒
