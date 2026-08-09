import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_PAT = process.env.SUPABASE_PAT || '';
const PROJECT_REF = process.env.PROJECT_REF || 'llqljjenztttoohmvffr';

async function applyAllMigrations() {
  console.log(`🚀 Applying All Schema Migrations on Supabase project: ${PROJECT_REF}...`);

  const mig2Path = path.join(process.cwd(), 'supabase', 'migrations', '002_expanded_schema.sql');
  const mig3Path = path.join(process.cwd(), 'supabase', 'migrations', '003_application_kit_schema.sql');

  const mig2SQL = fs.readFileSync(mig2Path, 'utf-8');
  const mig3SQL = fs.readFileSync(mig3Path, 'utf-8');

  const fullQuery = `
${mig2SQL}

${mig3SQL}

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
      console.error(`❌ Failed to execute SQL via Supabase API (Status ${response.status}):`, text);
      return false;
    }

    console.log('✅ Supabase Migrations 002 & 003 applied successfully!');
    return true;
  } catch (error) {
    console.error('Error executing DDL via Management API:', error);
    return false;
  }
}

applyAllMigrations();
