import { Router, Request, Response } from 'express';
import { generateMultiFormatCoverLetterWithGemini } from '../services/gemini.js';
import { saveCoverLetterRecord } from '../services/supabase.js';

const router = Router();

router.post('/cover-letter', async (req: Request, res: Response) => {
  try {
    const { resumeText, jobTitle, companyName, hiringManager, jobDescription, tone, resumeId, userId } = req.body;

    if (!jobTitle || !companyName) {
      return res.status(400).json({ error: 'Job title and company name are required.' });
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ error: 'Resume content must be at least 50 characters long.' });
    }

    const effectiveUserId = userId || 'demo-user-123';

    // Generate 4 distinct cover letter variants simultaneously
    const result = await generateMultiFormatCoverLetterWithGemini(
      resumeText,
      jobTitle,
      companyName,
      hiringManager,
      jobDescription,
      tone
    );

    const coverLetterId = await saveCoverLetterRecord({
      userId: effectiveUserId,
      resumeId,
      ...result,
    });

    return res.status(200).json({
      success: true,
      coverLetterId,
      ...result,
      createdAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Cover letter generation route error:', error);
    return res.status(500).json({
      error: error.message || 'An error occurred while generating cover letters.',
    });
  }
});

export default router;
