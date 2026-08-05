import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Service Role/Anon Key must be configured in environment variables.');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Helper function to safely format UUIDs for Supabase foreign keys
function sanitizeUuid(id?: string): string | null {
  if (!id) return null;
  // Standard UUID format regex check
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(id)) return id;
  return null;
}

export async function saveResumeRecord(data: {
  userId: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'txt';
  rawText: string;
}): Promise<string> {
  const validUserId = sanitizeUuid(data.userId);

  const { data: dbData, error } = await supabaseAdmin
    .from('resumes')
    .insert({
      user_id: validUserId,
      file_name: data.fileName,
      file_type: data.fileType,
      raw_text: data.rawText,
    })
    .select('id')
    .single();

  if (error || !dbData) {
    console.error('Supabase saveResume Error:', error);
    throw new Error(`Failed to insert resume record into Supabase: ${error?.message || 'Unknown error'}`);
  }

  return dbData.id;
}

export async function saveAnalysisRecord(data: {
  userId: string;
  resumeId?: string;
  targetJobTitle?: string;
  companyName?: string;
  jobDescription?: string;
  atsScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  recommendations: string[];
}): Promise<string> {
  const validUserId = sanitizeUuid(data.userId);
  const validResumeId = sanitizeUuid(data.resumeId);

  const { data: dbData, error } = await supabaseAdmin
    .from('analyses')
    .insert({
      user_id: validUserId,
      resume_id: validResumeId,
      target_job_title: data.targetJobTitle || null,
      company_name: data.companyName || null,
      job_description: data.jobDescription || null,
      ats_score: data.atsScore,
      summary: data.summary,
      strengths: data.strengths,
      weaknesses: data.weaknesses,
      missing_skills: data.missingSkills,
      recommendations: data.recommendations,
    })
    .select('id')
    .single();

  if (error || !dbData) {
    console.error('Supabase saveAnalysis Error:', error);
    throw new Error(`Failed to insert analysis record into Supabase: ${error?.message || 'Unknown error'}`);
  }

  return dbData.id;
}

export async function saveCoverLetterRecord(data: {
  userId: string;
  resumeId?: string;
  jobTitle: string;
  companyName: string;
  content: string;
  tone: string;
}): Promise<string> {
  const validUserId = sanitizeUuid(data.userId);
  const validResumeId = sanitizeUuid(data.resumeId);

  const { data: dbData, error } = await supabaseAdmin
    .from('cover_letters')
    .insert({
      user_id: validUserId,
      resume_id: validResumeId,
      job_title: data.jobTitle,
      company_name: data.companyName,
      content: data.content,
      tone: data.tone,
    })
    .select('id')
    .single();

  if (error || !dbData) {
    console.error('Supabase saveCoverLetter Error:', error);
    throw new Error(`Failed to insert cover letter into Supabase: ${error?.message || 'Unknown error'}`);
  }

  return dbData.id;
}

export async function getUserHistory(userId: string) {
  const validUserId = sanitizeUuid(userId);

  let analysesQuery = supabaseAdmin.from('analyses').select('*').order('created_at', { ascending: false });
  let coverLettersQuery = supabaseAdmin.from('cover_letters').select('*').order('created_at', { ascending: false });

  if (validUserId) {
    analysesQuery = analysesQuery.eq('user_id', validUserId);
    coverLettersQuery = coverLettersQuery.eq('user_id', validUserId);
  }

  const [analysesRes, coverLettersRes] = await Promise.all([
    analysesQuery,
    coverLettersQuery,
  ]);

  if (analysesRes.error) {
    console.error('Supabase fetch analyses error:', analysesRes.error);
  }

  if (coverLettersRes.error) {
    console.error('Supabase fetch cover letters error:', coverLettersRes.error);
  }

  return {
    analyses: analysesRes.data || [],
    coverLetters: coverLettersRes.data || [],
  };
}

export async function getAnalysisById(id: string) {
  const validId = sanitizeUuid(id);
  if (!validId) return null;

  const { data, error } = await supabaseAdmin
    .from('analyses')
    .select('*')
    .eq('id', validId)
    .single();

  if (error) {
    console.error('Supabase fetch analysis by ID error:', error);
    return null;
  }

  return data;
}
