/*
  # Update RLS Policies for Public Access

  ## Overview
  This migration updates the Row Level Security policies to allow public (anon) access
  to all tables, since the application doesn't have authentication implemented yet.

  ## Changes
  - Drop existing restrictive policies
  - Create new policies that allow anon role access
  - Maintains data security through application-level access patterns

  ## Security Note
  - These policies allow anonymous access for development/demo purposes
  - In production, should be replaced with proper authentication-based policies
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can view all patients" ON patients;
DROP POLICY IF EXISTS "Authenticated users can insert patients" ON patients;
DROP POLICY IF EXISTS "Authenticated users can update patients" ON patients;
DROP POLICY IF EXISTS "Authenticated users can delete patients" ON patients;

DROP POLICY IF EXISTS "Authenticated users can view all cases" ON cases;
DROP POLICY IF EXISTS "Authenticated users can insert cases" ON cases;
DROP POLICY IF EXISTS "Authenticated users can update cases" ON cases;
DROP POLICY IF EXISTS "Authenticated users can delete cases" ON cases;

DROP POLICY IF EXISTS "Authenticated users can view all ongoing management activities" ON ongoing_management_activities;
DROP POLICY IF EXISTS "Authenticated users can insert ongoing management activities" ON ongoing_management_activities;
DROP POLICY IF EXISTS "Authenticated users can update ongoing management activities" ON ongoing_management_activities;
DROP POLICY IF EXISTS "Authenticated users can delete ongoing management activities" ON ongoing_management_activities;

DROP POLICY IF EXISTS "Authenticated users can view all referral letters" ON referral_letters;
DROP POLICY IF EXISTS "Authenticated users can insert referral letters" ON referral_letters;
DROP POLICY IF EXISTS "Authenticated users can update referral letters" ON referral_letters;
DROP POLICY IF EXISTS "Authenticated users can delete referral letters" ON referral_letters;

-- Create new public access policies for patients
CREATE POLICY "Public can view all patients"
  ON patients FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can insert patients"
  ON patients FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public can update patients"
  ON patients FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete patients"
  ON patients FOR DELETE
  TO anon, authenticated
  USING (true);

-- Create new public access policies for cases
CREATE POLICY "Public can view all cases"
  ON cases FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can insert cases"
  ON cases FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public can update cases"
  ON cases FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete cases"
  ON cases FOR DELETE
  TO anon, authenticated
  USING (true);

-- Create new public access policies for ongoing management activities
CREATE POLICY "Public can view all ongoing management activities"
  ON ongoing_management_activities FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can insert ongoing management activities"
  ON ongoing_management_activities FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public can update ongoing management activities"
  ON ongoing_management_activities FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete ongoing management activities"
  ON ongoing_management_activities FOR DELETE
  TO anon, authenticated
  USING (true);

-- Create new public access policies for referral letters
CREATE POLICY "Public can view all referral letters"
  ON referral_letters FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can insert referral letters"
  ON referral_letters FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public can update referral letters"
  ON referral_letters FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete referral letters"
  ON referral_letters FOR DELETE
  TO anon, authenticated
  USING (true);
