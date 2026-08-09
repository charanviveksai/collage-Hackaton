import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ResumeEditor } from '../components/ResumeEditor';
import { ResumePreview } from '../components/ResumePreview';
import { Save, Download, ArrowLeft, CheckCircle2, BookOpen } from 'lucide-react';

export const CVEditorPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const state = location.state as { cvData?: any; cvId?: string } | null;

  const [cvData, setCvData] = useState<any>(
    state?.cvData || {
      title: 'Academic & Executive Curriculum Vitae',
      summary: 'Distinguished researcher and engineering leader.',
      personalInfo: { fullName: user?.fullName || 'Dr. Alex Vance', email: user?.email || 'alex@example.com' },
      experience: [],
      education: [],
      skills: [],
    }
  );

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    const textContent = JSON.stringify(cvData, null, 2);
    const blob = new Blob([textContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CV-${(cvData.personalInfo?.fullName || 'User').replace(/\s+/g, '_')}.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <Link to="/tools" className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Tools</span>
          </Link>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-slate-900 border border-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              {saveSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4 text-cyan-400" />}
              <span>{saveSuccess ? 'Saved!' : 'Save CV'}</span>
            </button>

            <button
              onClick={handleExport}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Export CV JSON</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Interactive CV Editor</span>
            </h2>
            <ResumeEditor data={cvData} onChange={setCvData} />
          </div>

          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-base font-bold text-white">Live CV Document Preview</h2>
            <ResumePreview data={cvData} />
          </div>
        </div>

      </div>
    </div>
  );
};
