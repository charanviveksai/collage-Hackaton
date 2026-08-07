import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert,
  ArrowLeft,
  Globe
} from 'lucide-react';

const COUNTRY_CODES = [
  { code: '+1', country: 'United States / Canada 🇺🇸 🇨🇦' },
  { code: '+91', country: 'India 🇮🇳' },
  { code: '+44', country: 'United Kingdom 🇬🇧' },
  { code: '+61', country: 'Australia 🇦🇺' },
  { code: '+49', country: 'Germany 🇩🇪' },
  { code: '+33', country: 'France 🇫🇷' },
  { code: '+81', country: 'Japan 🇯🇵' },
  { code: '+971', country: 'United Arab Emirates 🇦🇪' },
  { code: '+65', country: 'Singapore 🇸🇬' },
  { code: '+86', country: 'China 🇨🇳' },
  { code: '+55', country: 'Brazil 🇧🇷' },
  { code: '+27', country: 'South Africa 🇿🇦' },
  { code: '+34', country: 'Spain 🇪🇸' },
  { code: '+39', country: 'Italy 🇮🇹' },
  { code: '+7', country: 'Russia / Kazakhstan 🇷🇺' },
  { code: '+82', country: 'South Korea 🇰🇷' },
  { code: '+52', country: 'Mexico 🇲🇽' },
  { code: '+966', country: 'Saudi Arabia 🇸🇦' },
];

export const AuthPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register, resetPasswordByEmail, resetPasswordByPhone, verifyPhoneOtp, isDemo } = useAuth();

  const isRegisterInitial = location.pathname === '/register';
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Login / Register fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // Forgot password fields
  const [recoveryMethod, setRecoveryMethod] = useState<'email' | 'phone'>('email');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [rawPhone, setRawPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fullPhoneNumber = `${countryCode}${rawPhone.trim().replace(/^[+0]+/, '')}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      if (mode === 'register') {
        await register(email, password, fullName);
        navigate('/dashboard');
      } else if (mode === 'login') {
        await login(email, password);
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setErrorMsg(err.message || 'Authentication failed. Please ensure you have signed up.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      if (recoveryMethod === 'email') {
        if (!recoveryEmail) {
          setErrorMsg('Please enter your email address.');
          setSubmitting(false);
          return;
        }
        const res = await resetPasswordByEmail(recoveryEmail);
        setSuccessMsg(res.message);
      } else {
        if (!otpSent) {
          if (!rawPhone.trim()) {
            setErrorMsg('Please enter your phone number.');
            setSubmitting(false);
            return;
          }
          const res = await resetPasswordByPhone(fullPhoneNumber);
          setSuccessMsg(res.message);
          setOtpSent(true);
        } else {
          if (!otpCode || !newPassword) {
            setErrorMsg('Please enter the OTP verification code and your new password.');
            setSubmitting(false);
            return;
          }
          const res = await verifyPhoneOtp(fullPhoneNumber, otpCode, newPassword);
          setSuccessMsg(res.message);
          setTimeout(() => {
            setMode('login');
            setOtpSent(false);
          }, 2000);
        }
      }
    } catch (err: any) {
      console.error('Forgot password error:', err);
      setErrorMsg(err.message || 'Failed to process password recovery request.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('alex.developer@example.com');
    setPassword('DemoPass123!');
    setFullName('Alex Vance');
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center px-4 py-12 bg-slate-950">
      
      {/* Background Blur */}
      <div className="absolute w-96 h-96 bg-brand-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl relative z-10">
        
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-brand-500/25">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            {mode === 'forgot'
              ? 'Reset Account Password'
              : mode === 'register'
              ? 'Create Your Account'
              : 'Sign In to ResumeAI'}
          </h2>
          <p className="text-xs text-slate-400">
            {mode === 'forgot'
              ? 'Recover access using your email or phone number'
              : mode === 'register'
              ? 'Sign up to access AI resume tools & ATS optimization'
              : 'Enter your credentials to log in'}
          </p>
        </div>

        {isDemo && mode !== 'forgot' && (
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start space-x-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Demo Sandbox Active</p>
              <p className="text-[11px] text-amber-400/80 mt-0.5">
                Sign in with existing credentials or create a new account.
              </p>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="mt-2 px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-medium rounded-lg text-[11px] transition-colors"
              >
                Auto-Fill Demo Credentials
              </button>
            </div>
          </div>
        )}

        {/* Error / Success Banners */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* MODE: FORGOT PASSWORD */}
        {mode === 'forgot' ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            
            {/* Method Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setRecoveryMethod('email');
                  setOtpSent(false);
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5 transition-colors ${
                  recoveryMethod === 'email'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Mail</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRecoveryMethod('phone');
                  setOtpSent(false);
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5 transition-colors ${
                  recoveryMethod === 'phone'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Phone</span>
              </button>
            </div>

            {recoveryMethod === 'email' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number (Worldwide International)</label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-1/3 py-2.5 px-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code} className="bg-slate-900 text-slate-200">
                          {c.code} ({c.country})
                        </option>
                      ))}
                    </select>

                    <div className="relative flex-1">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        required
                        value={rawPhone}
                        onChange={(e) => setRawPhone(e.target.value)}
                        placeholder="1234567890"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Full international format: {fullPhoneNumber}</p>
                </div>

                {otpSent && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">SMS Verification Code (OTP)</label>
                      <input
                        type="text"
                        required
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="6-digit code"
                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 font-mono tracking-widest text-center"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2 text-sm transition-all disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {recoveryMethod === 'email'
                      ? 'Send Reset Link'
                      : otpSent
                      ? 'Reset Password'
                      : 'Send SMS OTP'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
            </div>

          </form>
        ) : (
          /* MODE: LOGIN / REGISTER */
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Vance"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number (Worldwide International)</label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-1/3 py-2.5 px-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code} className="bg-slate-900 text-slate-200">
                      {c.code} ({c.country})
                    </option>
                  ))}
                </select>

                <div className="relative flex-1">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    value={rawPhone}
                    onChange={(e) => setRawPhone(e.target.value)}
                    placeholder="1234567890"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">Password *</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2 text-sm transition-all disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'register' ? 'Sign Up & Create Account' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className="text-xs text-slate-400 hover:text-brand-400 transition-colors"
              >
                {mode === 'login'
                  ? "Don't have an account? Sign Up first"
                  : 'Already registered? Sign In to your account'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
