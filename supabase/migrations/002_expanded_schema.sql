-- =====================================================================
-- SUPABASE MIGRATION: 002_expanded_schema.sql
-- Complete 17-Table Enterprise Schema with RLS, Soft Deletes & Indexes
-- =====================================================================

-- 1. USERS & PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  professional_title TEXT,
  phone_number TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  address TEXT,
  country TEXT,
  city TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Profiles user access policy') THEN
    CREATE POLICY "Profiles user access policy" ON public.profiles
      FOR ALL USING (auth.uid() = id OR id IS NULL);
  END IF;
END $$;


-- 2. RESUMES TABLE
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_name TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'pdf' | 'docx' | 'txt'
  file_size INTEGER DEFAULT 0,
  raw_text TEXT NOT NULL,
  resume_version INTEGER DEFAULT 1,
  parsing_status TEXT DEFAULT 'parsed', -- 'pending' | 'parsed' | 'failed'
  upload_source TEXT DEFAULT 'web',
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Resumes user access policy') THEN
    CREATE POLICY "Resumes user access policy" ON public.resumes
      FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);
  END IF;
END $$;


-- 3. RESUME SECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.resume_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL, -- 'summary' | 'experience' | 'education' | 'skills' | 'projects' | etc.
  title TEXT NOT NULL,
  content TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

ALTER TABLE public.resume_sections ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Resume sections access policy') THEN
    CREATE POLICY "Resume sections access policy" ON public.resume_sections FOR ALL USING (true);
  END IF;
END $$;


-- 4. EXPERIENCE TABLE
CREATE TABLE IF NOT EXISTS public.experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  employment_type TEXT, -- 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance'
  location TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT,
  is_present BOOLEAN DEFAULT false,
  responsibilities TEXT[] DEFAULT '{}',
  achievements TEXT[] DEFAULT '{}',
  technologies_used TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Experience access policy') THEN
    CREATE POLICY "Experience access policy" ON public.experience FOR ALL USING (true);
  END IF;
END $$;


-- 5. EDUCATION TABLE
CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  degree TEXT NOT NULL,
  specialization TEXT,
  institution TEXT NOT NULL,
  location TEXT,
  grade_cgpa TEXT,
  start_year TEXT,
  end_year TEXT,
  is_present BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Education access policy') THEN
    CREATE POLICY "Education access policy" ON public.education FOR ALL USING (true);
  END IF;
END $$;


-- 6. RESUME SKILLS TABLE
CREATE TABLE IF NOT EXISTS public.resume_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  category TEXT DEFAULT 'technical', -- 'technical' | 'soft'
  proficiency_level TEXT DEFAULT 'intermediate', -- 'beginner' | 'intermediate' | 'advanced' | 'expert'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

ALTER TABLE public.resume_skills ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Resume skills access policy') THEN
    CREATE POLICY "Resume skills access policy" ON public.resume_skills FOR ALL USING (true);
  END IF;
END $$;


-- 7. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  description TEXT NOT NULL,
  technologies_used TEXT[] DEFAULT '{}',
  github_url TEXT,
  live_demo_url TEXT,
  duration TEXT,
  role TEXT,
  key_features TEXT[] DEFAULT '{}',
  screenshots TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Projects access policy') THEN
    CREATE POLICY "Projects access policy" ON public.projects FOR ALL USING (true);
  END IF;
END $$;


-- 8. CERTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  certificate_name TEXT NOT NULL,
  issuing_organization TEXT NOT NULL,
  issue_date TEXT NOT NULL,
  expiry_date TEXT,
  credential_id TEXT,
  credential_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Certifications access policy') THEN
    CREATE POLICY "Certifications access policy" ON public.certifications FOR ALL USING (true);
  END IF;
END $$;


-- 9. ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'award', -- 'award' | 'hackathon' | 'competition' | 'scholarship' | 'publication'
  issuer TEXT,
  date TEXT,
  description TEXT,
  url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Achievements access policy') THEN
    CREATE POLICY "Achievements access policy" ON public.achievements FOR ALL USING (true);
  END IF;
END $$;


-- 10. LANGUAGES TABLE
CREATE TABLE IF NOT EXISTS public.languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  language_name TEXT NOT NULL,
  proficiency_level TEXT DEFAULT 'fluent', -- 'basic' | 'conversational' | 'fluent' | 'native'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Languages access policy') THEN
    CREATE POLICY "Languages access policy" ON public.languages FOR ALL USING (true);
  END IF;
END $$;


-- 11. INTERESTS TABLE
CREATE TABLE IF NOT EXISTS public.interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  interest_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Interests access policy') THEN
    CREATE POLICY "Interests access policy" ON public.interests FOR ALL USING (true);
  END IF;
END $$;


-- 12. REFERENCES TABLE
CREATE TABLE IF NOT EXISTS public.references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

ALTER TABLE public.references ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'References access policy') THEN
    CREATE POLICY "References access policy" ON public.references FOR ALL USING (true);
  END IF;
END $$;


-- 13. ANALYSES TABLE (30+ Metrics JSON Storage)
CREATE TABLE IF NOT EXISTS public.analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE SET NULL,
  target_job_title TEXT,
  company_name TEXT,
  job_description TEXT,
  overall_resume_score INTEGER DEFAULT 80,
  ats_score INTEGER NOT NULL CHECK (ats_score >= 0 AND ats_score <= 100),
  professional_headline TEXT,
  experience_level TEXT,
  career_domain TEXT,
  summary TEXT NOT NULL,
  strengths TEXT[] DEFAULT '{}',
  weaknesses TEXT[] DEFAULT '{}',
  missing_skills TEXT[] DEFAULT '{}',
  missing_keywords TEXT[] DEFAULT '{}',
  skill_gap_analysis TEXT,
  keyword_match_percentage INTEGER DEFAULT 75,
  grammar_score INTEGER DEFAULT 90,
  formatting_score INTEGER DEFAULT 85,
  readability_score INTEGER DEFAULT 88,
  action_verb_score INTEGER DEFAULT 85,
  quantifiable_impact_score INTEGER DEFAULT 80,
  interview_readiness_score INTEGER DEFAULT 85,
  hiring_probability INTEGER DEFAULT 80,
  full_analysis_json JSONB DEFAULT '{}'::jsonb,
  recommendations TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Analyses access policy') THEN
    CREATE POLICY "Analyses access policy" ON public.analyses FOR ALL USING (true);
  END IF;
END $$;


-- 14. ATS REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.ats_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID REFERENCES public.analyses(id) ON DELETE CASCADE,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
  overall_ats_score INTEGER NOT NULL,
  contact_info_score INTEGER DEFAULT 90,
  length_formatting_score INTEGER DEFAULT 85,
  keyword_match_score INTEGER DEFAULT 80,
  action_verbs_score INTEGER DEFAULT 85,
  achievements_score INTEGER DEFAULT 80,
  section_ordering_score INTEGER DEFAULT 90,
  category_breakdown_json JSONB DEFAULT '{}'::jsonb,
  improvement_suggestions TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ats_reports ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'ATS reports access policy') THEN
    CREATE POLICY "ATS reports access policy" ON public.ats_reports FOR ALL USING (true);
  END IF;
END $$;


-- 15. COVER LETTERS TABLE (Multi-Format Support)
CREATE TABLE IF NOT EXISTS public.cover_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE SET NULL,
  job_title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  hiring_manager TEXT,
  content TEXT NOT NULL, -- Professional Version
  short_version TEXT,    -- Short Version
  email_version TEXT,    -- Email Version
  ats_version TEXT,      -- ATS Optimized Version
  tone TEXT DEFAULT 'professional',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

ALTER TABLE public.cover_letters ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Cover letters access policy') THEN
    CREATE POLICY "Cover letters access policy" ON public.cover_letters FOR ALL USING (true);
  END IF;
END $$;


-- 16. ANALYSIS HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.analysis_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_id UUID REFERENCES public.analyses(id) ON DELETE CASCADE,
  ats_score INTEGER NOT NULL,
  target_job_title TEXT,
  company_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.analysis_history ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Analysis history access policy') THEN
    CREATE POLICY "Analysis history access policy" ON public.analysis_history FOR ALL USING (true);
  END IF;
END $$;


-- PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON public.resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_experience_resume_id ON public.experience(resume_id);
CREATE INDEX IF NOT EXISTS idx_education_resume_id ON public.education(resume_id);
CREATE INDEX IF NOT EXISTS idx_skills_resume_id ON public.resume_skills(resume_id);
CREATE INDEX IF NOT EXISTS idx_projects_resume_id ON public.projects(resume_id);
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON public.analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_cover_letters_user_id ON public.cover_letters(user_id);
