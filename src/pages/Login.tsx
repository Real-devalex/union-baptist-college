import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth, getDashboardPath } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { GraduationCap, Loader2, ArrowLeft, UserPlus, LogIn } from 'lucide-react'

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, user } = useAuth()
  const navigate = useNavigate()

  if (user?.profile) {
    navigate(getDashboardPath(user.profile.role), { replace: true })
    return null
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await signIn(email, password)
    if (result.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: undefined,
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      setSuccess('Account created! Your admin will set your role. You can now sign in.')
      setLoading(false)
    }
  }

  function toggleMode() {
    setIsSignUp(!isSignUp)
    setError('')
    setSuccess('')
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
          <h1 className="text-2xl font-bold text-white">Union Baptist College</h1>
          <p className="text-[#4a90d9] text-sm font-medium mt-1">IBADAN</p>
          <p className="text-white/50 text-xs mt-2 italic">Knowledge is Light</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">{isSignUp ? 'Create Account' : 'Sign In'}</h2>
            <button onClick={toggleMode} className="flex items-center gap-1.5 text-xs font-medium text-[#4a90d9] hover:text-[#1e3a5f] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#4a90d9]/5">
              {isSignUp ? <><LogIn className="w-3.5 h-3.5" />Sign In</> : <><UserPlus className="w-3.5 h-3.5" />Create Account</>}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-100">{error}</div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-700 text-sm border border-green-100">{success}</div>
          )}

          {isSignUp ? (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4a90d9] focus:border-[#4a90d9] text-sm"
                  placeholder="John Doe" disabled={loading} />
              </div>
              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4a90d9] focus:border-[#4a90d9] text-sm"
                  placeholder="you@school.com" disabled={loading} />
              </div>
              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4a90d9] focus:border-[#4a90d9] text-sm"
                  placeholder="Min 6 characters" disabled={loading} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#4a90d9] hover:bg-[#3a7bc8] text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl">
                {loading ? (<><Loader2 className="w-4 h-4 animate-spin" />Creating Account...</>) : 'Create Account'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4a90d9] focus:border-[#4a90d9] text-sm"
                  placeholder="you@school.com" disabled={loading} />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4a90d9] focus:border-[#4a90d9] text-sm"
                  placeholder="Enter your password" disabled={loading} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1e3a5f] hover:bg-[#162d4a] text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl">
                {loading ? (<><Loader2 className="w-4 h-4 animate-spin" />Signing in...</>) : 'Sign In'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-white/30 mt-6">
          Union Baptist College Academic Portal
        </p>
      </div>
    </div>
  )
}
