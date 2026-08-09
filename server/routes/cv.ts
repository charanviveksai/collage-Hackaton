import { Router, Request, Response } from 'express';
import { generateCVFromText } from '../services/gemini.service.js';
import { parseResumeBuffer } from '../services/parser.js';
import { supabaseAdmin } from '../services/supabase.js';

const router = Router();

// GET /api/cvs
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || 'demo-user-123';
    if (!supabaseAdmin) {
      return res.json({ cvs: [] });
    }

    const { data, error } = await supabaseAdmin
      .from('cvs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json({ cvs: data || [] });
  } catch (error: any) {
    console.error('Fetch CVs error:', error);
    return res.status(500).json({ error: 'Failed to retrieve CVs.' });
  }
});

// POST /api/cvs/generate
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { promptText, textInput, role, userId } = req.body;
    const inputContent = promptText || textInput;

    if (!inputContent || inputContent.trim().length < 10) {
      return res.status(400).json({ error: 'Please provide valid text or prompt for CV generation.' });
    }

    const effectiveUserId = userId || 'demo-user-123';
    const cvData = await generateCVFromText(inputContent, role);

    let cvId = 'cv_' + Math.random().toString(36).substring(2, 10);
    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin.from('cvs').insert({
        user_id: effectiveUserId,
        title: cvData.title || 'Curriculum Vitae',
        summary: cvData.summary || '',
        personal_info: cvData.personalInfo || {},
        experience: cvData.experience || [],
        education: cvData.education || [],
        skills: cvData.skills || [],
        projects: cvData.projects || [],
        certifications: cvData.certifications || [],
        achievements: cvData.achievements || [],
        languages: cvData.languages || [],
        interests: cvData.interests || [],
        references_list: cvData.referencesList || [],
      }).select('id').single();

      if (!error && data) cvId = data.id;
    }

    return res.status(200).json({
      success: true,
      cvId,
      cv: cvData,
    });
  } catch (error: any) {
    console.error('Generate CV error:', error);
    return res.status(500).json({ error: error.message || 'CV generation failed.' });
  }
});

// GET /api/cvs/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!supabaseAdmin) {
      return res.status(404).json({ error: 'CV record not found.' });
    }

    const { data, error } = await supabaseAdmin
      .from('cvs')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'CV record not found.' });
    }

    return res.json({ success: true, cv: data });
  } catch (error: any) {
    console.error('Fetch CV detail error:', error);
    return res.status(500).json({ error: 'Failed to retrieve CV record.' });
  }
});

export default router;
