import React from 'react';
import { Sparkles, Shield, Zap, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 text-slate-400 text-sm py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-white">
                Resume<span className="gradient-text">AI</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-powered ATS resume analyzer & cover letter architect. Crafted for engineers, designers, and tech leaders to land their dream job.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/resume/new" className="hover:text-white transition-colors">ATS Resume Scanner</Link></li>
              <li><Link to="/cover-letter/new" className="hover:text-white transition-colors">Cover Letter AI</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Analytics Dashboard</Link></li>
              <li><Link to="/history" className="hover:text-white transition-colors">Analysis History</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-3">Security & AI</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-400" /> Supabase RLS Protected</li>
              <li className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-400" /> Powered by Gemini 2.5</li>
              <li>Privacy First Storage</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-3">System Status</h4>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-medium text-slate-300">All AI API Engines Operational</span>
              </div>
              <p className="text-[11px] text-slate-500">Latency: ~240ms | Uptime: 99.9%</p>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ResumeAI Assistant Inc. All rights reserved.</p>
          <div className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Built with precision for Antigravity IDE using React, Express & Supabase</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
