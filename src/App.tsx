import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import LandingPage from '@/pages/Landing'
import StudentLoginPage from '@/pages/StudentLogin'
import ParentLoginPage from '@/pages/ParentLogin'
import StaffLoginPage from '@/pages/StaffLogin'
import AppLayout from '@/components/Layout'
import { ProtectedRoute } from '@/contexts/AuthContext'

// Super Admin pages
import SuperAdminDashboard from '@/pages/super-admin/Dashboard'
import SuperAdminUsers from '@/pages/super-admin/Users'
import SuperAdminStudents from '@/pages/super-admin/Students'
import SuperAdminClasses from '@/pages/super-admin/Classes'
import SuperAdminSubjects from '@/pages/super-admin/Subjects'
import SuperAdminSettings from '@/pages/super-admin/Settings'
import SuperAdminSessions from '@/pages/super-admin/Sessions'
import SuperAdminGrading from '@/pages/super-admin/Grading'
import SuperAdminAudit from '@/pages/super-admin/Audit'
import SuperAdminAdmissions from '@/pages/super-admin/Admissions'

// Principal pages
import PrincipalDashboard from '@/pages/principal/Dashboard'
import PrincipalReview from '@/pages/principal/Review'
import PrincipalGrading from '@/pages/principal/Grading'
import PrincipalReports from '@/pages/principal/Reports'

// Teacher pages
import TeacherDashboard from '@/pages/teacher/Dashboard'
import TeacherEnterScores from '@/pages/teacher/EnterScores'
import TeacherMyResults from '@/pages/teacher/MyResults'

// Student pages
import StudentDashboard from '@/pages/student/Dashboard'
import StudentResults from '@/pages/student/Results'
import StudentProfile from '@/pages/student/Profile'

// Public pages
import AdmissionApplication from '@/pages/public/AdmissionApplication'

function AuthRedirect() {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e3a5f]" />
    </div>
  )
  if (!user) return null
  if (user.profile) {
    const role = user.profile.role
    switch (role) {
      case 'SUPER_ADMIN': return <Navigate to="/super-admin/dashboard" replace />
      case 'PRINCIPAL': return <Navigate to="/principal/dashboard" replace />
      case 'TEACHER': return <Navigate to="/teacher/dashboard" replace />
      case 'STUDENT': return <Navigate to="/student/dashboard" replace />
      case 'PARENT': return <Navigate to="/parent/dashboard" replace />
      default: return null
    }
  }
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/student-login" element={<StudentLoginPage />} />
          <Route path="/parent-login" element={<ParentLoginPage />} />
          <Route path="/staff-login" element={<StaffLoginPage />} />
          <Route path="/apply" element={<AdmissionApplication />} />

          {/* Super Admin routes */}
          <Route path="/super-admin" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']}><AppLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<SuperAdminDashboard />} />
            <Route path="users" element={<SuperAdminUsers />} />
            <Route path="students" element={<SuperAdminStudents />} />
            <Route path="classes" element={<SuperAdminClasses />} />
            <Route path="subjects" element={<SuperAdminSubjects />} />
            <Route path="settings" element={<SuperAdminSettings />} />
            <Route path="sessions" element={<SuperAdminSessions />} />
            <Route path="grading" element={<SuperAdminGrading />} />
            <Route path="audit" element={<SuperAdminAudit />} />
            <Route path="admissions" element={<SuperAdminAdmissions />} />
          </Route>

          {/* Principal routes */}
          <Route path="/principal" element={<ProtectedRoute allowedRoles={['PRINCIPAL']}><AppLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<PrincipalDashboard />} />
            <Route path="review" element={<PrincipalReview />} />
            <Route path="grading" element={<PrincipalGrading />} />
            <Route path="reports" element={<PrincipalReports />} />
          </Route>

          {/* Teacher routes */}
          <Route path="/teacher" element={<ProtectedRoute allowedRoles={['TEACHER']}><AppLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="enter-scores" element={<TeacherEnterScores />} />
            <Route path="my-results" element={<TeacherMyResults />} />
          </Route>

          {/* Student routes */}
          <Route path="/student" element={<ProtectedRoute allowedRoles={['STUDENT']}><AppLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="results" element={<StudentResults />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
