# Union Baptist College — Academic Portal

A modern school academic management and result portal for **Union Baptist College, Ibadan, Nigeria**.

Built with **React + Vite + TypeScript + Tailwind CSS + Supabase**.

## Live Site

Deployed on Vercel — [View Live](https://union-baptist-college.vercel.app)

## Features

- Landing page with school branding
- Sign in / Sign up authentication
- Role-based dashboards (Super Admin, Principal, Teacher, Student, Parent)
- Student, teacher, class, and subject management
- Teacher score entry (midterm, post-midterm, exam)
- Automatic CA averaging, grading, and competition ranking
- Principal review and approval workflow (DRAFT → SUBMITTED → APPROVED → PUBLISHED)
- Class-arm isolation for rankings
- Student transfer history preservation
- Row-level security via Supabase RLS

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS |
| Auth & DB | Supabase (Auth + PostgreSQL + RLS) |
| Icons | Lucide React |
| Tests | Vitest |

## Getting Started

```bash
npm install
npm run dev
```

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste and run `supabase/migrations/001_initial_schema.sql`
3. Run this trigger SQL so new sign-ups auto-create a `users` row:

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'TEACHER',
    true
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

4. Sign up on the portal
5. Set your role via SQL:

```sql
UPDATE users SET role = 'SUPER_ADMIN' WHERE email = 'your@email.com';
```

6. Create more accounts and assign roles (PRINCIPAL, TEACHER, STUDENT, PARENT)

## Environment Variables

Create a `.env` file:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Deployment (Vercel)

1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Add env variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
4. Deploy

## Project Structure

```
src/
  pages/           # Landing, Login, role-based dashboards
  components/      # Layout, UI components
  contexts/        # Auth context (Supabase)
  lib/             # Supabase client, utilities
  server/academic/ # Calculation engine, rankings, constants
  types/           # TypeScript database types
tests/unit/        # Vitest tests (38 passing)
supabase/migrations/ # SQL schema + RLS + seed data
```

## Academic Rules

- Midterm: Note & Attendance (10) + CA1 (10) + CA2 (10) = 30 marks
- Post-midterm: Note/Assignment (10) + CA/Test (20) = 30 marks
- 1st/2nd Term CA = (midterm + post-midterm) / 2
- Exam = 70 marks
- Final total = CA (30) + Exam (70) = 100 marks
- 3rd Term: CA (30) + Exam (70) = 100 marks (no averaging)
- Annual total = 1st term + 2nd term + 3rd term (out of 300)
- Competition ranking (ties share position, next position skips)

## License

Private — Union Baptist College
