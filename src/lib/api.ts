import { ResumeAnalysis, CoverLetterRecord, UploadResumeResponse } from '../types';

const API_BASE = '/api';

export async function uploadResumeFile(file: File, userId?: string): Promise<UploadResumeResponse> {
  const formData = new FormData();
  formData.append('file', file);
  if (userId) formData.append('userId', userId);

  const response = await fetch(`${API_BASE}/resume/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to upload and parse resume file.');
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
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to analyze resume.');
  }

  return {
    id: data.analysisId,
    atsScore: data.atsScore,
    summary: data.summary,
    strengths: data.strengths || [],
    weaknesses: data.weaknesses || [],
    missingSkills: data.missingSkills || [],
    recommendations: data.recommendations || [],
    targetJobTitle: data.targetJobTitle,
    companyName: data.companyName,
    createdAt: data.createdAt || new Date().toISOString(),
  };
}

export async function generateCoverLetterApi(payload: {
  resumeText: string;
  jobTitle: string;
  companyName: string;
  jobDescription?: string;
  tone?: string;
  resumeId?: string;
  userId?: string;
}): Promise<CoverLetterRecord> {
  const response = await fetch(`${API_BASE}/cover-letter`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to generate cover letter.');
  }

  return {
    id: data.coverLetterId,
    jobTitle: data.jobTitle,
    companyName: data.companyName,
    content: data.content,
    tone: data.tone,
    createdAt: data.createdAt || new Date().toISOString(),
  };
}

export async function fetchUserHistoryApi(userId?: string): Promise<{
  analyses: ResumeAnalysis[];
  coverLetters: CoverLetterRecord[];
}> {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
  const response = await fetch(`${API_BASE}/history${query}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to load history.');
  }

  const analyses: ResumeAnalysis[] = (data.analyses || []).map((a: any) => ({
    id: a.id,
    userId: a.user_id || a.userId,
    resumeId: a.resume_id || a.resumeId,
    targetJobTitle: a.target_job_title || a.targetJobTitle,
    companyName: a.company_name || a.companyName,
    jobDescription: a.job_description || a.jobDescription,
    atsScore: a.ats_score || a.atsScore || 75,
    summary: a.summary || '',
    strengths: a.strengths || [],
    weaknesses: a.weaknesses || [],
    missingSkills: a.missing_skills || a.missingSkills || [],
    recommendations: a.recommendations || [],
    createdAt: a.created_at || a.createdAt || new Date().toISOString(),
  }));

  const coverLetters: CoverLetterRecord[] = (data.coverLetters || []).map((c: any) => ({
    id: c.id,
    userId: c.user_id || c.userId,
    resumeId: c.resume_id || c.resumeId,
    jobTitle: c.job_title || c.jobTitle,
    companyName: c.company_name || c.companyName,
    content: c.content || '',
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

  return data.analysis;
}
