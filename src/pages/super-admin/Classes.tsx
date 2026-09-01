import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardTitle } from '@/components/ui/Card'
import { School, Plus, Edit, Trash2 } from 'lucide-react'

interface ClassLevelWithArms {
  id: string
  name: string
  sort_order: number
  is_active: boolean
  arms: { id: string; name: string; is_active: boolean }[]
}

export default function SuperAdminClasses() {
  const [classes, setClasses] = useState<ClassLevelWithArms[]>([])
  const [loading, setLoading] = useState(true)
  const [newLevelName, setNewLevelName] = useState('')
  const [newArmName, setNewArmName] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')

  useEffect(() => { loadClasses() }, [])

  async function loadClasses() {
    setLoading(true)
    const { data: levels } = await supabase
      .from('class_levels')
      .select('*')
      .order('sort_order')

    const { data: arms } = await supabase
      .from('class_arms')
      .select('*')
      .order('name')

    if (levels) {
      setClasses(levels.map((l) => ({
        ...l,
        arms: arms?.filter((a) => a.class_level_id === l.id) || [],
      })))
    }
    setLoading(false)
  }

  async function addLevel() {
    if (!newLevelName.trim()) return
    const { error } = await supabase.from('class_levels').insert({
      name: newLevelName.trim().toUpperCase(),
      sort_order: classes.length + 1,
    })
    if (!error) {
      setNewLevelName('')
      loadClasses()
    }
  }

  async function addArm() {
    if (!selectedLevel || !newArmName.trim()) return
    const { error } = await supabase.from('class_arms').insert({
      class_level_id: selectedLevel,
      name: newArmName.trim().toUpperCase(),
    })
    if (!error) {
      setNewArmName('')
      setSelectedLevel('')
      loadClasses()
    }
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
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Class Management</h2>
        <p className="text-gray-500">Manage class levels and arms</p>
      </div>

      {/* Add New Level */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <CardTitle>Add Class Level</CardTitle>
        </div>
        <CardContent>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="e.g., SS1 C"
              value={newLevelName}
              onChange={(e) => setNewLevelName(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={addLevel}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Add Arm to Level */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <CardTitle>Add Arm to Level</CardTitle>
        </div>
        <CardContent>
          <div className="flex gap-3">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select class level</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Arm name (e.g., C)"
              value={newArmName}
              onChange={(e) => setNewArmName(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={addArm}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Class Levels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((cls) => (
          <Card key={cls.id}>
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <School className="w-5 h-5 text-primary" />
                <CardTitle>{cls.name}</CardTitle>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1 text-gray-400 hover:text-primary rounded" title="Edit">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-red-500 rounded" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {cls.arms.map((arm) => (
                  <span
                    key={arm.id}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      arm.is_active ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {cls.name} {arm.name}
                  </span>
                ))}
                {cls.arms.length === 0 && (
                  <p className="text-sm text-gray-400">No arms yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
