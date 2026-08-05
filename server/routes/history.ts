import { Router, Request, Response } from 'express';
import { getUserHistory } from '../services/supabase.js';

const router = Router();

router.get('/history', async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || 'demo-user-123';
    const history = await getUserHistory(userId);

    return res.status(200).json({
      success: true,
      analyses: history.analyses,
      coverLetters: history.coverLetters,
    });
  } catch (error: any) {
    console.error('Fetch history error:', error);
    return res.status(500).json({
      error: 'Failed to retrieve analysis and cover letter history.',
    });
  }
});

export default router;
