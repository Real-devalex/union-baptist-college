import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth, getDashboardPath } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { GraduationCap, Loader2, ArrowLeft, KeyRound, User } from 'lucide-react'

export default function ParentLoginPage() {
  const [parentId, setParentId] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, user } = useAuth()
  const navigate = useNavigate()

  if (user?.profile) {
    navigate(getDashboardPath(user.profile.role), { replace: true })
    return null
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Find parent by parent_id
      const { data: parent, error: parentError } = await supabase
        .from('parent_profiles')
        .select('id, user_id, login_pin, parent_id')
        .eq('parent_id', parentId.trim().toUpperCase())
        .single()

      if (parentError || !parent) {
        setError('Parent ID not found. Please check and try again.')
        setLoading(false)
        return
      }

      if (!parent.user_id) {
        setError('No portal account linked to this parent. Contact the school admin.')
        setLoading(false)
        return
      }

      // Verify PIN
      if (parent.login_pin !== pin) {
        setError('Incorrect PIN. Please try again.')
        setLoading(false)
        return
      }

      // Get the user email to sign in via Supabase Auth
      const { data: userProfile } = await supabase
        .from('users')
        .select('email')
        .eq('id', parent.user_id)
        .single()

      if (!userProfile) {
        setError('Account issue. Contact the school admin.')
        setLoading(false)
        return
      }

      const { error: authError } = await supabase.auth.signInWithPassword({
        email: userProfile.email,
        password: pin,
      })

      if (authError) {
        setError('Login failed. Your PIN may need to be reset by the school admin.')
        setLoading(false)
        return
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3a5f] via-[#1e3a5f] to-[#2a5080]">
      <div className="w-full max-w-md px-4">
        <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#4a90d9] mb-4 shadow-lg">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Parent Portal</h1>
          <p className="text-[#4a90d9] text-sm font-medium mt-1">Union Baptist College, Ibadan</p>
          <p className="text-white/50 text-xs mt-2">Sign in with your Parent ID and PIN</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Parent Sign In</h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-100">{error}</div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="parentId" className="block text-sm font-medium text-gray-700 mb-1">Parent ID</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="parentId"
                  type="text"
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4a90d9] focus:border-[#4a90d9] text-sm uppercase"
                  placeholder="e.g. PARENT-001"
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Your Parent ID was sent to you by the school</p>
            </div>
            <div>
              <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-1">PIN</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="pin"
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  required
                  minLength={4}
                  maxLength={8}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4a90d9] focus:border-[#4a90d9] text-sm"
                  placeholder="Enter your PIN"
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Your PIN was given to you by the school admin</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1e3a5f] hover:bg-[#162d4a] text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (<><Loader2 className="w-4 h-4 animate-spin" />Signing in...</>) : 'Sign In'}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center space-y-2">
          <Link to="/student-login" className="block text-white/40 hover:text-white/70 text-xs transition-colors">
            Are you a student? Sign in here
          </Link>
          <Link to="/staff-login" className="block text-white/40 hover:text-white/70 text-xs transition-colors">
            Staff login
          </Link>
        </div>
      </div>
    </div>
  )
}
