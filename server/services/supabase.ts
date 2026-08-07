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

function sanitizeUuid(id?: string): string | null {
  if (!id) return null;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(id)) return id;
  return null;
}

export async function saveResumeRecord(data: {
  userId?: string;
  resumeName?: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'txt';
  fileSize?: number;
  rawText: string;
}): Promise<string> {
  const validUserId = sanitizeUuid(data.userId);

  const { data: dbData, error } = await supabaseAdmin
    .from('resumes')
    .insert({
      user_id: validUserId,
      resume_name: data.resumeName || data.fileName,
      file_name: data.fileName,
      file_type: data.fileType,
      file_size: data.fileSize || data.rawText.length,
      raw_text: data.rawText,
      parsing_status: 'parsed',
    })
    .select('id')
    .single();

  if (error || !dbData) {
    console.error('Supabase saveResume Error:', error);
    throw new Error(`Failed to insert resume record into Supabase: ${error?.message || 'Unknown error'}`);
  }

  return dbData.id;
}

export async function saveAnalysisRecord(data: any): Promise<string> {
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
      overall_resume_score: data.overallResumeScore || 85,
      ats_score: data.atsScore,
      professional_headline: data.professionalHeadline,
      experience_level: data.experienceLevel,
      career_domain: data.careerDomain,
      summary: data.summary,
      strengths: data.strengths || [],
      weaknesses: data.weaknesses || [],
      missing_skills: data.missingSkills || [],
      missing_keywords: data.missingKeywords || [],
      skill_gap_analysis: data.skillGapAnalysis,
      keyword_match_percentage: data.keywordMatchPercentage || 80,
      grammar_score: data.grammarScore || 90,
      formatting_score: data.formattingScore || 88,
      readability_score: data.readabilityScore || 85,
      action_verb_score: data.actionVerbScore || 84,
      quantifiable_impact_score: data.quantifiableImpactScore || 80,
      interview_readiness_score: data.interviewReadinessScore || 88,
      hiring_probability: data.hiringProbability || 82,
      full_analysis_json: data,
      recommendations: data.recommendations || [],
    })
    .select('id')
    .single();

  if (error || !dbData) {
    console.error('Supabase saveAnalysis Error:', error);
    throw new Error(`Failed to insert analysis record into Supabase: ${error?.message || 'Unknown error'}`);
  }

  // Also insert into analysis_history
  await supabaseAdmin.from('analysis_history').insert({
    user_id: validUserId,
    analysis_id: dbData.id,
    ats_score: data.atsScore,
    target_job_title: data.targetJobTitle,
    company_name: data.companyName,
  });

  return dbData.id;
}

export async function saveCoverLetterRecord(data: any): Promise<string> {
  const validUserId = sanitizeUuid(data.userId);
  const validResumeId = sanitizeUuid(data.resumeId);

  const { data: dbData, error } = await supabaseAdmin
    .from('cover_letters')
    .insert({
      user_id: validUserId,
      resume_id: validResumeId,
      job_title: data.jobTitle,
      company_name: data.companyName,
      hiring_manager: data.hiringManager,
      content: data.professionalVersion || data.content,
      short_version: data.shortVersion,
      email_version: data.emailVersion,
      ats_version: data.atsVersion,
      tone: data.tone || 'professional',
    })
    .select('id')
    .single();

  if (error || !dbData) {
    console.error('Supabase saveCoverLetter Error:', error);
    throw new Error(`Failed to insert cover letter into Supabase: ${error?.message || 'Unknown error'}`);
  }

  return dbData.id;
}

export async function getUserDashboardMetrics(userId?: string) {
  const validUserId = sanitizeUuid(userId);

  let analysesQuery = supabaseAdmin.from('analyses').select('id, ats_score, created_at, target_job_title, company_name');
  let resumesQuery = supabaseAdmin.from('resumes').select('id', { count: 'exact', head: true });
  let coverLettersQuery = supabaseAdmin.from('cover_letters').select('id', { count: 'exact', head: true });

  if (validUserId) {
    analysesQuery = analysesQuery.eq('user_id', validUserId);
    resumesQuery = resumesQuery.eq('user_id', validUserId);
    coverLettersQuery = coverLettersQuery.eq('user_id', validUserId);
  }

  const [analysesRes, resumesRes, coverLettersRes] = await Promise.all([
    analysesQuery,
    resumesQuery,
    coverLettersQuery,
  ]);

  const analysesList = analysesRes.data || [];
  const totalAnalyses = analysesList.length;
  const totalResumes = resumesRes.count || totalAnalyses;
  const coverLettersCount = coverLettersRes.count || 0;

  const scores = analysesList.map(a => a.ats_score);
  const avgAtsScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const highestAtsScore = scores.length > 0 ? Math.max(...scores) : 0;
  const lowestAtsScore = scores.length > 0 ? Math.min(...scores) : 0;

  const recentActivity = analysesList.slice(0, 5).map(a => ({
    id: a.id,
    type: 'analysis' as const,
    title: a.target_job_title ? `${a.target_job_title} (${a.company_name || 'General'})` : 'Resume Scan',
    score: a.ats_score,
    date: a.created_at,
  }));

  return {
    totalResumes,
    totalAnalyses,
    avgAtsScore,
    highestAtsScore,
    lowestAtsScore,
    coverLettersCount,
    aiSuggestionsCount: totalAnalyses * 8,
    recentActivity,
  };
}

export async function getUserHistory(userId?: string) {
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
    console.error('Supabase getAnalysisById error:', error);
    return null;
  }

  return data;
}
