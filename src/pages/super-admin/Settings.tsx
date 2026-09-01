import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardTitle } from '@/components/ui/Card'
import { Settings, Save, Loader2 } from 'lucide-react'

interface SchoolSettings {
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
}

export default function SuperAdminSettings() {
  const [settings, setSettings] = useState<SchoolSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { loadSettings() }, [])

  async function loadSettings() {
    setLoading(true)
    const { data } = await supabase
      .from('school_settings')
      .select('*')
      .limit(1)
      .single()
    setSettings(data)
    setLoading(false)
  }

  async function saveSettings() {
    if (!settings) return
    setSaving(true)
    const { error } = await supabase
      .from('school_settings')
      .update({
        school_name: settings.school_name,
        address: settings.address,
        email: settings.email,
        phone: settings.phone,
        motto: settings.motto,
        report_title: settings.report_title,
        report_footer: settings.report_footer,
        primary_color: settings.primary_color,
        secondary_color: settings.secondary_color,
        principal_display_name: settings.principal_display_name,
      })
      .eq('id', settings.id)
    setSaving(false)
    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">School Settings</h2>
          <p className="text-gray-500">Configure school branding and information</p>
        </div>
        <button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* School Information */}
        <Card>
          <div className="p-4 border-b border-gray-200">
            <CardTitle>School Information</CardTitle>
          </div>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
              <input
                type="text"
                value={settings.school_name}
                onChange={(e) => setSettings({ ...settings, school_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                value={settings.address || ''}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={settings.email || ''}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={settings.phone || ''}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Motto</label>
              <input
                type="text"
                value={settings.motto || ''}
                onChange={(e) => setSettings({ ...settings, motto: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Principal Display Name</label>
              <input
                type="text"
                value={settings.principal_display_name || ''}
                onChange={(e) => setSettings({ ...settings, principal_display_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </CardContent>
        </Card>

        {/* Report Settings */}
        <Card>
          <div className="p-4 border-b border-gray-200">
            <CardTitle>Report Settings</CardTitle>
          </div>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Title</label>
              <input
                type="text"
                value={settings.report_title || ''}
                onChange={(e) => setSettings({ ...settings, report_title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., End of Term Report"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Footer</label>
              <textarea
                value={settings.report_footer || ''}
                onChange={(e) => setSettings({ ...settings, report_footer: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.primary_color || '#1e40af'}
                    onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                    className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.primary_color || ''}
                    onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.secondary_color || '#f59e0b'}
                    onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                    className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.secondary_color || ''}
                    onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">School Logo</label>
              <div className="flex items-center gap-4">
                {settings.logo && (
                  <img src={settings.logo} alt="School Logo" className="w-16 h-16 object-contain rounded border" />
                )}
                <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
                  Upload Logo
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
