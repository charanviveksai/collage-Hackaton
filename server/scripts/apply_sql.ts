import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_PAT = process.env.SUPABASE_PAT || '';
const PROJECT_REF = process.env.PROJECT_REF || 'llqljjenztttoohmvffr';

async function reloadSchemaCache() {
  console.log(`🚀 Reloading PostgREST schema cache on Supabase project: ${PROJECT_REF}...`);

  const sqlFilePath = path.join(process.cwd(), 'supabase', 'migrations', '002_expanded_schema.sql');
  const migrationQuery = fs.readFileSync(sqlFilePath, 'utf-8');

  const fullQuery = `
${migrationQuery}

ALTER TABLE public.analyses ADD COLUMN IF NOT EXISTS overall_resume_score INTEGER DEFAULT 85;
ALTER TABLE public.analyses ADD COLUMN IF NOT EXISTS professional_headline TEXT;
ALTER TABLE public.analyses ADD COLUMN IF NOT EXISTS experience_level TEXT;
ALTER TABLE public.analyses ADD COLUMN IF NOT EXISTS career_domain TEXT;
ALTER TABLE public.analyses ADD COLUMN IF NOT EXISTS missing_keywords TEXT[] DEFAULT '{}';
ALTER TABLE public.analyses ADD COLUMN IF NOT EXISTS skill_gap_analysis TEXT;
ALTER TABLE public.analyses ADD COLUMN IF NOT EXISTS keyword_match_percentage INTEGER DEFAULT 80;
ALTER TABLE public.analyses ADD COLUMN IF NOT EXISTS grammar_score INTEGER DEFAULT 90;
ALTER TABLE public.analyses ADD COLUMN IF NOT EXISTS formatting_score INTEGER DEFAULT 88;
ALTER TABLE public.analyses ADD COLUMN IF NOT EXISTS readability_score INTEGER DEFAULT 86;
ALTER TABLE public.analyses ADD COLUMN IF NOT EXISTS action_verb_score INTEGER DEFAULT 84;
ALTER TABLE public.analyses ADD COLUMN IF NOT EXISTS quantifiable_impact_score INTEGER DEFAULT 80;
ALTER TABLE public.analyses ADD COLUMN IF NOT EXISTS interview_readiness_score INTEGER DEFAULT 88;
ALTER TABLE public.analyses ADD COLUMN IF NOT EXISTS hiring_probability INTEGER DEFAULT 82;
ALTER TABLE public.analyses ADD COLUMN IF NOT EXISTS full_analysis_json JSONB DEFAULT '{}'::jsonb;

ALTER TABLE public.cover_letters ADD COLUMN IF NOT EXISTS hiring_manager TEXT;
ALTER TABLE public.cover_letters ADD COLUMN IF NOT EXISTS short_version TEXT;
ALTER TABLE public.cover_letters ADD COLUMN IF NOT EXISTS email_version TEXT;
ALTER TABLE public.cover_letters ADD COLUMN IF NOT EXISTS ats_version TEXT;

NOTIFY pgrst, 'reload schema';
`;

  try {
    const response = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_PAT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: fullQuery }),
    });

    const text = await response.text();
    if (!response.ok) {
      console.error(`❌ Failed to reload schema (Status ${response.status}):`, text);
      return false;
    }

    console.log('✅ Supabase Schema cache reloaded successfully!');
    return true;
  } catch (error) {
    console.error('Error connecting to Supabase API:', error);
    return false;
  }
}

reloadSchemaCache();
