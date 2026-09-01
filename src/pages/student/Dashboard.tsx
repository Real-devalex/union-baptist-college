import { Card, CardContent, CardTitle } from '@/components/ui/Card'
import { FileText, GraduationCap, Calendar } from 'lucide-react'

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Student Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-blue-50 rounded-lg">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">My Class</p>
              <p className="font-semibold text-gray-900">JSS1 A</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-green-50 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Published Results</p>
              <p className="font-semibold text-gray-900">0</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Term</p>
              <p className="font-semibold text-gray-900">1st Term</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-gray-200">
          <CardTitle>Recent Results</CardTitle>
        </div>
        <CardContent>
          <p className="text-sm text-gray-500">No published results yet. Check back later.</p>
        </CardContent>
      </Card>
    </div>
  )
}
