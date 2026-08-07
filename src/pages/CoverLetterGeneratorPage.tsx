import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { generateMultiFormatCoverLetterApi } from '../lib/api';
import { FileDropzone } from '../components/FileDropzone';
import { CoverLetterTabs } from '../components/CoverLetterTabs';
import { MultiFormatCoverLetter } from '../types';
import { 
  Mail, 
  Sparkles, 
  Building2, 
  Briefcase, 
  AlertCircle, 
  User, 
  FileText 
} from 'lucide-react';

export const CoverLetterGeneratorPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const state = location.state as { jobTitle?: string; companyName?: string } | null;

  const [jobTitle, setJobTitle] = useState(state?.jobTitle || '');
  const [companyName, setCompanyName] = useState(state?.companyName || '');
  const [hiringManager, setHiringManager] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [tone, setTone] = useState<'professional' | 'enthusiastic' | 'technical' | 'executive'>('professional');
  
  const [resumeText, setResumeText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState<MultiFormatCoverLetter | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleParsedText = (text: string) => {
    setResumeText(text);
    setErrorMsg(null);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim() || !companyName.trim()) {
      setErrorMsg('Please enter both Job Title and Company Name.');
      return;
    }

    if (!resumeText || resumeText.trim().length < 50) {
      setErrorMsg('Please upload or paste resume text before generating cover letters.');
      return;
    }

    setErrorMsg(null);
    setIsGenerating(true);

    try {
      const res = await generateMultiFormatCoverLetterApi({
        resumeText,
        jobTitle: jobTitle.trim(),
        companyName: companyName.trim(),
        hiringManager: hiringManager.trim() || undefined,
        jobDescription: jobDescription.trim() || undefined,
        tone,
        userId: user?.id,
      });

      setGeneratedLetter(res);
    } catch (err: any) {
      console.error('Cover letter generation failed:', err);
      setErrorMsg(err.message || 'Failed to generate cover letters.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
            <Mail className="w-3.5 h-3.5" />
            <span>AI Cover Letter Architect (4 Formats)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Generate <span className="gradient-text">Tailored Cover Letters</span>
          </h1>
          <p className="text-slate-400 text-sm">
            Create Professional, Short, Email Outreach, and ATS-Optimized cover letter formats tailored to your role.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form Left Side */}
          <form onSubmit={handleGenerate} className="lg:col-span-5 space-y-6">
            
            <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-brand-400" />
                <span>Job & Company Details</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Job Title *</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Staff Full Stack Architect"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name *</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Stripe, OpenAI, Vercel"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Hiring Manager Name (Optional)</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={hiringManager}
                    onChange={(e) => setHiringManager(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Writing Tone</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['professional', 'enthusiastic', 'technical', 'executive'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTone(t)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize border transition-all ${
                        tone === t
                          ? 'bg-brand-600 text-white border-brand-500 shadow-md'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Job Description (Optional)</label>
                <textarea
                  rows={3}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste job posting details for keyword matching..."
                  className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <span>Resume Source</span>
              </h3>
              <FileDropzone onParsedText={handleParsedText} userId={user?.id} />
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isGenerating || !resumeText || !jobTitle || !companyName}
              className="w-full py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-brand-600 hover:from-purple-500 hover:to-brand-500 text-white font-bold rounded-2xl shadow-xl shadow-purple-500/25 flex items-center justify-center space-x-2 text-sm transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate 4 Cover Letter Formats</span>
                </>
              )}
            </button>

          </form>

          {/* Result Right Side */}
          <div className="lg:col-span-7 space-y-4">
            {isGenerating ? (
              <div className="p-16 rounded-3xl glass-panel border border-slate-800 text-center space-y-4">
                <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-purple-300 font-mono">Writing 4 personalized cover letter formats via Gemini AI...</p>
              </div>
            ) : generatedLetter ? (
              <CoverLetterTabs coverLetter={generatedLetter} />
            ) : (
              <div className="p-16 rounded-3xl glass-panel border border-slate-800 text-center text-slate-500 text-xs space-y-3">
                <Mail className="w-12 h-12 text-slate-700 mx-auto" />
                <h3 className="text-sm font-bold text-slate-300">Ready to Generate Cover Letters</h3>
                <p className="max-w-md mx-auto">
                  Provide your target job title, company name, and resume text to generate Professional, Short, Email, and ATS Optimized versions.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
