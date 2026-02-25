# 🔄 Reset Storage with Pre-configured Admin

## ⚡ One Command Fix

Open browser console (Press **F12**) and paste this:

```javascript
// Reset storage with pre-configured admin account
localStorage.clear();
console.log('✅ Storage cleared!');
console.log('✅ Creating admin account...');

// Create admin account with new password
const adminUser = {
  id: 'admin-001',
  email: 'gathaiyalewis1122@gmail.com',
  full_name: 'Lewis Gathaiya',
  phone: '254712345678',
  role: 'admin',
  created_at: new Date().toISOString(),
  password: btoa('Admin001')
};

localStorage.setItem('rento_users', JSON.stringify([adminUser]));

// Initialize apartments
const apartments = [
  {
    id: 'apt-001',
    name: 'Skyline Penthouse',
    description: 'Luxurious penthouse with panoramic city views, modern finishes, and premium amenities.',
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
    description: 'Spacious waterfront loft with floor-to-ceiling windows and industrial-chic design.',
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
    description: 'Cozy studio apartment with private garden access, perfect for young professionals.',
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
    description: 'Contemporary 2-bedroom suite in the heart of downtown with gym access and rooftop pool.',
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
    description: 'Peaceful 3-bedroom home with river views and private parking.',
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
    description: 'Modern 1-bedroom apartment with open floor plan and high-end appliances.',
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

console.log('✅ Admin account created!');
console.log('✅ 6 apartments loaded!');
console.log('');
console.log('📝 ADMIN CREDENTIALS:');
console.log('   Email: gathaiyalewis1122@gmail.com');
console.log('   Password: Admin001');
console.log('');
console.log('🔗 Login at: http://localhost:8080/login?role=admin');
console.log('');
console.log('Reloading in 2 seconds...');

setTimeout(() => location.reload(), 2000);
```

**That's it!** Admin account is ready to use.

---

## 🔑 New Admin Credentials

- **Email:** `gathaiyalewis1122@gmail.com`
- **Password:** `Admin001`

---

## 🚀 Login Now

1. **Go to:** http://localhost:8080/login?role=admin
2. **Enter:**
   - Email: `gathaiyalewis1122@gmail.com`
   - Password: `Admin001`
3. **Click:** "Log In"
4. **Done!** You're in the admin dashboard ✅

---

## ✅ What This Does

- ✅ Clears all old data
- ✅ Creates admin account with password: `Admin001`
- ✅ Loads 6 sample apartments
- ✅ Initializes empty bookings and payments
- ✅ Ready to use immediately

---

## 🔍 Verify Admin Account

After running the script, check:

```javascript
const users = JSON.parse(localStorage.getItem('rento_users') || '[]');
const admin = users.find(u => u.email === 'gathaiyalewis1122@gmail.com');
console.log('Admin exists:', !!admin);
console.log('Admin role:', admin?.role);
console.log('Password set:', !!admin?.password);
```

---

## 📝 Summary

✅ **Email:** gathaiyalewis1122@gmail.com
✅ **Password:** Admin001 (capital A, no special characters)
✅ **Pre-configured:** Ready to login immediately
✅ **No signup needed:** Just login directly

---

**Run the script above and login with the new credentials!** 🎉
