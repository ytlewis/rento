# ⚡ INSTANT FIX - Copy & Paste This!

## 🔧 Run This in Browser Console (F12)

Copy this ENTIRE script and paste it in the browser console:

```javascript
// COMPLETE RESET WITH WORKING ADMIN ACCOUNT
(function instantFix() {
  console.log('🔧 Starting instant fix...');
  
  // Clear everything
  localStorage.clear();
  
  // Create admin account with correct password
  const adminUser = {
    id: 'admin-001',
    email: 'lewismwangi210@gmail.com',
    full_name: 'Lewis Mwangi',
    phone: '254712345678',
    role: 'admin',
    created_at: new Date().toISOString(),
    password: btoa('Lewis001!') // Base64 encoded password
  };
  
  // Save admin user
  localStorage.setItem('rento_users', JSON.stringify([adminUser]));
  
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
  
  console.log('✅ Storage reset complete!');
  console.log('✅ Admin account created!');
  console.log('✅ 6 apartments loaded!');
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📝 ADMIN LOGIN CREDENTIALS:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Email: lewismwangi210@gmail.com');
  console.log('Password: Lewis001!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
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

2. **Enter EXACTLY:**
   - Email: `lewismwangi210@gmail.com`
   - Password: `Lewis001!`

3. **Click "Log In"**

4. **You're in!** ✅

---

## ✅ This Script:

- ✅ Clears ALL old data
- ✅ Creates fresh admin account
- ✅ Sets password to `Lewis001!`
- ✅ Loads 6 apartments
- ✅ Initializes empty bookings/payments
- ✅ Reloads page automatically

---

## 🔍 Verify It Worked

After reload, check in console:

```javascript
const users = JSON.parse(localStorage.getItem('rento_users'));
console.log('Admin user:', users[0]);
console.log('Password (encoded):', users[0].password);
console.log('Expected (encoded):', btoa('Lewis001!'));
console.log('Match:', users[0].password === btoa('Lewis001!'));
```

---

## ⚠️ IMPORTANT

Type the password EXACTLY as shown:
- `Lewis001!`
- Capital L
- Exclamation mark at the end
- No spaces

---

**Just paste the script above and wait for reload!** ⚡
