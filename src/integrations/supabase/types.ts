export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          role: 'admin' | 'tenant'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          role?: 'admin' | 'tenant'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          role?: 'admin' | 'tenant'
          created_at?: string
          updated_at?: string
        }
      }
      apartments: {
        Row: {
          id: string
          name: string
          description: string | null
          address: string
          bedrooms: number
          bathrooms: number
          price: number
          image_url: string | null
          status: 'available' | 'occupied' | 'maintenance'
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          address: string
          bedrooms: number
          bathrooms: number
          price: number
          image_url?: string | null
          status?: 'available' | 'occupied' | 'maintenance'
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          address?: string
          bedrooms?: number
          bathrooms?: number
          price?: number
          image_url?: string | null
          status?: 'available' | 'occupied' | 'maintenance'
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          apartment_id: string
          tenant_id: string
          status: 'pending' | 'confirmed' | 'cancelled'
          lease_start: string
          lease_end: string | null
          monthly_rent: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          apartment_id: string
          tenant_id: string
          status?: 'pending' | 'confirmed' | 'cancelled'
          lease_start: string
          lease_end?: string | null
          monthly_rent: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          apartment_id?: string
          tenant_id?: string
          status?: 'pending' | 'confirmed' | 'cancelled'
          lease_start?: string
          lease_end?: string | null
          monthly_rent?: number
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          booking_id: string
          tenant_id: string
          amount: number
          payment_method: 'mpesa' | 'card'
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          transaction_id: string | null
          mpesa_receipt: string | null
          payment_date: string | null
          period_month: string
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          tenant_id: string
          amount: number
          payment_method: 'mpesa' | 'card'
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          transaction_id?: string | null
          mpesa_receipt?: string | null
          payment_date?: string | null
          period_month: string
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          tenant_id?: string
          amount?: number
          payment_method?: 'mpesa' | 'card'
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          transaction_id?: string | null
          mpesa_receipt?: string | null
          payment_date?: string | null
          period_month?: string
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      admin_accounts: {
        Row: {
          id: string
          admin_id: string
          account_name: string
          account_number: string
          bank_name: string
          mpesa_number: string | null
          is_primary: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          admin_id: string
          account_name: string
          account_number: string
          bank_name: string
          mpesa_number?: string | null
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          admin_id?: string
          account_name?: string
          account_number?: string
          bank_name?: string
          mpesa_number?: string | null
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      withdrawals: {
        Row: {
          id: string
          admin_id: string
          amount: number
          account_id: string
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          transaction_id: string | null
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          admin_id: string
          amount: number
          account_id: string
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          transaction_id?: string | null
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          admin_id?: string
          amount?: number
          account_id?: string
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          transaction_id?: string | null
          created_at?: string
          completed_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'tenant'
      booking_status: 'pending' | 'confirmed' | 'cancelled'
      payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
      payment_method: 'mpesa' | 'card'
      apartment_status: 'available' | 'occupied' | 'maintenance'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
