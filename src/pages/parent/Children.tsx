import { Card, CardContent } from '@/components/ui/Card'
import { Users } from 'lucide-react'

export default function ParentChildren() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Children</h2>
        <p className="text-gray-500 dark:text-gray-400">View results and progress for each child</p>
      </div>
      <Card>
        <CardContent>
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Children's Results</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Access each child's term results, grades, positions, and attendance records.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
