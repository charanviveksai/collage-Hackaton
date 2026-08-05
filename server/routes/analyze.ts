import { Router, Request, Response } from 'express';
import { analyzeResumeSchema } from '../validators/schemas.js';
import { analyzeResumeWithGemini } from '../services/gemini.js';
import { saveAnalysisRecord, getAnalysisById } from '../services/supabase.js';

const router = Router();

// POST /api/resume/analyze
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const parseResult = analyzeResumeSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parseResult.error.errors.map(e => e.message),
      });
    }

    const { resumeText, targetJobTitle, companyName, jobDescription, resumeId, userId } = parseResult.data;
    const effectiveUserId = userId || 'demo-user-123';

    // Invoke Gemini AI service
    const analysis = await analyzeResumeWithGemini(
      resumeText,
      targetJobTitle,
      companyName,
      jobDescription
    );

    // Save record
    const analysisId = await saveAnalysisRecord({
      userId: effectiveUserId,
      resumeId,
      targetJobTitle,
      companyName,
      jobDescription,
      atsScore: analysis.atsScore,
      summary: analysis.summary,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      missingSkills: analysis.missingSkills,
      recommendations: analysis.recommendations,
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

// GET /api/analysis/:id
router.get('/analysis/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const record = await getAnalysisById(id);

    if (!record) {
      return res.status(404).json({ error: 'Analysis record not found' });
    }

    return res.status(200).json({
      success: true,
      analysis: {
        id: record.id,
        summary: record.summary,
        strengths: record.strengths || [],
        weaknesses: record.weaknesses || [],
        missingSkills: record.missing_skills || record.missingSkills || [],
        recommendations: record.recommendations || [],
        atsScore: record.ats_score || record.atsScore,
        targetJobTitle: record.target_job_title || record.targetJobTitle,
        companyName: record.company_name || record.companyName,
        createdAt: record.created_at || record.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Fetch analysis error:', error);
    return res.status(500).json({ error: 'Failed to retrieve analysis record' });
  }
});

export default router;
