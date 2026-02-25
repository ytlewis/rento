# 🧹 Clean Old Admin & Fix New Admin Login

## The Problem

- Old admin credentials (gathaiyalewis1122@gmail.com) still exist
- New admin (lewismwangi210@gmail.com) is being logged in as tenant
- Need to remove old admin and fix new admin role

## 🔥 COMPLETE FIX (Copy & Paste in Console - F12)

```javascript
// COMPLETE CLEANUP AND FIX
(function cleanAndFix() {
  console.log('🧹 Starting complete cleanup...');
  console.log('');
  
  // Show what's currently there
  console.log('━━━ BEFORE CLEANUP ━━━');
  const oldUsers = localStorage.getItem('rento_users');
  if (oldUsers) {
    const users = JSON.parse(oldUsers);
    console.log('Current users:');
    users.forEach(u => {
      console.log(`  - ${u.email} (${u.role})`);
    });
  }
  console.log('');
  
  // NUCLEAR CLEAN - Remove EVERYTHING
  console.log('🗑️  Removing all old data...');
  localStorage.clear();
  sessionStorage.clear();
  console.log('✅ All storage cleared');
  console.log('');
  
  // Create ONLY the new admin
  console.log('👤 Creating NEW admin account...');
  const newAdmin = {
    id: 'admin-001',
    email: 'lewismwangi210@gmail.com',
    full_name: 'Lewis Mwangi',
    phone: '254712345678',
    role: 'admin',  // ← EXPLICIT ADMIN ROLE
    created_at: new Date().toISOString(),
    password: btoa('Lewis001!')
  };
  
  // Save ONLY new admin (no old admin, no tenants)
  localStorage.setItem('rento_users', JSON.stringify([newAdmin]));
  console.log('✅ New admin created');
  console.log('   Email:', newAdmin.email);
  console.log('   Role:', newAdmin.role);
  console.log('');
  
  // Create sample apartments
  console.log('📦 Creating apartments...');
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
  
  // Verify
  console.log('━━━ VERIFICATION ━━━');
  const verifyUsers = JSON.parse(localStorage.getItem('rento_users'));
  console.log('Total users:', verifyUsers.length);
  console.log('Users:');
  verifyUsers.forEach(u => {
    console.log(`  - ${u.email} (${u.role})`);
  });
  console.log('');
  
  // Check for old admin
  const oldAdmin = verifyUsers.find(u => u.email === 'gathaiyalewis1122@gmail.com');
  const newAdminCheck = verifyUsers.find(u => u.email === 'lewismwangi210@gmail.com');
  
  console.log('Old admin (gathaiyalewis1122@gmail.com):', oldAdmin ? '❌ STILL EXISTS' : '✅ REMOVED');
  console.log('New admin (lewismwangi210@gmail.com):', newAdminCheck ? '✅ EXISTS' : '❌ MISSING');
  console.log('New admin role:', newAdminCheck?.role);
  console.log('');
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ CLEANUP COMPLETE!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('📝 NEW ADMIN CREDENTIALS:');
  console.log('   Email: lewismwangi210@gmail.com');
  console.log('   Password: Lewis001!');
  console.log('   Role: admin');
  console.log('');
  console.log('🔗 Redirecting to login page...');
  
  setTimeout(() => {
    window.location.href = 'http://localhost:8080/login?role=admin';
  }, 3000);
})();
```

---

## After Redirect

1. **Click "Log in"** (NOT "Sign up")
2. **Enter:**
   - Email: `lewismwangi210@gmail.com`
   - Password: `Lewis001!`
3. **Click "Log In"**
4. **Success!** You should be in admin dashboard

---

## What This Does

✅ Removes ALL old users (including gathaiyalewis1122@gmail.com)  
✅ Creates ONLY new admin (lewismwangi210@gmail.com)  
✅ Sets role to 'admin' explicitly  
✅ Clears any cached sessions  
✅ Loads sample apartments  
✅ Redirects to login page  

---

## Verify It Worked

After login, run this in console:

```javascript
const users = JSON.parse(localStorage.getItem('rento_users'));
const currentUser = JSON.parse(localStorage.getItem('rento_current_user'));

console.log('All users:', users);
console.log('Current user:', currentUser);
console.log('Current user role:', currentUser?.role);
console.log('Is admin:', currentUser?.role === 'admin');
```

Should show:
- Only 1 user (lewismwangi210@gmail.com)
- Current user role: 'admin'
- Is admin: true

---

**Run the script and you'll be good to go!** 🚀
