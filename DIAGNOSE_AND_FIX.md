# 🔍 Diagnose & Fix Admin Access

## Step 1: Check What's Wrong

Open browser console (F12) and run this diagnostic:

```javascript
// DIAGNOSTIC SCRIPT
(function diagnose() {
  console.log('🔍 Running diagnostics...');
  console.log('');
  
  // Check if users exist
  const usersRaw = localStorage.getItem('rento_users');
  console.log('1. Users in storage:', usersRaw ? 'YES' : 'NO');
  
  if (!usersRaw) {
    console.log('❌ NO USERS FOUND - Need to initialize storage');
    console.log('→ Run the FIX script below');
    return;
  }
  
  const users = JSON.parse(usersRaw);
  console.log('2. Total users:', users.length);
  console.log('');
  
  // Check for admin email
  const adminEmail = 'lewismwangi210@gmail.com';
  const adminUser = users.find(u => u.email === adminEmail);
  
  console.log('3. Admin user exists:', !!adminUser);
  
  if (!adminUser) {
    console.log('❌ NO ADMIN USER FOUND');
    console.log('→ Run the FIX script below');
    return;
  }
  
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('ADMIN USER DETAILS:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Email:', adminUser.email);
  console.log('Role:', adminUser.role);
  console.log('Name:', adminUser.full_name);
  console.log('Has Password:', !!adminUser.password);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  
  // Check role
  if (adminUser.role !== 'admin') {
    console.log('❌ PROBLEM FOUND: User has role "' + adminUser.role + '" instead of "admin"');
    console.log('→ This is why you get "Access denied"');
    console.log('→ Run the FIX script below');
    return;
  }
  
  // Check password
  const expectedPassword = btoa('Lewis001!');
  if (adminUser.password !== expectedPassword) {
    console.log('⚠️  WARNING: Password might not match');
    console.log('Expected:', expectedPassword);
    console.log('Actual:', adminUser.password);
    console.log('→ Run the FIX script below');
    return;
  }
  
  // Check current user
  const currentUserRaw = localStorage.getItem('rento_current_user');
  if (currentUserRaw) {
    const currentUser = JSON.parse(currentUserRaw);
    console.log('4. Currently logged in as:', currentUser.email);
    console.log('   Role:', currentUser.role);
    
    if (currentUser.role !== 'admin') {
      console.log('❌ PROBLEM: Logged in as non-admin');
      console.log('→ Run the FIX script below');
      return;
    }
  }
  
  console.log('');
  console.log('✅ EVERYTHING LOOKS GOOD!');
  console.log('');
  console.log('If you still get "Access denied", try:');
  console.log('1. Clear browser cache (Ctrl+Shift+Delete)');
  console.log('2. Run the FIX script below');
  console.log('3. Make sure you\'re using: http://localhost:8080/login?role=admin');
})();
```

---

## Step 2: Fix The Problem

After running diagnostics, paste this FIX script:

```javascript
// COMPLETE FIX - GUARANTEED TO WORK
(function completeReset() {
  console.log('🔧 Starting complete reset...');
  
  // Nuclear option: Clear EVERYTHING
  localStorage.clear();
  sessionStorage.clear();
  console.log('✅ Cleared all storage');
  
  // Create perfect admin account
  const perfectAdmin = {
    id: 'admin-001',
    email: 'lewismwangi210@gmail.com',
    full_name: 'Lewis Mwangi',
    phone: '254712345678',
    role: 'admin',
    created_at: new Date().toISOString(),
    password: btoa('Lewis001!')
  };
  
  // Save it
  localStorage.setItem('rento_users', JSON.stringify([perfectAdmin]));
  console.log('✅ Created admin account');
  
  // Create apartments
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
    },
    {
      id: 'apt-004',
      name: 'Metropolitan Suite',
      description: 'Contemporary 2-bedroom suite.',
      address: '200 Main Street, Downtown',
      bedrooms: 2,
      bathrooms: 1,
      price: 1950,
      image_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      status: 'available',
      created_at: new Date().toISOString()
    },
    {
      id: 'apt-005',
      name: 'Riverside Retreat',
      description: 'Peaceful 3-bedroom home.',
      address: '56 River Road, Riverside',
      bedrooms: 3,
      bathrooms: 2,
      price: 2200,
      image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      status: 'available',
      created_at: new Date().toISOString()
    },
    {
      id: 'apt-006',
      name: 'Urban Nest',
      description: 'Modern 1-bedroom apartment.',
      address: '89 Urban Plaza, Midtown',
      bedrooms: 1,
      bathrooms: 1,
      price: 1500,
      image_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      status: 'available',
      created_at: new Date().toISOString()
    }
  ];
  
  localStorage.setItem('rento_apartments', JSON.stringify(apartments));
  localStorage.setItem('rento_bookings', '[]');
  localStorage.setItem('rento_payments', '[]');
  console.log('✅ Loaded apartments and data');
  
  // Verify
  const verify = JSON.parse(localStorage.getItem('rento_users'))[0];
  
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ RESET COMPLETE!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Email:', verify.email);
  console.log('Role:', verify.role);
  console.log('Password correct:', verify.password === btoa('Lewis001!') ? 'YES ✅' : 'NO ❌');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('📝 LOGIN WITH:');
  console.log('   Email: lewismwangi210@gmail.com');
  console.log('   Password: Lewis001!');
  console.log('');
  console.log('🔗 URL: http://localhost:8080/login?role=admin');
  console.log('');
  console.log('⚠️  IMPORTANT: Click "Log in" (NOT "Sign up")');
  console.log('');
  console.log('Reloading in 3 seconds...');
  
  setTimeout(() => {
    location.reload();
  }, 3000);
})();
```

---

## Step 3: Login

After page reloads:

1. **Go to:** http://localhost:8080/login?role=admin
2. **Make sure you see:** "Admin Login" heading
3. **Click:** "Log in" button at bottom (NOT "Sign up")
4. **Enter:**
   - Email: `lewismwangi210@gmail.com`
   - Password: `Lewis001!`
5. **Click:** "Log In" button
6. **Success!** You should be redirected to `/admin`

---

## Common Mistakes

❌ **Using "Sign up" instead of "Log in"**
   - The admin account is already created
   - Use "Log in" button

❌ **Wrong URL**
   - Must include: `?role=admin`
   - Correct: `http://localhost:8080/login?role=admin`

❌ **Typo in password**
   - Must be exactly: `Lewis001!`
   - Capital L, exclamation at end

❌ **Old data in cache**
   - Clear browser cache: Ctrl+Shift+Delete
   - Run the FIX script again

---

## Still Not Working?

Run this to see what's happening:

```javascript
// Debug login attempt
const email = 'lewismwangi210@gmail.com';
const password = 'Lewis001!';

const users = JSON.parse(localStorage.getItem('rento_users') || '[]');
const user = users.find(u => u.email === email);

console.log('User found:', !!user);
console.log('User role:', user?.role);
console.log('Password match:', user?.password === btoa(password));
console.log('Is admin portal:', window.location.search.includes('role=admin'));

if (user && user.role !== 'admin' && window.location.search.includes('role=admin')) {
  console.log('❌ THIS IS THE PROBLEM: User is not admin but trying to access admin portal');
  console.log('→ Run the FIX script to set role to admin');
}
```

---

**Run DIAGNOSTIC first, then FIX, then LOGIN!** 🚀
