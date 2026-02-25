# Clear All Users from Local Storage

## 🗑️ Method 1: Browser Console (Recommended)

### Step 1: Open Browser Console
- Press **F12** (Windows/Linux) or **Cmd+Option+J** (Mac)
- Or right-click anywhere → "Inspect" → "Console" tab

### Step 2: Run This Command
Copy and paste this into the console and press Enter:

```javascript
localStorage.setItem('rento_users', '[]');
localStorage.removeItem('rento_current_user');
console.log('✅ All users cleared!');
location.reload();
```

### Step 3: Page Will Reload
The page will automatically refresh with no users in storage.

---

## 🗑️ Method 2: Clear All Data

To reset EVERYTHING (users, apartments, bookings, payments):

```javascript
localStorage.clear();
console.log('✅ All data cleared!');
location.reload();
```

**Note:** This will also remove the 6 sample apartments. They'll be recreated on next page load.

---

## 🗑️ Method 3: Clear Only Users (Keep Everything Else)

```javascript
localStorage.setItem('rento_users', '[]');
localStorage.removeItem('rento_current_user');
console.log('✅ Users cleared, apartments and bookings preserved!');
location.reload();
```

---

## 🔍 Check Current Users

To see what users are currently stored:

```javascript
const users = JSON.parse(localStorage.getItem('rento_users') || '[]');
console.log('Current users:', users);
```

---

## 🔄 What Happens After Clearing

1. **All user accounts deleted** - Including admin
2. **Current session cleared** - You'll be logged out
3. **Need to sign up again** - Create new admin account
4. **Apartments preserved** - Unless you used Method 2

---

## ✅ Verify Users Are Cleared

After running the clear command, check:

```javascript
const users = JSON.parse(localStorage.getItem('rento_users') || '[]');
console.log('User count:', users.length); // Should show: 0
```

---

## 🚀 Create Fresh Admin Account

After clearing users:

1. Go to: http://localhost:8080/login?role=admin
2. Click "Sign up"
3. Enter:
   - Email: gathaiyalewis1122@gmail.com
   - Password: Lewis001!
   - Name: Lewis Gathaiya
   - Phone: 254712345678
4. Click "Create Admin Account"
5. You're in with a fresh account! 🎉

---

## 📋 Quick Reference

### Clear Users Only
```javascript
localStorage.setItem('rento_users', '[]');
localStorage.removeItem('rento_current_user');
location.reload();
```

### Clear Everything
```javascript
localStorage.clear();
location.reload();
```

### View Current Users
```javascript
console.table(JSON.parse(localStorage.getItem('rento_users') || '[]'));
```

### View Current User (Logged In)
```javascript
console.log(JSON.parse(localStorage.getItem('rento_current_user') || 'null'));
```

---

## 🎯 Common Use Cases

### Reset Admin Password
1. Clear users (Method 1)
2. Sign up again with new password

### Remove Test Accounts
1. Clear users (Method 1)
2. Sign up only the accounts you need

### Start Fresh
1. Clear all data (Method 2)
2. Sign up as admin
3. Add properties
4. Create tenant accounts

---

## ⚠️ Important Notes

- **Data is browser-specific** - Clearing in Chrome doesn't affect Firefox
- **Incognito mode** - Has separate storage, won't affect normal browsing
- **No undo** - Once cleared, users are gone (need to sign up again)
- **Apartments safe** - Unless you use "Clear Everything" method

---

## 🆘 Troubleshooting

### "Can't find localStorage"
- Make sure you're on the app page (http://localhost:8080)
- Console must be open on the same tab

### "Command doesn't work"
- Copy the entire command
- Paste into console
- Press Enter
- Wait for confirmation message

### "Still see old users"
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Or close and reopen browser tab

---

**Users cleared! Now you can create fresh accounts.** 🎉
