import React from 'react';
import { motion } from 'framer-motion';

interface ATSScoreGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showDetails?: boolean;
}

export const ATSScoreGauge: React.FC<ATSScoreGaugeProps> = ({
  score,
  size = 200,
  strokeWidth = 16,
  showDetails = true,
}) => {
  const normalizedScore = Math.max(0, Math.min(100, score));
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  // Determine color scheme based on score
  const getScoreTheme = (s: number) => {
    if (s >= 80) {
      return {
        stroke: 'url(#gradient-emerald)',
        textColor: 'text-emerald-400',
        bgGlow: 'shadow-emerald-500/20',
        badgeBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        label: 'Excellent ATS Fit',
      };
    }
    if (s >= 65) {
      return {
        stroke: 'url(#gradient-amber)',
        textColor: 'text-amber-400',
        bgGlow: 'shadow-amber-500/20',
        badgeBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
        label: 'Good - Optimization Suggested',
      };
    }
    return {
      stroke: 'url(#gradient-rose)',
      textColor: 'text-rose-400',
      bgGlow: 'shadow-rose-500/20',
      badgeBg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
      label: 'Needs Important Revisions',
    };
  };

  const theme = getScoreTheme(normalizedScore);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className={`relative flex items-center justify-center rounded-full ${theme.bgGlow}`}>
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id="gradient-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="gradient-amber" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="gradient-rose" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
          </defs>

          {/* Track Circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Animated Progress Circle */}
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            stroke={theme.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`text-5xl font-black tracking-tight ${theme.textColor}`}
          >
            {normalizedScore}
          </motion.span>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">
            Out of 100
          </span>
        </div>
      </div>

      {showDetails && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-center"
        >
          <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${theme.badgeBg}`}>
            {theme.label}
          </span>
        </motion.div>
      )}
    </div>
  );
};
