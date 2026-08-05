export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  jobTitle?: string;
  targetIndustry?: string;
}

export interface ResumeRecord {
  id: string;
  userId: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'txt';
  rawText: string;
  createdAt: string;
}

export interface ResumeAnalysis {
  id: string;
  userId?: string;
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
  createdAt: string;
}

export interface CoverLetterRecord {
  id: string;
  userId?: string;
  resumeId?: string;
  jobTitle: string;
  companyName: string;
  content: string;
  tone: string;
  createdAt: string;
}

export interface UploadResumeResponse {
  success: boolean;
  resumeId: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'txt';
  text: string;
  characterCount: number;
}
