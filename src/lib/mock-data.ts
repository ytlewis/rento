export interface Apartment {
  id: string;
  name: string;
  address: string;
  bedrooms: number;
  price: number;
  image: string;
  status: 'available' | 'occupied' | 'maintenance';
  description: string;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  apartmentId: string | null;
  leaseStart: string | null;
  status: 'housed' | 'not_housed';
}

export interface Payment {
  id: string;
  tenantName: string;
  apartment: string;
  amount: number;
  month: string;
  year: number;
  status: 'paid' | 'pending' | 'overdue';
  method: 'card' | 'cash' | 'bank';
  date: string;
}

export const mockApartments: Apartment[] = [
  {
    id: '1',
    name: 'Sunset Suite A1',
    address: '123 Palm Avenue, Downtown',
    bedrooms: 2,
    price: 1200,
    image: 'apt-1',
    status: 'available',
    description: 'Spacious 2-bedroom with panoramic city views and modern finishes.',
  },
  {
    id: '2',
    name: 'Harbor View B3',
    address: '45 Marina Drive, Waterfront',
    bedrooms: 3,
    price: 1800,
    image: 'apt-2',
    status: 'available',
    description: 'Luxury 3-bedroom apartment overlooking the harbor with premium amenities.',
  },
  {
    id: '3',
    name: 'Garden Studio C1',
    address: '78 Green Lane, Midtown',
    bedrooms: 1,
    price: 850,
    image: 'apt-3',
    status: 'available',
    description: 'Cozy studio perfect for professionals, with garden access.',
  },
  {
    id: '4',
    name: 'Skyline Penthouse D1',
    address: '200 High Street, Uptown',
    bedrooms: 3,
    price: 2500,
    image: 'apt-1',
    status: 'occupied',
    description: 'Premium penthouse with rooftop terrace and 360° views.',
  },
  {
    id: '5',
    name: 'Oak Residence E2',
    address: '55 Oak Boulevard, Eastside',
    bedrooms: 2,
    price: 1400,
    image: 'apt-2',
    status: 'available',
    description: 'Modern 2-bedroom in a quiet neighborhood with parking included.',
  },
  {
    id: '6',
    name: 'Central Loft F1',
    address: '10 Main Street, City Center',
    bedrooms: 1,
    price: 950,
    image: 'apt-3',
    status: 'maintenance',
    description: 'Trendy loft-style apartment in the heart of the city.',
  },
];

export const mockPayments: Payment[] = [
  { id: '1', tenantName: 'Sarah Johnson', apartment: 'Skyline Penthouse D1', amount: 2500, month: 'February', year: 2026, status: 'paid', method: 'card', date: '2026-02-01' },
  { id: '2', tenantName: 'Mike Chen', apartment: 'Sunset Suite A1', amount: 1200, month: 'February', year: 2026, status: 'pending', method: 'card', date: '2026-02-15' },
  { id: '3', tenantName: 'Sarah Johnson', apartment: 'Skyline Penthouse D1', amount: 2500, month: 'January', year: 2026, status: 'paid', method: 'bank', date: '2026-01-03' },
  { id: '4', tenantName: 'Emma Wilson', apartment: 'Oak Residence E2', amount: 1400, month: 'February', year: 2026, status: 'overdue', method: 'cash', date: '2026-02-01' },
  { id: '5', tenantName: 'Mike Chen', apartment: 'Sunset Suite A1', amount: 1200, month: 'January', year: 2026, status: 'paid', method: 'card', date: '2026-01-05' },
];

export const mockTenants: Tenant[] = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah@email.com', phone: '+1234567890', apartmentId: '4', leaseStart: '2025-06-01', status: 'housed' },
  { id: '2', name: 'Mike Chen', email: 'mike@email.com', phone: '+1234567891', apartmentId: '1', leaseStart: '2025-09-01', status: 'housed' },
  { id: '3', name: 'Emma Wilson', email: 'emma@email.com', phone: '+1234567892', apartmentId: '5', leaseStart: '2025-11-01', status: 'housed' },
  { id: '4', name: 'James Brown', email: 'james@email.com', phone: '+1234567893', apartmentId: null, leaseStart: null, status: 'not_housed' },
];

export const dashboardStats = {
  totalTenants: 3,
  availableUnits: 3,
  monthlyCollections: 2500,
  totalRevenue: 18700,
};

export const monthlyRevenue = [
  { month: 'Sep', amount: 4900 },
  { month: 'Oct', amount: 4900 },
  { month: 'Nov', amount: 6300 },
  { month: 'Dec', amount: 6300 },
  { month: 'Jan', amount: 6300 },
  { month: 'Feb', amount: 2500 },
];
