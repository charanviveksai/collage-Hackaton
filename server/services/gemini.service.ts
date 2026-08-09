import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { ResumeAnalysis, MultiFormatCoverLetter } from '../../src/types/index.js';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
You are an expert resume writer, CV specialist, cover-letter writer, recruiter, career coach, ATS optimization specialist, and hiring expert.
Transform user-provided information into accurate professional documents.
Never invent employment, education, certifications, companies, dates, skills, achievements, metrics, or credentials.
Use strong action verbs, improve clarity and grammar, optimize for ATS and humans, and use job-description keywords only when they genuinely match the user's profile.
Return valid structured JSON when requested.
`;

export async function generateResumeFromPrompt(promptText: string): Promise<any> {
  const model = ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [
          { text: SYSTEM_INSTRUCTION },
          {
            text: `Based on the following natural language request or background notes, generate a structured resume object in strict JSON format.

USER PROMPT:
${promptText}

Return JSON with this exact structure:
{
  "title": "Professional Title",
  "summary": "3-5 line professional summary statement highlighting technical expertise and metrics",
  "personalInfo": {
    "fullName": "Name",
    "email": "Email",
    "phone": "Phone",
    "linkedIn": "LinkedIn URL",
    "gitHub": "GitHub URL",
    "portfolio": "Portfolio URL",
    "location": "City, Country"
  },
  "experience": [
    {
      "company": "Company Name",
      "jobTitle": "Job Title",
      "employmentType": "Full-time",
      "location": "City, Country",
      "startDate": "YYYY-MM",
      "endDate": "Present",
      "responsibilities": ["Responsibility bullet 1", "Responsibility bullet 2"],
      "achievements": ["Quantifiable achievement with metrics % or $"],
      "technologies": ["Tech 1", "Tech 2"]
    }
  ],
  "education": [
    {
      "degree": "B.S. in Computer Science",
      "specialization": "Software Engineering",
      "institution": "University Name",
      "cgpa": "3.8/4.0",
      "startYear": "2018",
      "endYear": "2022"
    }
  ],
  "skills": [
    { "name": "TypeScript", "category": "Technical", "proficiency": "Expert" },
    { "name": "System Architecture", "category": "Technical", "proficiency": "Advanced" },
    { "name": "Leadership", "category": "Soft", "proficiency": "Expert" }
  ],
  "projects": [
    {
      "name": "Project Title",
      "description": "Project summary",
      "technologies": ["React", "Node.js"],
      "link": "https://github.com/example",
      "keyFeatures": ["Feature 1", "Feature 2"]
    }
  ],
  "certifications": [
    { "name": "AWS Certified Solutions Architect", "issuer": "Amazon Web Services", "date": "2023" }
  ],
  "achievements": ["Hackathon Winner 2023"],
  "languages": ["English (Native)", "Spanish (Professional)"],
  "interests": ["Distributed Systems", "AI Research"]
}
`
          }
        ]
      }
    ],
    config: {
      responseMimeType: 'application/json',
      temperature: 0.2,
    }
  });

  const response = await model;
  const text = response.text || '{}';
  return JSON.parse(text);
}

export async function generateCVFromText(textInput: string, role?: string): Promise<any> {
  const model = ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [
          { text: SYSTEM_INSTRUCTION },
          {
            text: `Transform the following background/CV text into an academic and executive Curriculum Vitae (CV) object in JSON format.
${role ? `Target Domain/Role: ${role}` : ''}

INPUT CV TEXT:
${textInput}

Return JSON with structure:
{
  "title": "Curriculum Vitae",
  "summary": "Executive summary statement",
  "personalInfo": { "fullName": "", "email": "", "phone": "", "linkedIn": "", "gitHub": "", "location": "" },
  "experience": [],
  "education": [],
  "skills": [],
  "projects": [],
  "certifications": [],
  "achievements": [],
  "languages": [],
  "interests": [],
  "referencesList": []
}
`
          }
        ]
      }
    ],
    config: {
      responseMimeType: 'application/json',
      temperature: 0.2,
    }
  });

  const response = await model;
  return JSON.parse(response.text || '{}');
}

export async function analyzeJobPosting(jobDescription: string): Promise<any> {
  const model = ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [
          { text: SYSTEM_INSTRUCTION },
          {
            text: `Analyze this job posting description and extract key domain requirements in JSON format:

JOB DESCRIPTION:
${jobDescription}

Return JSON:
{
  "jobTitle": "Extracted Job Title",
  "companyName": "Extracted Company Name",
  "careerDomain": "e.g. Web Development / Software Engineering / Data Science",
  "experienceLevel": "e.g. Senior / Staff / Entry",
  "requiredSkills": ["Skill 1", "Skill 2"],
  "requiredKeywords": ["Keyword 1", "Keyword 2"],
  "summary": "Brief role summary"
}
`
          }
        ]
      }
    ],
    config: {
      responseMimeType: 'application/json',
      temperature: 0.1,
    }
  });

  const response = await model;
  return JSON.parse(response.text || '{}');
}

export async function generateApplicationKitPackage(
  resumeText: string,
  jobDescription: string,
  targetTitle?: string,
  targetCompany?: string
): Promise<any> {
  const model = ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [
          { text: SYSTEM_INSTRUCTION },
          {
            text: `Generate a complete Application Kit including job match analysis, ATS audit score, tailored resume JSON, and 4-format cover letter bundle.

RESUME CONTENT:
${resumeText}

JOB POSTING:
${jobDescription}

Target Title: ${targetTitle || 'Extracted Role'}
Target Company: ${targetCompany || 'Extracted Company'}

Return JSON:
{
  "jobTitle": "${targetTitle || 'Software Professional'}",
  "companyName": "${targetCompany || 'Target Enterprise'}",
  "matchScore": 88,
  "atsScore": 92,
  "matchedKeywords": ["TypeScript", "React", "Node.js"],
  "missingKeywords": ["GraphQL", "Docker"],
  "recommendations": [
    "Highlight quantifiable performance metrics in your latest software engineering role.",
    "Mention experience with API Gateway & microservices architecture."
  ],
  "tailoredResume": {
    "title": "Tailored Software Engineer Resume",
    "summary": "High-impact summary tailored to job requirements.",
    "experience": [],
    "education": [],
    "skills": []
  },
  "coverLetter": {
    "professionalVersion": "Dear Hiring Manager...",
    "shortVersion": "Dear Hiring Manager...",
    "emailVersion": "Subject: Application...",
    "atsVersion": "Dear Hiring Manager..."
  }
}
`
          }
        ]
      }
    ],
    config: {
      responseMimeType: 'application/json',
      temperature: 0.2,
    }
  });

  const response = await model;
  return JSON.parse(response.text || '{}');
}
