import { GoogleGenAI } from '@google/genai';

export interface AIAnalysisResult {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  recommendations: string[];
  atsScore: number;
}

export async function analyzeResumeWithGemini(
  resumeText: string,
  targetJobTitle?: string,
  companyName?: string,
  jobDescription?: string
): Promise<AIAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your-gemini-api-key') {
    console.warn('GEMINI_API_KEY not configured. Falling back to intelligent heuristic resume analysis engine.');
    return generateFallbackResumeAnalysis(resumeText, targetJobTitle, jobDescription);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
You are an expert ATS (Applicant Tracking System) Auditor and Executive Career Coach.
Analyze the following candidate resume thoroughly and objectively against modern hiring standards${targetJobTitle ? ` for the target role of "${targetJobTitle}"` : ''}${companyName ? ` at "${companyName}"` : ''}.

${jobDescription ? `Target Job Description:\n${jobDescription}\n` : ''}
Resume Text:
${resumeText}

Respond strictly in raw, valid JSON with no markdown formatting surrounding it (no \`\`\`json block).
The JSON object MUST strictly follow this exact structure:
{
  "summary": "A 2-3 sentence executive summary of the candidate's background and suitability.",
  "strengths": ["3 to 5 clear, specific key strengths observed in the resume"],
  "weaknesses": ["3 to 4 specific areas of improvement or formatting/content flaws"],
  "missingSkills": ["4 to 6 critical industry keywords, technical tools, or soft skills missing"],
  "recommendations": ["4 actionable bullet points on how to revise and improve the resume"],
  "atsScore": 85
}

atsScore must be an integer between 0 and 100 representing how well optimized this resume is for ATS parsers and target job relevance.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text || '';
    const cleanJson = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();

    const parsed: AIAnalysisResult = JSON.parse(cleanJson);

    // Validate fields
    return {
      summary: parsed.summary || 'Solid candidate profile with strong experience.',
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
      missingSkills: Array.isArray(parsed.missingSkills) ? parsed.missingSkills : [],
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
      atsScore: typeof parsed.atsScore === 'number' ? Math.max(0, Math.min(100, parsed.atsScore)) : 75,
    };
  } catch (error) {
    console.error('Error invoking Gemini API:', error);
    return generateFallbackResumeAnalysis(resumeText, targetJobTitle, jobDescription);
  }
}

export async function generateCoverLetterWithGemini(
  resumeText: string,
  jobTitle: string,
  companyName: string,
  jobDescription?: string,
  tone: string = 'professional'
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your-gemini-api-key') {
    console.warn('GEMINI_API_KEY not configured. Falling back to structured cover letter generator engine.');
    return generateFallbackCoverLetter(resumeText, jobTitle, companyName, jobDescription, tone);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
You are a senior career advisor and executive professional writer.
Write a tailored, highly persuasive cover letter for a candidate applying for the position of "${jobTitle}" at "${companyName}".

Tone: ${tone}

Job Description Context:
${jobDescription || 'Standard requirements for ' + jobTitle}

Candidate's Resume Information:
${resumeText}

Instructions:
1. Do not use placeholders like [Your Name] or [Date] - draft it cleanly starting with a compelling opening paragraph.
2. Highlight specific metrics, achievements, and technical strengths mentioned in the resume.
3. Bridge candidate's skills directly with potential value for ${companyName}.
4. Keep length between 250 and 400 words across 3-4 structured paragraphs.
5. End with a confident, professional call to action.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || generateFallbackCoverLetter(resumeText, jobTitle, companyName, jobDescription, tone);
  } catch (error) {
    console.error('Error generating cover letter with Gemini:', error);
    return generateFallbackCoverLetter(resumeText, jobTitle, companyName, jobDescription, tone);
  }
}

// Smart Heuristic Fallbacks for evaluation when offline or API key isn't provided
function generateFallbackResumeAnalysis(
  resumeText: string,
  targetJobTitle?: string,
  jobDescription?: string
): AIAnalysisResult {
  const lowerText = resumeText.toLowerCase();
  
  // Keyword density checks
  const keywords = ['managed', 'developed', 'led', 'architected', 'improved', 'increased', '%', 'project', 'team', 'design', 'react', 'node', 'python', 'sql', 'agile', 'aws', 'data'];
  const foundKeywords = keywords.filter(kw => lowerText.includes(kw));
  const hasMetrics = /\d+%/g.test(resumeText) || /\$\d+/g.test(resumeText) || /\d+ (users|clients|projects|team|percent)/i.test(resumeText);
  const lengthScore = resumeText.length > 500 ? (resumeText.length > 3000 ? 70 : 90) : 50;
  
  let atsScore = Math.min(95, Math.max(55, Math.round((foundKeywords.length * 4) + (hasMetrics ? 15 : 0) + (lengthScore * 0.4))));

  const targetRole = targetJobTitle || 'Target Position';

  return {
    summary: `The resume demonstrates experience relevant to ${targetRole}. It presents clear technical experience, but can be further tailored with impact metrics and ATS keyword alignment.`,
    strengths: [
      'Clear chronological structure and easily readable layout formatting.',
      'Demonstrates actionable technical responsibilities and core project contributions.',
      'Contains relevant domain terminology aligned with industry standards.',
      ...(hasMetrics ? ['Includes quantified business metrics and achievements (% / scale numbers).'] : [])
    ],
    weaknesses: [
      ...(!hasMetrics ? ['Lacks quantified numerical achievements (e.g., increased conversion by 25%, managed $50k budget).'] : []),
      'Action verbs could be stronger at the beginning of experience bullet points.',
      'Summary statement could be more tailored to specific high-value key results.'
    ],
    missingSkills: [
      'CI/CD Pipelines & DevOps Automation',
      'System Architecture & Performance Tuning',
      'Cross-functional Stakeholder Management',
      'Data-driven Impact Analytics'
    ],
    recommendations: [
      'Reframe experience bullet points using the XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]".',
      'Add a dedicated "Technical Skills & Certifications" matrix near the top of the resume.',
      'Incorporate exact key terms from the job posting to maximize ATS scanner match percentage.',
      'Keep action verbs active and impactful (e.g., use "Spearheaded", "Architected", "Engineered" rather than "Responsible for").'
    ],
    atsScore
  };
}

function generateFallbackCoverLetter(
  resumeText: string,
  jobTitle: string,
  companyName: string,
  jobDescription?: string,
  tone: string = 'professional'
): string {
  return `Dear Hiring Manager at ${companyName},

I am writing to express my strong enthusiasm for the ${jobTitle} position at ${companyName}. With my extensive background in technical execution, strategic problem solving, and project leadership, I am confident in my ability to immediately make a meaningful impact on your team.

Throughout my career, I have consistently driven results by aligning engineering precision with organizational goals. My resume highlights key achievements in designing scalable solutions, collaborating across multi-disciplinary teams, and optimizing workflow efficiency. When reviewing the job requirements for ${jobTitle}, I identified strong synergies between your current roadmap and my proven track record.

What particularly excites me about ${companyName} is your commitment to innovation and excellence. I thrive in dynamic environments where complex technical challenges require innovative thinking and meticulous execution.

I would welcome the opportunity to discuss how my skill set, experience, and drive align with the goals of ${companyName}. Thank you for your time and consideration.

Sincerely,
[Candidate Name]`;
}
