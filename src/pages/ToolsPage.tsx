import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  BookOpen, 
  Mail, 
  Briefcase, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Gauge 
} from 'lucide-react';

export const ToolsPage: React.FC = () => {
  const tools = [
    {
      title: 'Build My Resume',
      subtitle: 'Upload PDF or enter natural language prompt → AI parses/generates resume → Open interactive editor.',
      link: '/tools/resume/input',
      icon: FileText,
      gradient: 'from-brand-600 to-blue-600',
      badge: 'Most Popular',
    },
    {
      title: 'CV Maker',
      subtitle: 'Academic & Executive CV builder with comprehensive publication, research & experience sections.',
      link: '/tools/cv/input',
      icon: BookOpen,
      gradient: 'from-cyan-600 to-teal-600',
      badge: 'Academic & Exec',
    },
    {
      title: 'Cover Letter Architect',
      subtitle: 'Generate 4 tailored cover letter formats (Professional, Short, Email, ATS) in seconds.',
      link: '/tools/cover-letter/input',
      icon: Mail,
      gradient: 'from-purple-600 to-indigo-600',
      badge: '4 Variants',
    },
    {
      title: 'Job Application Kit',
      subtitle: 'Import CV + Paste Job Posting → AI Job Analysis & Match Score → Tailored CV + Custom Cover Letter Package.',
      link: '/application-kit',
      icon: Briefcase,
      gradient: 'from-amber-500 to-orange-600',
      badge: 'Job Matcher',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Career Toolkit Suite</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            AI Resume & <span className="gradient-text">Application Tools</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Select a specialized AI engine to create, audit, match, and tailor your career documents for top ATS scores.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tools.map((t, idx) => {
            const Icon = t.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl glass-panel glass-panel-hover border border-slate-800 flex flex-col justify-between space-y-6 relative overflow-hidden group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${t.gradient} flex items-center justify-center text-white shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 bg-slate-900 text-slate-300 border border-slate-800 rounded-full text-xs font-semibold">
                      {t.badge}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-white group-hover:text-brand-300 transition-colors">
                    {t.title}
                  </h2>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    {t.subtitle}
                  </p>
                </div>

                <Link
                  to={t.link}
                  className={`w-full py-3.5 px-4 bg-gradient-to-r ${t.gradient} text-white font-bold rounded-xl shadow-lg flex items-center justify-center space-x-2 text-xs sm:text-sm transition-transform hover:scale-[1.02]`}
                >
                  <span>Launch Tool</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
