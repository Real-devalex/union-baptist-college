import { Card, CardContent } from '@/components/ui/Card'
import { FileText } from 'lucide-react'

export default function StudentResults() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Results</h2>
        <p className="text-gray-500">View your academic results and reports</p>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Your results will appear here once published by your school.</p>
        </CardContent>
      </Card>
    </div>
  )
}
