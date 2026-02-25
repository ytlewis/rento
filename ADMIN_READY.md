# ✅ Admin Account Ready!

## 🎉 Pre-configured Admin Account

Your admin account is now pre-configured and ready to use!

---

## 🔑 Admin Credentials

- **Email:** `lewismwangi210@gmail.com`
- **Password:** `Lewis001!`

---

## 🚀 Login in 3 Steps

### Step 1: Reset Storage (One Time)

Open browser console (Press **F12**) and paste:

```javascript
localStorage.clear();
location.reload();
```

### Step 2: Go to Admin Login

http://localhost:8080/login?role=admin

### Step 3: Enter Credentials

- Email: `lewismwangi210@gmail.com`
- Password: `Lewis001!`

**Click "Log In"** and you're in! ✅

---

## 📝 Important Notes

### Password Format:
- ✅ Current: `Lewis001!`
- Capital L
- Exclamation mark at end
- Exactly: `Lewis001!`

### Pre-configured:
- Admin account created automatically
- No signup needed
- Just login directly

---

## 🔄 If You Need to Reset

Run this in console to recreate admin account:

```javascript
localStorage.clear();
const admin = {
  id: 'admin-001',
  email: 'gathaiyalewis1122@gmail.com',
  full_name: 'Lewis Gathaiya',
  phone: '254712345678',
  role: 'admin',
  created_at: new Date().toISOString(),
  password: btoa('Lewis001!')
};
localStorage.setItem('rento_users', JSON.stringify([admin]));
location.reload();
```

---

## ✅ Quick Test

After resetting, verify admin exists:

```javascript
const users = JSON.parse(localStorage.getItem('rento_users') || '[]');
console.log('Admin account:', users.find(u => u.role === 'admin'));
```

---

## 🎯 Summary

✅ **Email:** lewismwangi210@gmail.com
✅ **Password:** Lewis001!
✅ **Pre-configured:** Ready immediately
✅ **No signup:** Just login

---

## 🔗 Quick Links

- **Admin Login:** http://localhost:8080/login?role=admin
- **Reset Script:** See RESET_WITH_ADMIN.md

---

**Just clear storage once and login with the new password!** 🚀
