import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Shield, 
  BarChart3, 
  FileCheck, 
  Mail, 
  Bot, 
  Target, 
  Award 
} from 'lucide-react';
import { ATSScoreGauge } from '../components/ATSScoreGauge';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      
      {/* Background Gradient Blurs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-brand-600/20 via-indigo-600/20 to-purple-600/10 blur-[140px] pointer-events-none -z-10" />

      {/* HERO SECTION */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Next-Generation AI Resume & ATS Intelligence</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]"
          >
            Land Your Next Role with <span className="gradient-text">Instant AI Resume</span> Optimization
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-400 font-normal max-w-2xl mx-auto leading-relaxed"
          >
            Upload your resume or paste text to get an instant 0–100 ATS Score, deep strength & weakness audit, missing skill gap analysis, and tailored cover letters in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/resume/new"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-600 via-blue-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-brand-500/25 flex items-center justify-center space-x-3 text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-5 h-5 text-brand-200" />
              <span>Scan Resume Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/cover-letter/new"
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 font-semibold rounded-2xl flex items-center justify-center space-x-2 text-base transition-all"
            >
              <Mail className="w-5 h-5 text-brand-400" />
              <span>Generate Cover Letter</span>
            </Link>
          </motion.div>

          {/* Social Proof */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Free Demo Mode</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> PDF / DOCX / TXT Parser</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Powered by Gemini 2.5 AI</span>
          </div>

        </div>

        {/* HERO PREVIEW CARD */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 max-w-5xl mx-auto rounded-3xl glass-panel p-6 sm:p-8 shadow-2xl border border-slate-800 relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            
            <div className="w-full md:w-1/3 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-800/80 pb-6 md:pb-0 md:pr-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Live Demo Score</span>
              <ATSScoreGauge score={88} size={180} />
            </div>

            <div className="w-full md:w-2/3 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Senior Software Engineer Analysis</h3>
                  <p className="text-xs text-slate-400">Targeting Google / Stripe Technical Lead Roles</p>
                </div>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold rounded-full">
                  High ATS Compatibility
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="font-semibold text-emerald-400 flex items-center gap-1 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
                  </span>
                  <p className="text-slate-300">Strong metric impact (e.g. 40% latency reduction). Excellent modern tech stack listing.</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="font-semibold text-rose-400 flex items-center gap-1 mb-1">
                    <Target className="w-3.5 h-3.5" /> Missing Skill Gaps
                  </span>
                  <p className="text-slate-300">Kubernetes Orchestration, Distributed Caching, GraphQL Schema Design.</p>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </section>


      {/* FEATURES GRID */}
      <section id="features" className="py-20 border-t border-slate-900 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Built for Modern Job Seekers & Leaders
            </h2>
            <p className="text-slate-400 text-sm">
              Everything you need to beat applicant tracking systems and stand out in recruiter inbox lists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-8 rounded-3xl glass-panel glass-panel-hover space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">0–100 ATS Scoring</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Receive an objective 0 to 100 ATS optimization rating calculated based on parser readability, structure, and keyword density.
              </p>
            </div>

            <div className="p-8 rounded-3xl glass-panel glass-panel-hover space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Structured AI Feedback</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Get categorized strengths, weaknesses, and actionable step-by-step recommendations generated by Gemini AI models.
              </p>
            </div>

            <div className="p-8 rounded-3xl glass-panel glass-panel-hover space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Cover Letter Architect</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Generate highly tailored cover letters aligned with specific company roles, target job descriptions, and custom writing tones.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-brand-900 via-slate-900 to-indigo-950 p-10 md:p-14 border border-brand-500/30 text-center space-y-6 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 space-y-4">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
                Ready to Upgrade Your Resume?
              </h2>
              <p className="text-slate-300 text-base max-w-xl mx-auto">
                No credit card required. Start analyzing your resume and generating cover letters immediately.
              </p>
              <div className="pt-2">
                <Link
                  to="/resume/new"
                  className="inline-flex items-center space-x-2 px-8 py-4 bg-white hover:bg-slate-100 text-slate-950 font-extrabold rounded-2xl shadow-xl transition-transform hover:scale-105"
                >
                  <Sparkles className="w-5 h-5 text-brand-600" />
                  <span>Start Free Analysis</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
