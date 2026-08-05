import { Router, Request, Response } from 'express';
import multer from 'multer';
import { parseResumeBuffer } from '../services/parser.js';
import { saveResumeRecord } from '../services/supabase.js';

const router = Router();
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const userId = (req.body.userId as string) || 'demo-user-123';

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded. Please upload a PDF, DOCX, or TXT file.' });
    }

    const { text, fileType } = await parseResumeBuffer(file.buffer, file.mimetype, file.originalname);

    if (!text || text.trim().length < 20) {
      return res.status(422).json({
        error: 'Unable to extract legible text from file. Please ensure it contains readable text.',
      });
    }

    const resumeId = await saveResumeRecord({
      userId,
      fileName: file.originalname,
      fileType,
      rawText: text,
    });

    return res.status(200).json({
      success: true,
      resumeId,
      fileName: file.originalname,
      fileType,
      text,
      characterCount: text.length,
    });
  } catch (error: any) {
    console.error('Resume upload error:', error);
    return res.status(500).json({
      error: error.message || 'An unexpected error occurred while parsing the resume file.',
    });
  }
});

export default router;
