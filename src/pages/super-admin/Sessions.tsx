import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardTitle } from '@/components/ui/Card'
import { Calendar, Plus, Check } from 'lucide-react'

interface Session {
  id: string
  name: string
  start_date: string
  end_date: string
  is_current: boolean
  status: string
  created_at: string
}

export default function SuperAdminSessions() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newSession, setNewSession] = useState({ name: '', start_date: '', end_date: '' })

  useEffect(() => { loadSessions() }, [])

  async function loadSessions() {
    const { data } = await supabase.from('academic_sessions').select('*').order('created_at', { ascending: false })
    setSessions(data || [])
    setLoading(false)
  }

  async function createSession(e: React.FormEvent) {
    e.preventDefault()
    await supabase.from('academic_sessions').insert({
      name: newSession.name,
      start_date: newSession.start_date,
      end_date: newSession.end_date,
      is_current: false,
      status: 'UPCOMING',
    })
    setNewSession({ name: '', start_date: '', end_date: '' })
    setShowCreate(false)
    loadSessions()
  }

  async function setCurrent(sessionId: string) {
    // Unset all current
    await supabase.from('academic_sessions').update({ is_current: false }).neq('id', sessionId)
    // Set this one
    await supabase.from('academic_sessions').update({ is_current: true, status: 'ACTIVE' }).eq('id', sessionId)
    loadSessions()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Academic Sessions</h2>
          <p className="text-gray-500">Manage academic sessions and current session</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-md hover:bg-[#162d4a]">
          <Plus className="w-4 h-4" /> Create Session
        </button>
      </div>

      {showCreate && (
        <Card>
          <CardContent>
            <form onSubmit={createSession} className="grid sm:grid-cols-3 gap-4">
              <input type="text" placeholder="e.g. 2027/2028" value={newSession.name} onChange={(e) => setNewSession({ ...newSession, name: e.target.value })} required className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#4a90d9]" />
              <input type="date" value={newSession.start_date} onChange={(e) => setNewSession({ ...newSession, start_date: e.target.value })} required className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#4a90d9]" />
              <input type="date" value={newSession.end_date} onChange={(e) => setNewSession({ ...newSession, end_date: e.target.value })} required className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#4a90d9]" />
              <div className="sm:col-span-3 flex gap-2">
                <button type="submit" className="px-4 py-2 bg-[#1e3a5f] text-white rounded-md text-sm hover:bg-[#162d4a]">Save</button>
                <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">Cancel</button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e3a5f]" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Session</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sessions.map((s) => (
                  <tr key={s.id} className={s.is_current ? 'bg-[#4a90d9]/5' : ''}>
                    <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{new Date(s.start_date).toLocaleDateString('en-NG')}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{new Date(s.end_date).toLocaleDateString('en-NG')}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.is_current ? 'bg-green-100 text-green-700' : s.status === 'COMPLETED' ? 'bg-gray-100 text-gray-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {s.is_current ? 'CURRENT' : s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {!s.is_current && (
                        <button onClick={() => setCurrent(s.id)} className="flex items-center gap-1 px-3 py-1 text-sm text-[#1e3a5f] hover:bg-[#1e3a5f]/5 rounded-md">
                          <Check className="w-4 h-4" /> Set Current
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
