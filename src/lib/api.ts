import { ResumeAnalysis, MultiFormatCoverLetter, DashboardMetrics } from '../types';

const API_BASE = '/api';

export async function uploadResumeFile(file: File, userId?: string) {
  const formData = new FormData();
  formData.append('file', file);
  if (userId) formData.append('userId', userId);

  const response = await fetch(`${API_BASE}/resume/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to upload resume file.');
  }

  return data;
}

export async function analyzeResumeApi(payload: {
  resumeText: string;
  targetJobTitle?: string;
  companyName?: string;
  jobDescription?: string;
  resumeId?: string;
  userId?: string;
}): Promise<ResumeAnalysis> {
  const response = await fetch(`${API_BASE}/resume/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to run AI resume analysis.');
  }

  return {
    id: data.analysisId,
    overallResumeScore: data.overallResumeScore || 85,
    atsScore: data.atsScore,
    professionalHeadline: data.professionalHeadline,
    experienceLevel: data.experienceLevel,
    careerDomain: data.careerDomain,
    summary: data.summary,
    strengths: data.strengths || [],
    weaknesses: data.weaknesses || [],
    missingSkills: data.missingSkills || [],
    missingKeywords: data.missingKeywords || [],
    skillGapAnalysis: data.skillGapAnalysis,
    keywordMatchPercentage: data.keywordMatchPercentage || 80,
    grammarScore: data.grammarScore || 92,
    formattingScore: data.formattingScore || 88,
    readabilityScore: data.readabilityScore || 86,
    actionVerbScore: data.actionVerbScore || 84,
    quantifiableImpactScore: data.quantifiableImpactScore || 80,
    interviewReadinessScore: data.interviewReadinessScore || 88,
    hiringProbability: data.hiringProbability || 82,
    aiSuggestions: data.aiSuggestions || {
      suggestedSkills: [],
      suggestedKeywords: [],
      suggestedBulletPoints: [],
      suggestedProfessionalSummary: '',
      suggestedResumeHeadlines: [],
      suggestedProjects: [],
      suggestedCertifications: [],
      suggestedLearningRoadmap: [],
    },
    recommendations: data.recommendations || [],
    targetJobTitle: data.targetJobTitle,
    companyName: data.companyName,
    createdAt: data.createdAt || new Date().toISOString(),
  };
}

export async function generateMultiFormatCoverLetterApi(payload: {
  resumeText: string;
  jobTitle: string;
  companyName: string;
  hiringManager?: string;
  jobDescription?: string;
  tone?: string;
  resumeId?: string;
  userId?: string;
}): Promise<MultiFormatCoverLetter> {
  const response = await fetch(`${API_BASE}/cover-letter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to generate multi-format cover letters.');
  }

  return {
    id: data.coverLetterId,
    jobTitle: data.jobTitle,
    companyName: data.companyName,
    hiringManager: data.hiringManager,
    professionalVersion: data.professionalVersion || data.content,
    shortVersion: data.shortVersion || '',
    emailVersion: data.emailVersion || '',
    atsVersion: data.atsVersion || '',
    tone: data.tone || 'professional',
    createdAt: data.createdAt || new Date().toISOString(),
  };
}

export async function fetchDashboardMetricsApi(userId?: string): Promise<DashboardMetrics> {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
  const response = await fetch(`${API_BASE}/dashboard/metrics${query}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch dashboard metrics.');
  }

  return data.metrics;
}

export async function fetchUserHistoryApi(userId?: string) {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
  const response = await fetch(`${API_BASE}/history${query}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to load user history.');
  }

  const analyses: ResumeAnalysis[] = (data.analyses || []).map((a: any) => ({
    id: a.id,
    userId: a.user_id || a.userId,
    resumeId: a.resume_id || a.resumeId,
    targetJobTitle: a.target_job_title || a.targetJobTitle,
    companyName: a.company_name || a.companyName,
    overallResumeScore: a.overall_resume_score || a.overallResumeScore || 85,
    atsScore: a.ats_score || a.atsScore || 75,
    professionalHeadline: a.professional_headline || a.professionalHeadline,
    experienceLevel: a.experience_level || a.experienceLevel,
    careerDomain: a.career_domain || a.careerDomain,
    summary: a.summary || '',
    strengths: a.strengths || [],
    weaknesses: a.weaknesses || [],
    missingSkills: a.missing_skills || a.missingSkills || [],
    missingKeywords: a.missing_keywords || a.missingKeywords || [],
    skillGapAnalysis: a.skill_gap_analysis || a.skillGapAnalysis,
    keywordMatchPercentage: a.keyword_match_percentage || a.keywordMatchPercentage || 80,
    grammarScore: a.grammar_score || a.grammarScore || 90,
    formattingScore: a.formatting_score || a.formattingScore || 88,
    readabilityScore: a.readability_score || a.readabilityScore || 85,
    actionVerbScore: a.action_verb_score || a.actionVerbScore || 84,
    quantifiableImpactScore: a.quantifiable_impact_score || a.quantifiableImpactScore || 80,
    interviewReadinessScore: a.interview_readiness_score || a.interviewReadinessScore || 88,
    hiringProbability: a.hiring_probability || a.hiringProbability || 82,
    aiSuggestions: a.full_analysis_json?.aiSuggestions || a.aiSuggestions || {
      suggestedSkills: [],
      suggestedKeywords: [],
      suggestedBulletPoints: [],
      suggestedProfessionalSummary: '',
      suggestedResumeHeadlines: [],
      suggestedProjects: [],
      suggestedCertifications: [],
      suggestedLearningRoadmap: [],
    },
    recommendations: a.recommendations || [],
    createdAt: a.created_at || a.createdAt || new Date().toISOString(),
  }));

  const coverLetters: MultiFormatCoverLetter[] = (data.coverLetters || []).map((c: any) => ({
    id: c.id,
    userId: c.user_id || c.userId,
    resumeId: c.resume_id || c.resumeId,
    jobTitle: c.job_title || c.jobTitle,
    companyName: c.company_name || c.companyName,
    hiringManager: c.hiring_manager || c.hiringManager,
    professionalVersion: c.content || c.professionalVersion || '',
    shortVersion: c.short_version || c.shortVersion || '',
    emailVersion: c.email_version || c.emailVersion || '',
    atsVersion: c.ats_version || c.atsVersion || '',
    tone: c.tone || 'professional',
    createdAt: c.created_at || c.createdAt || new Date().toISOString(),
  }));

  return { analyses, coverLetters };
}

export async function fetchAnalysisDetailApi(id: string): Promise<ResumeAnalysis> {
  const response = await fetch(`${API_BASE}/analysis/${id}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch analysis details.');
  }

  const raw = data.analysis;
  const full = raw.full_analysis_json || {};

  return {
    id: raw.id,
    overallResumeScore: raw.overall_resume_score || full.overallResumeScore || 85,
    atsScore: raw.ats_score || full.atsScore || 80,
    professionalHeadline: raw.professional_headline || full.professionalHeadline || 'Software Professional',
    experienceLevel: raw.experience_level || full.experienceLevel || 'Mid-Senior',
    careerDomain: raw.career_domain || full.careerDomain || 'Technology',
    summary: raw.summary || full.summary || '',
    strengths: raw.strengths || full.strengths || [],
    weaknesses: raw.weaknesses || full.weaknesses || [],
    missingSkills: raw.missing_skills || full.missingSkills || [],
    missingKeywords: raw.missing_keywords || full.missingKeywords || [],
    skillGapAnalysis: raw.skill_gap_analysis || full.skillGapAnalysis || '',
    keywordMatchPercentage: raw.keyword_match_percentage || full.keywordMatchPercentage || 80,
    grammarScore: raw.grammar_score || full.grammarScore || 92,
    formattingScore: raw.formatting_score || full.formattingScore || 88,
    readabilityScore: raw.readability_score || full.readabilityScore || 86,
    actionVerbScore: raw.action_verb_score || full.actionVerbScore || 84,
    quantifiableImpactScore: raw.quantifiable_impact_score || full.quantifiableImpactScore || 80,
    interviewReadinessScore: raw.interview_readiness_score || full.interviewReadinessScore || 88,
    hiringProbability: raw.hiring_probability || full.hiringProbability || 82,
    aiSuggestions: full.aiSuggestions || raw.aiSuggestions || {
      suggestedSkills: [],
      suggestedKeywords: [],
      suggestedBulletPoints: [],
      suggestedProfessionalSummary: '',
      suggestedResumeHeadlines: [],
      suggestedProjects: [],
      suggestedCertifications: [],
      suggestedLearningRoadmap: [],
    },
    recommendations: raw.recommendations || full.recommendations || [],
    targetJobTitle: raw.target_job_title || full.targetJobTitle,
    companyName: raw.company_name || full.companyName,
    createdAt: raw.created_at || new Date().toISOString(),
  };
}
