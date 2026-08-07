import React, { useState } from 'react';
import { MultiFormatCoverLetter } from '../types';
import { Mail, Copy, Check, Download, FileText, CheckCircle2 } from 'lucide-react';

interface CoverLetterTabsProps {
  coverLetter: MultiFormatCoverLetter;
}

export const CoverLetterTabs: React.FC<CoverLetterTabsProps> = ({ coverLetter }) => {
  const [activeTab, setActiveTab] = useState<'professional' | 'short' | 'email' | 'ats'>('professional');
  const [copied, setCopied] = useState(false);

  const getActiveContent = () => {
    switch (activeTab) {
      case 'short':
        return coverLetter.shortVersion || coverLetter.professionalVersion;
      case 'email':
        return coverLetter.emailVersion || coverLetter.professionalVersion;
      case 'ats':
        return coverLetter.atsVersion || coverLetter.professionalVersion;
      case 'professional':
      default:
        return coverLetter.professionalVersion;
    }
  };

  const currentContent = getActiveContent();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cover-Letter-${coverLetter.companyName.replace(/\s+/g, '_')}-${activeTab}.txt`;
    a.click();
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
      
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-purple-400" />
            <span>Generated Cover Letter Variants</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            4 customized versions optimized for distinct outreach channels.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export TXT</span>
          </button>
        </div>
      </div>

      {/* Format Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { key: 'professional', label: 'Professional Executive' },
          { key: 'short', label: 'Short & Impactful' },
          { key: 'email', label: 'Email Outreach' },
          { key: 'ats', label: 'ATS Scanner Format' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`p-3 rounded-xl text-xs font-semibold border text-center transition-all ${
              activeTab === tab.key
                ? 'bg-purple-600/20 text-purple-300 border-purple-500/40 shadow-md'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Display */}
      <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800/80 font-sans text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
        {currentContent}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800 pt-3">
        <span>Word Count: {currentContent.split(/\s+/).length} words</span>
        <span className="capitalize font-semibold text-brand-400">Tone: {coverLetter.tone}</span>
      </div>

    </div>
  );
};
