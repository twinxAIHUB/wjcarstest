export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      featured_vehicles: {
        Row: {
          id: string
          title: string
          description: string
          price: number
          image_url: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          price: number
          image_url: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: number
          image_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      website_stats: {
        Row: {
          id: string
          visitor_count: number
          vehicles_sold: number
          last_updated: string
        }
        Insert: {
          id?: string
          visitor_count?: number
          vehicles_sold?: number
          last_updated?: string
        }
        Update: {
          id?: string
          visitor_count?: number
          vehicles_sold?: number
          last_updated?: string
        }
      }
      admin_settings: {
        Row: {
          id: string
          admin_id: string
          email: string
          last_password_change: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          admin_id: string
          email: string
          last_password_change?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          admin_id?: string
          email?: string
          last_password_change?: string
          created_at?: string
          updated_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          email: string
          is_super_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          is_super_admin: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          is_super_admin?: boolean
          created_at?: string
          updated_at?: string
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
      [_ in never]: never
    }
  }
} 