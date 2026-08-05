import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const PROJECT_REF = process.env.PROJECT_REF || 'llqljjenztttoohmvffr';
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function provisionEverything() {
  console.log('====================================================');
  console.log('🌟 Executing Full Supabase Automated Provisioning');
  console.log(`📡 Project Ref: ${PROJECT_REF}`);
  console.log('====================================================\n');

  try {
    // 1. Create Resumes Storage Bucket
    console.log('1️⃣ Provisioning Supabase Storage Bucket ("resumes")...');
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    
    let bucketExists = false;
    if (buckets) {
      bucketExists = buckets.some(b => b.name === 'resumes');
    }

    if (!bucketExists) {
      const { error: createBucketErr } = await supabaseAdmin.storage.createBucket('resumes', {
        public: true,
        allowedMimeTypes: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
        fileSizeLimit: 10485760, // 10MB
      });

      if (createBucketErr) {
        console.warn('Notice creating storage bucket:', createBucketErr.message);
      } else {
        console.log('✅ Created storage bucket "resumes" successfully!');
      }
    } else {
      console.log('✅ Storage bucket "resumes" already exists and is active.');
    }

    console.log('\n====================================================');
    console.log('🎉 FULL SUPABASE PROVISIONING COMPLETE!');
    console.log('====================================================\n');

  } catch (err: any) {
    console.error('Provisioning error:', err);
  }
}

provisionEverything();
