import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchUserHistoryApi } from '../lib/api';
import { ResumeAnalysis, CoverLetterRecord } from '../types';
import { 
  History as HistoryIcon, 
  FileText, 
  Mail, 
  Search, 
  ArrowUpRight, 
  Calendar, 
  Briefcase, 
  Building2 
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'analyses' | 'coverLetters'>('analyses');
  const [analyses, setAnalyses] = useState<ResumeAnalysis[]>([]);
  const [coverLetters, setCoverLetters] = useState<CoverLetterRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await fetchUserHistoryApi(user?.id);
        setAnalyses(data.analyses);
        setCoverLetters(data.coverLetters);
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, [user]);

  const filteredAnalyses = analyses.filter(
    (a) =>
      (a.targetJobTitle && a.targetJobTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (a.companyName && a.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (a.summary && a.summary.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredCoverLetters = coverLetters.filter(
    (c) =>
      c.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <HistoryIcon className="w-6 h-6 text-brand-400" />
              <span>Analysis & Document History</span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Access your previous ATS scans, strength assessments, and saved cover letter drafts.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex space-x-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('analyses')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'analyses'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Resume Analyses ({analyses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('coverLetters')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'coverLetters'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Cover Letters ({coverLetters.length})</span>
          </button>
        </div>

        {/* Content View */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 glass-panel rounded-2xl">
            <div className="w-6 h-6 border-2 border-brand-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Fetching history...
          </div>
        ) : activeTab === 'analyses' ? (
          filteredAnalyses.length === 0 ? (
            <div className="py-16 text-center glass-panel rounded-3xl border border-slate-800 text-slate-500 text-xs">
              No matching resume analyses found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAnalyses.map((item) => (
                <div
                  key={item.id}
                  className="p-6 rounded-3xl glass-panel glass-panel-hover border border-slate-800 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-white text-base">
                          {item.targetJobTitle || 'General Resume Scan'}
                        </h3>
                        {item.companyName && (
                          <span className="inline-flex items-center gap-1 text-xs text-purple-400 font-medium">
                            <Building2 className="w-3 h-3" /> {item.companyName}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-emerald-400">{item.atsScore}</span>
                        <span className="block text-[9px] uppercase tracking-widest text-slate-500">ATS Score</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      {item.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs">
                    <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <Link
                      to={`/analysis/${item.id}`}
                      className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-lg text-xs flex items-center space-x-1 transition-colors"
                    >
                      <span>Open Report</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          filteredCoverLetters.length === 0 ? (
            <div className="py-16 text-center glass-panel rounded-3xl border border-slate-800 text-slate-500 text-xs">
              No matching cover letters found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCoverLetters.map((cl) => (
                <div
                  key={cl.id}
                  className="p-6 rounded-3xl glass-panel glass-panel-hover border border-slate-800 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="font-bold text-white text-base">{cl.jobTitle}</h3>
                      <p className="text-xs text-brand-400 font-semibold">{cl.companyName}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-full text-[10px] uppercase font-bold tracking-wider">
                      {cl.tone}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-mono line-clamp-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    {cl.content}
                  </p>

                  <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                    <span>Generated {new Date(cl.createdAt).toLocaleDateString()}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(cl.content)}
                      className="text-xs text-brand-400 hover:underline font-semibold"
                    >
                      Copy Content
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

      </div>
    </div>
  );
};
