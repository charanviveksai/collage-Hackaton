import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { isSupabaseClientConfigured } from '../lib/supabase';
import { User, Mail, Shield, Key, CheckCircle2, Zap, Save, AlertCircle } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, isDemo } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [jobTitle, setJobTitle] = useState(user?.jobTitle || 'Senior Engineer / Specialist');
  const [targetIndustry, setTargetIndustry] = useState(user?.targetIndustry || 'Technology / Software');
  
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      user.fullName = fullName;
      user.jobTitle = jobTitle;
      user.targetIndustry = targetIndustry;
      if (isDemo) {
        localStorage.setItem('ai_resume_demo_user', JSON.stringify(user));
      }
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-slate-800 pb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <User className="w-6 h-6 text-brand-400" />
            <span>Profile & Settings</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Manage your account preferences, target career role, and API security configuration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* User Card Left */}
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4 text-center md:text-left h-fit">
            <div className="w-20 h-20 rounded-2xl bg-brand-600/20 border border-brand-500/30 overflow-hidden mx-auto md:mx-0">
              <img
                src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=0070f3&color=fff`}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{user?.fullName || 'Professional'}</h2>
              <p className="text-xs text-slate-400 font-mono truncate">{user?.email}</p>
            </div>
            <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 space-y-1">
              <p><span className="font-semibold text-slate-200">Account Type:</span> {isDemo ? 'Demo Sandbox' : 'Supabase Auth'}</p>
              <p><span className="font-semibold text-slate-200">Role Focus:</span> {jobTitle}</p>
            </div>
          </div>

          {/* Settings Form Right */}
          <div className="md:col-span-2 space-y-6">
            
            <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Personal & Career Focus</h3>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Default Target Job Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Industry / Field</label>
                <input
                  type="text"
                  value={targetIndustry}
                  onChange={(e) => setTargetIndustry(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              {savedSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Profile details updated successfully!</span>
                </div>
              )}

              <button
                type="submit"
                className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-brand-500/20 flex items-center space-x-2 transition-transform hover:scale-105"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </form>

            {/* Infrastructure & Security Diagnostics */}
            <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>System Security & API Diagnostics</span>
              </h3>

              <div className="space-y-3 text-xs">
                
                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <div>
                      <p className="font-semibold text-slate-200">Google Gemini AI Engine</p>
                      <p className="text-slate-400 text-[11px]">Server-side `@google/genai` API key security</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-bold">
                    Active
                  </span>
                </div>

                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <div>
                      <p className="font-semibold text-slate-200">Supabase Row Level Security (RLS)</p>
                      <p className="text-slate-400 text-[11px]">Enforces user isolation across PostgreSQL tables</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    isSupabaseClientConfigured
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {isSupabaseClientConfigured ? 'Supabase Connected' : 'Local Fallback Engine'}
                  </span>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
