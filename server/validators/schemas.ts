import { z } from 'zod';

export const analyzeResumeSchema = z.object({
  resumeText: z.string().min(50, 'Resume content must be at least 50 characters long.'),
  targetJobTitle: z.string().optional(),
  companyName: z.string().optional(),
  jobDescription: z.string().optional(),
  resumeId: z.string().optional(),
  userId: z.string().optional(),
});

export const generateCoverLetterSchema = z.object({
  resumeText: z.string().min(50, 'Resume content must be at least 50 characters long.'),
  jobTitle: z.string().min(2, 'Job title is required.'),
  companyName: z.string().min(2, 'Company name is required.'),
  jobDescription: z.string().optional(),
  tone: z.enum(['professional', 'enthusiastic', 'technical', 'executive']).default('professional'),
  resumeId: z.string().optional(),
  userId: z.string().optional(),
});

export type AnalyzeResumeInput = z.infer<typeof analyzeResumeSchema>;
export type GenerateCoverLetterInput = z.infer<typeof generateCoverLetterSchema>;
