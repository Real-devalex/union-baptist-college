import { Card, CardContent } from '@/components/ui/Card'
import { Award } from 'lucide-react'

export default function PrincipalTeachers() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Teachers</h2>
        <p className="text-gray-500 dark:text-gray-400">View teacher assignments and performance</p>
      </div>
      <Card>
        <CardContent>
          <div className="text-center py-12">
            <Award className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Teacher Directory</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">View teachers, their subject assignments, and class responsibilities.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
