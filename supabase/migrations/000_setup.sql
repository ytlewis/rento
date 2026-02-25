-- RENTO Database Setup
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/lvkweqqialyykgqxmxmo/sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'tenant');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM ('mpesa', 'card');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE apartment_status AS ENUM ('available', 'occupied', 'maintenance');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Drop existing tables if they exist (be careful in production!)
DROP TABLE IF EXISTS withdrawals CASCADE;
DROP TABLE IF EXISTS admin_accounts CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS apartments CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role user_role DEFAULT 'tenant',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Apartments table
CREATE TABLE apartments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  status apartment_status DEFAULT 'available',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  apartment_id UUID REFERENCES apartments(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status booking_status DEFAULT 'pending',
  lease_start DATE NOT NULL,
  lease_end DATE,
  monthly_rent DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_method payment_method NOT NULL,
  status payment_status DEFAULT 'pending',
  transaction_id TEXT,
  mpesa_receipt TEXT,
  payment_date TIMESTAMPTZ,
  period_month TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin bank accounts table
CREATE TABLE admin_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  account_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  mpesa_number TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Withdrawals table
CREATE TABLE withdrawals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  account_id UUID REFERENCES admin_accounts(id),
  status payment_status DEFAULT 'pending',
  transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Create indexes
CREATE INDEX idx_apartments_status ON apartments(status);
CREATE INDEX idx_bookings_tenant ON bookings(tenant_id);
CREATE INDEX idx_bookings_apartment ON bookings(apartment_id);
CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_tenant ON payments(tenant_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE apartments ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for apartments
CREATE POLICY "Anyone can view apartments" ON apartments FOR SELECT USING (true);
CREATE POLICY "Admins can insert apartments" ON apartments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update apartments" ON apartments FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete apartments" ON apartments FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for bookings
CREATE POLICY "Tenants can view own bookings" ON bookings FOR SELECT USING (tenant_id = auth.uid());
CREATE POLICY "Admins can view all bookings" ON bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Tenants can create bookings" ON bookings FOR INSERT WITH CHECK (tenant_id = auth.uid());
CREATE POLICY "Admins can update bookings" ON bookings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for payments
CREATE POLICY "Tenants can view own payments" ON payments FOR SELECT USING (tenant_id = auth.uid());
CREATE POLICY "Admins can view all payments" ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Tenants can create payments" ON payments FOR INSERT WITH CHECK (tenant_id = auth.uid());
CREATE POLICY "Admins can update payments" ON payments FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for admin accounts
CREATE POLICY "Admins can manage own accounts" ON admin_accounts FOR ALL USING (admin_id = auth.uid());

-- RLS Policies for withdrawals
CREATE POLICY "Admins can manage own withdrawals" ON withdrawals FOR ALL USING (admin_id = auth.uid());

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_apartments_updated_at BEFORE UPDATE ON apartments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    CASE 
      WHEN NEW.email = 'gathaiyalewis1122@gmail.com' THEN 'admin'::user_role
      ELSE 'tenant'::user_role
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update apartment status when booked
CREATE OR REPLACE FUNCTION update_apartment_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' THEN
    UPDATE apartments SET status = 'occupied' WHERE id = NEW.apartment_id;
  ELSIF OLD.status = 'confirmed' AND NEW.status = 'cancelled' THEN
    UPDATE apartments SET status = 'available' WHERE id = NEW.apartment_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS booking_status_trigger ON bookings;

CREATE TRIGGER booking_status_trigger
  AFTER INSERT OR UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_apartment_status();

-- Insert sample apartments
INSERT INTO apartments (name, description, address, bedrooms, bathrooms, price, image_url, status) VALUES
('Skyline Penthouse', 'Luxurious penthouse with panoramic city views, modern finishes, and premium amenities.', '123 Downtown Avenue, City Center', 3, 2, 2500, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', 'available'),
('Harbor View Loft', 'Spacious waterfront loft with floor-to-ceiling windows and industrial-chic design.', '45 Marina Drive, Waterfront', 2, 2, 1800, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'available'),
('Garden Oasis Studio', 'Cozy studio apartment with private garden access, perfect for young professionals.', '78 Green Street, Suburb', 1, 1, 1200, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 'available'),
('Metropolitan Suite', 'Contemporary 2-bedroom suite in the heart of downtown with gym access and rooftop pool.', '200 Main Street, Downtown', 2, 1, 1950, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 'available'),
('Riverside Retreat', 'Peaceful 3-bedroom home with river views and private parking.', '56 River Road, Riverside', 3, 2, 2200, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', 'available'),
('Urban Nest', 'Modern 1-bedroom apartment with open floor plan and high-end appliances.', '89 Urban Plaza, Midtown', 1, 1, 1500, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'available');

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Database setup complete! Tables created and sample data inserted.';
  RAISE NOTICE 'Next: Disable email confirmation in Authentication > Settings';
  RAISE NOTICE 'Then create admin user: gathaiyalewis1122@gmail.com';
END $$;
