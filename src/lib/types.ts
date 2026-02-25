export type UserRole = 'admin' | 'tenant';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'mpesa' | 'card';
export type ApartmentStatus = 'available' | 'occupied' | 'maintenance';

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Apartment {
  id: string;
  name: string;
  description?: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  price: number;
  image_url?: string;
  status: ApartmentStatus;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  apartment_id: string;
  tenant_id: string;
  status: BookingStatus;
  lease_start: string;
  lease_end?: string;
  monthly_rent: number;
  created_at: string;
  updated_at: string;
  apartment?: Apartment;
  tenant?: Profile;
}

export interface Payment {
  id: string;
  booking_id: string;
  tenant_id: string;
  amount: number;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  transaction_id?: string;
  mpesa_receipt?: string;
  payment_date?: string;
  period_month: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface AdminAccount {
  id: string;
  admin_id: string;
  account_name: string;
  account_number: string;
  bank_name: string;
  mpesa_number?: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface Withdrawal {
  id: string;
  admin_id: string;
  amount: number;
  account_id: string;
  status: PaymentStatus;
  transaction_id?: string;
  created_at: string;
  completed_at?: string;
}
