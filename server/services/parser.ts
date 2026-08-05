import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export async function parseResumeBuffer(buffer: Buffer, mimeType: string, originalFilename: string): Promise<{ text: string; fileType: 'pdf' | 'docx' | 'txt' }> {
  try {
    const filenameLower = originalFilename.toLowerCase();
    
    if (mimeType.includes('pdf') || filenameLower.endsWith('.pdf')) {
      const parsed = await pdfParse(buffer);
      const cleaned = cleanExtractedText(parsed.text);
      return { text: cleaned, fileType: 'pdf' };
    }
    
    if (
      mimeType.includes('word') ||
      mimeType.includes('officedocument') ||
      filenameLower.endsWith('.docx') ||
      filenameLower.endsWith('.doc')
    ) {
      const result = await mammoth.extractRawText({ buffer });
      const cleaned = cleanExtractedText(result.value);
      return { text: cleaned, fileType: 'docx' };
    }

    // Default to plain text
    const textContent = buffer.toString('utf-8');
    const cleaned = cleanExtractedText(textContent);
    return { text: cleaned, fileType: 'txt' };
  } catch (error) {
    console.error('Error extracting text from file:', error);
    throw new Error('Failed to parse document text. Please ensure the file is not password-protected or corrupted.');
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
