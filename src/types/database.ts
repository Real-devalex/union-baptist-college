// ============================================================
// AUTO-GENERATED SUPABASE TYPES
// These mirror the Supabase database schema.
// In production, run `supabase gen types typescript` to auto-generate.
// ============================================================

export type UserRole = 'SUPER_ADMIN' | 'PRINCIPAL' | 'TEACHER' | 'STUDENT' | 'PARENT'
export type Gender = 'MALE' | 'FEMALE'
export type SessionStatus = 'UPCOMING' | 'ACTIVE' | 'COMPLETED'
export type TermName = 'FIRST' | 'SECOND' | 'THIRD'
export type EnrollmentStatus = 'ACTIVE' | 'TRANSFERRED' | 'COMPLETED' | 'INACTIVE'
export type ResultStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'REJECTED' | 'APPROVED' | 'PUBLISHED' | 'LOCKED'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: UserRow
        Insert: UserInsert
        Update: UserUpdate
      }
      teacher_profiles: {
        Row: TeacherProfileRow
        Insert: TeacherProfileInsert
        Update: TeacherProfileUpdate
      }
      students: {
        Row: StudentRow
        Insert: StudentInsert
        Update: StudentUpdate
      }
      parent_profiles: {
        Row: ParentProfileRow
        Insert: ParentProfileInsert
        Update: ParentProfileUpdate
      }
      parent_student_links: {
        Row: ParentStudentLinkRow
        Insert: ParentStudentLinkInsert
        Update: ParentStudentLinkUpdate
      }
      academic_sessions: {
        Row: AcademicSessionRow
        Insert: AcademicSessionInsert
        Update: AcademicSessionUpdate
      }
      terms: {
        Row: TermRow
        Insert: TermInsert
        Update: TermUpdate
      }
      class_levels: {
        Row: ClassLevelRow
        Insert: ClassLevelInsert
        Update: ClassLevelUpdate
      }
      class_arms: {
        Row: ClassArmRow
        Insert: ClassArmInsert
        Update: ClassArmUpdate
      }
      student_enrollments: {
        Row: StudentEnrollmentRow
        Insert: StudentEnrollmentInsert
        Update: StudentEnrollmentUpdate
      }
      subjects: {
        Row: SubjectRow
        Insert: SubjectInsert
        Update: SubjectUpdate
      }
      class_subjects: {
        Row: ClassSubjectRow
        Insert: ClassSubjectInsert
        Update: ClassSubjectUpdate
      }
      teacher_assignments: {
        Row: TeacherAssignmentRow
        Insert: TeacherAssignmentInsert
        Update: TeacherAssignmentUpdate
      }
      assessment_results: {
        Row: AssessmentResultRow
        Insert: AssessmentResultInsert
        Update: AssessmentResultUpdate
      }
      grade_scales: {
        Row: GradeScaleRow
        Insert: GradeScaleInsert
        Update: GradeScaleUpdate
      }
      attendance_records: {
        Row: AttendanceRecordRow
        Insert: AttendanceRecordInsert
        Update: AttendanceRecordUpdate
      }
      audit_logs: {
        Row: AuditLogRow
        Insert: AuditLogInsert
        Update: AuditLogUpdate
      }
      school_settings: {
        Row: SchoolSettingsRow
        Insert: SchoolSettingsInsert
        Update: SchoolSettingsUpdate
      }
    }
    Enums: {
      user_role: UserRole
      gender: Gender
      session_status: SessionStatus
      term_name: TermName
      enrollment_status: EnrollmentStatus
      result_status: ResultStatus
    }
  }
}

// ============================================================
// ROW TYPES
// ============================================================

export interface UserRow {
  id: string
  email: string
  name: string
  role: UserRole
  is_active: boolean
  last_login_at: string | null
  created_at: string
  updated_at: string
}

export interface UserInsert {
  id?: string
  email: string
  name: string
  role: UserRole
  is_active?: boolean
  last_login_at?: string | null
  created_at?: string
  updated_at?: string
}

export interface UserUpdate {
  id?: string
  email?: string
  name?: string
  role?: UserRole
  is_active?: boolean
  last_login_at?: string | null
  updated_at?: string
}

export interface TeacherProfileRow {
  id: string
  user_id: string
  employee_id: string | null
  qualification: string | null
  created_at: string
  updated_at: string
}

export interface TeacherProfileInsert {
  id?: string
  user_id: string
  employee_id?: string | null
  qualification?: string | null
  created_at?: string
  updated_at?: string
}

export interface TeacherProfileUpdate {
  id?: string
  user_id?: string
  employee_id?: string | null
  qualification?: string | null
  updated_at?: string
}

export interface StudentRow {
  id: string
  admission_number: string
  user_id: string | null
  first_name: string
  middle_name: string | null
  surname: string
  gender: Gender
  date_of_birth: string | null
  admission_session_id: string
  login_pin: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface StudentInsert {
  id?: string
  admission_number: string
  user_id?: string | null
  first_name: string
  middle_name?: string | null
  surname: string
  gender: Gender
  date_of_birth?: string | null
  admission_session_id: string
  login_pin?: string | null
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface StudentUpdate {
  id?: string
  admission_number?: string
  user_id?: string | null
  first_name?: string
  middle_name?: string | null
  surname?: string
  gender?: Gender
  date_of_birth?: string | null
  admission_session_id?: string
  login_pin?: string | null
  is_active?: boolean
  updated_at?: string
}

export interface ParentProfileRow {
  id: string
  user_id: string
  parent_id: string | null
  phone: string | null
  occupation: string | null
  login_pin: string | null
  created_at: string
  updated_at: string
}

export interface ParentProfileInsert {
  id?: string
  user_id: string
  parent_id?: string | null
  phone?: string | null
  occupation?: string | null
  login_pin?: string | null
  created_at?: string
  updated_at?: string
}

export interface ParentProfileUpdate {
  id?: string
  user_id?: string
  parent_id?: string | null
  phone?: string | null
  occupation?: string | null
  login_pin?: string | null
  updated_at?: string
}

export interface ParentStudentLinkRow {
  id: string
  parent_id: string
  student_id: string
  relationship: string | null
  created_at: string
}

export interface ParentStudentLinkInsert {
  id?: string
  parent_id: string
  student_id: string
  relationship?: string | null
  created_at?: string
}

export interface ParentStudentLinkUpdate {
  id?: string
  parent_id?: string
  student_id?: string
  relationship?: string | null
}

export interface AcademicSessionRow {
  id: string
  name: string
  start_date: string
  end_date: string
  is_current: boolean
  status: SessionStatus
  created_at: string
  updated_at: string
}

export interface AcademicSessionInsert {
  id?: string
  name: string
  start_date: string
  end_date: string
  is_current?: boolean
  status?: SessionStatus
  created_at?: string
  updated_at?: string
}

export interface AcademicSessionUpdate {
  id?: string
  name?: string
  start_date?: string
  end_date?: string
  is_current?: boolean
  status?: SessionStatus
  updated_at?: string
}

export interface TermRow {
  id: string
  session_id: string
  name: TermName
  start_date: string
  end_date: string
  is_current: boolean
  created_at: string
  updated_at: string
}

export interface TermInsert {
  id?: string
  session_id: string
  name: TermName
  start_date: string
  end_date: string
  is_current?: boolean
  created_at?: string
  updated_at?: string
}

export interface TermUpdate {
  id?: string
  session_id?: string
  name?: TermName
  start_date?: string
  end_date?: string
  is_current?: boolean
  updated_at?: string
}

export interface ClassLevelRow {
  id: string
  name: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ClassLevelInsert {
  id?: string
  name: string
  sort_order?: number
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface ClassLevelUpdate {
  id?: string
  name?: string
  sort_order?: number
  is_active?: boolean
  updated_at?: string
}

export interface ClassArmRow {
  id: string
  class_level_id: string
  name: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ClassArmInsert {
  id?: string
  class_level_id: string
  name: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface ClassArmUpdate {
  id?: string
  class_level_id?: string
  name?: string
  is_active?: boolean
  updated_at?: string
}

export interface StudentEnrollmentRow {
  id: string
  student_id: string
  session_id: string
  term_id: string | null
  class_level_id: string
  class_arm_id: string
  start_date: string
  end_date: string | null
  status: EnrollmentStatus
  created_at: string
  updated_at: string
}

export interface StudentEnrollmentInsert {
  id?: string
  student_id: string
  session_id: string
  term_id?: string | null
  class_level_id: string
  class_arm_id: string
  start_date: string
  end_date?: string | null
  status?: EnrollmentStatus
  created_at?: string
  updated_at?: string
}

export interface StudentEnrollmentUpdate {
  id?: string
  student_id?: string
  session_id?: string
  term_id?: string | null
  class_level_id?: string
  class_arm_id?: string
  start_date?: string
  end_date?: string | null
  status?: EnrollmentStatus
  updated_at?: string
}

export interface SubjectRow {
  id: string
  name: string
  code: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SubjectInsert {
  id?: string
  name: string
  code?: string | null
  sort_order?: number
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface SubjectUpdate {
  id?: string
  name?: string
  code?: string | null
  sort_order?: number
  is_active?: boolean
  updated_at?: string
}

export interface ClassSubjectRow {
  id: string
  class_level_id: string
  subject_id: string
  session_id: string
  created_at: string
}

export interface ClassSubjectInsert {
  id?: string
  class_level_id: string
  subject_id: string
  session_id: string
  created_at?: string
}

export interface ClassSubjectUpdate {
  id?: string
  class_level_id?: string
  subject_id?: string
  session_id?: string
}

export interface TeacherAssignmentRow {
  id: string
  teacher_id: string
  subject_id: string
  class_level_id: string
  class_arm_id: string
  session_id: string
  term_id: string
  created_at: string
  updated_at: string
}

export interface TeacherAssignmentInsert {
  id?: string
  teacher_id: string
  subject_id: string
  class_level_id: string
  class_arm_id: string
  session_id: string
  term_id: string
  created_at?: string
  updated_at?: string
}

export interface TeacherAssignmentUpdate {
  id?: string
  teacher_id?: string
  subject_id?: string
  class_level_id?: string
  class_arm_id?: string
  session_id?: string
  term_id?: string
  updated_at?: string
}

export interface AssessmentResultRow {
  id: string
  student_id: string
  enrollment_id: string
  session_id: string
  term_id: string
  subject_id: string
  class_level_id: string
  class_arm_id: string

  // Midterm (1st/2nd term)
  midterm_note_attendance: number | null
  midterm_ca1: number | null
  midterm_ca2: number | null
  midterm_total: number | null
  midterm_percentage: number | null
  midterm_grade: string | null
  midterm_position: number | null

  // Post-midterm (1st/2nd term)
  post_midterm_note_assignment: number | null
  post_midterm_ca_test: number | null
  post_midterm_total: number | null

  // 3rd term
  third_term_ca: number | null
  third_term_exam: number | null
  third_term_total: number | null

  // 1st/2nd term final
  term_ca: number | null
  exam_score: number | null
  term_total: number | null

  // Final grade & position
  final_grade: string | null
  subject_position: number | null

  // Annual
  annual_total: number | null
  annual_average: number | null

  // Attendance
  total_school_days: number | null
  present_days: number | null

  // Comments
  teacher_comment: string | null
  class_teacher_comment: string | null
  principal_comment: string | null

  // Workflow
  status: ResultStatus
  created_by: string
  updated_by: string
  submitted_at: string | null
  approved_at: string | null
  published_at: string | null
  locked_at: string | null

  created_at: string
  updated_at: string
}

export interface AssessmentResultInsert {
  id?: string
  student_id: string
  enrollment_id: string
  session_id: string
  term_id: string
  subject_id: string
  class_level_id: string
  class_arm_id: string

  midterm_note_attendance?: number | null
  midterm_ca1?: number | null
  midterm_ca2?: number | null
  midterm_total?: number | null
  midterm_percentage?: number | null
  midterm_grade?: string | null
  midterm_position?: number | null

  post_midterm_note_assignment?: number | null
  post_midterm_ca_test?: number | null
  post_midterm_total?: number | null

  third_term_ca?: number | null
  third_term_exam?: number | null
  third_term_total?: number | null

  term_ca?: number | null
  exam_score?: number | null
  term_total?: number | null

  final_grade?: string | null
  subject_position?: number | null

  annual_total?: number | null
  annual_average?: number | null

  total_school_days?: number | null
  present_days?: number | null

  teacher_comment?: string | null
  class_teacher_comment?: string | null
  principal_comment?: string | null

  status?: ResultStatus
  created_by: string
  updated_by: string
  submitted_at?: string | null
  approved_at?: string | null
  published_at?: string | null
  locked_at?: string | null

  created_at?: string
  updated_at?: string
}

export interface AssessmentResultUpdate {
  id?: string
  student_id?: string
  enrollment_id?: string
  session_id?: string
  term_id?: string
  subject_id?: string
  class_level_id?: string
  class_arm_id?: string

  midterm_note_attendance?: number | null
  midterm_ca1?: number | null
  midterm_ca2?: number | null
  midterm_total?: number | null
  midterm_percentage?: number | null
  midterm_grade?: string | null
  midterm_position?: number | null

  post_midterm_note_assignment?: number | null
  post_midterm_ca_test?: number | null
  post_midterm_total?: number | null

  third_term_ca?: number | null
  third_term_exam?: number | null
  third_term_total?: number | null

  term_ca?: number | null
  exam_score?: number | null
  term_total?: number | null

  final_grade?: string | null
  subject_position?: number | null

  annual_total?: number | null
  annual_average?: number | null

  total_school_days?: number | null
  present_days?: number | null

  teacher_comment?: string | null
  class_teacher_comment?: string | null
  principal_comment?: string | null

  status?: ResultStatus
  updated_by?: string
  submitted_at?: string | null
  approved_at?: string | null
  published_at?: string | null
  locked_at?: string | null

  updated_at?: string
}

export interface GradeScaleRow {
  id: string
  label: string
  min_score: number
  max_score: number
  description: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface GradeScaleInsert {
  id?: string
  label: string
  min_score: number
  max_score: number
  description?: string | null
  sort_order?: number
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface GradeScaleUpdate {
  id?: string
  label?: string
  min_score?: number
  max_score?: number
  description?: string | null
  sort_order?: number
  is_active?: boolean
  updated_at?: string
}

export interface AttendanceRecordRow {
  id: string
  student_id: string
  session_id: string
  term_id: string
  total_school_days: number
  present_days: number
  created_at: string
  updated_at: string
}

export interface AttendanceRecordInsert {
  id?: string
  student_id: string
  session_id: string
  term_id: string
  total_school_days: number
  present_days: number
  created_at?: string
  updated_at?: string
}

export interface AttendanceRecordUpdate {
  id?: string
  student_id?: string
  session_id?: string
  term_id?: string
  total_school_days?: number
  present_days?: number
  updated_at?: string
}

export interface AuditLogRow {
  id: string
  user_id: string | null
  action: string
  entity: string
  entity_id: string | null
  old_value: string | null
  new_value: string | null
  reason: string | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

export interface AuditLogInsert {
  id?: string
  user_id?: string | null
  action: string
  entity: string
  entity_id?: string | null
  old_value?: string | null
  new_value?: string | null
  reason?: string | null
  ip_address?: string | null
  user_agent?: string | null
  created_at?: string
}

export interface AuditLogUpdate {
  id?: string
  user_id?: string | null
  action?: string
  entity?: string
  entity_id?: string | null
  old_value?: string | null
  new_value?: string | null
  reason?: string | null
  ip_address?: string | null
  user_agent?: string | null
}

export interface AdmissionApplicationRow {
  id: string
  applicant_name: string
  applicant_email: string | null
  applicant_phone: string | null
  student_first_name: string
  student_middle_name: string | null
  student_surname: string
  student_gender: Gender
  student_date_of_birth: string | null
  parent_name: string
  parent_email: string | null
  parent_phone: string
  parent_occupation: string | null
  desired_class_level: string
  previous_school: string | null
  documents_url: string | null
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'ENROLLED'
  reviewed_by: string | null
  reviewed_at: string | null
  rejection_reason: string | null
  student_id: string | null
  admission_number: string | null
  user_id: string | null
  created_at: string
  updated_at: string
}

export interface AdmissionApplicationInsert {
  id?: string
  applicant_name: string
  applicant_email?: string | null
  applicant_phone?: string | null
  student_first_name: string
  student_middle_name?: string | null
  student_surname: string
  student_gender: Gender
  student_date_of_birth?: string | null
  parent_name: string
  parent_email?: string | null
  parent_phone: string
  parent_occupation?: string | null
  desired_class_level: string
  previous_school?: string | null
  documents_url?: string | null
  status?: string
  reviewed_by?: string | null
  reviewed_at?: string | null
  rejection_reason?: string | null
  student_id?: string | null
  admission_number?: string | null
  user_id?: string | null
  created_at?: string
  updated_at?: string
}

export interface SchoolSettingsRow {
  id: string
  school_name: string
  logo: string | null
  address: string | null
  email: string | null
  phone: string | null
  motto: string | null
  report_title: string | null
  report_footer: string | null
  primary_color: string | null
  secondary_color: string | null
  principal_display_name: string | null
  report_signature_labels: string | null
  created_at: string
  updated_at: string
}

export interface SchoolSettingsInsert {
  id?: string
  school_name: string
  logo?: string | null
  address?: string | null
  email?: string | null
  phone?: string | null
  motto?: string | null
  report_title?: string | null
  report_footer?: string | null
  primary_color?: string | null
  secondary_color?: string | null
  principal_display_name?: string | null
  report_signature_labels?: string | null
  created_at?: string
  updated_at?: string
}

export interface SchoolSettingsUpdate {
  id?: string
  school_name?: string
  logo?: string | null
  address?: string | null
  email?: string | null
  phone?: string | null
  motto?: string | null
  report_title?: string | null
  report_footer?: string | null
  primary_color?: string | null
  secondary_color?: string | null
  principal_display_name?: string | null
  report_signature_labels?: string | null
  updated_at?: string
}
