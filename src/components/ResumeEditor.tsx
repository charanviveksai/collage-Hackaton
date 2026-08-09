import React from 'react';
import { User, Briefcase, GraduationCap, Code, Plus, Trash2, FileText } from 'lucide-react';

interface ResumeEditorProps {
  data: any;
  onChange: (updatedData: any) => void;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({ data, onChange }) => {
  if (!data) return null;

  const updatePersonalInfo = (field: string, val: string) => {
    onChange({
      ...data,
      personalInfo: {
        ...(data.personalInfo || {}),
        [field]: val,
      },
    });
  };

  const updateExperience = (index: number, field: string, val: any) => {
    const newExp = [...(data.experience || [])];
    newExp[index] = { ...newExp[index], [field]: val };
    onChange({ ...data, experience: newExp });
  };

  const addExperience = () => {
    onChange({
      ...data,
      experience: [
        ...(data.experience || []),
        { company: '', jobTitle: '', startDate: '', endDate: 'Present', responsibilities: [''] },
      ],
    });
  };

  const removeExperience = (index: number) => {
    const newExp = [...(data.experience || [])];
    newExp.splice(index, 1);
    onChange({ ...data, experience: newExp });
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Personal Info */}
      <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
          <User className="w-4 h-4 text-brand-400" />
          <span>Personal & Contact Information</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Full Name</label>
            <input
              type="text"
              value={data.personalInfo?.fullName || ''}
              onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Professional Title</label>
            <input
              type="text"
              value={data.title || ''}
              onChange={(e) => onChange({ ...data, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Email</label>
            <input
              type="email"
              value={data.personalInfo?.email || ''}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Phone</label>
            <input
              type="text"
              value={data.personalInfo?.phone || ''}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
          <FileText className="w-4 h-4 text-purple-400" />
          <span>Professional Summary</span>
        </h3>
        <textarea
          rows={3}
          value={data.summary || ''}
          onChange={(e) => onChange({ ...data, summary: e.target.value })}
          className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
        />
      </div>

      {/* Experience */}
      <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <span>Work Experience</span>
          </h3>
          <button
            onClick={addExperience}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-brand-300 rounded-lg flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Position</span>
          </button>
        </div>

        {data.experience?.map((exp: any, idx: number) => (
          <div key={idx} className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3 relative group">
            <button
              onClick={() => removeExperience(idx)}
              className="absolute top-3 right-3 text-slate-500 hover:text-rose-400"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-2 gap-3 pr-6">
              <input
                type="text"
                placeholder="Job Title"
                value={exp.jobTitle || ''}
                onChange={(e) => updateExperience(idx, 'jobTitle', e.target.value)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              />
              <input
                type="text"
                placeholder="Company Name"
                value={exp.company || ''}
                onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
