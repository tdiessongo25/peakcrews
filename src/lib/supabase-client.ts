import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          user_type: 'client' | 'worker' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          user_type?: 'client' | 'worker' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          user_type?: 'client' | 'worker' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          client_id: string
          title: string
          description: string
          trade: string
          location: string
          budget_min: number | null
          budget_max: number | null
          urgency: 'low' | 'medium' | 'high' | 'urgent'
          status: 'open' | 'in_progress' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          title: string
          description: string
          trade: string
          location: string
          budget_min?: number | null
          budget_max?: number | null
          urgency?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'open' | 'in_progress' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          title?: string
          description?: string
          trade?: string
          location?: string
          budget_min?: number | null
          budget_max?: number | null
          urgency?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'open' | 'in_progress' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
      worker_profiles: {
        Row: {
          id: string
          user_id: string
          trade: string
          skills: string[] | null
          experience: string | null
          certifications: string[] | null
          availability: boolean
          location: string | null
          bio: string | null
          hourly_rate: number | null
          resume_url: string | null
          profile_status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          trade: string
          skills?: string[] | null
          experience?: string | null
          certifications?: string[] | null
          availability?: boolean
          location?: string | null
          bio?: string | null
          hourly_rate?: number | null
          resume_url?: string | null
          profile_status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          trade?: string
          skills?: string[] | null
          experience?: string | null
          certifications?: string[] | null
          availability?: boolean
          location?: string | null
          bio?: string | null
          hourly_rate?: number | null
          resume_url?: string | null
          profile_status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          job_id: string
          worker_id: string
          proposal: string
          bid_amount: number | null
          status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_id: string
          worker_id: string
          proposal: string
          bid_amount?: number | null
          status?: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          worker_id?: string
          proposal?: string
          bid_amount?: number | null
          status?: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          job_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment: string | null
          category: 'communication' | 'quality' | 'timeliness' | 'professionalism' | 'overall'
          created_at: string
        }
        Insert: {
          id?: string
          job_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment?: string | null
          category?: 'communication' | 'quality' | 'timeliness' | 'professionalism' | 'overall'
          created_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          reviewer_id?: string
          reviewee_id?: string
          rating?: number
          comment?: string | null
          category?: 'communication' | 'quality' | 'timeliness' | 'professionalism' | 'overall'
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          job_id: string
          client_id: string
          worker_id: string
          amount: number
          stripe_payment_intent_id: string | null
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_id: string
          client_id: string
          worker_id: string
          amount: number
          stripe_payment_intent_id?: string | null
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          client_id?: string
          worker_id?: string
          amount?: number
          stripe_payment_intent_id?: string | null
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'job_application' | 'payment' | 'review' | 'system' | 'message'
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: 'job_application' | 'payment' | 'review' | 'system' | 'message'
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'job_application' | 'payment' | 'review' | 'system' | 'message'
          read?: boolean
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          job_id: string
          sender_id: string
          receiver_id: string
          content: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          job_id: string
          sender_id: string
          receiver_id: string
          content: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          sender_id?: string
          receiver_id?: string
          content?: string
          read?: boolean
          created_at?: string
        }
      }
    }
  }
}

// Helper functions
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}
