import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Settings,
  LogOut,
  ClipboardList,
  FileText,
  Star,
  User,
  Menu,
  X,
  School,
} from 'lucide-react'
import { useState } from 'react'
import type { UserRole } from '@/types/database'

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
}

const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  SUPER_ADMIN: [
    { label: 'Dashboard', path: '/super-admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Users', path: '/super-admin/users', icon: <Users className="w-5 h-5" /> },
    { label: 'Students', path: '/super-admin/students', icon: <GraduationCap className="w-5 h-5" /> },
    { label: 'Classes', path: '/super-admin/classes', icon: <School className="w-5 h-5" /> },
    { label: 'Subjects', path: '/super-admin/subjects', icon: <BookOpen className="w-5 h-5" /> },
    { label: 'Settings', path: '/super-admin/settings', icon: <Settings className="w-5 h-5" /> },
  ],
  PRINCIPAL: [
    { label: 'Dashboard', path: '/principal/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Review Results', path: '/principal/review', icon: <ClipboardList className="w-5 h-5" /> },
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
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const role = user?.profile?.role as UserRole | undefined
  const navItems: NavItem[] = role ? NAV_ITEMS[role] : []

  function handleSignOut() {
    signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">School Portal</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">              {navItems.map((item: NavItem) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* User info & sign out */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.profile?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {role?.replace('_', ' ')}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-400 hover:text-red-500 rounded-md hover:bg-gray-100"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="ml-3 text-lg font-semibold text-gray-900 lg:ml-0">
            {navItems.find((i: NavItem) => i.path === location.pathname)?.label || 'Dashboard'}
          </h1>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
