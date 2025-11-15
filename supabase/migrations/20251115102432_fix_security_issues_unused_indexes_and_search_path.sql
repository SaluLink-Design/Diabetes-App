/*
  # Fix Security Issues - Remove Unused Indexes and Fix Function Search Path

  1. Security Fixes
    - Remove unused indexes that are not being utilized by queries
    - Fix function search_path to be immutable for security

  2. Changes
    - Drop index `idx_cases_patient_id` (unused - already covered by foreign key)
    - Drop index `idx_cases_status` (unused - low cardinality column)
    - Drop index `idx_ongoing_mgmt_activity_date` (unused)
    - Drop index `idx_referrals_patient_id` (unused - already covered by foreign key)
    - Drop index `idx_referrals_status` (unused - low cardinality column)
    - Recreate function `update_updated_at_column` with immutable search_path

  3. Important Notes
    - These indexes are being removed because they are not used by current queries
    - If query patterns change in the future, indexes can be recreated as needed
    - The function search_path fix prevents potential SQL injection vulnerabilities
*/

-- Drop unused indexes
DROP INDEX IF EXISTS idx_cases_patient_id;
DROP INDEX IF EXISTS idx_cases_status;
DROP INDEX IF EXISTS idx_ongoing_mgmt_activity_date;
DROP INDEX IF EXISTS idx_referrals_patient_id;
DROP INDEX IF EXISTS idx_referrals_status;

-- Fix function search_path to be immutable for security
-- This prevents SQL injection attacks through search_path manipulation
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate triggers that were dropped with CASCADE
DO $$
BEGIN
  -- Check and recreate trigger for patients table
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_patients_updated_at'
  ) THEN
    CREATE TRIGGER update_patients_updated_at
      BEFORE UPDATE ON patients
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  -- Check and recreate trigger for cases table
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_cases_updated_at'
  ) THEN
    CREATE TRIGGER update_cases_updated_at
      BEFORE UPDATE ON cases
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
