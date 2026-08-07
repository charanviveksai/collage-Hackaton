import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { GranularResumeData } from '../../src/types/index.js';

export async function parseResumeBuffer(
  buffer: Buffer,
  mimeType: string,
  originalFilename: string
): Promise<{ text: string; fileType: 'pdf' | 'docx' | 'txt'; parsedData?: Partial<GranularResumeData> }> {
  try {
    const filenameLower = originalFilename.toLowerCase();
    let text = '';
    let fileType: 'pdf' | 'docx' | 'txt' = 'txt';

    if (mimeType.includes('pdf') || filenameLower.endsWith('.pdf')) {
      const parsed = await pdfParse(buffer);
      text = cleanExtractedText(parsed.text);
      fileType = 'pdf';
    } else if (
      mimeType.includes('word') ||
      mimeType.includes('officedocument') ||
      filenameLower.endsWith('.docx') ||
      filenameLower.endsWith('.doc')
    ) {
      const result = await mammoth.extractRawText({ buffer });
      text = cleanExtractedText(result.value);
      fileType = 'docx';
    } else {
      text = cleanExtractedText(buffer.toString('utf-8'));
      fileType = 'txt';
    }

    const parsedData = extractGranularSections(text);
    return { text, fileType, parsedData };
  } catch (error) {
    console.error('Error extracting text from file:', error);
    throw new Error('Failed to parse document text. Please ensure the file is valid.');
  }
}

function cleanExtractedText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[^\S\r\n]+/g, ' ')
    .trim();
}

function extractGranularSections(text: string): Partial<GranularResumeData> {
  const lines = text.split('\n');
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const linkedinMatch = text.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const githubMatch = text.match(/github\.com\/[a-zA-Z0-9_-]+/i);

  const technicalSkillsList = [
    'Java', 'Python', 'C++', 'JavaScript', 'TypeScript', 'React', 'Node.js',
    'Express.js', 'SQL', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'Git',
    'HTML', 'CSS', 'Tailwind', 'Next.js', 'Kubernetes', 'GraphQL', 'Redis'
  ];

  const softSkillsList = [
    'Communication', 'Leadership', 'Teamwork', 'Problem Solving',
    'Time Management', 'Critical Thinking', 'Adaptability'
  ];

  const foundTech = technicalSkillsList.filter(s => new RegExp(`\\b${s}\\b`, 'i').test(text));
  const foundSoft = softSkillsList.filter(s => new RegExp(`\\b${s}\\b`, 'i').test(text));

  return {
    personalInfo: {
      fullName: lines[0]?.trim() || 'Candidate Name',
      email: emailMatch ? emailMatch[0] : '',
      phoneNumber: phoneMatch ? phoneMatch[0] : '',
      linkedinUrl: linkedinMatch ? `https://${linkedinMatch[0]}` : '',
      githubUrl: githubMatch ? `https://${githubMatch[0]}` : '',
    },
    technicalSkills: foundTech,
    softSkills: foundSoft,
    interests: ['AI', 'Web Development', 'Cloud Computing'],
  };
}
