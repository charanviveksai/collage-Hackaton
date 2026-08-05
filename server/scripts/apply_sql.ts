import fs from 'fs';
import path from 'path';

const SUPABASE_PAT = process.env.SUPABASE_PAT || '';
const PROJECT_REF = process.env.PROJECT_REF || 'llqljjenztttoohmvffr';

async function applyMigrationSQL() {
  console.log(`🚀 Executing migration DDL on Supabase project: ${PROJECT_REF}...`);

  const sqlFilePath = path.join(process.cwd(), 'supabase', 'migrations', '001_initial_schema.sql');
  const sqlQuery = fs.readFileSync(sqlFilePath, 'utf-8');

  try {
    const response = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_PAT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sqlQuery }),
    });

    const text = await response.text();

    if (!response.ok) {
      console.error(`❌ Failed to execute SQL via Supabase Management API (Status ${response.status}):`, text);
      return false;
    }

    console.log('✅ Supabase DDL execution successful!');
    return true;
  } catch (error) {
    console.error('Error connecting to Supabase Management API:', error);
    return false;
  }
}

applyMigrationSQL();
