import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, Settings, LogOut,
  ClipboardList, FileText, Star, User, Menu, X, School, Sun, Moon,
  ClipboardCheck, BarChart3, Bell, Calendar, Award, Shield, Search,
} from 'lucide-react'
import { useState } from 'react'
import type { UserRole } from '@/types/database'

interface NavItem { label: string; path: string; icon: React.ReactNode; badge?: number }

const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  SUPER_ADMIN: [
    { label: 'Dashboard', path: '/super-admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Users', path: '/super-admin/users', icon: <Users className="w-5 h-5" /> },
    { label: 'Students', path: '/super-admin/students', icon: <GraduationCap className="w-5 h-5" /> },
    { label: 'Teachers', path: '/super-admin/teachers', icon: <Award className="w-5 h-5" /> },
    { label: 'Classes', path: '/super-admin/classes', icon: <School className="w-5 h-5" /> },
    { label: 'Subjects', path: '/super-admin/subjects', icon: <BookOpen className="w-5 h-5" /> },
    { label: 'Admissions', path: '/super-admin/admissions', icon: <ClipboardCheck className="w-5 h-5" /> },
    { label: 'Sessions', path: '/super-admin/sessions', icon: <Calendar className="w-5 h-5" /> },
    { label: 'Grading', path: '/super-admin/grading', icon: <Star className="w-5 h-5" /> },
    { label: 'Reports', path: '/super-admin/reports', icon: <BarChart3 className="w-5 h-5" /> },
    { label: 'Audit Logs', path: '/super-admin/audit', icon: <Shield className="w-5 h-5" /> },
    { label: 'Settings', path: '/super-admin/settings', icon: <Settings className="w-5 h-5" /> },
  ],
  PRINCIPAL: [
    { label: 'Dashboard', path: '/principal/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Students', path: '/principal/students', icon: <GraduationCap className="w-5 h-5" /> },
    { label: 'Teachers', path: '/principal/teachers', icon: <Award className="w-5 h-5" /> },
    { label: 'Review Results', path: '/principal/review', icon: <ClipboardList className="w-5 h-5" /> },
    { label: 'Applications', path: '/principal/applications', icon: <Bell className="w-5 h-5" /> },
    { label: 'Grading', path: '/principal/grading', icon: <Star className="w-5 h-5" /> },
    { label: 'Reports', path: '/principal/reports', icon: <FileText className="w-5 h-5" /> },
  ],
  TEACHER: [
    { label: 'Dashboard', path: '/teacher/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Enter Scores', path: '/teacher/enter-scores', icon: <ClipboardList className="w-5 h-5" /> },
    { label: 'My Results', path: '/teacher/my-results', icon: <FileText className="w-5 h-5" /> },
  ],
  STUDENT: [
    { label: 'Dashboard', path: '/student/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'My Results', path: '/student/results', icon: <FileText className="w-5 h-5" /> },
    { label: 'My Profile', path: '/student/profile', icon: <User className="w-5 h-5" /> },
  ],
  PARENT: [
    { label: 'Dashboard', path: '/parent/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Children's Results", path: '/parent/children', icon: <GraduationCap className="w-5 h-5" /> },
  ],
}

export default function AppLayout() {
  const { user, signOut } = useAuth()
  const { dark, toggle } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const role = user?.profile?.role as UserRole | undefined
  const navItems: NavItem[] = role ? NAV_ITEMS[role] : []

  function handleSignOut() {
    signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#1e293b] border-r border-gray-200 dark:border-[#334155] transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-[#334155]">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#1e3a5f] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-sm text-gray-900 dark:text-white">Union Baptist</span>
                <p className="text-[10px] text-[#4a90d9] -mt-0.5">IBADAN</p>
              </div>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-[#1e3a5f]/10 text-[#1e3a5f] dark:bg-[#4a90d9]/10 dark:text-[#4a90d9]' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-[#334155] dark:hover:text-white'}`}>
                  {item.icon}
                  {item.label}
                  {item.badge && <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{item.badge}</span>}
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-[#334155]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center">
                <User className="w-4 h-4 text-[#1e3a5f] dark:text-[#4a90d9]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.profile?.name || 'User'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{role?.replace('_', ' ')}</p>
              </div>
              <button onClick={handleSignOut} className="p-2 text-gray-400 hover:text-red-500 rounded-md hover:bg-gray-100 dark:hover:bg-[#334155]" title="Sign Out">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 h-16 bg-white dark:bg-[#1e293b] border-b border-gray-200 dark:border-[#334155] flex items-center px-4 lg:px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 rounded-md hover:bg-gray-100 dark:hover:bg-[#334155]">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white lg:ml-0">
            {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={toggle} className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-[#334155] transition-colors" title="Toggle dark mode">
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
