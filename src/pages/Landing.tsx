import { Link } from 'react-router-dom'
import { GraduationCap, BookOpen, Users, Award, Calendar, Phone, Mail, MapPin, ChevronRight, Star, Shield, Menu, X } from 'lucide-react'
import { useState } from 'react'

const programs = [
  { name: 'Junior Secondary (JSS1-JSS3)', desc: 'Building strong foundations in academics, character, and leadership.' },
  { name: 'Senior Secondary (SS1-SS3)', desc: 'Preparing students for WAEC, NECO, and JAMB with excellence.' },
  { name: 'Science & Technology', desc: 'Modern science laboratories and computer studies.' },
  { name: 'Arts & Humanities', desc: 'Literature, Government, History and cultural education.' },
]

const values = [
  { title: 'Knowledge is Light', icon: Star, desc: 'We believe education illuminates every path to success.' },
  { title: 'Discipline', icon: Shield, desc: 'Building character through moral and academic discipline.' },
  { title: 'Excellence', icon: Award, desc: 'Striving for the highest standards in everything we do.' },
  { title: 'Community', icon: Users, desc: 'Fostering a supportive community of learners and leaders.' },
]

const gallery = [
  { title: 'Science Laboratory', desc: 'Well-equipped modern science lab' },
  { title: 'Computer Studies', desc: 'ICT center with modern equipment' },
  { title: 'Library', desc: 'Extensive collection of academic resources' },
  { title: 'Sports Complex', desc: 'Multi-sport facility for physical education' },
]

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#1e3a5f] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#4a90d9] flex items-center justify-center shadow-lg">
                <GraduationCap className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-sm sm:text-lg leading-tight">Union Baptist College</h1>
                <p className="text-[#4a90d9] text-[10px] sm:text-xs font-medium tracking-wide">IBADAN</p>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <a href="#about" className="text-white/80 hover:text-white text-sm font-medium transition-colors">About</a>
              <a href="#programs" className="text-white/80 hover:text-white text-sm font-medium transition-colors">Programs</a>
              <a href="#values" className="text-white/80 hover:text-white text-sm font-medium transition-colors">Values</a>
              <a href="#contact" className="text-white/80 hover:text-white text-sm font-medium transition-colors">Contact</a>
              <Link to="/student-login" className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all border border-white/20">
                Student Portal
              </Link>
              <Link to="/parent-login" className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all border border-white/20">
                Parent Portal
              </Link>
            </div>

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white p-2">
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-[#162d4a] border-t border-white/10">
            <div className="px-4 py-3 space-y-2">
              <a href="#about" className="block text-white/80 hover:text-white py-2 text-sm">About</a>
              <a href="#programs" className="block text-white/80 hover:text-white py-2 text-sm">Programs</a>
              <a href="#values" className="block text-white/80 hover:text-white py-2 text-sm">Values</a>
              <a href="#contact" className="block text-white/80 hover:text-white py-2 text-sm">Contact</a>
              <hr className="border-white/10" />
              <Link to="/student-login" onClick={() => setMenuOpen(false)} className="block bg-[#4a90d9] text-white text-center py-2.5 rounded-lg text-sm font-semibold">Student Portal</Link>
              <Link to="/parent-login" onClick={() => setMenuOpen(false)} className="block bg-white/10 text-white text-center py-2.5 rounded-lg text-sm font-semibold border border-white/20">Parent Portal</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#1e3a5f] via-[#1e3a5f] to-[#2a5080] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#4a90d9]/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#4a90d9]/5 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
                <Calendar className="w-4 h-4 text-[#4a90d9]" />
                <span className="text-white/90 text-xs sm:text-sm font-medium">Admission Open 2026/2027 Session</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                Welcome to<br />
                <span className="text-[#4a90d9]">Union Baptist</span><br />
                College
              </h2>
              <p className="text-lg text-white/70 max-w-xl mb-8 leading-relaxed">
                A prestigious institution committed to producing well-rounded individuals equipped with knowledge, discipline, and moral values for leadership in society.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/student-login" className="flex items-center justify-center gap-2 bg-[#4a90d9] hover:bg-[#3a7bc8] text-white px-8 py-4 rounded-xl text-base font-bold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
                  Student Portal <ChevronRight className="w-5 h-5" />
                </Link>
                <Link to="/parent-login" className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-xl text-base font-semibold transition-all">
                  Parent Portal
                </Link>
              </div>
              <p className="mt-8 text-white/40 text-sm italic tracking-wide">"Knowledge is Light" — Est. 1955</p>
            </div>

            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-2xl p-6 text-center border border-white/10">
                    <p className="text-4xl font-extrabold text-[#4a90d9] mb-1">500+</p>
                    <p className="text-white/60 text-sm">Students</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-6 text-center border border-white/10">
                    <p className="text-4xl font-extrabold text-[#4a90d9] mb-1">30+</p>
                    <p className="text-white/60 text-sm">Teachers</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-6 text-center border border-white/10">
                    <p className="text-4xl font-extrabold text-[#4a90d9] mb-1">15</p>
                    <p className="text-white/60 text-sm">Class Arms</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-6 text-center border border-white/10">
                    <p className="text-4xl font-extrabold text-[#4a90d9] mb-1">60+</p>
                    <p className="text-white/60 text-sm">Years Legacy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#1e3a5f]/5 rounded-full px-4 py-1.5 mb-4">
                <BookOpen className="w-4 h-4 text-[#4a90d9]" />
                <span className="text-[#1e3a5f] text-sm font-semibold">About Us</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">
                A Legacy of Academic Excellence
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Union Baptist College, Ibadan is one of the oldest and most respected secondary schools in Oyo State, Nigeria. Founded with the mission of providing quality education rooted in Christian values, we have been shaping leaders for over six decades.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our commitment to academic excellence, moral uprightness, and holistic development has produced notable alumni who have made significant contributions to Nigeria and the world.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-[#1e3a5f]">WAEC</p>
                  <p className="text-sm text-gray-500">Consistent 90%+ pass rate</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-[#1e3a5f]">JAMB</p>
                  <p className="text-sm text-gray-500">Top university admissions</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2a5080] rounded-3xl p-8 sm:p-12 text-white">
              <h4 className="text-xl font-bold mb-6">School Motto</h4>
              <blockquote className="text-3xl font-extrabold text-[#4a90d9] mb-4 italic">
                "Knowledge is Light"
              </blockquote>
              <p className="text-white/70 leading-relaxed mb-8">
                We believe that knowledge illuminates the path to a successful and meaningful life. Every student at Union Baptist College is equipped to be a light in their community and beyond.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">JSS</p>
                  <p className="text-xs text-white/50">Junior Secondary</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">SS</p>
                  <p className="text-xs text-white/50">Senior Secondary</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">2026</p>
                  <p className="text-xs text-white/50">Current Session</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section id="programs" className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#4a90d9]/10 rounded-full px-4 py-1.5 mb-4">
              <BookOpen className="w-4 h-4 text-[#4a90d9]" />
              <span className="text-[#1e3a5f] text-sm font-semibold">Academic Programs</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Our Programs</h3>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">Comprehensive academic programs designed to develop well-rounded students.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-8">
            {programs.map((p) => (
              <div key={p.name} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#4a90d9]/20 transition-all">
                <h4 className="text-xl font-bold text-gray-900 mb-3">{p.name}</h4>
                <p className="text-gray-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section id="values" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Our Core Values</h3>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">The principles that guide everything we do at Union Baptist College.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v) => {
              const Icon = v.icon
              return (
                <div key={v.title} className="text-center group">
                  <div className="w-16 h-16 rounded-2xl bg-[#1e3a5f]/5 group-hover:bg-[#4a90d9]/10 flex items-center justify-center mx-auto mb-6 transition-colors">
                    <Icon className="w-8 h-8 text-[#1e3a5f] group-hover:text-[#4a90d9] transition-colors" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{v.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Our Facilities</h3>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">Modern facilities that support learning and development.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {gallery.map((g) => (
              <div key={g.title} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all">
                <div className="h-40 bg-gradient-to-br from-[#1e3a5f]/10 to-[#4a90d9]/10 flex items-center justify-center">
                  <GraduationCap className="w-12 h-12 text-[#1e3a5f]/30" />
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-gray-900 mb-1">{g.title}</h4>
                  <p className="text-sm text-gray-500">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Contact Us</h3>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">Get in touch with us for admissions and enquiries.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-14 h-14 rounded-xl bg-[#1e3a5f]/5 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-7 h-7 text-[#1e3a5f]" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Address</h4>
              <p className="text-gray-500 text-sm">Ibadan, Oyo State, Nigeria</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-xl bg-[#1e3a5f]/5 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-7 h-7 text-[#1e3a5f]" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Phone</h4>
              <p className="text-gray-500 text-sm">Contact the school office</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-xl bg-[#1e3a5f]/5 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-[#1e3a5f]" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Email</h4>
              <p className="text-gray-500 text-sm">info@unionbaptistcollege.edu.ng</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1e3a5f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#4a90d9] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-bold">Union Baptist College</h4>
                  <p className="text-[#4a90d9] text-xs">IBADAN</p>
                </div>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">Empowering academic excellence through discipline and moral values since 1955.</p>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Quick Links</h5>
              <div className="space-y-2">
                <a href="#about" className="block text-white/50 hover:text-white text-sm transition-colors">About Us</a>
                <a href="#programs" className="block text-white/50 hover:text-white text-sm transition-colors">Programs</a>
                <a href="#values" className="block text-white/50 hover:text-white text-sm transition-colors">Core Values</a>
                <a href="#contact" className="block text-white/50 hover:text-white text-sm transition-colors">Contact</a>
              </div>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Portals</h5>
              <div className="space-y-2">
                <Link to="/student-login" className="block text-white/50 hover:text-white text-sm transition-colors">Student Portal</Link>
                <Link to="/parent-login" className="block text-white/50 hover:text-white text-sm transition-colors">Parent Portal</Link>
                <Link to="/staff-login" className="block text-white/50 hover:text-white text-sm transition-colors">Staff Portal</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-white/30 text-xs">&copy; {new Date().getFullYear()} Union Baptist College, Ibadan. All rights reserved. | Built by <a href="https://alexion-studios-portfolio.vercel.app" className="text-[#4a90d9] hover:underline">ALEXION STUDIOS</a></p>
          </div>
        </div>
      </footer>
    </div>
  )
}
