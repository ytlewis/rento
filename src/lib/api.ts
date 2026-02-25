import { supabase } from '@/integrations/supabase/client';
import type { Apartment, Booking, Payment, AdminAccount, Withdrawal } from './types';

// Apartments API
export const getApartments = async (status?: string) => {
  let query = supabase.from('apartments').select('*').order('created_at', { ascending: false });
  
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data as Apartment[];
};

export const getApartment = async (id: string) => {
  const { data, error } = await supabase
    .from('apartments')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Apartment;
};

export const createApartment = async (apartment: Omit<Apartment, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('apartments')
    .insert(apartment)
    .select()
    .single();
  
  if (error) throw error;
  return data as Apartment;
};

export const updateApartment = async (id: string, updates: Partial<Apartment>) => {
  const { data, error } = await supabase
    .from('apartments')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Apartment;
};

export const deleteApartment = async (id: string) => {
  const { error } = await supabase
    .from('apartments')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Bookings API
export const getBookings = async (tenantId?: string) => {
  let query = supabase
    .from('bookings')
    .select(`
      *,
      apartment:apartments(*),
      tenant:profiles(*)
    `)
    .order('created_at', { ascending: false });
  
  if (tenantId) {
    query = query.eq('tenant_id', tenantId);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data as Booking[];
};

export const createBooking = async (booking: Omit<Booking, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
  const { data, error } = await supabase
    .from('bookings')
    .insert({ ...booking, status: 'pending' })
    .select()
    .single();
  
  if (error) throw error;
  return data as Booking;
};

export const updateBooking = async (id: string, updates: Partial<Booking>) => {
  const { data, error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Booking;
};

// Payments API
export const getPayments = async (tenantId?: string) => {
  let query = supabase
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (tenantId) {
    query = query.eq('tenant_id', tenantId);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data as Payment[];
};

export const createPayment = async (payment: Omit<Payment, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('payments')
    .insert(payment)
    .select()
    .single();
  
  if (error) throw error;
  return data as Payment;
};

export const updatePayment = async (id: string, updates: Partial<Payment>) => {
  const { data, error } = await supabase
    .from('payments')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Payment;
};

// Admin Accounts API
export const getAdminAccounts = async (adminId: string) => {
  const { data, error } = await supabase
    .from('admin_accounts')
    .select('*')
    .eq('admin_id', adminId)
    .order('is_primary', { ascending: false });
  
  if (error) throw error;
  return data as AdminAccount[];
};

export const createAdminAccount = async (account: Omit<AdminAccount, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('admin_accounts')
    .insert(account)
    .select()
    .single();
  
  if (error) throw error;
  return data as AdminAccount;
};

// Withdrawals API
export const getWithdrawals = async (adminId: string) => {
  const { data, error } = await supabase
    .from('withdrawals')
    .select('*')
    .eq('admin_id', adminId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Withdrawal[];
};

export const createWithdrawal = async (withdrawal: Omit<Withdrawal, 'id' | 'created_at' | 'completed_at'>) => {
  const { data, error } = await supabase
    .from('withdrawals')
    .insert(withdrawal)
    .select()
    .single();
  
  if (error) throw error;
  return data as Withdrawal;
};

// Real-time subscriptions
export const subscribeToApartments = (callback: (payload: any) => void) => {
  return supabase
    .channel('apartments-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'apartments' }, callback)
    .subscribe();
};

export const subscribeToBookings = (callback: (payload: any) => void) => {
  return supabase
    .channel('bookings-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, callback)
    .subscribe();
};

export const subscribeToPayments = (callback: (payload: any) => void) => {
  return supabase
    .channel('payments-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, callback)
    .subscribe();
};
