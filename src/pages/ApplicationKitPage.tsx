import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileDropzone } from '../components/FileDropzone';
import { Briefcase, Sparkles, ArrowRight, AlertCircle, Building2, CheckCircle2 } from 'lucide-react';

export const ApplicationKitPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [targetTitle, setTargetTitle] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleParsedText = (text: string) => {
    setResumeText(text);
    setErrorMsg(null);
  };

  const handleGenerateKit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jobDescription || jobDescription.trim().length < 20) {
      setErrorMsg('Please paste a job description (min 20 characters).');
      return;
    }

    if (!resumeText || resumeText.trim().length < 20) {
      setErrorMsg('Please upload a PDF resume or enter your background text.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/application-kit/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          targetTitle: targetTitle.trim() || undefined,
          targetCompany: targetCompany.trim() || undefined,
          userId: user?.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate Application Kit.');

      navigate(`/application-kit/${data.kitId}`, { state: { kitData: data.applicationKit } });
    } catch (err: any) {
      console.error('Application kit generation error:', err);
      setErrorMsg(err.message || 'An error occurred while generating Application Kit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Job Matcher & Application Kit Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Import CV → Paste Job Listing → <span className="gradient-text">Get Application Kit</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Generate a tailored CV, matching cover letter, job match score, ATS score, missing keywords, and strategic recommendations in one click.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleGenerateKit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Column: Job Listing Input */}
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Step 1: Target Job Listing</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Job Title</label>
              <input
                type="text"
                value={targetTitle}
                onChange={(e) => setTargetTitle(e.target.value)}
                placeholder="e.g. Senior Software Architect"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name</label>
              <input
                type="text"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                placeholder="e.g. Stripe, OpenAI, Vercel"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Job Posting Details / Description *</label>
              <textarea
                rows={6}
                required
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target job posting text here..."
                className="w-full p-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Right Column: Resume Source Input */}
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Briefcase className="w-4 h-4 text-brand-400" />
                <span>Step 2: Import Your CV / Resume</span>
              </h3>

              <FileDropzone onParsedText={handleParsedText} userId={user?.id} />

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Or Paste Background / Resume Text</label>
                <textarea
                  rows={4}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your current resume or background text..."
                  className="w-full p-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !jobDescription || !resumeText}
              className="w-full py-4 bg-gradient-to-r from-amber-500 via-orange-600 to-brand-600 hover:from-amber-400 hover:to-brand-500 text-white font-bold rounded-2xl shadow-xl shadow-amber-500/25 flex items-center justify-center space-x-2 text-xs sm:text-sm transition-all disabled:opacity-50 mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Application Kit Package</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
