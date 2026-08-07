import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchAnalysisDetailApi } from '../lib/api';
import { ResumeAnalysis } from '../types';
import { ATSScoreGauge } from '../components/ATSScoreGauge';
import { ATSCategoryBreakdown } from '../components/ATSCategoryBreakdown';
import { AIImprovementRoadmap } from '../components/AIImprovementRoadmap';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Target, 
  Lightbulb, 
  ArrowLeft, 
  Mail, 
  Share2, 
  Download, 
  Building2, 
  Briefcase, 
  Gauge, 
  Sparkles 
} from 'lucide-react';

export const AnalysisDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadAnalysis() {
      if (!id) return;
      try {
        const data = await fetchAnalysisDetailApi(id);
        setAnalysis(data);
      } catch (err: any) {
        console.error('Failed to load analysis detail:', err);
        setError(err.message || 'Unable to retrieve requested analysis.');
      } finally {
        setLoading(false);
      }
    }
    loadAnalysis();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    if (!analysis) return;
    const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-analysis-${analysis.id}.json`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-brand-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-400 font-mono">Loading full 30+ metric analysis report...</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-4 glass-panel p-8 rounded-3xl border border-slate-800">
          <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Analysis Not Found</h2>
          <p className="text-xs text-slate-400">{error || 'The requested analysis record does not exist.'}</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation / Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleShare}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON Report</span>
            </button>

            <Link
              to="/cover-letter/new"
              state={{
                jobTitle: analysis.targetJobTitle,
                companyName: analysis.companyName,
              }}
              className="px-4 py-2 bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-500 hover:to-blue-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-brand-500/20 flex items-center space-x-2 transition-transform hover:scale-105"
            >
              <Mail className="w-4 h-4" />
              <span>Generate Cover Letters</span>
            </Link>
          </div>
        </div>

        {/* HERO ANALYSIS HEADER */}
        <div className="p-8 rounded-3xl glass-panel border border-slate-800 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          {/* Left Column: ATS Gauge */}
          <div className="flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-800 pb-6 lg:pb-0 lg:pr-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Overall ATS Score</span>
            <ATSScoreGauge score={analysis.atsScore} size={200} />
          </div>

          {/* Middle & Right Column: Details & Summary */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              {analysis.targetJobTitle && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-500/10 text-brand-300 border border-brand-500/20 rounded-full text-xs font-semibold">
                  <Briefcase className="w-3.5 h-3.5" /> {analysis.targetJobTitle}
                </span>
              )}
              {analysis.companyName && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-full text-xs font-semibold">
                  <Building2 className="w-3.5 h-3.5" /> {analysis.companyName}
                </span>
              )}
              {analysis.experienceLevel && (
                <span className="px-3 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded-full text-xs font-semibold">
                  {analysis.experienceLevel}
                </span>
              )}
            </div>

            <h1 className="text-2xl font-extrabold text-white">
              {analysis.professionalHeadline || 'Executive Resume Summary'}
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
              {analysis.summary}
            </p>
          </div>

        </div>

        {/* 30+ CATEGORY AUDIT GAUGES */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800">
          <ATSCategoryBreakdown analysis={analysis} />
        </div>

        {/* STRENGTHS & WEAKNESSES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Key Strengths */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Key Strengths ({analysis.strengths.length})</h3>
            </div>
            <ul className="space-y-3">
              {analysis.strengths.map((str, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">✓</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement / Weaknesses */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <h3 className="text-lg font-bold text-white">Areas for Improvement ({analysis.weaknesses.length})</h3>
            </div>
            <ul className="space-y-3">
              {analysis.weaknesses.map((weak, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">!</span>
                  <span>{weak}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* AI ACTIONABLE ROADMAP */}
        {analysis.aiSuggestions && (
          <AIImprovementRoadmap suggestions={analysis.aiSuggestions} />
        )}

      </div>
    </div>
  );
};
