import { Router, Request, Response } from 'express';
import { analyzeResumeWithGemini } from '../services/gemini.js';
import { saveAnalysisRecord, getAnalysisById } from '../services/supabase.js';

const router = Router();

router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { resumeText, targetJobTitle, companyName, jobDescription, resumeId, userId } = req.body;

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ error: 'Resume content must be at least 50 characters long.' });
    }

    const effectiveUserId = userId || 'demo-user-123';

    // Invoke Gemini AI 30+ metric model
    const analysis = await analyzeResumeWithGemini(
      resumeText,
      targetJobTitle,
      companyName,
      jobDescription
    );

    const analysisId = await saveAnalysisRecord({
      userId: effectiveUserId,
      resumeId,
      targetJobTitle,
      companyName,
      jobDescription,
      ...analysis,
    });

    return res.status(200).json({
      success: true,
      analysisId,
      ...analysis,
      targetJobTitle,
      companyName,
      createdAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Resume analyze route error:', error);
    return res.status(500).json({
      error: error.message || 'An error occurred while running the AI resume analysis.',
    });
  }
});

router.get('/analysis/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const record = await getAnalysisById(id);

    if (!record) {
      return res.status(404).json({ error: 'Analysis record not found' });
    }

    return res.status(200).json({
      success: true,
      analysis: record,
    });
  } catch (error: any) {
    console.error('Fetch analysis detail error:', error);
    return res.status(500).json({ error: 'Failed to retrieve analysis record' });
  }
});

export default router;
