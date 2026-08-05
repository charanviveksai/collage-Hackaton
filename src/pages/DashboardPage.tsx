import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchUserHistoryApi } from '../lib/api';
import { ResumeAnalysis, CoverLetterRecord } from '../types';
import { 
  BarChart3, 
  FileText, 
  Mail, 
  Sparkles, 
  PlusCircle, 
  ArrowUpRight, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  Target 
} from 'lucide-react';
import { ATSScoreGauge } from '../components/ATSScoreGauge';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<ResumeAnalysis[]>([]);
  const [coverLetters, setCoverLetters] = useState<CoverLetterRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchUserHistoryApi(user?.id);
        setAnalyses(data.analyses);
        setCoverLetters(data.coverLetters);
      } catch (err) {
        console.error('Failed to load user history:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const totalScans = analyses.length;
  const avgScore = totalScans > 0
    ? Math.round(analyses.reduce((acc, a) => acc + a.atsScore, 0) / totalScans)
    : 0;
  const totalCoverLetters = coverLetters.length;

  const recentAnalysis = analyses.length > 0 ? analyses[0] : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, <span className="gradient-text">{user?.fullName || 'Professional'}</span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Here is your AI resume optimization overview and career document activity.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/resume/new"
              className="px-4 py-2.5 bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-500 hover:to-blue-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-brand-500/20 flex items-center space-x-2 transition-transform hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Scan New Resume</span>
            </Link>

            <Link
              to="/cover-letter/new"
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold rounded-xl text-xs flex items-center space-x-2 transition-colors"
            >
              <Mail className="w-4 h-4 text-brand-400" />
              <span>Generate Cover Letter</span>
            </Link>
          </div>
        </div>

        {/* METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Scans</span>
              <FileText className="w-5 h-5 text-brand-400" />
            </div>
            <p className="text-3xl font-black text-white">{totalScans}</p>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" /> Analyzed & Saved
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Average ATS Score</span>
              <BarChart3 className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-black text-emerald-400">{avgScore > 0 ? `${avgScore}/100` : 'N/A'}</p>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Target role match average
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Cover Letters</span>
              <Mail className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-3xl font-black text-purple-400">{totalCoverLetters}</p>
            <p className="text-[11px] text-slate-400">Custom tailored drafts</p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">AI Engine</span>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-3xl font-black text-amber-400">Gemini 2.5</p>
            <p className="text-[11px] text-slate-400">Latest structural models</p>
          </div>

        </div>

        {/* DASHBOARD MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Recent Analysis */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-400" />
                <span>Recent Resume Analyses</span>
              </h2>
              <Link to="/history" className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1">
                <span>View All History</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-400 glass-panel rounded-2xl">
                <div className="w-6 h-6 border-2 border-brand-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                Loading your analysis history...
              </div>
            ) : analyses.length === 0 ? (
              <div className="p-12 text-center glass-panel rounded-2xl border border-slate-800 space-y-4">
                <FileText className="w-12 h-12 text-slate-600 mx-auto" />
                <div>
                  <h3 className="text-base font-semibold text-white">No resume analyses yet</h3>
                  <p className="text-xs text-slate-400 mt-1">Upload your first resume to get your ATS Score & detailed recommendations.</p>
                </div>
                <Link
                  to="/resume/new"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl text-xs transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Scan Resume Now</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {analyses.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl glass-panel glass-panel-hover flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-base">
                          {item.targetJobTitle || 'General Software Resume'}
                        </span>
                        {item.companyName && (
                          <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md border border-slate-700">
                            {item.companyName}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1">{item.summary}</p>
                      <p className="text-[11px] text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4 shrink-0">
                      <div className="text-right">
                        <span className="text-2xl font-black text-emerald-400">{item.atsScore}</span>
                        <span className="block text-[10px] text-slate-500 uppercase tracking-widest">ATS Score</span>
                      </div>

                      <Link
                        to={`/analysis/${item.id}`}
                        className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition-colors flex items-center space-x-1"
                      >
                        <span>View Details</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Score Widget & Cover Letters */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl glass-panel border border-slate-800 text-center space-y-4">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Latest Score Overview</h3>
              {recentAnalysis ? (
                <ATSScoreGauge score={recentAnalysis.atsScore} size={170} />
              ) : (
                <div className="py-8 text-xs text-slate-500">Scan a resume to reveal your ATS gauge</div>
              )}
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-400" />
                  <span>Recent Cover Letters</span>
                </h3>
              </div>

              {coverLetters.length === 0 ? (
                <p className="text-xs text-slate-400 py-2">No cover letters generated yet.</p>
              ) : (
                <div className="space-y-3">
                  {coverLetters.slice(0, 3).map((cl) => (
                    <div key={cl.id} className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-xs space-y-1">
                      <p className="font-semibold text-slate-200">{cl.jobTitle} at {cl.companyName}</p>
                      <p className="text-slate-400 line-clamp-2 text-[11px] font-mono">{cl.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
