# 🏠 RENTO - Modern Rental Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

A modern, full-featured rental management platform built with React, TypeScript, and Tailwind CSS. RENTO streamlines property management, tenant bookings, and rent payments with M-Pesa integration.

![RENTO Banner](https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=400&fit=crop)

---

## ✨ Features

### For Tenants
- 🏘️ **Browse Properties** - Explore premium apartments with detailed information
- 📅 **Easy Booking** - Request bookings with instant status updates
- 💳 **Multiple Payment Methods** - Pay rent via M-Pesa or credit/debit cards
- 💾 **Save Payment Methods** - Store M-Pesa numbers and cards for quick payments
- 📊 **Personal Dashboard** - Track bookings, payments, and lease information
- ✅ **Booking Management** - Cancel pending requests, view approval status
- 🏆 **Room Ownership** - Clear indication when you own a room

### For Property Owners/Admins
- 🏢 **Property Management** - Add, edit, and manage rental properties
- 👥 **Tenant Management** - View and manage all tenants
- ✔️ **Booking Approvals** - Approve or reject booking requests
- 📈 **Booking Monitor** - Track all bookings with status filters
- 💰 **Payment Accounts** - Set up M-Pesa and bank accounts for receiving payments
- 📊 **Analytics Dashboard** - Monitor occupancy, revenue, and bookings
- 🔄 **Auto-Rejection** - Automatically reject other pending bookings when one is paid

### Technical Features
- 🎨 **Modern UI/UX** - Beautiful, responsive design with Tailwind CSS
- 🌙 **Dark Mode Ready** - Prepared for dark theme implementation
- 📱 **Mobile Responsive** - Works perfectly on all devices
- ⚡ **Fast Performance** - Optimized with Vite and React
- 🔒 **Secure Authentication** - Role-based access control (Admin/Tenant)
- 💾 **LocalStorage Backend** - Immediate functionality without server setup
- 🎭 **Smooth Animations** - Framer Motion for delightful interactions
- 🎯 **Type Safety** - Full TypeScript implementation

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- Modern web browser

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/rento.git
cd rento

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun run dev
```

Visit `http://localhost:5173` to see the app.


---

## 📁 Project Structure

```
rento/
├── public/                 # Static assets
│   ├── favicon.svg        # App icon
│   ├── robots.txt         # SEO crawler rules
│   ├── sitemap.xml        # Site structure for search engines
│   ├── privacy-policy.html
│   └── terms-of-service.html
├── src/
│   ├── components/        # React components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── PaymentDialog.tsx
│   │   ├── PaymentMethods.tsx
│   │   ├── BookingApprovals.tsx
│   │   ├── BookingMonitor.tsx
│   │   ├── TenantManagement.tsx
│   │   └── AdminPaymentAccounts.tsx
│   ├── pages/            # Page components
│   │   ├── Index.tsx     # Homepage
│   │   ├── Login.tsx     # Authentication
│   │   ├── AdminDashboard.tsx
│   │   ├── TenantDashboard.tsx
│   │   ├── About.tsx
│   │   └── Contact.tsx
│   ├── lib/              # Utilities and logic
│   │   ├── localStorage.ts  # Data management
│   │   ├── localAuth.ts     # Authentication
│   │   ├── api.ts           # API helpers
│   │   └── types.ts         # TypeScript types
│   └── main.tsx          # App entry point
├── index.html            # HTML template with SEO meta tags
├── tailwind.config.ts    # Tailwind configuration
├── vite.config.ts        # Vite configuration
└── package.json          # Dependencies
```

---

## 🎯 Usage

### For Tenants

1. **Sign Up**
   - Click "Get Started" or "Sign In"
   - Create account with email and password
   - Automatically logged in as tenant

2. **Browse Properties**
   - View available apartments on homepage
   - See details: bedrooms, bathrooms, price, location
   - Click "Book Now" to request booking

3. **Make Booking**
   - Select lease start date
   - Submit booking request
   - Wait for admin approval

4. **Pay Rent**
   - Once approved, status changes to "Pending Payment"
   - Click "Pay Now"
   - Choose M-Pesa or Card payment
   - Complete payment
   - Room ownership confirmed!

### For Admins

1. **Login**
   - Use admin credentials
   - Access admin dashboard

2. **Manage Properties**
   - Add new apartments
   - Edit existing properties
   - Update availability status

3. **Approve Bookings**
   - Review pending booking requests
   - Approve or reject with one click
   - Approved bookings move to "Pending Payment"

4. **Set Up Payment Accounts**
   - Add M-Pesa number or bank account
   - Set default payment method
   - Receive payments from tenants

5. **Monitor Activity**
   - Track all bookings and their status
   - View tenant information
   - Monitor payment history

---

## 🔧 Configuration

### Environment Variables

Create `.env` file (optional for future backend integration):

```env
# M-Pesa Configuration (for future integration)
VITE_MPESA_CONSUMER_KEY=your_key
VITE_MPESA_CONSUMER_SECRET=your_secret
VITE_MPESA_SHORTCODE=your_shortcode
VITE_MPESA_PASSKEY=your_passkey

# API Configuration
VITE_API_URL=http://localhost:3001
```

### SEO Configuration

Update these in `index.html`:
- Replace `yourdomain.com` with your actual domain
- Add Google verification code
- Add Bing verification code
- Update social media image URLs

---

## 📱 M-Pesa Integration

### Current Status
The app currently **simulates** M-Pesa payments for demonstration purposes.

### For Real M-Pesa Integration
See `MPESA_INTEGRATION_REALITY.md` for complete setup guide.

**Requirements:**
1. Backend server (Node.js/Python/PHP)
2. Safaricom Daraja API credentials
3. Public HTTPS domain
4. Business registration

**Alternative:** Use payment gateway like Pesapal or Flutterwave (easier setup).

---

## 🎨 Customization

### Colors
Edit `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: '#2563eb',  // Change primary color
      secondary: '#8b5cf6', // Change secondary color
    }
  }
}
```

### Branding
- Replace logo in `src/components/Navbar.tsx`
- Update favicon in `public/favicon.svg`
- Modify app name in `index.html`

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Build
npm run build

# Deploy dist/ folder to Netlify
```

### GitHub Pages

```bash
# Build
npm run build

# Deploy to gh-pages branch
npm run deploy
```

---

## 📊 SEO & Analytics

### Included SEO Features
- ✅ Meta tags for search engines
- ✅ Open Graph tags for social media
- ✅ Twitter Card tags
- ✅ Structured data (Schema.org)
- ✅ Sitemap.xml
- ✅ Robots.txt
- ✅ Canonical URLs

### Setup Webmaster Tools
See `WEBMASTER_SETUP_GUIDE.md` for:
- Google Search Console setup
- Bing Webmaster Tools setup
- Analytics integration
- Performance monitoring

### Keywords Research
See `SEO_KEYWORDS_RESEARCH.md` for:
- Primary keywords
- Long-tail keywords
- Local SEO strategy
- Content ideas

---

## 🛠️ Tech Stack

- **Frontend:** React 18.3.1
- **Language:** TypeScript 5.6.2
- **Styling:** Tailwind CSS 3.4.1
- **UI Components:** shadcn/ui
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Build Tool:** Vite 5.4.2
- **Routing:** React Router 6.26.2
- **Forms:** React Hook Form
- **Notifications:** Sonner

---

## 📝 Documentation

- **[Privacy Policy](public/privacy-policy.html)** - Data handling and privacy
- **[Terms of Service](public/terms-of-service.html)** - Usage terms
- **[M-Pesa Integration Guide](MPESA_INTEGRATION_REALITY.md)** - Real payment setup
- **[SEO Keywords Research](SEO_KEYWORDS_RESEARCH.md)** - SEO strategy
- **[Webmaster Setup](WEBMASTER_SETUP_GUIDE.md)** - Search engine setup
- **[Current Situation](CURRENT_SITUATION_EXPLAINED.md)** - What works & what doesn't

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Lewis Mwangi**
- Email: gathaiyalewis1122@gmail.com
- Phone: +254 702320995
- Location: Nairobi, Kenya

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide Icons](https://lucide.dev/) - Beautiful icon set
- [Unsplash](https://unsplash.com/) - High-quality images

---

## 📞 Support

For support, email lewismwangi210@gmail.com or create an issue in the repository.

---

## 🗺️ Roadmap

- [ ] Real M-Pesa API integration
- [ ] Backend server with database
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Advanced search and filters
- [ ] Property reviews and ratings
- [ ] Maintenance request system
- [ ] Document management
- [ ] Multi-language support
- [ ] Mobile app (React Native)

---

## ⚠️ Important Notes

1. **Payment Simulation:** Current version simulates payments. See M-Pesa integration guide for real implementation.
2. **Data Storage:** Uses localStorage. Data is stored locally on user's device.
3. **Production Ready:** UI/UX is production-ready. Backend integration needed for real deployment.

---

**Made with ❤️ in Kenya** 🇰🇪

---

## 📸 Screenshots

### Homepage
![Homepage](https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800)

### Tenant Dashboard
![Dashboard](https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800)

### Admin Panel
![Admin](https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800)

---

**Star ⭐ this repo if you find it helpful!**
