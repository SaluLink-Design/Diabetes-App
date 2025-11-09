/*
  # Patient Case Management System Schema

  ## Overview
  This migration creates the core tables for a patient-centric medical case management system
  with support for chronic disease treatment protocols, ongoing management, and referrals.

  ## New Tables

  ### 1. patients
  Core patient information table storing all patient identification details.
  - `id` (uuid, primary key) - Unique patient identifier
  - `full_name` (text) - Patient's complete legal name
  - `patient_id_number` (text, unique) - National ID or medical record number
  - `date_of_birth` (date) - Patient's date of birth
  - `medical_aid_number` (text) - Medical insurance/aid membership number
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. cases
  Medical cases linked to patients, storing clinical documentation and treatment information.
  - `id` (uuid, primary key) - Unique case identifier
  - `patient_id` (uuid, foreign key) - References patients table
  - `patient_note` (text) - Original clinical note/chief complaint
  - `detected_conditions` (text[]) - Array of AI-detected conditions
  - `confirmed_condition` (text) - Doctor-confirmed primary condition
  - `selected_icd_codes` (jsonb) - Array of selected ICD-10 codes with descriptions
  - `selected_treatments` (jsonb) - Array of selected treatment protocols from baskets
  - `selected_medications` (jsonb) - Array of prescribed medications
  - `chronic_registration_note` (text) - Legacy field for backward compatibility
  - `chronic_registration_notes` (jsonb) - Array of medication-specific registration notes
  - `status` (text) - Case status: 'active', 'completed', 'archived'
  - `created_at` (timestamptz) - Case creation date
  - `updated_at` (timestamptz) - Last modification date

  ### 3. ongoing_management_activities
  Tracks ongoing care activities for chronic conditions including specialist visits and tests.
  - `id` (uuid, primary key) - Unique activity identifier
  - `case_id` (uuid, foreign key) - References cases table
  - `activity_type` (text) - Type: 'specialist_visit', 'diagnostic_test', 'follow_up'
  - `activity_date` (date) - Date of activity
  - `specialist_type` (text) - Type of specialist (if applicable)
  - `clinical_notes` (text) - Notes from the activity
  - `attachments` (jsonb) - Array of file attachments (URLs, metadata)
  - `created_at` (timestamptz) - Record creation timestamp
  - `created_by` (text) - Doctor/user who created the activity

  ### 4. referral_letters
  Stores specialist referral letters generated for patients.
  - `id` (uuid, primary key) - Unique referral identifier
  - `case_id` (uuid, foreign key) - References cases table
  - `patient_id` (uuid, foreign key) - References patients table
  - `specialist_type` (text) - Type of specialist being referred to
  - `reason_for_referral` (text) - Clinical reason for referral
  - `urgency_level` (text) - Urgency: 'routine', 'urgent', 'emergency'
  - `clinical_summary` (text) - Summary of relevant clinical information
  - `referral_document` (jsonb) - Complete referral letter content and metadata
  - `status` (text) - Referral status: 'pending', 'sent', 'completed'
  - `created_at` (timestamptz) - Referral creation date
  - `sent_at` (timestamptz) - Date referral was sent

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Policies restrict access to authenticated users only
  - Future enhancement: policies based on doctor-patient relationships

  ## Indexes
  - Patient ID number for fast patient lookup
  - Case patient_id for efficient patient case retrieval
  - Case status for filtering active/completed cases
  - Ongoing management case_id for activity history
  - Referral case_id and patient_id for tracking

  ## Notes
  - All tables use UUIDs for primary keys
  - JSONB used for flexible nested data structures
  - Timestamps include timezone information
  - Text arrays used for simple list data
*/

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  patient_id_number text UNIQUE NOT NULL,
  date_of_birth date NOT NULL,
  medical_aid_number text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for patient lookup
CREATE INDEX IF NOT EXISTS idx_patients_id_number ON patients(patient_id_number);
CREATE INDEX IF NOT EXISTS idx_patients_full_name ON patients(full_name);

-- Create cases table
CREATE TABLE IF NOT EXISTS cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  patient_note text NOT NULL DEFAULT '',
  detected_conditions text[] DEFAULT '{}',
  confirmed_condition text DEFAULT '',
  selected_icd_codes jsonb DEFAULT '[]',
  selected_treatments jsonb DEFAULT '[]',
  selected_medications jsonb DEFAULT '[]',
  chronic_registration_note text DEFAULT '',
  chronic_registration_notes jsonb DEFAULT '[]',
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for cases
CREATE INDEX IF NOT EXISTS idx_cases_patient_id ON cases(patient_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_created_at ON cases(created_at DESC);

-- Create ongoing_management_activities table
CREATE TABLE IF NOT EXISTS ongoing_management_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  activity_type text NOT NULL CHECK (activity_type IN ('specialist_visit', 'diagnostic_test', 'follow_up', 'other')),
  activity_date date NOT NULL,
  specialist_type text,
  clinical_notes text NOT NULL DEFAULT '',
  attachments jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  created_by text DEFAULT ''
);

-- Create index for ongoing management activities
CREATE INDEX IF NOT EXISTS idx_ongoing_mgmt_case_id ON ongoing_management_activities(case_id);
CREATE INDEX IF NOT EXISTS idx_ongoing_mgmt_activity_date ON ongoing_management_activities(activity_date DESC);

-- Create referral_letters table
CREATE TABLE IF NOT EXISTS referral_letters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  specialist_type text NOT NULL,
  reason_for_referral text NOT NULL,
  urgency_level text DEFAULT 'routine' CHECK (urgency_level IN ('routine', 'urgent', 'emergency')),
  clinical_summary text NOT NULL DEFAULT '',
  referral_document jsonb DEFAULT '{}',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  sent_at timestamptz
);

-- Create indexes for referral letters
CREATE INDEX IF NOT EXISTS idx_referrals_case_id ON referral_letters(case_id);
CREATE INDEX IF NOT EXISTS idx_referrals_patient_id ON referral_letters(patient_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referral_letters(status);

-- Enable Row Level Security
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE ongoing_management_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_letters ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for patients table
CREATE POLICY "Authenticated users can view all patients"
  ON patients FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert patients"
  ON patients FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update patients"
  ON patients FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete patients"
  ON patients FOR DELETE
  TO authenticated
  USING (true);

-- Create RLS Policies for cases table
CREATE POLICY "Authenticated users can view all cases"
  ON cases FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert cases"
  ON cases FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update cases"
  ON cases FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete cases"
  ON cases FOR DELETE
  TO authenticated
  USING (true);

-- Create RLS Policies for ongoing_management_activities table
CREATE POLICY "Authenticated users can view all ongoing management activities"
  ON ongoing_management_activities FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert ongoing management activities"
  ON ongoing_management_activities FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update ongoing management activities"
  ON ongoing_management_activities FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete ongoing management activities"
  ON ongoing_management_activities FOR DELETE
  TO authenticated
  USING (true);

-- Create RLS Policies for referral_letters table
CREATE POLICY "Authenticated users can view all referral letters"
  ON referral_letters FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert referral letters"
  ON referral_letters FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update referral letters"
  ON referral_letters FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete referral letters"
  ON referral_letters FOR DELETE
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cases_updated_at
  BEFORE UPDATE ON cases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
