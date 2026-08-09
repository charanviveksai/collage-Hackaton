import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { ResumePreview } from '../components/ResumePreview';
import { ATSScoreGauge } from '../components/ATSScoreGauge';
import { CoverLetterTabs } from '../components/CoverLetterTabs';
import { 
  ArrowLeft, 
  Briefcase, 
  Building2, 
  CheckCircle2, 
  Target, 
  Download, 
  Sparkles 
} from 'lucide-react';

export const ApplicationKitDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const state = location.state as { kitData?: any } | null;

  const [kit, setKit] = useState<any>(state?.kitData || null);
  const [loading, setLoading] = useState<boolean>(!state?.kitData);

  useEffect(() => {
    async function loadKit() {
      if (!id || kit) return;
      try {
        const res = await fetch(`/api/application-kit/${id}`);
        const data = await res.json();
        if (data.applicationKit) {
          setKit({
            jobTitle: data.applicationKit.job_title,
            companyName: data.applicationKit.company_name,
            matchScore: data.applicationKit.match_score,
            atsScore: data.applicationKit.ats_score,
            tailoredResume: data.applicationKit.tailored_resume,
            coverLetter: data.applicationKit.cover_letter,
            matchedKeywords: data.applicationKit.matched_keywords,
            missingKeywords: data.applicationKit.missing_keywords,
            recommendations: data.applicationKit.recommendations,
          });
        }
      } catch (err) {
        console.error('Failed to load application kit:', err);
      } finally {
        setLoading(false);
      }
    }
    loadKit();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-mono">Loading Job Application Kit Package...</p>
        </div>
      </div>
    );
  }

  if (!kit) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-center">
        <div className="space-y-4 max-w-md glass-panel p-8 rounded-3xl border border-slate-800">
          <h2 className="text-xl font-bold text-white">Application Kit Not Found</h2>
          <Link to="/application-kit" className="inline-block px-4 py-2 bg-brand-600 text-white font-bold rounded-xl text-xs">
            Create Application Kit
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <Link to="/tools" className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Tools</span>
          </Link>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-full text-xs font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Job Application Kit</span>
            </span>
          </div>
        </div>

        {/* HERO SCORES CARD */}
        <div className="p-8 rounded-3xl glass-panel border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          <div className="text-center md:border-r border-slate-800 pb-6 md:pb-0 md:pr-6 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Job Match Score</span>
            <div className="text-5xl font-black text-amber-400">{kit.matchScore || 88}%</div>
            <p className="text-[11px] text-slate-500">Qualifications Alignment</p>
          </div>

          <div className="text-center md:border-r border-slate-800 pb-6 md:pb-0 md:pr-6 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">ATS Scanner Score</span>
            <div className="text-5xl font-black text-emerald-400">{kit.atsScore || 92}%</div>
            <p className="text-[11px] text-slate-500">Keyword Density Audit</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Briefcase className="w-5 h-5 text-amber-400" />
              <span>{kit.jobTitle}</span>
            </div>
            <div className="text-xs text-brand-400 font-semibold flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>{kit.companyName}</span>
            </div>
          </div>

        </div>

        {/* KEYWORDS & RECOMMENDATIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Matched Keywords ({kit.matchedKeywords?.length || 0})</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {kit.matchedKeywords?.map((kw: string, i: number) => (
                <span key={i} className="px-2.5 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-lg text-xs font-semibold">
                  {kw}
                </span>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span>Missing Keywords ({kit.missingKeywords?.length || 0})</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {kit.missingKeywords?.map((kw: string, i: number) => (
                <span key={i} className="px-2.5 py-1 bg-rose-500/10 text-rose-300 border border-rose-500/20 rounded-lg text-xs font-semibold">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* TAILORED RESUME PREVIEW */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-amber-400" />
            <span>Tailored Resume Document</span>
          </h3>
          <ResumePreview data={kit.tailoredResume} />
        </div>

        {/* COVER LETTER BUNDLE */}
        {kit.coverLetter && (
          <div className="space-y-4">
            <CoverLetterTabs coverLetter={{
              id: 'kit_cl',
              jobTitle: kit.jobTitle,
              companyName: kit.companyName,
              professionalVersion: kit.coverLetter.professionalVersion || kit.coverLetter.professional || '',
              shortVersion: kit.coverLetter.shortVersion || kit.coverLetter.short || '',
              emailVersion: kit.coverLetter.emailVersion || '',
              atsVersion: kit.coverLetter.atsVersion || kit.coverLetter.atsOptimized || '',
              tone: 'executive',
              createdAt: new Date().toISOString(),
            }} />
          </div>
        )}

      </div>
    </div>
  );
};
