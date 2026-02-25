// Local Storage Authentication System
// This replaces Supabase Auth for immediate functionality

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: 'admin' | 'tenant';
  created_at: string;
}

export interface Apartment {
  id: string;
  name: string;
  description: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  price: number;
  image_url: string;
  status: 'available' | 'occupied' | 'maintenance';
  created_at: string;
}

export interface Booking {
  id: string;
  apartment_id: string;
  tenant_id: string;
  status: 'pending_approval' | 'pending_payment' | 'confirmed' | 'cancelled' | 'rejected';
  lease_start: string;
  lease_end?: string;
  monthly_rent: number;
  created_at: string;
  approved_at?: string;
  approved_by?: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  tenant_id: string;
  amount: number;
  payment_method: 'mpesa' | 'card';
  status: 'pending' | 'completed' | 'failed';
  transaction_id?: string;
  mpesa_receipt?: string;
  payment_date?: string;
  period_month: string;
  created_at: string;
  admin_account_id?: string; // Which admin account received the payment
}

export interface AdminPaymentAccount {
  id: string;
  admin_id: string;
  account_type: 'mpesa' | 'bank';
  mpesa_phone?: string;
  bank_name?: string;
  account_number?: string;
  account_name?: string;
  is_default: boolean;
  created_at: string;
}

// Storage keys
const STORAGE_KEYS = {
  USERS: 'rento_users',
  CURRENT_USER: 'rento_current_user',
  APARTMENTS: 'rento_apartments',
  BOOKINGS: 'rento_bookings',
  PAYMENTS: 'rento_payments',
  ADMIN_ACCOUNTS: 'rento_admin_payment_accounts',
};

// Initialize default data
export const initializeStorage = () => {
  // Initialize users with pre-configured admin account
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const defaultUsers: (User & { password: string })[] = [
      {
        id: 'admin-001',
        email: 'lewismwangi210@gmail.com',
        full_name: 'Lewis Mwangi',
        phone: '254712345678',
        role: 'admin',
        created_at: new Date().toISOString(),
        password: btoa('Lewis001!'), // Pre-configured password
      },
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  }

  // Initialize apartments if not exists
  if (!localStorage.getItem(STORAGE_KEYS.APARTMENTS)) {
    const defaultApartments: Apartment[] = [
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
        created_at: new Date().toISOString(),
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
        created_at: new Date().toISOString(),
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
        created_at: new Date().toISOString(),
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
        created_at: new Date().toISOString(),
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
        created_at: new Date().toISOString(),
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
        created_at: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.APARTMENTS, JSON.stringify(defaultApartments));
  }

  // Initialize bookings if not exists
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify([]));
  }

  // Initialize payments if not exists
  if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify([]));
  }

  // Initialize admin payment accounts if not exists
  if (!localStorage.getItem(STORAGE_KEYS.ADMIN_ACCOUNTS)) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_ACCOUNTS, JSON.stringify([]));
  }
};

// User Management
export const getUsers = (): User[] => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

// Apartments Management
export const getApartments = (): Apartment[] => {
  const apartments = localStorage.getItem(STORAGE_KEYS.APARTMENTS);
  return apartments ? JSON.parse(apartments) : [];
};

export const saveApartments = (apartments: Apartment[]) => {
  localStorage.setItem(STORAGE_KEYS.APARTMENTS, JSON.stringify(apartments));
};

// Bookings Management
export const getBookings = (): Booking[] => {
  const bookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
  return bookings ? JSON.parse(bookings) : [];
};

export const saveBookings = (bookings: Booking[]) => {
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
};

// Payments Management
export const getPayments = (): Payment[] => {
  const payments = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
  return payments ? JSON.parse(payments) : [];
};

export const savePayments = (payments: Payment[]) => {
  localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
};

// Admin Payment Accounts Management
export const getAdminPaymentAccounts = (): AdminPaymentAccount[] => {
  const accounts = localStorage.getItem(STORAGE_KEYS.ADMIN_ACCOUNTS);
  return accounts ? JSON.parse(accounts) : [];
};

export const saveAdminPaymentAccounts = (accounts: AdminPaymentAccount[]) => {
  localStorage.setItem(STORAGE_KEYS.ADMIN_ACCOUNTS, JSON.stringify(accounts));
};

export const getDefaultAdminAccount = (): AdminPaymentAccount | null => {
  const accounts = getAdminPaymentAccounts();
  return accounts.find(a => a.is_default) || accounts[0] || null;
};

// Generate unique ID
export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Clear all user data (useful for reset)
export const clearAllUsers = () => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  console.log('All users cleared from storage');
};

// Remove duplicate users with the same email (keep only the admin one)
export const removeDuplicateUsers = (email: string) => {
  const users = getUsers() as any[];
  
  // Find all users with this email
  const duplicates = users.filter(u => u.email === email);
  
  if (duplicates.length <= 1) {
    console.log('No duplicates found for', email);
    return;
  }
  
  // Keep only the admin user, remove others
  const adminUser = duplicates.find(u => u.role === 'admin');
  const otherUsers = users.filter(u => u.email !== email);
  
  if (adminUser) {
    const cleanedUsers = [...otherUsers, adminUser];
    saveUsers(cleanedUsers);
    console.log(`Removed ${duplicates.length - 1} duplicate(s) for ${email}, kept admin account`);
  } else {
    // No admin found, keep the first one and make it admin
    const firstUser = duplicates[0];
    firstUser.role = 'admin';
    const cleanedUsers = [...otherUsers, firstUser];
    saveUsers(cleanedUsers);
    console.log(`Removed ${duplicates.length - 1} duplicate(s) for ${email}, promoted first to admin`);
  }
  
  // If current user was a duplicate, log them out
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.email === email && currentUser.role !== 'admin') {
    setCurrentUser(null);
    console.log('Logged out duplicate user');
  }
};

// Remove all non-admin users with admin email
export const cleanAdminEmail = () => {
  const adminEmail = 'lewismwangi210@gmail.com';
  removeDuplicateUsers(adminEmail);
};

// Reset entire application data
export const resetAllData = () => {
  localStorage.clear();
  initializeStorage();
  console.log('All data reset to defaults');
};

// Clear pending approval bookings
export const clearPendingBookings = () => {
  const bookings = getBookings();
  const filtered = bookings.filter(b => b.status !== 'pending_approval');
  saveBookings(filtered);
  const removedCount = bookings.length - filtered.length;
  console.log(`Cleared ${removedCount} pending approval bookings`);
  return removedCount;
};

// Clear bookings by status
export const clearBookingsByStatus = (status: Booking['status']) => {
  const bookings = getBookings();
  const filtered = bookings.filter(b => b.status !== status);
  saveBookings(filtered);
  const removedCount = bookings.length - filtered.length;
  console.log(`Cleared ${removedCount} bookings with status: ${status}`);
  return removedCount;
};
