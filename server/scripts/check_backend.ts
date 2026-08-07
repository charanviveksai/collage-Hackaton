import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3001;
const BASE_URL = `http://localhost:${PORT}`;

async function testBackend() {
  console.log('====================================================');
  console.log('🔍 Executing Comprehensive Backend Verification');
  console.log(`📡 Server Address: ${BASE_URL}`);
  console.log('====================================================\n');

  // 1. Health Check
  console.log('1️⃣ Testing GET /api/health...');
  const healthRes = await fetch(`${BASE_URL}/api/health`);
  const healthData = await healthRes.json();
  console.log('  Status:', healthRes.status, healthData);

  // 2. Dashboard Metrics Check
  console.log('\n2️⃣ Testing GET /api/dashboard/metrics...');
  const metricsRes = await fetch(`${BASE_URL}/api/dashboard/metrics?userId=demo-user-123`);
  const metricsData = await metricsRes.json();
  console.log('  Status:', metricsRes.status);
  console.log('  Metrics:', JSON.stringify(metricsData.metrics, null, 2));

  // 3. Test Resume Analysis Route
  console.log('\n3️⃣ Testing POST /api/resume/analyze...');
  const analyzeRes = await fetch(`${BASE_URL}/api/resume/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      resumeText: 'Alex Vance. Senior Full Stack Architect with experience in TypeScript, React, Node.js, Express, PostgreSQL, and Supabase. Reduced API latency by 45% for 2M daily active users.',
      targetJobTitle: 'Staff Software Architect',
      companyName: 'Stripe',
    }),
  });
  const analyzeData = await analyzeRes.json();
  console.log('  Status:', analyzeRes.status, analyzeData);

  // 4. Test Cover Letter Route
  console.log('\n4️⃣ Testing POST /api/cover-letter...');
  const coverRes = await fetch(`${BASE_URL}/api/cover-letter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      resumeText: 'Alex Vance. Senior Full Stack Architect with experience in TypeScript, React, Node.js, Express, PostgreSQL, and Supabase.',
      jobTitle: 'Staff Software Architect',
      companyName: 'Stripe',
      tone: 'executive',
    }),
  });
  const coverData = await coverRes.json();
  console.log('  Status:', coverRes.status, coverData);
}

testBackend();
