import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/Card'
import { Shield, Search } from 'lucide-react'

interface AuditLog {
  id: string
  user_id: string | null
  action: string
  entity: string
  entity_id: string | null
  old_value: string | null
  new_value: string | null
  reason: string | null
  created_at: string
}

export default function SuperAdminAudit() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [entityFilter, setEntityFilter] = useState('ALL')

  useEffect(() => { loadLogs() }, [])

  async function loadLogs() {
    const { data } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(500)
    setLogs(data || [])
    setLoading(false)
  }

  const filtered = logs.filter((l) => {
    const matchesSearch = !search || l.action.includes(search.toLowerCase()) || l.entity.includes(search.toLowerCase())
    const matchesEntity = entityFilter === 'ALL' || l.entity === entityFilter
    return matchesSearch && matchesEntity
  })

  const entities = [...new Set(logs.map(l => l.entity))]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Audit Logs</h2>
        <p className="text-gray-500">Track all important system actions</p>
      </div>

      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search logs..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#4a90d9]" />
            </div>
            <select value={entityFilter} onChange={(e) => setEntityFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option value="ALL">All Entities</option>
              {entities.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e3a5f]" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs text-gray-500">{new Date(log.created_at).toLocaleString('en-NG')}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#1e3a5f]/10 text-[#1e3a5f]">{log.action}</span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{log.entity}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 max-w-xs truncate">{log.entity_id || '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{log.reason || '—'}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-500">No audit logs found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
