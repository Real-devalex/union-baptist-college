-- ============================================================
-- MIGRATION 2: PIN Login + Admission Applications
-- ============================================================

-- Add PIN fields for student and parent login
ALTER TABLE students ADD COLUMN login_pin TEXT;
ALTER TABLE parent_profiles ADD COLUMN login_pin TEXT;

-- Parent ID (unique identifier for parent login)
ALTER TABLE parent_profiles ADD COLUMN parent_id TEXT UNIQUE;

-- Admission applications table
CREATE TABLE admission_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  applicant_name TEXT NOT NULL,
  applicant_email TEXT,
  applicant_phone TEXT,
  
  -- Student info
  student_first_name TEXT NOT NULL,
  student_middle_name TEXT,
  student_surname TEXT NOT NULL,
  student_gender gender NOT NULL,
  student_date_of_birth DATE,
  
  -- Parent/guardian info
  parent_name TEXT NOT NULL,
  parent_email TEXT,
  parent_phone TEXT NOT NULL,
  parent_occupation TEXT,
  
  -- School info
  desired_class_level TEXT NOT NULL,
  previous_school TEXT,
  documents_url TEXT,
  
  -- Application status
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'ENROLLED')),
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  
  -- Enrollment (set after approval)
  student_id UUID REFERENCES students(id),
  admission_number TEXT,
  user_id UUID REFERENCES users(id),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_admission_applications_status ON admission_applications(status);
CREATE INDEX idx_admission_applications_created_at ON admission_applications(created_at);

-- Updated_at trigger for admission_applications
CREATE TRIGGER update_admission_applications_updated_at
  BEFORE UPDATE ON admission_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS policies for admission_applications
ALTER TABLE admission_applications ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (submit an application)
CREATE POLICY "Anyone can submit applications"
  ON admission_applications FOR INSERT
  WITH CHECK (true);

-- Applicants can view their own applications
CREATE POLICY "Applicants can view own applications"
  ON admission_applications FOR SELECT
  USING (
    applicant_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    OR is_super_admin(auth.uid())
    OR is_admin_or_principal(auth.uid())
  );

-- Only admin/principal can update applications
CREATE POLICY "Admin and principal can update applications"
  ON admission_applications FOR UPDATE
  USING (is_super_admin(auth.uid()) OR is_admin_or_principal(auth.uid()));

-- RLS policies for student login_pin access
-- Students can read their own PIN (for PIN verification during login)
CREATE POLICY "Students can verify own PIN"
  ON students FOR SELECT
  USING (
    user_id = auth.uid()
    OR is_super_admin(auth.uid())
    OR is_admin_or_principal(auth.uid())
  );

-- RLS policies for parent login_pin access
CREATE POLICY "Parents can verify own PIN"
  ON parent_profiles FOR SELECT
  USING (
    user_id = auth.uid()
    OR is_super_admin(auth.uid())
    OR is_admin_or_principal(auth.uid())
  );

-- ============================================================
-- Seed: Create a demo parent login record
-- ============================================================
-- This will be created when a student is enrolled via admission approval
