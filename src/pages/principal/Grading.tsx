import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardTitle } from '@/components/ui/Card'
import { Star, Plus, Save, Loader2 } from 'lucide-react'

interface GradeEntry {
  id: string
  label: string
  min_score: number
  max_score: number
  description: string | null
  sort_order: number
}

export default function PrincipalGrading() {
  const [grades, setGrades] = useState<GradeEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadGrades() }, [])

  async function loadGrades() {
    setLoading(true)
    const { data } = await supabase
      .from('grade_scales')
      .select('*')
      .order('sort_order')
    setGrades(data || [])
    setLoading(false)
  }

  async function saveGrades() {
    setSaving(true)
    // Update each grade
    for (const g of grades) {
      await supabase
        .from('grade_scales')
        .update({ label: g.label, min_score: g.min_score, max_score: g.max_score, description: g.description })
        .eq('id', g.id)
    }
    setSaving(false)
    loadGrades()
  }

  function updateGrade(id: string, field: keyof GradeEntry, value: string | number) {
    setGrades(grades.map((g) => g.id === id ? { ...g, [field]: value } : g))
  }

  function addGrade() {
    const maxSort = Math.max(...grades.map((g) => g.sort_order), 0)
    setGrades([...grades, {
      id: `new-${Date.now()}`,
      label: '',
      min_score: 0,
      max_score: 0,
      description: null,
      sort_order: maxSort + 1,
    }])
  }

  if (loading) {
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
          <h2 className="text-2xl font-bold text-gray-900">Grading Scale</h2>
          <p className="text-gray-500">Configure the global grading scale for the school</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={addGrade}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Plus className="w-4 h-4" />
            Add Grade
          </button>
          <button
            onClick={saveGrades}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </button>
        </div>
      </div>

      <Card>
        <div className="p-4 border-b border-gray-200">
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Grade Ranges
          </CardTitle>
        </div>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Label</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Score</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Max Score</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {grades.map((g) => (
                  <tr key={g.id}>
                    <td className="px-4 py-2 text-sm text-gray-500">{g.sort_order}</td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={g.label}
                        onChange={(e) => updateGrade(g.id, 'label', e.target.value)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-center font-bold"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={g.min_score}
                        onChange={(e) => updateGrade(g.id, 'min_score', Number(e.target.value))}
                        className="w-24 px-2 py-1 border border-gray-300 rounded"
                        min={0}
                        max={100}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={g.max_score}
                        onChange={(e) => updateGrade(g.id, 'max_score', Number(e.target.value))}
                        className="w-24 px-2 py-1 border border-gray-300 rounded"
                        min={0}
                        max={100}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={g.description || ''}
                        onChange={(e) => updateGrade(g.id, 'description', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                        placeholder="Description"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
