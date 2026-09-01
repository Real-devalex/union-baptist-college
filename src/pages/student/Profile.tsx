import { Card, CardContent, CardTitle } from '@/components/ui/Card'
import { User } from 'lucide-react'

export default function StudentProfile() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
        <p className="text-gray-500">View and manage your profile information</p>
      </div>

      <Card>
        <div className="p-4 border-b border-gray-200">
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </CardTitle>
        </div>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-500">Full Name</label>
              <p className="font-medium text-gray-900">—</p>
            </div>
            <div>
              <label className="block text-sm text-gray-500">Admission Number</label>
              <p className="font-medium text-gray-900">—</p>
            </div>
            <div>
              <label className="block text-sm text-gray-500">Gender</label>
              <p className="font-medium text-gray-900">—</p>
            </div>
            <div>
              <label className="block text-sm text-gray-500">Class</label>
              <p className="font-medium text-gray-900">—</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
