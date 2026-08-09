import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ResumeEditor } from '../components/ResumeEditor';
import { ResumePreview } from '../components/ResumePreview';
import { 
  Save, 
  Download, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  Gauge, 
  Briefcase, 
  Copy 
} from 'lucide-react';

export const ResumeEditorPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { resumeData?: any; resumeId?: string } | null;

  const [resumeData, setResumeData] = useState<any>(
    state?.resumeData || {
      title: 'Senior Software Professional',
      summary: 'Experienced Software Architect specializing in Full-Stack Web Applications, Microservices, and AI integrations.',
      personalInfo: {
        fullName: user?.fullName || 'Alex Vance',
        email: user?.email || 'alex@example.com',
        phone: '+1 555-0199',
        location: 'San Francisco, CA',
      },
      experience: [],
      education: [],
      skills: [],
    }
  );

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save updated resume to server
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: resumeData.title,
          parsedData: resumeData,
          userId: user?.id,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (err) {
      console.error('Save resume error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadTXT = () => {
    const textContent = `
${resumeData.personalInfo?.fullName || ''}
${resumeData.title || ''}
Email: ${resumeData.personalInfo?.email || ''} | Phone: ${resumeData.personalInfo?.phone || ''}

SUMMARY:
${resumeData.summary || ''}

EXPERIENCE:
${(resumeData.experience || []).map((e: any) => `${e.jobTitle} - ${e.company}\n${(e.responsibilities || []).join('\n')}`).join('\n\n')}
`;
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Resume-${(resumeData.personalInfo?.fullName || 'User').replace(/\s+/g, '_')}.txt`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <Link to="/tools" className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Tools</span>
          </Link>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              {saveSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4 text-brand-400" />}
              <span>{saveSuccess ? 'Saved!' : 'Save Resume'}</span>
            </button>

            <button
              onClick={handleDownloadTXT}
              className="px-4 py-2 bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-500 hover:to-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-brand-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Export Resume</span>
            </button>
          </div>
        </div>

        {/* View Switcher Mobile/Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Side: Interactive Editor */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-400" />
                <span>Interactive Resume Editor</span>
              </h2>
            </div>
            <ResumeEditor data={resumeData} onChange={setResumeData} />
          </div>

          {/* Right Side: Live Document Preview */}
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Gauge className="w-4 h-4 text-emerald-400" />
              <span>Real-Time Document Preview</span>
            </h2>
            <ResumePreview data={resumeData} />
          </div>

        </div>

      </div>
    </div>
  );
};
