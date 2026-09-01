import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { GraduationCap, ArrowLeft, Loader2, CheckCircle } from 'lucide-react'

export default function AdmissionApplication() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    applicant_name: '',
    applicant_phone: '',
    applicant_email: '',
    student_first_name: '',
    student_middle_name: '',
    student_surname: '',
    student_gender: 'MALE' as 'MALE' | 'FEMALE',
    student_date_of_birth: '',
    parent_name: '',
    parent_phone: '',
    parent_email: '',
    parent_occupation: '',
    desired_class_level: 'JSS1',
    previous_school: '',
  })

  const update = (field: string, value: string) => setForm({ ...form, [field]: value })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: insertError } = await supabase.from('admission_applications').insert({
      applicant_name: form.applicant_name,
      applicant_phone: form.applicant_phone,
      applicant_email: form.applicant_email || null,
      student_first_name: form.student_first_name,
      student_middle_name: form.student_middle_name || null,
      student_surname: form.student_surname,
      student_gender: form.student_gender,
      student_date_of_birth: form.student_date_of_birth || null,
      parent_name: form.parent_name,
      parent_phone: form.parent_phone,
      parent_email: form.parent_email || null,
      parent_occupation: form.parent_occupation || null,
      desired_class_level: form.desired_class_level,
      previous_school: form.previous_school || null,
    })

    if (insertError) {
      setError('Failed to submit application. Please try again.')
      setLoading(false)
      return
    }

    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3a5f] to-[#2a5080]">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md mx-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Application Submitted!</h2>
          <p className="text-gray-500 mb-6">Your admission application has been received. The school administration will review it and contact you.</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-[#1e3a5f] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#162d4a] transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a5f] via-[#1e3a5f] to-[#2a5080] py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#4a90d9] mb-3 shadow-lg">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admission Application</h1>
          <p className="text-[#4a90d9] text-sm">Union Baptist College, Ibadan — 2026/2027 Session</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
          {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-100">{error}</div>}

          {/* Parent/Guardian Info */}
          <div>
            <h3 className="text-sm font-bold text-[#1e3a5f] uppercase tracking-wide mb-3">Parent / Guardian Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name *" value={form.parent_name} onChange={(e) => update('parent_name', e.target.value)} required className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4a90d9]" />
              <input type="tel" placeholder="Phone Number *" value={form.parent_phone} onChange={(e) => update('parent_phone', e.target.value)} required className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4a90d9]" />
              <input type="email" placeholder="Email (optional)" value={form.parent_email} onChange={(e) => update('parent_email', e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4a90d9]" />
              <input type="text" placeholder="Occupation (optional)" value={form.parent_occupation} onChange={(e) => update('parent_occupation', e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4a90d9]" />
            </div>
          </div>

          {/* Applicant Info */}
          <div>
            <h3 className="text-sm font-bold text-[#1e3a5f] uppercase tracking-wide mb-3">Your Details (Contact Person)</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Your Full Name *" value={form.applicant_name} onChange={(e) => update('applicant_name', e.target.value)} required className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4a90d9]" />
              <input type="tel" placeholder="Your Phone *" value={form.applicant_phone} onChange={(e) => update('applicant_phone', e.target.value)} required className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4a90d9]" />
              <input type="email" placeholder="Your Email (optional)" value={form.applicant_email} onChange={(e) => update('applicant_email', e.target.value)} className="sm:col-span-2 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4a90d9]" />
            </div>
          </div>

          {/* Student Info */}
          <div>
            <h3 className="text-sm font-bold text-[#1e3a5f] uppercase tracking-wide mb-3">Student Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <input type="text" placeholder="First Name *" value={form.student_first_name} onChange={(e) => update('student_first_name', e.target.value)} required className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4a90d9]" />
              <input type="text" placeholder="Middle Name (optional)" value={form.student_middle_name} onChange={(e) => update('student_middle_name', e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4a90d9]" />
              <input type="text" placeholder="Surname *" value={form.student_surname} onChange={(e) => update('student_surname', e.target.value)} required className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4a90d9]" />
              <select value={form.student_gender} onChange={(e) => update('student_gender', e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4a90d9]">
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
              <input type="date" placeholder="Date of Birth" value={form.student_date_of_birth} onChange={(e) => update('student_date_of_birth', e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4a90d9]" />
              <select value={form.desired_class_level} onChange={(e) => update('desired_class_level', e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4a90d9]">
                <option value="JSS1">JSS1</option>
                <option value="JSS2">JSS2</option>
                <option value="JSS3">JSS3</option>
                <option value="SS1">SS1</option>
                <option value="SS2">SS2</option>
                <option value="SS3">SS3</option>
              </select>
              <input type="text" placeholder="Previous School (optional)" value={form.previous_school} onChange={(e) => update('previous_school', e.target.value)} className="sm:col-span-2 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4a90d9]" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1e3a5f] hover:bg-[#162d4a] text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 shadow-lg hover:shadow-xl">
            {loading ? (<><Loader2 className="w-4 h-4 animate-spin" />Submitting...</>) : 'Submit Application'}
          </button>

          <p className="text-center text-xs text-gray-400">By submitting, you agree that the information provided is accurate.</p>
        </form>
      </div>
    </div>
  )
}
