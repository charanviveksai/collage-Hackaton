import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileDropzone } from '../components/FileDropzone';
import { FileText, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';

export const ResumeInputPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [promptText, setPromptText] = useState('');
  const [parsedText, setParsedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleParsedText = (text: string) => {
    setParsedText(text);
    setErrorMsg(null);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const sourceContent = parsedText || promptText;

    if (!sourceContent || sourceContent.trim().length < 15) {
      setErrorMsg('Please upload a PDF resume OR enter a natural language prompt (min 15 chars).');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/resumes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptText: promptText.trim() || undefined,
          textInput: parsedText.trim() || undefined,
          userId: user?.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate resume.');

      // Redirect to interactive editor
      navigate('/tools/resume/editor', { state: { resumeData: data.resume, resumeId: data.resumeId } });
    } catch (err: any) {
      console.error('Resume generation error:', err);
      setErrorMsg(err.message || 'An error occurred while building your resume.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold">
            <FileText className="w-3.5 h-3.5" />
            <span>Build My Resume Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Import CV or Generate with AI</h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Upload an existing PDF or describe your experience in natural language to open the interactive editor.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleGenerate} className="space-y-8">
          
          {/* Card 1: Upload PDF */}
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <FileText className="w-4 h-4 text-brand-400" />
              <span>Option A: Drag your file here or choose File (PDF Only)</span>
            </h3>
            <FileDropzone onParsedText={handleParsedText} userId={user?.id} />
          </div>

          {/* Card 2: Prompt Text Input */}
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Or Create Your Resume with AI Prompt</span>
            </h3>

            <textarea
              rows={5}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="e.g. I am a Senior Full Stack Engineer with 6 years of experience in React, TypeScript, Node.js, and Supabase. I led microservices migration at TechCorp reducing API latency by 45%..."
              className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-brand-600 via-blue-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-brand-500/25 flex items-center justify-center space-x-2 text-sm transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate & Open Resume Editor</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};
