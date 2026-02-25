# Fix Invalid Password Issue

## 🔍 Check What's Wrong

Open browser console (F12) and run this to see all users:

```javascript
const users = JSON.parse(localStorage.getItem('rento_users') || '[]');
console.table(users);
```

This will show you all users and their roles.

---

## 🔧 Quick Fix - Reset Admin Password

### Option 1: Delete Admin User and Sign Up Fresh

```javascript
// Remove all users with admin email
const users = JSON.parse(localStorage.getItem('rento_users') || '[]');
const cleanedUsers = users.filter(u => u.email !== 'gathaiyalewis1122@gmail.com');
localStorage.setItem('rento_users', JSON.stringify(cleanedUsers));
localStorage.removeItem('rento_current_user');
console.log('✅ Admin user removed. Now sign up fresh!');
location.reload();
```

**Then:**
1. Go to: http://localhost:8080/login?role=admin
2. Click "Sign up"
3. Create new admin account with password: `Lewis001!`

---

### Option 2: Update Existing Admin Password

```javascript
// Update admin password to Lewis001!
const users = JSON.parse(localStorage.getItem('rento_users') || '[]');
const adminUser = users.find(u => u.email === 'gathaiyalewis1122@gmail.com');

if (adminUser) {
  // Update password (base64 encoded)
  adminUser.password = btoa('Lewis001!');
  localStorage.setItem('rento_users', JSON.stringify(users));
  console.log('✅ Admin password updated to: Lewis001!');
  location.reload();
} else {
  console.log('❌ No admin user found');
}
```

---

### Option 3: Clear Everything and Start Fresh

```javascript
// Nuclear option - clear all users
localStorage.setItem('rento_users', '[]');
localStorage.removeItem('rento_current_user');
console.log('✅ All users cleared!');
location.reload();
```

**Then create admin account from scratch.**

---

## 🎯 Step-by-Step Fix

### Step 1: Open Console
Press **F12** to open browser console

### Step 2: Check Current Users
```javascript
const users = JSON.parse(localStorage.getItem('rento_users') || '[]');
console.log('Total users:', users.length);
console.table(users.map(u => ({ email: u.email, role: u.role })));
```

### Step 3: Choose Your Fix

**If you see admin user with wrong password:**
→ Use Option 2 (Update Password)

**If you see multiple users with admin email:**
→ Use Option 1 (Delete and Sign Up Fresh)

**If you want to start completely fresh:**
→ Use Option 3 (Clear Everything)

---

## 🔐 Verify Password After Fix

After running any fix, test login:

1. Go to: http://localhost:8080/login?role=admin
2. Email: `gathaiyalewis1122@gmail.com`
3. Password: `Lewis001!`
4. Should work! ✅

---

## 🆘 Still Not Working?

### Check Password Encoding

```javascript
// Check how password is stored
const users = JSON.parse(localStorage.getItem('rento_users') || '[]');
const adminUser = users.find(u => u.email === 'gathaiyalewis1122@gmail.com');

if (adminUser) {
  console.log('Stored password (encoded):', adminUser.password);
  console.log('Expected password (encoded):', btoa('Lewis001!'));
  console.log('Match:', adminUser.password === btoa('Lewis001!'));
}
```

### Manually Set Correct Password

```javascript
// Force set the correct password
const users = JSON.parse(localStorage.getItem('rento_users') || '[]');
const adminIndex = users.findIndex(u => u.email === 'gathaiyalewis1122@gmail.com');

if (adminIndex !== -1) {
  users[adminIndex].password = btoa('Lewis001!');
  users[adminIndex].role = 'admin';
  localStorage.setItem('rento_users', JSON.stringify(users));
  console.log('✅ Password forcefully updated!');
  location.reload();
}
```

---

## 📋 Complete Reset Script

If nothing works, use this complete reset:

```javascript
// Complete reset and create fresh admin
(function resetAdmin() {
  // Clear all users
  localStorage.setItem('rento_users', '[]');
  localStorage.removeItem('rento_current_user');
  
  console.log('✅ Storage cleared');
  console.log('📝 Now go to: http://localhost:8080/login?role=admin');
  console.log('📝 Click "Sign up"');
  console.log('📝 Email: gathaiyalewis1122@gmail.com');
  console.log('📝 Password: Lewis001!');
  
  location.reload();
})();
```

---

## 🎯 Recommended Solution

**Best approach:**

1. **Clear admin user:**
```javascript
const users = JSON.parse(localStorage.getItem('rento_users') || '[]');
const cleanedUsers = users.filter(u => u.email !== 'gathaiyalewis1122@gmail.com');
localStorage.setItem('rento_users', JSON.stringify(cleanedUsers));
localStorage.removeItem('rento_current_user');
location.reload();
```

2. **Sign up fresh:**
- Go to: http://localhost:8080/login?role=admin
- Click "Sign up"
- Email: `gathaiyalewis1122@gmail.com`
- Password: `Lewis001!`
- Name: Lewis Gathaiya
- Phone: 254712345678

This ensures a clean admin account with the correct password.

---

## ✅ Verification

After fixing, verify it works:

```javascript
// Test login credentials
const users = JSON.parse(localStorage.getItem('rento_users') || '[]');
const adminUser = users.find(u => u.email === 'gathaiyalewis1122@gmail.com');

if (adminUser) {
  const testPassword = 'Lewis001!';
  const isValid = btoa(testPassword) === adminUser.password;
  console.log('Admin user exists:', !!adminUser);
  console.log('Role is admin:', adminUser.role === 'admin');
  console.log('Password is correct:', isValid);
  
  if (isValid) {
    console.log('✅ Everything looks good! Try logging in.');
  } else {
    console.log('❌ Password mismatch. Run Option 2 to fix.');
  }
} else {
  console.log('❌ No admin user found. Run Option 1 to create one.');
}
```

---

## 🔑 Password Requirements

The password **must be exactly:**
- `Lewis001!`
- Capital L
- Capital L at position 6
- Exclamation mark at end
- No spaces

---

**Run the recommended solution above to fix the password issue!** 🔧
