import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wrench, 
  FileText, 
  BookOpen, 
  Mail, 
  Briefcase, 
  ChevronDown, 
  Sparkles 
} from 'lucide-react';

export const ToolsButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tools = [
    {
      name: 'Build My Resume',
      desc: 'PDF upload or AI prompt → Interactive editor',
      path: '/tools/resume/input',
      icon: FileText,
      badge: 'Popular',
      color: 'text-brand-400 bg-brand-500/10',
    },
    {
      name: 'CV Maker',
      desc: 'Academic & executive curriculum vitae engine',
      path: '/tools/cv/input',
      icon: BookOpen,
      badge: 'Academic',
      color: 'text-cyan-400 bg-cyan-500/10',
    },
    {
      name: 'Cover Letter Architect',
      desc: '4 tailored versions (Professional, Short, Email, ATS)',
      path: '/tools/cover-letter/input',
      icon: Mail,
      badge: 'AI Powered',
      color: 'text-purple-400 bg-purple-500/10',
    },
    {
      name: 'Job Application Kit',
      desc: 'Match CV to Job Posting → Tailored Resume + Cover Letter',
      path: '/application-kit',
      icon: Briefcase,
      badge: 'Match Engine',
      color: 'text-amber-400 bg-amber-500/10',
    },
  ];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 shadow-md transition-all group"
      >
        <Wrench className="w-4 h-4 text-brand-400 group-hover:rotate-12 transition-transform" />
        <span>Tools</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-80 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>ResumeAI Toolkit</span>
            </span>
            <Link
              to="/tools"
              onClick={() => setOpen(false)}
              className="text-[11px] font-semibold text-brand-400 hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="space-y-1 mt-1">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.path}
                  to={tool.path}
                  onClick={() => setOpen(false)}
                  className="flex items-start space-x-3 p-2.5 rounded-xl hover:bg-slate-800/70 transition-colors group"
                >
                  <div className={`p-2 rounded-lg ${tool.color} shrink-0 mt-0.5`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-brand-300 transition-colors">
                        {tool.name}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-medium">
                        {tool.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{tool.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
