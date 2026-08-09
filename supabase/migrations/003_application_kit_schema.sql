-- ====================================================================
-- MIGRATION 003: APPLICATION KITS, CVS, JOB LISTINGS, AND DOCUMENTS
-- ====================================================================

-- 1. Create CVS Table
CREATE TABLE IF NOT EXISTS public.cvs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL DEFAULT 'Academic & Executive CV',
    summary TEXT,
    personal_info JSONB DEFAULT '{}'::jsonb,
    experience JSONB DEFAULT '[]'::jsonb,
    education JSONB DEFAULT '[]'::jsonb,
    skills JSONB DEFAULT '[]'::jsonb,
    projects JSONB DEFAULT '[]'::jsonb,
    certifications JSONB DEFAULT '[]'::jsonb,
    achievements JSONB DEFAULT '[]'::jsonb,
    languages JSONB DEFAULT '[]'::jsonb,
    interests JSONB DEFAULT '[]'::jsonb,
    references_list JSONB DEFAULT '[]'::jsonb,
    version INTEGER DEFAULT 1,
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create JOB LISTINGS Table
CREATE TABLE IF NOT EXISTS public.job_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_title VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    job_url TEXT,
    job_description TEXT NOT NULL,
    required_skills TEXT[] DEFAULT '{}',
    required_keywords TEXT[] DEFAULT '{}',
    experience_level VARCHAR(100),
    career_domain VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create APPLICATION KITS Table
CREATE TABLE IF NOT EXISTS public.application_kits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_listing_id UUID REFERENCES public.job_listings(id) ON DELETE SET NULL,
    job_title VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    match_score INTEGER DEFAULT 0,
    ats_score INTEGER DEFAULT 0,
    tailored_resume JSONB DEFAULT '{}'::jsonb,
    cover_letter JSONB DEFAULT '{}'::jsonb,
    matched_keywords TEXT[] DEFAULT '{}',
    missing_keywords TEXT[] DEFAULT '{}',
    recommendations TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create DOCUMENTS Table (General store for all user documents)
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    document_type VARCHAR(50) NOT NULL, -- 'resume', 'cv', 'cover_letter', 'application_kit'
    file_path TEXT,
    file_size INTEGER,
    mime_type VARCHAR(100),
    content_text TEXT,
    parsed_json JSONB DEFAULT '{}'::jsonb,
    is_favorite BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_cvs_user_id ON public.cvs(user_id);
CREATE INDEX IF NOT EXISTS idx_job_listings_user_id ON public.job_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_application_kits_user_id ON public.application_kits(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);

-- Enable RLS
ALTER TABLE public.cvs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can manage their own CVs"
    ON public.cvs FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own Job Listings"
    ON public.job_listings FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own Application Kits"
    ON public.application_kits FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own Documents"
    ON public.documents FOR ALL USING (auth.uid() = user_id);

NOTIFY pgrst, 'reload schema';
