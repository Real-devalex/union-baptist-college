# School Academic Management & Result Portal

A production-ready School Academic Management and Result Portal for Nigerian secondary schools, built with **React + Vite + TypeScript + Supabase**.

## Tech Stack

- **Frontend:** React 19 + Vite 8 + TypeScript 6 + Tailwind CSS 4
- **Database:** PostgreSQL via Supabase (with Row-Level Security)
- **Auth:** Supabase Auth (email/password + JWT)
- **PDF:** @react-pdf/renderer (client-side)
- **Testing:** Vitest + jsdom
- **Build:** Vite (548KB gzipped ~150KB)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up Supabase (local or cloud)
# Create a .env file:
echo "VITE_SUPABASE_URL=http://localhost:54321" > .env
echo "VITE_SUPABASE_ANON_KEY=your-anon-key" >> .env

# 3. Run Supabase locally (requires Docker)
npx supabase init
npx supabase start

# 4. Apply database migration
npx supabase db push

# 5. Start dev server
npm run dev
```

## Project Structure

```
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql   # Complete DB schema + RLS + seed data
├── src/
│   ├── app/                         # (removed — using Vite SPA)
│   ├── components/
│   │   ├── Layout.tsx               # Dashboard layout with sidebar
│   │   └── ui/Card.tsx              # Reusable card components
│   ├── contexts/
│   │   └── AuthContext.tsx           # Auth provider + route guards
│   ├── lib/
│   │   ├── supabase.ts              # Supabase client singleton
│   │   └── utils.ts                 # Utility functions
│   ├── pages/
│   │   ├── Login.tsx                # Login page
│   │   ├── super-admin/             # Super Admin pages
│   │   ├── principal/               # Principal pages
│   │   ├── teacher/                 # Teacher pages
│   │   └── student/                 # Student pages
│   ├── server/
│   │   └── academic/
│   │       ├── constants.ts         # Score limits & rounding
│   │       ├── calculations.ts      # All academic formulas
│   │       └── rankings.ts          # Competition ranking engine
│   └── types/
│       └── database.ts              # Supabase DB types
├── tests/
│   └── unit/
│       ├── calculations.test.ts     # 26 calculation tests
│       └── rankings.test.ts         # 12 ranking tests
├── docs/
│   ├── ARCHITECTURE.md              # Architecture documentation
│   └── ACADEMIC_RULES.md            # Academic formula reference
└── vite.config.ts
```

## Default Accounts

After seeding, use these accounts (password: `password123`):

| Email | Role |
|-------|------|
| admin@school.com | Super Admin |
| principal@school.com | Principal |
| teacher1@school.com | Teacher |

## Academic Calculation Engine

All formulas are centralized in `src/server/academic/`:

### 1st & 2nd Term
```
Midterm Total = Note/Attendance (10) + CA1 (10) + CA2 (10) = /30
Midterm % = (Midterm Total / 30) × 100
Post-Midterm Total = Note/Assignment (10) + CA/Test (20) = /30
Term CA = (Midterm Total + Post-Midterm Total) / 2 = /30
Term Total = Term CA + Exam (70) = /100
```

### 3rd Term
```
3rd Term Total = CA (30) + Exam (70) = /100
Annual Total = 1st Term + 2nd Term + 3rd Term = /300
Annual Average = Annual Total / 3
```

### Grading
```
A = 75–100  |  B = 65–74.99  |  C = 55–64.99
D = 45–54.99  |  E = 40–44.99  |  F = 0–39.99
```

### Ranking
- Competition ranking (1224): ties share position, next rank skips
- Subject positions scoped to: session + term + classLevel + classArm + subject
- Overall positions scoped to: session + term + classLevel + classArm

## Roles & Permissions

| Capability | Super Admin | Principal | Teacher | Student | Parent |
|-----------|:-----------:|:---------:|:-------:|:-------:|:------:|
| Manage Users | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage School Settings | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage Classes/Subjects | ✅ | ❌ | ❌ | ❌ | ❌ |
| Review/Approve Results | ❌ | ✅ | ❌ | ❌ | ❌ |
| Edit Grading Scale | ❌ | ✅ | ❌ | ❌ | ❌ |
| Enter Scores | ❌ | ❌ | ✅ | ❌ | ❌ |
| View Own Results | ❌ | ❌ | ✅ | ✅ | ✅* |

*Parents only see linked children's results

## Row-Level Security (RLS)

The Supabase migration includes comprehensive RLS policies:
- Teachers can only access their assigned classes/subjects
- Students can only view their own published results
- Parents can only view linked children's results
- Principal has read access to all academic data
- Super Admin has full access

## Testing

```bash
# Run all tests
npx vitest run

# Run with coverage
npx vitest run --coverage

# Type checking
npx tsc -b
```

## Build

```bash
# Production build
npx vite build

# Preview production build
npx vite preview
```

## Environment Variables

```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Known Limitations

1. PDF generation not yet implemented (planned with @react-pdf/renderer)
2. Student/Parent portals are scaffolded but not fully functional
3. Logo upload not yet connected to Supabase Storage
4. Audit logging not yet wired into all operations
5. Needs Supabase instance (local or cloud) to run

## Next Steps

1. Set up Supabase project and apply migration
2. Implement PDF report generation
3. Wire up audit logging
4. Add student/parent portal functionality
5. Implement attendance management UI
6. Add CSV/Excel export
7. Add search and filtering across all pages
8. Implement real-time updates via Supabase Realtime

---

Built with ❤️ for Nigerian secondary schools
