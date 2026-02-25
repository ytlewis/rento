# 🚀 GitHub Setup & Deployment Guide

## Step 1: Prepare Your Repository

### Clean Up Unnecessary Files

Before pushing to GitHub, remove documentation files that were for development only:

```bash
# Remove temporary documentation (optional)
rm -f ACCESS_DENIED_SOLUTION.txt
rm -f ADMIN_LOGIN_GUIDE.md
rm -f ADMIN_READY.md
rm -f ADMIN_SIGNUP_ENABLED.md
rm -f APP_NOT_LOADING_FIX.md
rm -f BECOME_ADMIN_NOW.txt
rm -f CLEAN_AND_FIX_ADMIN.md
rm -f CLEAR_PENDING_BOOKINGS.md
rm -f CLEAR_PENDING_NOW.txt
rm -f CLEAR_USERS.md
rm -f COMPLETE_SOLUTION.md
rm -f DEBUG_LOGIN.md
rm -f DELETE_PENDING_BOOKINGS.md
rm -f DIAGNOSE_AND_FIX.md
rm -f DUPLICATE_REMOVED.md
rm -f FAVICON_UPDATED.md
rm -f FINAL_FIX.md
rm -f FINAL_SOLUTION.md
rm -f FIX_ACCESS_DENIED.md
rm -f FIX_ADMIN_NOW.txt
rm -f FIX_PASSWORD.md
rm -f FRESH_START.md
rm -f INSTANT_FIX.md
rm -f NO_DATABASE_SETUP.md
rm -f ONE_CLICK_FIX.md
rm -f REMOVE_DUPLICATE_USER.md
rm -f REMOVE_OLD_PENDING_BOOKINGS.txt
rm -f RESET_WITH_ADMIN.md
rm -f SECURITY_UPDATE.md
rm -f SETUP_CHECKLIST.txt
rm -f SIMPLE_FIX_NOW.txt
rm -f STEP_BY_STEP.md
rm -f ULTIMATE_FIX.md
```

### Keep These Important Files
- ✅ README.md
- ✅ LICENSE
- ✅ .gitignore
- ✅ MPESA_INTEGRATION_REALITY.md
- ✅ SEO_KEYWORDS_RESEARCH.md
- ✅ WEBMASTER_SETUP_GUIDE.md
- ✅ CURRENT_SITUATION_EXPLAINED.md
- ✅ CLEAR_ALL_USERS_NOW.md
- ✅ QUICK_FIXES.md

---

## Step 2: Initialize Git Repository

```bash
# Navigate to project directory
cd rent-control-main

# Initialize git (if not already initialized)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: RENTO - Modern Rental Management System"
```

---

## Step 3: Create GitHub Repository

### Option A: Via GitHub Website

1. Go to https://github.com/new
2. Fill in repository details:
   - **Repository name:** `rento` or `rental-management-system`
   - **Description:** Modern rental management platform with M-Pesa integration
   - **Visibility:** Public (or Private)
   - **Initialize:** Don't initialize with README (you already have one)
3. Click "Create repository"

### Option B: Via GitHub CLI

```bash
# Install GitHub CLI if not installed
# Windows: winget install GitHub.cli
# Mac: brew install gh
# Linux: See https://cli.github.com/

# Login to GitHub
gh auth login

# Create repository
gh repo create rento --public --source=. --remote=origin --push
```

---

## Step 4: Connect Local to GitHub

```bash
# Add remote origin (replace with your username)
git remote add origin https://github.com/yourusername/rento.git

# Verify remote
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 5: Configure Repository Settings

### On GitHub Website:

1. **About Section** (right sidebar)
   - Description: "Modern rental management platform with M-Pesa integration 🏠"
   - Website: Your deployed URL
   - Topics: `rental-management`, `property-management`, `react`, `typescript`, `tailwind`, `mpesa`, `kenya`, `real-estate`

2. **Repository Settings**
   - Enable Issues
   - Enable Discussions (optional)
   - Enable Wiki (optional)

3. **Branch Protection** (Settings → Branches)
   - Protect `main` branch
   - Require pull request reviews
   - Require status checks

---

## Step 6: Add License

Create `LICENSE` file:

```bash
# MIT License (recommended for open source)
cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2026 Lewis Mwangi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF

git add LICENSE
git commit -m "Add MIT License"
git push
```

---

## Step 7: Create GitHub Actions (CI/CD)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      if: github.ref == 'refs/heads/main'
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

---

## Step 8: Deploy to Vercel (Recommended)

### Via Vercel Website:

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "New Project"
4. Import your `rento` repository
5. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Click "Deploy"

### Via Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

---

## Step 9: Deploy to Netlify (Alternative)

### Via Netlify Website:

1. Go to https://netlify.com
2. Sign in with GitHub
3. Click "Add new site" → "Import an existing project"
4. Choose GitHub and select your repository
5. Configure:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Click "Deploy site"

### Via Netlify CLI:

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

---

## Step 10: Update URLs After Deployment

Once deployed, update these files with your actual domain:

### 1. index.html
```html
<!-- Replace yourdomain.com with actual domain -->
<link rel="canonical" href="https://your-actual-domain.com/" />
<meta property="og:url" content="https://your-actual-domain.com/" />
```

### 2. public/sitemap.xml
```xml
<!-- Replace all yourdomain.com -->
<loc>https://your-actual-domain.com/</loc>
```

### 3. public/robots.txt
```txt
Sitemap: https://your-actual-domain.com/sitemap.xml
```

### 4. README.md
Update demo URL and screenshots

---

## Step 11: Set Up Custom Domain (Optional)

### On Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

### On Netlify:
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Update DNS records
4. Enable HTTPS (automatic)

---

## Step 12: Configure Environment Variables

### On Vercel:
1. Go to Project Settings → Environment Variables
2. Add variables:
   ```
   VITE_MPESA_CONSUMER_KEY=your_key
   VITE_MPESA_CONSUMER_SECRET=your_secret
   ```
3. Redeploy

### On Netlify:
1. Go to Site Settings → Environment Variables
2. Add same variables
3. Trigger new deploy

---

## Step 13: Set Up Monitoring

### Vercel Analytics (Free)
1. Go to Project → Analytics
2. Enable Analytics
3. View real-time data

### Google Analytics
1. Get tracking ID from https://analytics.google.com
2. Add to `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## Step 14: Create Release

```bash
# Tag version
git tag -a v1.0.0 -m "Release version 1.0.0"

# Push tag
git push origin v1.0.0
```

On GitHub:
1. Go to Releases
2. Click "Create a new release"
3. Choose tag v1.0.0
4. Title: "RENTO v1.0.0 - Initial Release"
5. Description: List features and changes
6. Publish release

---

## Step 15: Add Badges to README

Add these to top of README.md:

```markdown
[![Deploy](https://github.com/yourusername/rento/actions/workflows/deploy.yml/badge.svg)](https://github.com/yourusername/rento/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vercel.com)
```

---

## Maintenance Workflow

### Daily:
```bash
# Pull latest changes
git pull origin main

# Make changes
# ... edit files ...

# Commit and push
git add .
git commit -m "Description of changes"
git push origin main
```

### For Features:
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push branch
git push origin feature/new-feature

# Create Pull Request on GitHub
# Merge after review
```

---

## Troubleshooting

### Push Rejected
```bash
# Pull first
git pull origin main --rebase

# Then push
git push origin main
```

### Large Files Error
```bash
# Remove large files from history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/large/file" \
  --prune-empty --tag-name-filter cat -- --all
```

### Reset to Remote
```bash
# Discard local changes
git fetch origin
git reset --hard origin/main
```

---

## Security Checklist

Before pushing:
- [ ] No API keys in code
- [ ] No passwords in code
- [ ] .env in .gitignore
- [ ] Sensitive data removed
- [ ] Dependencies updated
- [ ] Security vulnerabilities fixed

---

## Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] All pages accessible
- [ ] Forms work
- [ ] Payments simulate correctly
- [ ] Mobile responsive
- [ ] SEO meta tags present
- [ ] Sitemap accessible
- [ ] Robots.txt accessible
- [ ] SSL certificate active
- [ ] Analytics tracking
- [ ] Error monitoring set up

---

## Useful Commands

```bash
# Check status
git status

# View commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# View differences
git diff

# Create branch
git checkout -b branch-name

# Switch branch
git checkout branch-name

# Delete branch
git branch -d branch-name

# View remotes
git remote -v

# Update from remote
git fetch origin
git merge origin/main
```

---

## Resources

- **GitHub Docs:** https://docs.github.com
- **Vercel Docs:** https://vercel.com/docs
- **Netlify Docs:** https://docs.netlify.com
- **Git Docs:** https://git-scm.com/doc

---

**Your repository is now ready for GitHub! 🎉**

Next steps:
1. Push to GitHub
2. Deploy to Vercel/Netlify
3. Set up custom domain
4. Configure webmaster tools
5. Start promoting your app!
