import React from 'react';

interface ResumePreviewProps {
  data: any;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data }) => {
  if (!data) {
    return <div className="p-8 text-center text-slate-500 text-xs">No resume content generated yet.</div>;
  }

  const pInfo = data.personalInfo || {};

  return (
    <div className="p-8 bg-white text-slate-900 font-sans shadow-2xl rounded-2xl border border-slate-200 space-y-6 text-xs sm:text-sm">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 text-center space-y-1">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
          {pInfo.fullName || 'YOUR NAME'}
        </h1>
        <p className="text-xs font-bold text-blue-600 tracking-wider uppercase">
          {data.title || 'SOFTWARE PROFESSIONAL'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-600 pt-1">
          {pInfo.email && <span>{pInfo.email}</span>}
          {pInfo.phone && <span>• {pInfo.phone}</span>}
          {pInfo.location && <span>• {pInfo.location}</span>}
          {pInfo.linkedIn && <span>• {pInfo.linkedIn}</span>}
          {pInfo.gitHub && <span>• {pInfo.gitHub}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
            Executive Summary
          </h2>
          <p className="text-slate-700 leading-relaxed text-xs">{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience?.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
            Professional Experience
          </h2>
          <div className="space-y-3">
            {data.experience.map((exp: any, i: number) => (
              <div key={i} className="space-y-1">
                <div className="flex items-baseline justify-between font-bold text-xs text-slate-900">
                  <span>{exp.jobTitle} - <span className="text-slate-700">{exp.company}</span></span>
                  <span className="text-[11px] text-slate-500 font-normal">{exp.startDate} – {exp.endDate || 'Present'}</span>
                </div>
                {exp.responsibilities?.length > 0 && (
                  <ul className="list-disc list-inside space-y-0.5 text-xs text-slate-700 pl-1">
                    {exp.responsibilities.map((r: string, j: number) => (
                      <li key={j}>{r}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education?.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
            Education
          </h2>
          <div className="space-y-2">
            {data.education.map((edu: any, i: number) => (
              <div key={i} className="flex items-baseline justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900">{edu.degree}</span>
                  {edu.institution && <span className="text-slate-600">, {edu.institution}</span>}
                </div>
                <span className="text-[11px] text-slate-500">{edu.startYear} – {edu.endYear}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills?.length > 0 && (
        <div className="space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
            Skills & Competencies
          </h2>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {data.skills.map((s: any, i: number) => (
              <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-semibold text-[11px]">
                {typeof s === 'string' ? s : s.name}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
