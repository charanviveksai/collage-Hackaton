import React from 'react';
import { ResumeAnalysis } from '../types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Sparkles, 
  Gauge, 
  Target, 
  Award, 
  Briefcase 
} from 'lucide-react';

interface ATSCategoryBreakdownProps {
  analysis: ResumeAnalysis;
}

export const ATSCategoryBreakdown: React.FC<ATSCategoryBreakdownProps> = ({ analysis }) => {
  const categories = [
    { label: 'Grammar & Clarity', score: analysis.grammarScore, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Formatting & Layout', score: analysis.formattingScore, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Readability Score', score: analysis.readabilityScore, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { label: 'Action Verb Impact', score: analysis.actionVerbScore, color: 'text-brand-400', bg: 'bg-brand-500/10 border-brand-500/20' },
    { label: 'Quantifiable Metrics', score: analysis.quantifiableImpactScore, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Keyword Density Match', score: analysis.keywordMatchPercentage, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
    { label: 'Interview Readiness', score: analysis.interviewReadinessScore, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Hiring Probability', score: analysis.hiringProbability, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Gauge className="w-5 h-5 text-brand-400" />
          <span>Detailed ATS & Quality Category Audit</span>
        </h3>
        <span className="text-xs text-slate-400 font-mono">30+ Metrics Evaluated</span>
      </div>

      {/* Category Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.map((cat, idx) => (
          <div key={idx} className={`p-4 rounded-2xl border ${cat.bg} space-y-1`}>
            <span className="text-[11px] font-semibold text-slate-400 block truncate">{cat.label}</span>
            <div className="flex items-baseline justify-between">
              <span className={`text-2xl font-black ${cat.color}`}>{cat.score}%</span>
              <div className="w-12 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-current h-full"
                  style={{ width: `${cat.score}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Missing Keywords & Skill Gap Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
          <h4 className="text-sm font-bold text-rose-400 flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span>Missing ATS Keywords ({analysis.missingKeywords.length})</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {analysis.missingKeywords.map((kw, i) => (
              <span key={i} className="px-2.5 py-1 bg-rose-500/10 text-rose-300 border border-rose-500/20 rounded-lg text-xs font-semibold">
                {kw}
              </span>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
          <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            <span>Skill Gap Analysis</span>
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            {analysis.skillGapAnalysis || 'Good domain skill coverage.'}
          </p>
        </div>
      </div>
    </div>
  );
};
