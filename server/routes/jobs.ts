import { Router, Request, Response } from 'express';
import { analyzeJobPosting } from '../services/gemini.service.js';

const router = Router();

// POST /api/jobs/analyze
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { jobDescription } = req.body;
    if (!jobDescription || jobDescription.trim().length < 20) {
      return res.status(400).json({ error: 'Job description text must be at least 20 characters.' });
    }

    const jobAnalysis = await analyzeJobPosting(jobDescription);
    return res.status(200).json({
      success: true,
      analysis: jobAnalysis,
    });
  } catch (error: any) {
    console.error('Analyze job error:', error);
    return res.status(500).json({ error: error.message || 'Job description analysis failed.' });
  }
});

export default router;
