import { Card, CardContent, CardTitle } from '@/components/ui/Card'
import { FileText, Download, Printer } from 'lucide-react'

export default function PrincipalReports() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
        <p className="text-gray-500">Generate and download academic reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-blue-50 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-base">Midterm Reports</CardTitle>
              <p className="text-sm text-gray-500">Generate midterm assessment reports</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-green-50 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-base">1st Term Reports</CardTitle>
              <p className="text-sm text-gray-500">End of first term reports</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <FileText className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <CardTitle className="text-base">2nd Term Reports</CardTitle>
              <p className="text-sm text-gray-500">End of second term reports</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-purple-50 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-base">3rd Term / Annual Reports</CardTitle>
              <p className="text-sm text-gray-500">Cumulative annual reports</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-red-50 rounded-lg">
              <Download className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-base">Class Performance</CardTitle>
              <p className="text-sm text-gray-500">Class-level performance summary</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <Printer className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <CardTitle className="text-base">Subject Performance</CardTitle>
              <p className="text-sm text-gray-500">Subject-level performance summary</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
