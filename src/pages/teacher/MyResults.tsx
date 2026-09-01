import { Card, CardContent } from '@/components/ui/Card'
import { FileText } from 'lucide-react'

export default function TeacherMyResults() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Results</h2>
        <p className="text-gray-500">View results you've submitted</p>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Result history will appear here after you submit scores.</p>
        </CardContent>
      </Card>
    </div>
  )
}
