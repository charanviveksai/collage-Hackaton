import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileDropzone } from '../components/FileDropzone';
import { BookOpen, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';

export const CVInputPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [promptText, setPromptText] = useState('');
  const [parsedText, setParsedText] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleParsedText = (text: string) => {
    setParsedText(text);
    setErrorMsg(null);
  };

  const handleGenerateCV = async (e: React.FormEvent) => {
    e.preventDefault();
    const sourceContent = parsedText || promptText;

    if (!sourceContent || sourceContent.trim().length < 15) {
      setErrorMsg('Please upload a PDF CV or enter your experience prompt (min 15 chars).');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/cvs/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptText: promptText.trim() || undefined,
          textInput: parsedText.trim() || undefined,
          role: role.trim() || undefined,
          userId: user?.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate CV.');

      navigate('/tools/cv/editor', { state: { cvData: data.cv, cvId: data.cvId } });
    } catch (err: any) {
      console.error('CV generation error:', err);
      setErrorMsg(err.message || 'An error occurred while creating your CV.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic & Executive CV Maker</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Curriculum Vitae Engine</h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Upload an existing PDF or describe your academic/executive career to generate a structured CV.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleGenerateCV} className="space-y-8">
          
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Option A: Upload PDF CV</span>
            </h3>
            <FileDropzone onParsedText={handleParsedText} userId={user?.id} />
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Option B: Or Enter Natural Language CV Prompt</span>
            </h3>

            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Target Academic/Executive Role (e.g. Associate Professor of AI / VP of Engineering)"
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
            />

            <textarea
              rows={4}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Detail your degrees, publications, research experience, leadership roles, and honors..."
              className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold rounded-2xl shadow-xl shadow-cyan-500/25 flex items-center justify-center space-x-2 text-sm transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate & Open CV Editor</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};
