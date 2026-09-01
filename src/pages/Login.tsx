import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth, getDashboardPath } from '@/contexts/AuthContext'
import { GraduationCap, Loader2, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, user } = useAuth()
  const navigate = useNavigate()

  if (user?.profile) {
    navigate(getDashboardPath(user.profile.role), { replace: true })
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await signIn(email, password)
    if (result.error) {
      setError(result.error)
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
          <h1 className="text-2xl font-bold text-white">Union Baptist College</h1>
          <p className="text-[#4a90d9] text-sm font-medium mt-1">IBADAN</p>
          <p className="text-white/50 text-xs mt-2 italic">Knowledge is Light</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Sign In</h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-100">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center mb-3">Demo Accounts (password: password123)</p>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between"><span className="font-mono">admin@school.com</span><span className="text-[#1e3a5f] font-medium">Super Admin</span></div>
              <div className="flex justify-between"><span className="font-mono">principal@school.com</span><span className="text-[#1e3a5f] font-medium">Principal</span></div>
              <div className="flex justify-between"><span className="font-mono">teacher1@school.com</span><span className="text-[#1e3a5f] font-medium">Teacher</span></div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-white/30 mt-6">
          Union Baptist College Academic Portal
        </p>
      </div>
    </div>
  )
}
