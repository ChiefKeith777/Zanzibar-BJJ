export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string; email: string; name: string | null; phone: string | null
          role: 'pending' | 'member' | 'coach' | 'admin'; location: string | null
          program: string | null; emergency: string | null
          joined_date: string | null; created_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      members: {
        Row: {
          id: string; fee_amount: number; due_date: string | null
          status: 'active' | 'due' | 'overdue' | 'suspended'
          belt: string; stripes: number; sessions_this_month: number; updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['members']['Row']> & { id: string }
        Update: Partial<Database['public']['Tables']['members']['Row']>
      }
      attendance: {
        Row: {
          id: string; member_id: string; class_date: string
          location: string | null; class_type: string | null; created_at: string
        }
        Insert: Omit<Database['public']['Tables']['attendance']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['attendance']['Insert']>
      }
      payments: {
        Row: {
          id: string; member_id: string; amount: number; method: string | null
          paid_date: string | null; status: 'paid' | 'pending' | 'failed'; created_at: string
        }
        Insert: Omit<Database['public']['Tables']['payments']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['payments']['Insert']>
      }
      curriculum: {
        Row: {
          id: string; program: 'fundamentals' | 'kids' | 'competition'
          week: number; theme: string; points: string[]; video_url: string | null
          updated_at: string; updated_by: string | null
        }
        Insert: Omit<Database['public']['Tables']['curriculum']['Row'], 'id' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['curriculum']['Insert']>
      }
      site_content: {
        Row: { key: string; value: string | null; updated_at: string; updated_by: string | null }
        Insert: Omit<Database['public']['Tables']['site_content']['Row'], 'updated_at'>
        Update: Partial<Database['public']['Tables']['site_content']['Insert']>
      }
      schedule: {
        Row: {
          id: string; location: string; day: string; time: string
          class_type: string; program: string | null; updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['schedule']['Row'], 'id' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['schedule']['Insert']>
      }
      bookings: {
        Row: {
          id: string; name: string; phone: string; location: string | null
          program: string | null; kid_name: string | null; kid_age: string | null
          kid_exp: string | null; news_opt_in: boolean
          status: 'new' | 'contacted' | 'enrolled' | 'declined'
          notes: string | null; created_at: string
        }
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>
      }
      beach_signups: {
        Row: { id: string; name: string; phone: string; created_at: string }
        Insert: Omit<Database['public']['Tables']['beach_signups']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['beach_signups']['Insert']>
      }
      notification_log: {
        Row: {
          id: string; channel: string | null; text: string | null
          member_id: string | null; sent_at: string
        }
        Insert: Omit<Database['public']['Tables']['notification_log']['Row'], 'id' | 'sent_at'>
        Update: never
      }
      alert_rules: {
        Row: {
          id: string; trigger_key: string; label: string; note: string | null
          email_enabled: boolean; wa_enabled: boolean; tone: string
        }
        Insert: Omit<Database['public']['Tables']['alert_rules']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['alert_rules']['Insert']>
      }
    }
  }
}

export type Profile     = Database['public']['Tables']['profiles']['Row']
export type Member      = Database['public']['Tables']['members']['Row']
export type Attendance  = Database['public']['Tables']['attendance']['Row']
export type Payment     = Database['public']['Tables']['payments']['Row']
export type Curriculum  = Database['public']['Tables']['curriculum']['Row']
export type SiteContent = Database['public']['Tables']['site_content']['Row']
export type Schedule    = Database['public']['Tables']['schedule']['Row']
export type Booking     = Database['public']['Tables']['bookings']['Row']
export type AlertRule   = Database['public']['Tables']['alert_rules']['Row']
