export interface PersonalInfo {
  fullName: string;
  professionalTitle?: string;
  email: string;
  phoneNumber?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  address?: string;
  country?: string;
  city?: string;
}

export interface WorkExperienceItem {
  id?: string;
  companyName: string;
  jobTitle: string;
  employmentType?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isPresent?: boolean;
  responsibilities: string[];
  achievements: string[];
  technologiesUsed: string[];
}

export interface EducationItem {
  id?: string;
  degree: string;
  specialization?: string;
  institution: string;
  location?: string;
  gradeCgpa?: string;
  startYear?: string;
  endYear?: string;
  isPresent?: boolean;
}

export interface SkillItem {
  id?: string;
  skillName: string;
  category: 'technical' | 'soft';
  proficiencyLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface ProjectItem {
  id?: string;
  projectName: string;
  description: string;
  technologiesUsed: string[];
  githubUrl?: string;
  liveDemoUrl?: string;
  duration?: string;
  role?: string;
  keyFeatures: string[];
  screenshots?: string[];
}

export interface CertificationItem {
  id?: string;
  certificateName: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface AchievementItem {
  id?: string;
  title: string;
  category: 'award' | 'hackathon' | 'competition' | 'scholarship' | 'publication';
  issuer?: string;
  date?: string;
  description?: string;
  url?: string;
}

export interface LanguageItem {
  id?: string;
  languageName: string;
  proficiencyLevel: 'basic' | 'conversational' | 'fluent' | 'native';
}

export interface ReferenceItem {
  id?: string;
  name: string;
  designation: string;
  company: string;
  email?: string;
  phone?: string;
}

export interface GranularResumeData {
  personalInfo: PersonalInfo;
  professionalSummary?: string;
  experience: WorkExperienceItem[];
  education: EducationItem[];
  technicalSkills: string[];
  softSkills: string[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  achievements: AchievementItem[];
  languages: LanguageItem[];
  interests: string[];
  references: ReferenceItem[];
}

export interface AISuggestions {
  suggestedSkills: string[];
  suggestedKeywords: string[];
  suggestedBulletPoints: string[];
  suggestedProfessionalSummary: string;
  suggestedResumeHeadlines: string[];
  suggestedProjects: string[];
  suggestedCertifications: string[];
  suggestedLearningRoadmap: string[];
}

export interface ResumeAnalysis {
  id: string;
  userId?: string;
  resumeId?: string;
  targetJobTitle?: string;
  companyName?: string;
  jobDescription?: string;
  
  overallResumeScore: number;
  atsScore: number;
  professionalHeadline?: string;
  experienceLevel?: string;
  careerDomain?: string;
  summary: string;
  
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  missingKeywords: string[];
  skillGapAnalysis?: string;
  keywordMatchPercentage: number;
  
  grammarScore: number;
  formattingScore: number;
  readabilityScore: number;
  actionVerbScore: number;
  quantifiableImpactScore: number;
  interviewReadinessScore: number;
  hiringProbability: number;
  
  aiSuggestions: AISuggestions;
  recommendations: string[];
  createdAt: string;
}

export interface MultiFormatCoverLetter {
  id: string;
  userId?: string;
  resumeId?: string;
  jobTitle: string;
  companyName: string;
  hiringManager?: string;
  professionalVersion: string;
  shortVersion: string;
  emailVersion: string;
  atsVersion: string;
  tone: string;
  createdAt: string;
}

export interface DashboardMetrics {
  totalResumes: number;
  totalAnalyses: number;
  avgAtsScore: number;
  highestAtsScore: number;
  lowestAtsScore: number;
  coverLettersCount: number;
  aiSuggestionsCount: number;
  recentActivity: Array<{
    id: string;
    type: 'analysis' | 'cover_letter' | 'resume';
    title: string;
    score?: number;
    date: string;
  }>;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  jobTitle?: string;
  targetIndustry?: string;
}
