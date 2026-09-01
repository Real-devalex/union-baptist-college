import { Card, CardContent } from '@/components/ui/Card'
import { Bell } from 'lucide-react'

export default function PrincipalApplications() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admission Applications</h2>
        <p className="text-gray-500 dark:text-gray-400">Review and approve student admissions</p>
      </div>
      <Card>
        <CardContent>
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Applications</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">View submitted admission applications and take action on pending reviews.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
