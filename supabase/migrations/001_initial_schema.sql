-- ============================================================
-- SCHOOL ACADEMIC MANAGEMENT & RESULT PORTAL
-- Supabase Migration: Initial Schema
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT');
CREATE TYPE gender AS ENUM ('MALE', 'FEMALE');
CREATE TYPE session_status AS ENUM ('UPCOMING', 'ACTIVE', 'COMPLETED');
CREATE TYPE term_name AS ENUM ('FIRST', 'SECOND', 'THIRD');
CREATE TYPE enrollment_status AS ENUM ('ACTIVE', 'TRANSFERRED', 'COMPLETED', 'INACTIVE');
CREATE TYPE result_status AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'REJECTED', 'APPROVED', 'PUBLISHED', 'LOCKED');

-- ============================================================
-- AUTH & USER MANAGEMENT
-- ============================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'TEACHER',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);

-- Teacher profiles
CREATE TABLE teacher_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  employee_id TEXT UNIQUE,
  qualification TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_teacher_profiles_user_id ON teacher_profiles(user_id);

-- Students
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admission_number TEXT UNIQUE NOT NULL,
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  middle_name TEXT,
  surname TEXT NOT NULL,
  gender gender NOT NULL,
  date_of_birth DATE,
  admission_session_id UUID NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_students_admission_number ON students(admission_number);
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_is_active ON students(is_active);

-- Parent profiles
CREATE TABLE parent_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  phone TEXT,
  occupation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_parent_profiles_user_id ON parent_profiles(user_id);

-- Parent-Student links
CREATE TABLE parent_student_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES parent_profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  relationship TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(parent_id, student_id)
);

CREATE INDEX idx_parent_student_links_student_id ON parent_student_links(student_id);

-- ============================================================
-- ACADEMIC STRUCTURE
-- ============================================================

-- Academic sessions (e.g., "2026/2027")
CREATE TABLE academic_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_current BOOLEAN NOT NULL DEFAULT false,
  status session_status NOT NULL DEFAULT 'UPCOMING',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_academic_sessions_is_current ON academic_sessions(is_current);

-- Terms
CREATE TABLE terms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES academic_sessions(id) ON DELETE CASCADE,
  name term_name NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_current BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(session_id, name)
);

CREATE INDEX idx_terms_session_id ON terms(session_id);

-- Class levels (JSS1, JSS2, SS1, etc.)
CREATE TABLE class_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_class_levels_is_active ON class_levels(is_active);

-- Class arms (A, B, C for each level)
CREATE TABLE class_arms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_level_id UUID NOT NULL REFERENCES class_levels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(class_level_id, name)
);

CREATE INDEX idx_class_arms_class_level_id ON class_arms(class_level_id);

-- ============================================================
-- ENROLLMENT & SUBJECTS
-- ============================================================

-- Student enrollment history
CREATE TABLE student_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES academic_sessions(id),
  term_id UUID REFERENCES terms(id),
  class_level_id UUID NOT NULL REFERENCES class_levels(id),
  class_arm_id UUID NOT NULL REFERENCES class_arms(id),
  start_date DATE NOT NULL,
  end_date DATE,
  status enrollment_status NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_student_enrollments_student_id ON student_enrollments(student_id);
CREATE INDEX idx_student_enrollments_session_id ON student_enrollments(session_id);
CREATE INDEX idx_student_enrollments_class_arm_id ON student_enrollments(class_arm_id);
CREATE INDEX idx_student_enrollments_status ON student_enrollments(status);

-- Subjects
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  code TEXT UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_subjects_is_active ON subjects(is_active);

-- Class-Subject assignments
CREATE TABLE class_subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_level_id UUID NOT NULL REFERENCES class_levels(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES academic_sessions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(class_level_id, subject_id, session_id)
);

CREATE INDEX idx_class_subjects_class_level_id ON class_subjects(class_level_id);
CREATE INDEX idx_class_subjects_subject_id ON class_subjects(subject_id);

-- Teacher assignments
CREATE TABLE teacher_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES teacher_profiles(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  class_level_id UUID NOT NULL REFERENCES class_levels(id) ON DELETE CASCADE,
  class_arm_id UUID NOT NULL REFERENCES class_arms(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES academic_sessions(id) ON DELETE CASCADE,
  term_id UUID NOT NULL REFERENCES terms(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(teacher_id, subject_id, class_level_id, class_arm_id, session_id, term_id)
);

CREATE INDEX idx_teacher_assignments_teacher_id ON teacher_assignments(teacher_id);
CREATE INDEX idx_teacher_assignments_session_term ON teacher_assignments(session_id, term_id);

-- ============================================================
-- RESULTS & ASSESSMENTS
-- ============================================================

CREATE TABLE assessment_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES student_enrollments(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES academic_sessions(id),
  term_id UUID NOT NULL REFERENCES terms(id),
  subject_id UUID NOT NULL REFERENCES subjects(id),
  class_level_id UUID NOT NULL REFERENCES class_levels(id),
  class_arm_id UUID NOT NULL REFERENCES class_arms(id),

  -- Midterm scores (1st & 2nd term) - Teacher enters
  midterm_note_attendance DECIMAL(5,2),
  midterm_ca1 DECIMAL(5,2),
  midterm_ca2 DECIMAL(5,2),

  -- Midterm calculated (stored for audit)
  midterm_total DECIMAL(5,2),
  midterm_percentage DECIMAL(5,2),
  midterm_grade TEXT,
  midterm_position INTEGER,

  -- Post-midterm scores (1st & 2nd term) - Teacher enters
  post_midterm_note_assignment DECIMAL(5,2),
  post_midterm_ca_test DECIMAL(5,2),

  -- Post-midterm calculated
  post_midterm_total DECIMAL(5,2),

  -- 3rd term scores - Teacher enters
  third_term_ca DECIMAL(5,2),
  third_term_exam DECIMAL(5,2),

  -- 3rd term calculated
  third_term_total DECIMAL(5,2),

  -- 1st/2nd term final
  term_ca DECIMAL(5,2),
  exam_score DECIMAL(5,2),
  term_total DECIMAL(5,2),

  -- Final grade & position
  final_grade TEXT,
  subject_position INTEGER,

  -- Annual (3rd term report)
  annual_total DECIMAL(7,2),
  annual_average DECIMAL(5,2),

  -- Attendance (terminal reports)
  total_school_days INTEGER,
  present_days INTEGER,

  -- Comments
  teacher_comment TEXT,
  class_teacher_comment TEXT,
  principal_comment TEXT,

  -- Workflow
  status result_status NOT NULL DEFAULT 'DRAFT',
  created_by UUID NOT NULL REFERENCES users(id),
  updated_by UUID NOT NULL REFERENCES users(id),
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  locked_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(student_id, subject_id, session_id, term_id, enrollment_id)
);

CREATE INDEX idx_assessment_results_session_term ON assessment_results(session_id, term_id);
CREATE INDEX idx_assessment_results_class_arm_id ON assessment_results(class_arm_id);
CREATE INDEX idx_assessment_results_status ON assessment_results(status);
CREATE INDEX idx_assessment_results_subject_id ON assessment_results(subject_id);
CREATE INDEX idx_assessment_results_student_id ON assessment_results(student_id);

-- ============================================================
-- GRADING
-- ============================================================

CREATE TABLE grade_scales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label TEXT NOT NULL,
  min_score DECIMAL(5,2) NOT NULL,
  max_score DECIMAL(5,2) NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_grade_scales_is_active ON grade_scales(is_active);
CREATE INDEX idx_grade_scales_sort_order ON grade_scales(sort_order);

-- ============================================================
-- ATTENDANCE
-- ============================================================

CREATE TABLE attendance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES academic_sessions(id),
  term_id UUID NOT NULL REFERENCES terms(id),
  total_school_days INTEGER NOT NULL,
  present_days INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, session_id, term_id)
);

CREATE INDEX idx_attendance_records_student_id ON attendance_records(student_id);

-- ============================================================
-- AUDIT LOG
-- ============================================================

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT,
  old_value TEXT,
  new_value TEXT,
  reason TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity_entity_id ON audit_logs(entity, entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================================================
-- SCHOOL SETTINGS
-- ============================================================

CREATE TABLE school_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_name TEXT NOT NULL,
  logo TEXT,
  address TEXT,
  email TEXT,
  phone TEXT,
  motto TEXT,
  report_title TEXT,
  report_footer TEXT,
  primary_color TEXT DEFAULT '#1e40af',
  secondary_color TEXT DEFAULT '#f59e0b',
  principal_display_name TEXT,
  report_signature_labels TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_student_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_arms ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE grade_scales ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_settings ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- Helper function to get current user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function to check if user is principal or super admin
CREATE OR REPLACE FUNCTION is_admin_or_principal()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'PRINCIPAL'))
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- USERS table policies
CREATE POLICY "Super admin can do everything on users"
  ON users FOR ALL
  USING (is_super_admin());

CREATE POLICY "Users can read their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admin/principal can read all users"
  ON users FOR SELECT
  USING (is_admin_or_principal());

-- TEACHER PROFILES
CREATE POLICY "Super admin can manage teacher profiles"
  ON teacher_profiles FOR ALL
  USING (is_super_admin());

CREATE POLICY "Anyone authenticated can read teacher profiles"
  ON teacher_profiles FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- STUDENTS
CREATE POLICY "Super admin can manage students"
  ON students FOR ALL
  USING (is_super_admin());

CREATE POLICY "Admin/principal can read all students"
  ON students FOR SELECT
  USING (is_admin_or_principal());

CREATE POLICY "Teachers can read students in their assigned classes"
  ON students FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM teacher_assignments ta
      JOIN student_enrollments se ON se.class_arm_id = ta.class_arm_id
        AND se.session_id = ta.session_id
      WHERE ta.teacher_id = (SELECT id FROM teacher_profiles WHERE user_id = auth.uid())
      AND se.student_id = students.id
    )
  );

CREATE POLICY "Students can read their own record"
  ON students FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Parents can read their linked children"
  ON students FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parent_student_links psl
      JOIN parent_profiles pp ON pp.id = psl.parent_id
      WHERE pp.user_id = auth.uid()
      AND psl.student_id = students.id
    )
  );

-- PARENT PROFILES
CREATE POLICY "Super admin can manage parent profiles"
  ON parent_profiles FOR ALL
  USING (is_super_admin());

CREATE POLICY "Parents can read their own profile"
  ON parent_profiles FOR SELECT
  USING (user_id = auth.uid());

-- PARENT-STUDENT LINKS
CREATE POLICY "Super admin can manage parent-student links"
  ON parent_student_links FOR ALL
  USING (is_super_admin());

CREATE POLICY "Parents can read their own links"
  ON parent_student_links FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parent_profiles WHERE id = parent_id AND user_id = auth.uid()
    )
  );

-- ACADEMIC SESSIONS
CREATE POLICY "Authenticated users can read sessions"
  ON academic_sessions FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Super admin can manage sessions"
  ON academic_sessions FOR ALL
  USING (is_super_admin());

-- TERMS
CREATE POLICY "Authenticated users can read terms"
  ON terms FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Super admin can manage terms"
  ON terms FOR ALL
  USING (is_super_admin());

-- CLASS LEVELS
CREATE POLICY "Authenticated users can read class levels"
  ON class_levels FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Super admin can manage class levels"
  ON class_levels FOR ALL
  USING (is_super_admin());

-- CLASS ARMS
CREATE POLICY "Authenticated users can read class arms"
  ON class_arms FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Super admin can manage class arms"
  ON class_arms FOR ALL
  USING (is_super_admin());

-- STUDENT ENROLLMENTS
CREATE POLICY "Super admin can manage enrollments"
  ON student_enrollments FOR ALL
  USING (is_super_admin());

CREATE POLICY "Admin/principal can read all enrollments"
  ON student_enrollments FOR SELECT
  USING (is_admin_or_principal());

CREATE POLICY "Teachers can read enrollments in their assigned classes"
  ON student_enrollments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM teacher_assignments ta
      WHERE ta.teacher_id = (SELECT id FROM teacher_profiles WHERE user_id = auth.uid())
      AND ta.class_arm_id = student_enrollments.class_arm_id
    )
  );

CREATE POLICY "Students can read their own enrollments"
  ON student_enrollments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM students WHERE id = student_id AND user_id = auth.uid()
    )
  );

-- SUBJECTS
CREATE POLICY "Authenticated users can read subjects"
  ON subjects FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Super admin can manage subjects"
  ON subjects FOR ALL
  USING (is_super_admin());

-- CLASS SUBJECTS
CREATE POLICY "Authenticated users can read class subjects"
  ON class_subjects FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Super admin can manage class subjects"
  ON class_subjects FOR ALL
  USING (is_super_admin());

-- TEACHER ASSIGNMENTS
CREATE POLICY "Super admin can manage teacher assignments"
  ON teacher_assignments FOR ALL
  USING (is_super_admin());

CREATE POLICY "Admin/principal can read all teacher assignments"
  ON teacher_assignments FOR SELECT
  USING (is_admin_or_principal());

CREATE POLICY "Teachers can read their own assignments"
  ON teacher_assignments FOR SELECT
  USING (
    teacher_id = (SELECT id FROM teacher_profiles WHERE user_id = auth.uid())
  );

-- ASSESSMENT RESULTS
CREATE POLICY "Super admin can manage all results"
  ON assessment_results FOR ALL
  USING (is_super_admin());

CREATE POLICY "Principal can read and update results for review"
  ON assessment_results FOR SELECT
  USING (get_user_role() = 'PRINCIPAL');

CREATE POLICY "Principal can update results for approval"
  ON assessment_results FOR UPDATE
  USING (get_user_role() = 'PRINCIPAL');

CREATE POLICY "Teachers can manage their own draft results"
  ON assessment_results FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM teacher_assignments ta
      WHERE ta.teacher_id = (SELECT id FROM teacher_profiles WHERE user_id = auth.uid())
      AND ta.subject_id = assessment_results.subject_id
      AND ta.class_arm_id = assessment_results.class_arm_id
      AND ta.session_id = assessment_results.session_id
      AND ta.term_id = assessment_results.term_id
    )
    AND status IN ('DRAFT', 'REJECTED')
  );

CREATE POLICY "Teachers can read results in their assigned classes"
  ON assessment_results FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM teacher_assignments ta
      WHERE ta.teacher_id = (SELECT id FROM teacher_profiles WHERE user_id = auth.uid())
      AND ta.class_arm_id = assessment_results.class_arm_id
    )
  );

CREATE POLICY "Students can read their own published results"
  ON assessment_results FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM students WHERE id = student_id AND user_id = auth.uid()
    )
    AND status IN ('PUBLISHED', 'LOCKED')
  );

CREATE POLICY "Parents can read their children's published results"
  ON assessment_results FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parent_student_links psl
      JOIN parent_profiles pp ON pp.id = psl.parent_id
      WHERE pp.user_id = auth.uid()
      AND psl.student_id = assessment_results.student_id
    )
    AND status IN ('PUBLISHED', 'LOCKED')
  );

-- GRADE SCALES
CREATE POLICY "Authenticated users can read grade scales"
  ON grade_scales FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Principal can manage grade scales"
  ON grade_scales FOR ALL
  USING (get_user_role() = 'PRINCIPAL');

CREATE POLICY "Super admin can manage grade scales"
  ON grade_scales FOR ALL
  USING (is_super_admin());

-- ATTENDANCE RECORDS
CREATE POLICY "Super admin can manage attendance"
  ON attendance_records FOR ALL
  USING (is_super_admin());

CREATE POLICY "Admin/principal can read all attendance"
  ON attendance_records FOR SELECT
  USING (is_admin_or_principal());

CREATE POLICY "Teachers can read attendance in their assigned classes"
  ON attendance_records FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM teacher_assignments ta
      JOIN students s ON s.id = attendance_records.student_id
      WHERE ta.teacher_id = (SELECT id FROM teacher_profiles WHERE user_id = auth.uid())
      AND ta.class_arm_id = s.id::text::uuid  -- simplified
    )
  );

CREATE POLICY "Students can read their own attendance"
  ON attendance_records FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM students WHERE id = student_id AND user_id = auth.uid()
    )
  );

-- AUDIT LOGS
CREATE POLICY "Super admin can read all audit logs"
  ON audit_logs FOR SELECT
  USING (is_super_admin());

CREATE POLICY "Principal can read audit logs"
  ON audit_logs FOR SELECT
  USING (get_user_role() = 'PRINCIPAL');

CREATE POLICY "System can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- SCHOOL SETTINGS
CREATE POLICY "Authenticated users can read school settings"
  ON school_settings FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Super admin can manage school settings"
  ON school_settings FOR ALL
  USING (is_super_admin());

-- ============================================================
-- TRIGGER: Auto-update updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teacher_profiles_updated_at
  BEFORE UPDATE ON teacher_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_academic_sessions_updated_at
  BEFORE UPDATE ON academic_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_terms_updated_at
  BEFORE UPDATE ON terms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_class_levels_updated_at
  BEFORE UPDATE ON class_levels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_class_arms_updated_at
  BEFORE UPDATE ON class_arms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_enrollments_updated_at
  BEFORE UPDATE ON student_enrollments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subjects_updated_at
  BEFORE UPDATE ON subjects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teacher_assignments_updated_at
  BEFORE UPDATE ON teacher_assignments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessment_results_updated_at
  BEFORE UPDATE ON assessment_results
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grade_scales_updated_at
  BEFORE UPDATE ON grade_scales
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_records_updated_at
  BEFORE UPDATE ON attendance_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_school_settings_updated_at
  BEFORE UPDATE ON school_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- SEED: Default grade scale
-- ============================================================

INSERT INTO grade_scales (label, min_score, max_score, description, sort_order) VALUES
  ('A', 75.00, 100.00, 'Excellent', 1),
  ('B', 65.00, 74.99, 'Very Good', 2),
  ('C', 55.00, 64.99, 'Good', 3),
  ('D', 45.00, 54.99, 'Credit', 4),
  ('E', 40.00, 44.99, 'Pass', 5),
  ('F', 0.00, 39.99, 'Fail', 6);

-- ============================================================
-- SEED: Default school settings
-- ============================================================

INSERT INTO school_settings (school_name, motto, address, primary_color, secondary_color)
VALUES ('Union Baptist College', 'Knowledge is Light', 'Ibadan, Oyo State, Nigeria', '#1e3a5f', '#4a90d9');

-- ============================================================
-- SEED: Initial class levels and arms
-- ============================================================

-- Class Levels
INSERT INTO class_levels (name, sort_order) VALUES
  ('JSS1', 1),
  ('JSS2', 2),
  ('JSS3', 3),
  ('SS1', 4),
  ('SS2', 5),
  ('SS3', 6);

-- Class Arms
DO $$
DECLARE
  jss1_id UUID;
  jss2_id UUID;
  jss3_id UUID;
  ss1_id UUID;
  ss2_id UUID;
  ss3_id UUID;
BEGIN
  SELECT id INTO jss1_id FROM class_levels WHERE name = 'JSS1';
  SELECT id INTO jss2_id FROM class_levels WHERE name = 'JSS2';
  SELECT id INTO jss3_id FROM class_levels WHERE name = 'JSS3';
  SELECT id INTO ss1_id FROM class_levels WHERE name = 'SS1';
  SELECT id INTO ss2_id FROM class_levels WHERE name = 'SS2';
  SELECT id INTO ss3_id FROM class_levels WHERE name = 'SS3';

  INSERT INTO class_arms (class_level_id, name) VALUES
    (jss1_id, 'A'), (jss1_id, 'B'), (jss1_id, 'C'),
    (jss2_id, 'A'), (jss2_id, 'B'), (jss2_id, 'C'),
    (jss3_id, 'A'), (jss3_id, 'B'),
    (ss1_id, 'A'), (ss1_id, 'B'),
    (ss2_id, 'A'), (ss2_id, 'B'),
    (ss3_id, 'A'), (ss3_id, 'B');
END $$;

-- ============================================================
-- SEED: Current academic session and terms
-- ============================================================

DO $$
DECLARE
  session_id UUID;
BEGIN
  INSERT INTO academic_sessions (name, start_date, end_date, is_current, status)
  VALUES ('2026/2027', '2026-09-14', '2027-09-13', true, 'ACTIVE')
  RETURNING id INTO session_id;

  INSERT INTO terms (session_id, name, start_date, end_date, is_current)
  VALUES
    (session_id, 'FIRST', '2026-09-01', '2026-12-20', true),
    (session_id, 'SECOND', '2027-01-05', '2027-04-10', false),
    (session_id, 'THIRD', '2027-04-27', '2027-07-31', false);
END $$;
