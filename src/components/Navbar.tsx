import React, { useState } from 'react';
import { ToolsButton } from './ToolsButton';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  LayoutDashboard, 
  FileText, 
  History as HistoryIcon, 
  User, 
  LogOut, 
  PlusCircle, 
  ChevronDown,
  Mail,
  ShieldAlert
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, isDemo } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-brand-400 transition-colors">
                Resume<span className="gradient-text">AI</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-semibold bg-brand-500/10 text-brand-400 rounded-full border border-brand-500/20">
                PRO
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          {user ? (
            <div className="hidden md:flex items-center space-x-1">
              <ToolsButton />

              <Link
                to="/dashboard"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/dashboard')
                    ? 'bg-slate-800/80 text-brand-400 border border-slate-700/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/resume/new"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/resume/new')
                    ? 'bg-slate-800/80 text-brand-400 border border-slate-700/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>New Analysis</span>
              </Link>

              <Link
                to="/cover-letter/new"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/cover-letter/new')
                    ? 'bg-slate-800/80 text-brand-400 border border-slate-700/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Cover Letter</span>
              </Link>

              <Link
                to="/history"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/history')
                    ? 'bg-slate-800/80 text-brand-400 border border-slate-700/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <HistoryIcon className="w-4 h-4" />
                <span>History</span>
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Pricing
              </a>
            </div>
          )}

          {/* Right Action / Profile Menu */}
          <div className="flex items-center space-x-4">
            {isDemo && user && (
              <span className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20">
                <ShieldAlert className="w-3.5 h-3.5" />
                Demo Mode
              </span>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-slate-800/80 border border-transparent hover:border-slate-700/50 transition-all focus:outline-none"
                >
                  <img
                    src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.email)}&background=0070f3&color=fff`}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-lg object-cover ring-2 ring-brand-500/30"
                  />
                  <span className="hidden sm:inline-block text-sm font-semibold text-slate-200">
                    {user.fullName || user.email.split('@')[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 text-sm"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-800">
                      <p className="font-semibold text-white">{user.fullName || 'User'}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800/60"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Profile & Settings</span>
                    </Link>

                    <Link
                      to="/history"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800/60"
                    >
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span>Saved Analyses</span>
                    </Link>

                    <div className="border-t border-slate-800 mt-1 pt-1">
                      <button
                        onClick={async () => {
                          setDropdownOpen(false);
                          await logout();
                          navigate('/login');
                        }}
                        className="w-full flex items-center space-x-2.5 px-4 py-2 text-rose-400 hover:bg-rose-500/10 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-500 hover:to-blue-500 rounded-xl shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};
