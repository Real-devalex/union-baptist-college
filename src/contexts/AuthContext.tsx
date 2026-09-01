import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import type { UserRole } from '@/types/database'
import { Navigate } from 'react-router-dom'

interface AuthUser {
  id: string
  email: string
  profile: {
    id: string
    email: string
    name: string
    role: UserRole
    is_active: boolean
  } | null
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user.id, session.user.email || '')
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserProfile(session.user.id, session.user.email || '')
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function loadUserProfile(userId: string, email: string) {
    try {
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      setUser({ id: userId, email, profile })
    } catch {
      setUser({ id: userId, email, profile: null })
    } finally {
      setLoading(false)
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return { error: error.message }
      return {}
    } catch {
      return { error: 'An unexpected error occurred' }
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
  }

  async function refreshProfile() {
    if (!user) return
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    if (data) {
      setUser({ ...user, profile: data })
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export function ProtectedRoute({ children, allowedRoles }: { children: ReactNode; allowedRoles?: UserRole[] }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (allowedRoles && user.profile && !allowedRoles.includes(user.profile.role)) {
    return <Navigate to={getDashboardPath(user.profile.role)} replace />
  }

  return <>{children}</>
}

export function getDashboardPath(role: UserRole): string {
  switch (role) {
    case 'SUPER_ADMIN': return '/super-admin/dashboard'
    case 'PRINCIPAL': return '/principal/dashboard'
    case 'TEACHER': return '/teacher/dashboard'
    case 'STUDENT': return '/student/dashboard'
    case 'PARENT': return '/parent/dashboard'
    default: return '/login'
  }
}
