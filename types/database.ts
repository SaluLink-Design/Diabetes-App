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
      patients: {
        Row: {
          id: string
          full_name: string
          patient_id_number: string
          date_of_birth: string
          medical_aid_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          patient_id_number: string
          date_of_birth: string
          medical_aid_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          patient_id_number?: string
          date_of_birth?: string
          medical_aid_number?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      cases: {
        Row: {
          id: string
          patient_id: string
          patient_note: string
          detected_conditions: string[]
          confirmed_condition: string
          selected_icd_codes: Json
          selected_treatments: Json
          selected_medications: Json
          chronic_registration_note: string
          chronic_registration_notes: Json
          status: 'active' | 'completed' | 'archived'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          patient_note?: string
          detected_conditions?: string[]
          confirmed_condition?: string
          selected_icd_codes?: Json
          selected_treatments?: Json
          selected_medications?: Json
          chronic_registration_note?: string
          chronic_registration_notes?: Json
          status?: 'active' | 'completed' | 'archived'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          patient_note?: string
          detected_conditions?: string[]
          confirmed_condition?: string
          selected_icd_codes?: Json
          selected_treatments?: Json
          selected_medications?: Json
          chronic_registration_note?: string
          chronic_registration_notes?: Json
          status?: 'active' | 'completed' | 'archived'
          created_at?: string
          updated_at?: string
        }
      }
      ongoing_management_activities: {
        Row: {
          id: string
          case_id: string
          activity_type: 'specialist_visit' | 'diagnostic_test' | 'follow_up' | 'other'
          activity_date: string
          specialist_type: string | null
          clinical_notes: string
          attachments: Json
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          case_id: string
          activity_type: 'specialist_visit' | 'diagnostic_test' | 'follow_up' | 'other'
          activity_date: string
          specialist_type?: string | null
          clinical_notes?: string
          attachments?: Json
          created_at?: string
          created_by?: string
        }
        Update: {
          id?: string
          case_id?: string
          activity_type?: 'specialist_visit' | 'diagnostic_test' | 'follow_up' | 'other'
          activity_date?: string
          specialist_type?: string | null
          clinical_notes?: string
          attachments?: Json
          created_at?: string
          created_by?: string
        }
      }
      referral_letters: {
        Row: {
          id: string
          case_id: string
          patient_id: string
          specialist_type: string
          reason_for_referral: string
          urgency_level: 'routine' | 'urgent' | 'emergency'
          clinical_summary: string
          referral_document: Json
          status: 'pending' | 'sent' | 'completed' | 'cancelled'
          created_at: string
          sent_at: string | null
        }
        Insert: {
          id?: string
          case_id: string
          patient_id: string
          specialist_type: string
          reason_for_referral: string
          urgency_level?: 'routine' | 'urgent' | 'emergency'
          clinical_summary?: string
          referral_document?: Json
          status?: 'pending' | 'sent' | 'completed' | 'cancelled'
          created_at?: string
          sent_at?: string | null
        }
        Update: {
          id?: string
          case_id?: string
          patient_id?: string
          specialist_type?: string
          reason_for_referral?: string
          urgency_level?: 'routine' | 'urgent' | 'emergency'
          clinical_summary?: string
          referral_document?: Json
          status?: 'pending' | 'sent' | 'completed' | 'cancelled'
          created_at?: string
          sent_at?: string | null
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
