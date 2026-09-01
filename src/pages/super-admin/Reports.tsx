import { Card, CardContent } from '@/components/ui/Card'
import { BarChart3 } from 'lucide-react'

export default function SuperAdminReports() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h2>
        <p className="text-gray-500 dark:text-gray-400">School-wide academic reports and analytics</p>
      </div>
      <Card>
        <CardContent>
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Reports Coming Soon</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">This section will contain school-wide analytics, performance trends, and exportable reports.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
