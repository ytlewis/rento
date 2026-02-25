# 🐛 Debug Login Issue

## Run This BEFORE Attempting Login

Open browser console (F12) and paste this:

```javascript
// SETUP DEBUGGING
(function setupDebug() {
  console.log('🐛 Setting up debug mode...');
  
  // Clear everything first
  localStorage.clear();
  
  // Create admin with EXPLICIT role
  const admin = {
    id: 'admin-001',
    email: 'lewismwangi210@gmail.com',
    full_name: 'Lewis Mwangi',
    phone: '254712345678',
    role: 'admin',  // ← EXPLICIT ADMIN ROLE
    created_at: new Date().toISOString(),
    password: btoa('Lewis001!')
  };
  
  localStorage.setItem('rento_users', JSON.stringify([admin]));
  localStorage.setItem('rento_apartments', '[]');
  localStorage.setItem('rento_bookings', '[]');
  localStorage.setItem('rento_payments', '[]');
  
  console.log('✅ Admin created with role:', admin.role);
  console.log('');
  
  // Intercept localStorage operations
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function(key, value) {
    if (key === 'rento_current_user') {
      console.log('🔍 Setting current user:', JSON.parse(value));
    }
    return originalSetItem.apply(this, arguments);
  };
  
  const originalGetItem = localStorage.getItem;
  localStorage.getItem = function(key) {
    const result = originalGetItem.apply(this, arguments);
    if (key === 'rento_current_user' && result) {
      console.log('🔍 Getting current user:', JSON.parse(result));
    }
    return result;
  };
  
  console.log('✅ Debug mode active');
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('NOW TRY TO LOGIN:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('1. Go to: http://localhost:8080/login?role=admin');
  console.log('2. Click "Log in" (NOT "Sign up")');
  console.log('3. Email: lewismwangi210@gmail.com');
  console.log('4. Password: Lewis001!');
  console.log('5. Watch the console for debug output');
  console.log('');
  
  // Verify setup
  const verify = JSON.parse(localStorage.getItem('rento_users'))[0];
  console.log('✅ Verification:');
  console.log('   Email:', verify.email);
  console.log('   Role:', verify.role);
  console.log('   Role type:', typeof verify.role);
  console.log('   Is admin:', verify.role === 'admin');
  
  setTimeout(() => {
    window.location.href = 'http://localhost:8080/login?role=admin';
  }, 2000);
})();
```

---

## What This Does

1. **Clears storage** - Fresh start
2. **Creates admin** - With explicit `role: 'admin'`
3. **Intercepts localStorage** - Shows when current user is set/get
4. **Redirects to login** - Takes you to the right page

---

## Watch The Console

When you try to login, you'll see:

```
🔍 Setting current user: { id: '...', email: '...', role: '...' }
```

**Check the role value!** It should be `'admin'`

If it shows `'tenant'` or anything else, that's the problem!

---

## After Login Attempt

Run this to see what happened:

```javascript
// CHECK WHAT HAPPENED
console.log('━━━ POST-LOGIN CHECK ━━━');

const users = JSON.parse(localStorage.getItem('rento_users') || '[]');
const currentUser = localStorage.getItem('rento_current_user');

console.log('1. Users in storage:', users.length);
console.log('2. Admin user:', users.find(u => u.email === 'lewismwangi210@gmail.com'));
console.log('3. Current user:', currentUser ? JSON.parse(currentUser) : 'None');

if (currentUser) {
  const user = JSON.parse(currentUser);
  console.log('');
  console.log('Current user role:', user.role);
  console.log('Is admin:', user.role === 'admin');
  
  if (user.role !== 'admin') {
    console.log('');
    console.log('❌ PROBLEM: Current user role is NOT admin!');
    console.log('   Expected: admin');
    console.log('   Got:', user.role);
  }
}
```

---

## If Role Is Wrong

If the console shows the role is NOT 'admin', run this fix:

```javascript
// FORCE FIX THE ROLE
const users = JSON.parse(localStorage.getItem('rento_users'));
const admin = users.find(u => u.email === 'lewismwangi210@gmail.com');

if (admin) {
  admin.role = 'admin';  // Force it
  localStorage.setItem('rento_users', JSON.stringify(users));
  console.log('✅ Fixed admin role');
  
  // If currently logged in, fix current user too
  const currentUser = localStorage.getItem('rento_current_user');
  if (currentUser) {
    const user = JSON.parse(currentUser);
    if (user.email === 'lewismwangi210@gmail.com') {
      user.role = 'admin';
      localStorage.setItem('rento_current_user', JSON.stringify(user));
      console.log('✅ Fixed current user role');
    }
  }
  
  console.log('✅ Try accessing admin dashboard now');
  window.location.href = '/admin';
}
```

---

**Run the setup script and watch the console carefully!** 🐛
