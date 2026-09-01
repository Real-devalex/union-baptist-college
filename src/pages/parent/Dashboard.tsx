import { Card, CardContent } from '@/components/ui/Card'
import { GraduationCap } from 'lucide-react'

export default function ParentDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Parent Dashboard</h2>
        <p className="text-gray-500 dark:text-gray-400">Monitor your children's academic progress</p>
      </div>
      <Card>
        <CardContent>
          <div className="text-center py-12">
            <GraduationCap className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Children</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">View your linked children's results, attendance, and teacher comments.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
