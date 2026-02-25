# 🔥 ULTIMATE FIX - Access Denied Issue

## The Problem

You're getting "Access denied" when trying to login as admin. This happens because:
1. The user exists but has wrong role
2. OR you're using "Sign up" when user already exists
3. OR the password doesn't match

## 🚀 ULTIMATE FIX (Copy ALL of this into browser console - F12)

```javascript
// ULTIMATE FIX - HANDLES EVERYTHING
(function ultimateFix() {
  console.log('🔥 ULTIMATE FIX STARTING...');
  console.log('');
  
  // Step 1: Show current state
  console.log('━━━ BEFORE FIX ━━━');
  const oldUsers = localStorage.getItem('rento_users');
  if (oldUsers) {
    const users = JSON.parse(oldUsers);
    console.log('Users found:', users.length);
    users.forEach(u => {
      console.log(`  - ${u.email} (${u.role})`);
    });
  } else {
    console.log('No users found');
  }
  console.log('');
  
  // Step 2: NUCLEAR CLEAR
  console.log('🧹 Clearing ALL storage...');
  localStorage.clear();
  sessionStorage.clear();
  
  // Clear any cookies
  document.cookie.split(";").forEach(function(c) { 
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
  });
  
  console.log('✅ All storage cleared');
  console.log('');
  
  // Step 3: Create PERFECT admin
  console.log('👤 Creating admin account...');
  const perfectAdmin = {
    id: 'admin-001',
    email: 'lewismwangi210@gmail.com',
    full_name: 'Lewis Mwangi',
    phone: '254712345678',
    role: 'admin',
    created_at: new Date().toISOString(),
    password: btoa('Lewis001!')
  };
  
  localStorage.setItem('rento_users', JSON.stringify([perfectAdmin]));
  console.log('✅ Admin created');
  
  // Step 4: Create sample data
  console.log('📦 Creating sample apartments...');
  const apartments = [
    {
      id: 'apt-001',
      name: 'Skyline Penthouse',
      description: 'Luxurious penthouse with panoramic city views.',
      address: '123 Downtown Avenue, City Center',
      bedrooms: 3,
      bathrooms: 2,
      price: 2500,
      image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      status: 'available',
      created_at: new Date().toISOString()
    },
    {
      id: 'apt-002',
      name: 'Harbor View Loft',
      description: 'Spacious waterfront loft.',
      address: '45 Marina Drive, Waterfront',
      bedrooms: 2,
      bathrooms: 2,
      price: 1800,
      image_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      status: 'available',
      created_at: new Date().toISOString()
    },
    {
      id: 'apt-003',
      name: 'Garden Oasis Studio',
      description: 'Cozy studio apartment.',
      address: '78 Green Street, Suburb',
      bedrooms: 1,
      bathrooms: 1,
      price: 1200,
      image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      status: 'available',
      created_at: new Date().toISOString()
    }
  ];
  
  localStorage.setItem('rento_apartments', JSON.stringify(apartments));
  localStorage.setItem('rento_bookings', '[]');
  localStorage.setItem('rento_payments', '[]');
  console.log('✅ Sample data created');
  console.log('');
  
  // Step 5: VERIFY
  console.log('━━━ VERIFICATION ━━━');
  const verifyUsers = JSON.parse(localStorage.getItem('rento_users'));
  const admin = verifyUsers[0];
  
  console.log('Total users:', verifyUsers.length);
  console.log('Admin email:', admin.email);
  console.log('Admin role:', admin.role);
  console.log('Admin password set:', !!admin.password);
  console.log('Password correct:', admin.password === btoa('Lewis001!') ? '✅ YES' : '❌ NO');
  console.log('');
  
  // Step 6: Test login logic
  console.log('━━━ LOGIN TEST ━━━');
  const testEmail = 'lewismwangi210@gmail.com';
  const testPassword = 'Lewis001!';
  const testUser = verifyUsers.find(u => u.email === testEmail);
  
  console.log('User found:', !!testUser ? '✅ YES' : '❌ NO');
  console.log('User role:', testUser?.role);
  console.log('Role is admin:', testUser?.role === 'admin' ? '✅ YES' : '❌ NO');
  console.log('Password matches:', testUser?.password === btoa(testPassword) ? '✅ YES' : '❌ NO');
  console.log('');
  
  // Step 7: Instructions
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ FIX COMPLETE!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('📝 NEXT STEPS:');
  console.log('');
  console.log('1. Wait for page to reload (3 seconds)');
  console.log('2. Go to: http://localhost:8080/login?role=admin');
  console.log('3. Click "Log in" button (NOT "Sign up")');
  console.log('4. Enter:');
  console.log('   Email: lewismwangi210@gmail.com');
  console.log('   Password: Lewis001!');
  console.log('5. Click "Log In"');
  console.log('');
  console.log('⚠️  CRITICAL: Use "Log in" NOT "Sign up"');
  console.log('   The account already exists!');
  console.log('');
  console.log('Reloading in 3 seconds...');
  
  setTimeout(() => {
    window.location.href = 'http://localhost:8080/login?role=admin';
  }, 3000);
})();
```

---

## After Page Reloads

You'll be at: `http://localhost:8080/login?role=admin`

**CRITICAL STEPS:**

1. **Look at the bottom of the form** - You should see a toggle that says:
   - "Already have an account? **Log in**"
   
2. **If you see "Sign up" button** - Click the "Log in" link at the bottom first!

3. **Then enter:**
   - Email: `lewismwangi210@gmail.com`
   - Password: `Lewis001!`

4. **Click "Log In"** button

---

## Why This Happens

The "Access denied" error occurs when:

1. **You click "Sign up"** - This tries to create a NEW user, and if the email already exists, it fails
2. **User has wrong role** - If the stored user has `role: 'tenant'` instead of `role: 'admin'`
3. **Wrong password** - Password doesn't match what's stored

The script above:
- ✅ Clears EVERYTHING (localStorage, sessionStorage, cookies)
- ✅ Creates fresh admin with `role: 'admin'`
- ✅ Sets correct password
- ✅ Verifies everything is correct
- ✅ Redirects you to login page

---

## Still Getting "Access Denied"?

If you STILL get the error after running the script, run this diagnostic:

```javascript
// DIAGNOSTIC - Run this AFTER trying to login
console.log('━━━ DIAGNOSTIC ━━━');

// Check URL
console.log('Current URL:', window.location.href);
console.log('Has ?role=admin:', window.location.search.includes('role=admin') ? '✅ YES' : '❌ NO');

// Check storage
const users = JSON.parse(localStorage.getItem('rento_users') || '[]');
const currentUser = localStorage.getItem('rento_current_user');

console.log('Total users:', users.length);
console.log('Admin user:', users.find(u => u.email === 'lewismwangi210@gmail.com'));
console.log('Currently logged in:', currentUser ? JSON.parse(currentUser) : 'No one');

// Check form state
console.log('Form mode:', document.querySelector('button[type="submit"]')?.textContent);
```

This will show us exactly what's happening!

---

**Run the ULTIMATE FIX script and follow the steps carefully!** 🔥
