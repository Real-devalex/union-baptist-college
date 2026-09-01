import { Link } from 'react-router-dom'
import { GraduationCap, BookOpen, Users, BarChart3, FileText, Shield, ArrowRight, Star, ChevronRight, Award, School, Calendar, ClipboardCheck } from 'lucide-react'
const features = [
  { icon: BookOpen, title: 'Academic Management', description: 'Complete result management from midterm assessments to final term reports with automatic grade calculation.' },
  { icon: BarChart3, title: 'Smart Calculations', description: 'Automatic CA averaging, grade computation, and competition ranking calculated server-side with zero errors.' },
  { icon: ClipboardCheck, title: 'Approval Workflow', description: 'Teachers enter scores, Principal reviews, results published. Every step tracked with full audit trail.' },
  { icon: FileText, title: 'PDF Report Cards', description: 'Professional printable report cards for 1st Term, 2nd Term, and 3rd Term cumulative results.' },
  { icon: Shield, title: 'Role-Based Security', description: 'Five distinct roles: Super Admin, Principal, Teacher, Student, Parent with precise permissions.' },
  { icon: Users, title: 'Multi-Class Support', description: 'JSS1 to SS3 with unlimited class arms. Students can transfer between arms while preserving historical scores.' },
]

const stats = [
  { label: 'Class Arms', value: '15+' },
  { label: 'Subjects', value: 'Unlimited' },
  { label: 'Academic Terms', value: '3 Per Year' },
  { label: 'Report Types', value: '4' },
]

const steps = [
  { step: '01', title: 'Teacher Enters Scores', desc: 'Midterm, post-midterm, and exam scores entered in a fast spreadsheet-like interface.', color: 'bg-[#1e3a5f]' },
  { step: '02', title: 'System Calculates', desc: 'CA averaging, grading, subject positions, and overall rankings computed automatically.', color: 'bg-[#4a90d9]' },
  { step: '03', title: 'Principal Reviews', desc: 'Principal reviews, approves, or rejects results. Returns for correction if needed.', color: 'bg-[#1e3a5f]' },
  { step: '04', title: 'Results Published', desc: 'Approved results published. Students and parents view report cards and download PDFs.', color: 'bg-[#4a90d9]' },
]

const roles = [
  { role: 'Super Admin', desc: 'IT administrator. Manages users, school settings, and system configuration.', icon: Shield, access: 'Full System Access' },
  { role: 'Principal', desc: 'Academic authority. Reviews, approves, and publishes student results.', icon: Award, access: 'Academic Approval' },
  { role: 'Teacher', desc: 'Enters scores for assigned classes and subjects only.', icon: BookOpen, access: 'Score Entry' },
  { role: 'Student', desc: 'Views own results, grades, positions, and downloads report cards.', icon: GraduationCap, access: 'Own Results Only' },
  { role: 'Parent', desc: 'Views linked children results, attendance, and report cards.', icon: Users, access: 'Linked Children' },
]

const reportTypes = [
  { title: 'Midterm Report', desc: 'Note and Attendance, CA1, CA2 scores with midterm grades and subject positions.', badge: '30 Marks', icon: ClipboardCheck },
  { title: '1st Term Report', desc: 'Full terminal result with CA (30), Exam (70), grades, positions, and attendance.', badge: '100 Marks', icon: FileText },
  { title: '2nd Term Report', desc: 'Same comprehensive structure as 1st Term with proper CA averaging.', badge: '100 Marks', icon: FileText },
  { title: '3rd Term / Annual', desc: 'Cumulative report with all 3 terms, annual totals, averages, and final positions.', badge: '300 Marks', icon: Award },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-[#1e3a5f]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#4a90d9] flex items-center justify-center shadow-lg">
                <GraduationCap className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-sm sm:text-lg leading-tight">Union Baptist College</h1>
                <p className="text-[#4a90d9] text-[10px] sm:text-xs font-medium tracking-wide">IBADAN</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-white/80 hover:text-white text-sm font-medium transition-colors">Features</a>
              <a href="#how-it-works" className="text-white/80 hover:text-white text-sm font-medium transition-colors">How It Works</a>
              <a href="#roles" className="text-white/80 hover:text-white text-sm font-medium transition-colors">Roles</a>
            </div>
            <Link to="/login" className="flex items-center gap-2 bg-[#4a90d9] hover:bg-[#3a7bc8] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">Sign In<ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#1e3a5f] via-[#1e3a5f] to-[#2a5080]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#4a90d9]/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#4a90d9]/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/5" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8">
              <School className="w-4 h-4 text-[#4a90d9]" />
              <span className="text-white/90 text-xs sm:text-sm font-medium">Academic Management and Result Portal</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6">Welcome to <span className="text-[#4a90d9]">Union Baptist</span><br />College Portal</h2>
            <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">A modern, secure platform for managing student results, academic reports, and school administration built for the standards of Nigerian secondary education.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login" className="flex items-center gap-2 bg-[#4a90d9] hover:bg-[#3a7bc8] text-white px-8 py-4 rounded-xl text-base font-bold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 w-full sm:w-auto justify-center">Sign In to Portal<ArrowRight className="w-5 h-5" /></Link>
              <a href="#features" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-xl text-base font-semibold transition-all w-full sm:w-auto justify-center">Learn More<ChevronRight className="w-5 h-5" /></a>
            </div>
            <p className="mt-12 text-white/50 text-sm italic tracking-wide">Knowledge is Light</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0"><svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full"><path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/></svg></div>
      </section>

      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (<div key={stat.label} className="text-center"><div className="text-3xl sm:text-4xl font-extrabold text-[#1e3a5f] mb-1">{stat.value}</div><div className="text-sm text-gray-500 font-medium">{stat.label}</div></div>))}
          </div>
        </div>
      </section>

      <section id="features" className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#1e3a5f]/5 rounded-full px-4 py-1.5 mb-4"><Star className="w-4 h-4 text-[#4a90d9]" /><span className="text-[#1e3a5f] text-sm font-semibold">Platform Features</span></div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Everything Your School Needs</h3>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">From score entry to report card generation a complete academic management system.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => { const Icon = f.icon; return (<div key={f.title} className="group bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#4a90d9]/20 transition-all duration-300 hover:-translate-y-1"><div className="w-14 h-14 rounded-xl bg-[#1e3a5f]/5 group-hover:bg-[#4a90d9]/10 flex items-center justify-center mb-6 transition-colors"><Icon className="w-7 h-7 text-[#1e3a5f] group-hover:text-[#4a90d9] transition-colors" /></div><h4 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h4><p className="text-gray-500 leading-relaxed">{f.description}</p></div>); })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#4a90d9]/10 rounded-full px-4 py-1.5 mb-4"><Calendar className="w-4 h-4 text-[#4a90d9]" /><span className="text-[#1e3a5f] text-sm font-semibold">Workflow</span></div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">How It Works</h3>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">A simple, secure four-step process from score entry to published results.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((item, i) => (
              <div key={item.step} className="relative text-center">
                {i < 3 && (<div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-[#1e3a5f]/20 to-[#4a90d9]/20" />)}
                <div className={`w-20 h-20 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg relative z-10`}>
                  <span className="text-white font-extrabold text-2xl">{item.step}</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="roles" className="py-20 sm:py-28 bg-gradient-to-br from-[#1e3a5f] to-[#2a5080]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16"><h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Built for Every Role</h3><p className="text-white/60 text-lg max-w-2xl mx-auto">Strict role separation ensures the right people have the right access.</p></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {roles.map((item) => { const Icon = item.icon; return (<div key={item.role} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/15 transition-all"><div className="w-14 h-14 rounded-xl bg-[#4a90d9]/20 flex items-center justify-center mx-auto mb-4"><Icon className="w-7 h-7 text-[#4a90d9]" /></div><h4 className="text-white font-bold mb-2">{item.role}</h4><p className="text-white/60 text-sm mb-3 leading-relaxed">{item.desc}</p><span className="inline-block bg-[#4a90d9]/20 text-[#4a90d9] text-xs font-semibold px-3 py-1 rounded-full">{item.access}</span></div>); })}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16"><h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Four Report Types</h3><p className="text-gray-500 text-lg max-w-2xl mx-auto">Comprehensive reports at every stage of the academic year.</p></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reportTypes.map((item) => { const Icon = item.icon; return (<div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all"><div className="flex items-center justify-between mb-4"><Icon className="w-8 h-8 text-[#1e3a5f]" /><span className="bg-[#4a90d9]/10 text-[#4a90d9] text-xs font-bold px-3 py-1 rounded-full">{item.badge}</span></div><h4 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h4><p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p></div>); })}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2a5080] rounded-3xl p-12 sm:p-16 shadow-2xl">
            <GraduationCap className="w-16 h-16 text-[#4a90d9] mx-auto mb-6" />
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Ready to Get Started?</h3>
            <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">Sign in with your school credentials to access the academic portal.</p>
            <Link to="/login" className="inline-flex items-center gap-2 bg-[#4a90d9] hover:bg-[#3a7bc8] text-white px-10 py-4 rounded-xl text-lg font-bold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">Sign In Now<ArrowRight className="w-5 h-5" /></Link>
          </div>
        </div>
      </section>

      <footer className="bg-[#1e3a5f] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div><div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 rounded-xl bg-[#4a90d9] flex items-center justify-center"><GraduationCap className="w-5 h-5 text-white" /></div><div><h4 className="text-white font-bold">Union Baptist College</h4><p className="text-[#4a90d9] text-xs">IBADAN</p></div></div><p className="text-white/50 text-sm leading-relaxed">Empowering academic excellence through modern technology and secure result management.</p></div>
            <div><h5 className="text-white font-semibold mb-4">Quick Links</h5><div className="space-y-2"><a href="#features" className="block text-white/50 hover:text-white text-sm transition-colors">Features</a><a href="#how-it-works" className="block text-white/50 hover:text-white text-sm transition-colors">How It Works</a><a href="#roles" className="block text-white/50 hover:text-white text-sm transition-colors">User Roles</a></div></div>
            <div><h5 className="text-white font-semibold mb-4">Contact</h5><div className="space-y-2 text-white/50 text-sm"><p>Ibadan, Oyo State, Nigeria</p><p>Union Baptist College</p><p className="text-white/30 text-xs mt-4 italic">Knowledge is Light</p></div></div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center"><p className="text-white/30 text-xs">Academic Management and Result Portal built for Nigerian Secondary Schools</p></div>
        </div>
      </footer>
    </div>
  )
}
