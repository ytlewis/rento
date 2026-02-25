# 🔧 Fix "Access Denied" Error

## Problem
You're getting "Access denied" when trying to login as admin. This happens when:
1. A user exists with email `lewismwangi210@gmail.com` but has role `tenant` instead of `admin`
2. Old user data is still in localStorage

## ⚡ INSTANT FIX - Run This Now!

Open browser console (F12) and paste this:

```javascript
// COMPLETE FIX FOR ACCESS DENIED
(function fixAccessDenied() {
  console.log('🔧 Fixing access denied issue...');
  
  // Step 1: Clear ALL storage
  localStorage.clear();
  console.log('✅ Cleared old data');
  
  // Step 2: Create fresh admin account with correct role
  const adminUser = {
    id: 'admin-001',
    email: 'lewismwangi210@gmail.com',
    full_name: 'Lewis Mwangi',
    phone: '254712345678',
    role: 'admin', // ← This is the key!
    created_at: new Date().toISOString(),
    password: btoa('Lewis001!')
  };
  
  localStorage.setItem('rento_users', JSON.stringify([adminUser]));
  console.log('✅ Created admin account with role: admin');
  
  // Step 3: Create apartments
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
  console.log('✅ Loaded 6 apartments');
  
  // Step 4: Verify the fix
  const users = JSON.parse(localStorage.getItem('rento_users'));
  const admin = users[0];
  
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ FIX COMPLETE!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Admin Email:', admin.email);
  console.log('Admin Role:', admin.role);
  console.log('Password Set:', admin.password === btoa('Lewis001!') ? 'YES ✅' : 'NO ❌');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('📝 LOGIN CREDENTIALS:');
  console.log('   Email: lewismwangi210@gmail.com');
  console.log('   Password: Lewis001!');
  console.log('');
  console.log('🔗 Go to: http://localhost:8080/login?role=admin');
  console.log('');
  console.log('Page will reload in 3 seconds...');
  
  setTimeout(() => {
    location.reload();
  }, 3000);
})();
```

---

## 📝 After Page Reloads

1. **Go to:** http://localhost:8080/login?role=admin
2. **Click:** "Log in" (NOT "Sign up")
3. **Enter:**
   - Email: `lewismwangi210@gmail.com`
   - Password: `Lewis001!`
4. **Click:** "Log In"
5. **Success!** You should be in the admin dashboard

---

## 🔍 Why This Happened

The "Access denied" error occurs because:

1. **Login.tsx checks the user's role** when accessing admin portal
2. If `role !== 'admin'`, it logs you out and shows error
3. You may have created a user with the admin email but it got assigned `tenant` role

The script above:
- ✅ Clears all old users
- ✅ Creates fresh admin with `role: 'admin'`
- ✅ Ensures password is correct
- ✅ Reloads the page

---

## 🆘 Still Getting "Access Denied"?

Run this diagnostic in console:

```javascript
// Check current user data
const users = JSON.parse(localStorage.getItem('rento_users') || '[]');
const admin = users.find(u => u.email === 'lewismwangi210@gmail.com');

console.log('Admin user found:', !!admin);
console.log('Admin role:', admin?.role);
console.log('Expected role:', 'admin');
console.log('Role matches:', admin?.role === 'admin');

if (admin?.role !== 'admin') {
  console.error('❌ PROBLEM: User has wrong role!');
  console.log('Run the fix script above to correct this.');
}
```

---

## ⚠️ Important

- **Use "Log in"** button (not "Sign up") after running the script
- The admin account is already created by the script
- Password is `Lewis001!` with capital L and exclamation mark

---

**Just paste the fix script and wait for reload!** ⚡
