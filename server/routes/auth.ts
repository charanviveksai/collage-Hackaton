import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../services/supabase.js';
import { z } from 'zod';

const router = Router();

const resetPasswordSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  method: z.enum(['email', 'phone']),
});

const verifyOtpSchema = z.object({
  phone: z.string(),
  token: z.string(),
  newPassword: z.string().min(6),
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const parseResult = resetPasswordSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Invalid input parameters.' });
    }

    const { email, phone, method } = parseResult.data;

    if (method === 'email') {
      if (!email) {
        return res.status(400).json({ error: 'Email address is required for email recovery.' });
      }

      if (supabaseAdmin) {
        const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
          redirectTo: `${process.env.VITE_APP_URL || 'http://localhost:5173'}/login?reset=true`,
        });

        if (error) {
          console.error('Supabase resetPasswordForEmail error:', error);
          return res.status(400).json({ error: error.message });
        }
      }

      return res.status(200).json({
        success: true,
        message: `Password reset link sent to ${email}. Please check your inbox.`,
      });
    }

    if (method === 'phone') {
      if (!phone) {
        return res.status(400).json({ error: 'Phone number is required for SMS recovery.' });
      }

      if (supabaseAdmin) {
        const { error } = await supabaseAdmin.auth.signInWithOtp({
          phone,
        });

        if (error) {
          console.error('Supabase signInWithOtp error:', error);
          return res.status(400).json({ error: error.message });
        }
      }

      return res.status(200).json({
        success: true,
        message: `Verification OTP code sent to ${phone}. Please enter the code below to reset your password.`,
      });
    }

    return res.status(400).json({ error: 'Unsupported recovery method.' });
  } catch (error: any) {
    console.error('Reset password route error:', error);
    return res.status(500).json({ error: error.message || 'An error occurred during password reset request.' });
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req: Request, res: Response) => {
  try {
    const parseResult = verifyOtpSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Invalid OTP verification payload.' });
    }

    const { phone, token, newPassword } = parseResult.data;

    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
      });

      if (error || !data.session) {
        return res.status(400).json({ error: error?.message || 'Invalid or expired OTP verification code.' });
      }

      // Update password for user
      const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(
        data.session.user.id,
        { password: newPassword }
      );

      if (updateErr) {
        return res.status(500).json({ error: updateErr.message });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully! You can now log in with your new password.',
    });
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({ error: error.message || 'Failed to verify OTP code.' });
  }
});

export default router;
