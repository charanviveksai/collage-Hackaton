import { Router, Request, Response } from 'express';
import { generateApplicationKitPackage } from '../services/gemini.service.js';
import { supabaseAdmin } from '../services/supabase.js';

const router = Router();

// GET /api/application-kit
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || 'demo-user-123';
    if (!supabaseAdmin) {
      return res.json({ applicationKits: [] });
    }

    const { data, error } = await supabaseAdmin
      .from('application_kits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json({ applicationKits: data || [] });
  } catch (error: any) {
    console.error('Fetch Application Kits error:', error);
    return res.status(500).json({ error: 'Failed to retrieve application kits.' });
  }
});

// POST /api/application-kit/generate
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { resumeText, jobDescription, targetTitle, targetCompany, userId } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ error: 'Both resume text and job description are required.' });
    }

    const effectiveUserId = userId || 'demo-user-123';
    const kitData = await generateApplicationKitPackage(
      resumeText,
      jobDescription,
      targetTitle,
      targetCompany
    );

    let kitId = 'kit_' + Math.random().toString(36).substring(2, 10);
    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin.from('application_kits').insert({
        user_id: effectiveUserId,
        job_title: kitData.jobTitle || targetTitle || 'Target Role',
        company_name: kitData.companyName || targetCompany || 'Target Enterprise',
        match_score: kitData.matchScore || 85,
        ats_score: kitData.atsScore || 90,
        tailored_resume: kitData.tailoredResume || {},
        cover_letter: kitData.coverLetter || {},
        matched_keywords: kitData.matchedKeywords || [],
        missing_keywords: kitData.missingKeywords || [],
        recommendations: kitData.recommendations || [],
      }).select('id').single();

      if (!error && data) kitId = data.id;
    }

    return res.status(200).json({
      success: true,
      kitId,
      applicationKit: kitData,
    });
  } catch (error: any) {
    console.error('Generate Application Kit error:', error);
    return res.status(500).json({ error: error.message || 'Application Kit generation failed.' });
  }
});

// GET /api/application-kit/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!supabaseAdmin) {
      return res.status(404).json({ error: 'Application Kit not found.' });
    }

    const { data, error } = await supabaseAdmin
      .from('application_kits')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Application Kit not found.' });
    }

    return res.json({ success: true, applicationKit: data });
  } catch (error: any) {
    console.error('Fetch Application Kit detail error:', error);
    return res.status(500).json({ error: 'Failed to retrieve application kit detail.' });
  }
});

export default router;
