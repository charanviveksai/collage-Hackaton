import { Router, Request, Response } from 'express';
import { generateCoverLetterSchema } from '../validators/schemas.js';
import { generateCoverLetterWithGemini } from '../services/gemini.js';
import { saveCoverLetterRecord } from '../services/supabase.js';

const router = Router();

router.post('/cover-letter', async (req: Request, res: Response) => {
  try {
    const parseResult = generateCoverLetterSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parseResult.error.errors.map(e => e.message),
      });
    }

    const { resumeText, jobTitle, companyName, jobDescription, tone, resumeId, userId } = parseResult.data;
    const effectiveUserId = userId || 'demo-user-123';

    // Generate cover letter via Gemini service
    const content = await generateCoverLetterWithGemini(
      resumeText,
      jobTitle,
      companyName,
      jobDescription,
      tone
    );

    // Save record
    const coverLetterId = await saveCoverLetterRecord({
      userId: effectiveUserId,
      resumeId,
      jobTitle,
      companyName,
      content,
      tone,
    });

    return res.status(200).json({
      success: true,
      coverLetterId,
      jobTitle,
      companyName,
      content,
      tone,
      createdAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Cover letter generation error:', error);
    return res.status(500).json({
      error: error.message || 'An error occurred while generating the cover letter.',
    });
  }
});

export default router;
