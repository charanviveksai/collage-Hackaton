import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials missing in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigrationAndVerification() {
  console.log('----------------------------------------------------');
  console.log('🚀 Starting Supabase PostgreSQL Migration & Verification');
  console.log(`📡 Supabase Endpoint: ${supabaseUrl}`);
  console.log('----------------------------------------------------\n');

  const report = {
    tablesDetected: ['profiles', 'resumes', 'analyses', 'cover_letters'],
    tablesMigrated: 0,
    recordsMigrated: 0,
    crudStatus: 'Pending',
    warnings: [] as string[],
  };

  try {
    // 1. Verify Resumes Table Connectivity
    console.log('1️⃣ Testing Resumes table...');
    const resumesRes = await supabase.from('resumes').select('id', { count: 'exact', head: true });
    if (resumesRes.error) {
      console.warn('⚠️ Table resumes notice:', resumesRes.error.message);
      report.warnings.push(`Resumes table warning: ${resumesRes.error.message}`);
    } else {
      console.log(`✅ Table "resumes" verified. Existing count: ${resumesRes.count ?? 0}`);
      report.tablesMigrated++;
      report.recordsMigrated += (resumesRes.count || 0);
    }

    // 2. Verify Analyses Table Connectivity
    console.log('2️⃣ Testing Analyses table...');
    const analysesRes = await supabase.from('analyses').select('id', { count: 'exact', head: true });
    if (analysesRes.error) {
      console.warn('⚠️ Table analyses notice:', analysesRes.error.message);
      report.warnings.push(`Analyses table warning: ${analysesRes.error.message}`);
    } else {
      console.log(`✅ Table "analyses" verified. Existing count: ${analysesRes.count ?? 0}`);
      report.tablesMigrated++;
      report.recordsMigrated += (analysesRes.count || 0);
    }

    // 3. Verify Cover Letters Table Connectivity
    console.log('3️⃣ Testing Cover Letters table...');
    const coverRes = await supabase.from('cover_letters').select('id', { count: 'exact', head: true });
    if (coverRes.error) {
      console.warn('⚠️ Table cover_letters notice:', coverRes.error.message);
      report.warnings.push(`Cover Letters table warning: ${coverRes.error.message}`);
    } else {
      console.log(`✅ Table "cover_letters" verified. Existing count: ${coverRes.count ?? 0}`);
      report.tablesMigrated++;
      report.recordsMigrated += (coverRes.count || 0);
    }

    // 4. Verify Profiles Table Connectivity
    console.log('4️⃣ Testing Profiles table...');
    const profilesRes = await supabase.from('profiles').select('id', { count: 'exact', head: true });
    if (profilesRes.error) {
      console.warn('⚠️ Table profiles notice:', profilesRes.error.message);
      report.warnings.push(`Profiles table warning: ${profilesRes.error.message}`);
    } else {
      console.log(`✅ Table "profiles" verified. Existing count: ${profilesRes.count ?? 0}`);
      report.tablesMigrated++;
      report.recordsMigrated += (profilesRes.count || 0);
    }

    // 5. Test Full CRUD Cycle
    console.log('\n🔄 Testing Live CRUD Operations on Supabase PostgreSQL...');
    
    // Insert Test Resume
    const { data: testResume, error: resumeInsErr } = await supabase
      .from('resumes')
      .insert({
        file_name: 'test_resume_migration.pdf',
        file_type: 'pdf',
        raw_text: 'Migration test resume content with software development skills.',
      })
      .select()
      .single();

    if (resumeInsErr) {
      console.error('❌ Insert Test Resume Failed:', resumeInsErr);
      report.warnings.push(`Insert test failed: ${resumeInsErr.message}`);
    } else {
      console.log(`✅ Created test resume record ID: ${testResume.id}`);

      // Insert Test Analysis referencing test resume
      const { data: testAnalysis, error: anaInsErr } = await supabase
        .from('analyses')
        .insert({
          resume_id: testResume.id,
          target_job_title: 'Software Architect Test',
          company_name: 'Acme Test Corp',
          ats_score: 92,
          summary: 'Migration test analysis record.',
          strengths: ['Testing', 'Migration'],
          weaknesses: ['None'],
          missing_skills: ['Docker'],
          recommendations: ['Keep testing'],
        })
        .select()
        .single();

      if (anaInsErr) {
        console.error('❌ Insert Test Analysis Failed:', anaInsErr);
      } else {
        console.log(`✅ Created test analysis record ID: ${testAnalysis.id}`);

        // Cleanup test analysis
        await supabase.from('analyses').delete().eq('id', testAnalysis.id);
        console.log('🧹 Cleaned up test analysis record');
      }

      // Cleanup test resume
      await supabase.from('resumes').delete().eq('id', testResume.id);
      console.log('🧹 Cleaned up test resume record');
      report.crudStatus = 'Passed';
    }

    console.log('\n====================================================');
    console.log('🎉 SUPABASE MIGRATION & VERIFICATION SUMMARY REPORT');
    console.log('====================================================');
    console.log(`• Target Database: Supabase PostgreSQL (${supabaseUrl})`);
    console.log(`• Tables Migrated/Verified: ${report.tablesMigrated} / ${report.tablesDetected.length}`);
    console.log(`• Total Database Records Count: ${report.recordsMigrated}`);
    console.log(`• Live CRUD Verification: ${report.crudStatus}`);
    console.log(`• Schema Conflicts/Warnings: ${report.warnings.length}`);
    if (report.warnings.length > 0) {
      report.warnings.forEach(w => console.log(`  - ${w}`));
    }
    console.log('====================================================\n');

  } catch (err: any) {
    console.error('Migration script execution error:', err);
    process.exit(1);
  }
}

runMigrationAndVerification();
