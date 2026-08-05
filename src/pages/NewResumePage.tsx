import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileDropzone } from '../components/FileDropzone';
import { analyzeResumeApi } from '../lib/api';
import { 
  Sparkles, 
  Briefcase, 
  Building2, 
  FileText, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Bot 
} from 'lucide-react';

export const NewResumePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [resumeText, setResumeText] = useState<string>('');
  const [resumeFileName, setResumeFileName] = useState<string | undefined>();
  const [resumeId, setResumeId] = useState<string | undefined>();

  const [targetJobTitle, setTargetJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [analysisStep, setAnalysisStep] = useState<string>('Initializing AI Agent...');

  const handleParsedText = (text: string, fileName?: string, id?: string) => {
    setResumeText(text);
    if (fileName) setResumeFileName(fileName);
    if (id) setResumeId(id);
    setErrorMsg(null);
  };

  const handleRunAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText || resumeText.trim().length < 50) {
      setErrorMsg('Please upload a valid resume document or paste resume text before analyzing.');
      return;
    }

    setErrorMsg(null);
    setIsAnalyzing(true);

    try {
      setAnalysisStep('Reading document content & structure...');
      await new Promise(r => setTimeout(r, 600));

      setAnalysisStep('Evaluating ATS keyword match & section hierarchy...');
      await new Promise(r => setTimeout(r, 600));

      setAnalysisStep('Invoking Gemini 2.5 AI for strength & weakness audit...');

      const result = await analyzeResumeApi({
        resumeText,
        targetJobTitle: targetJobTitle.trim() || undefined,
        companyName: companyName.trim() || undefined,
        jobDescription: jobDescription.trim() || undefined,
        resumeId,
        userId: user?.id,
      });

      setAnalysisStep('Finalizing ATS Score & report visualization...');
      await new Promise(r => setTimeout(r, 400));

      navigate(`/analysis/${result.id}`);
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setErrorMsg(err.message || 'An error occurred while analyzing the resume. Please try again.');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Resume Scanner & ATS Auditor</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Analyze Resume <span className="gradient-text">Strengths & ATS Score</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Upload your resume file or paste text below. Optionally provide target job details to get role-matched tailoring recommendations.
          </p>
        </div>

        {/* Loading Overlay State */}
        {isAnalyzing ? (
          <div className="p-12 rounded-3xl glass-panel border border-brand-500/30 text-center space-y-6 animate-pulse">
            <div className="w-16 h-16 rounded-2xl bg-brand-600/20 border border-brand-500/40 flex items-center justify-center text-brand-400 mx-auto">
              <Bot className="w-8 h-8 animate-bounce" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Analyzing Your Resume</h3>
              <p className="text-sm text-brand-400 font-mono font-medium">{analysisStep}</p>
            </div>
            <div className="max-w-xs mx-auto bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-brand-500 to-indigo-500 h-full w-3/4 animate-pulse" />
            </div>
          </div>
        ) : (
          <form onSubmit={handleRunAnalysis} className="space-y-8">
            
            {/* Step 1: Upload or Paste */}
            <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-4">
              <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
                <div className="w-8 h-8 rounded-lg bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400 font-bold text-xs">
                  1
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Upload or Paste Resume</h3>
                  <p className="text-xs text-slate-400">PDF, DOCX, or plain text format</p>
                </div>
              </div>

              <FileDropzone onParsedText={handleParsedText} userId={user?.id} />

              {resumeText && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between text-xs text-emerald-400">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="font-semibold">Ready for AI Scan ({resumeText.length} characters loaded)</span>
                  </div>
                  {resumeFileName && <span className="font-mono text-slate-400">{resumeFileName}</span>}
                </div>
              )}
            </div>

            {/* Step 2: Target Job Details (Optional) */}
            <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-4">
              <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-xs">
                  2
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Target Job Context (Optional)</h3>
                  <p className="text-xs text-slate-400">Improves ATS match accuracy against a specific job posting</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Job Title</label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={targetJobTitle}
                      onChange={(e) => setTargetJobTitle(e.target.value)}
                      placeholder="e.g. Senior Frontend Engineer"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Stripe, OpenAI, Vercel"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Job Description Text</label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <textarea
                    rows={4}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste target job responsibilities and key requirements here for exact skill gap analysis..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-3">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!resumeText || resumeText.trim().length < 50}
                className="w-full py-4 bg-gradient-to-r from-brand-600 via-blue-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-extrabold rounded-2xl shadow-xl shadow-brand-500/25 flex items-center justify-center space-x-3 text-base transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                <Sparkles className="w-5 h-5" />
                <span>Run AI Resume Analysis</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
