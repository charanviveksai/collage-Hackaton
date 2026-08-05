import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Sparkles, Type } from 'lucide-react';
import { uploadResumeFile } from '../lib/api';

interface FileDropzoneProps {
  onParsedText: (text: string, fileName?: string, resumeId?: string) => void;
  userId?: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({ onParsedText, userId }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ name: string; size: number } | null>(null);
  const [pastedText, setPastedText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    setErrorMessage(null);
    setIsUploading(true);

    const validExtensions = ['.pdf', '.docx', '.txt'];
    const hasValidExt = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!hasValidExt) {
      setErrorMessage('Unsupported file format. Please upload a PDF, DOCX, or TXT file.');
      setIsUploading(false);
      return;
    }

    try {
      const res = await uploadResumeFile(file, userId);
      setSuccessInfo({ name: res.fileName, size: file.size });
      onParsedText(res.text, res.fileName, res.resumeId);
    } catch (err: any) {
      console.error('File parsing failed:', err);
      setErrorMessage(err.message || 'Failed to read file contents. Please try again or paste the text.');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePasteSubmit = () => {
    if (pastedText.trim().length < 50) {
      setErrorMessage('Please paste at least 50 characters of resume content.');
      return;
    }
    setErrorMessage(null);
    onParsedText(pastedText, 'Pasted Resume Text');
  };

  const wordCount = pastedText.trim() ? pastedText.trim().split(/\s+/).length : 0;
  const charCount = pastedText.length;

  return (
    <div className="w-full">
      {/* Mode Switcher */}
      <div className="flex items-center space-x-2 mb-4 p-1 bg-slate-900/90 rounded-xl border border-slate-800 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'upload'
              ? 'bg-brand-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload File (PDF / DOCX)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('paste')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'paste'
              ? 'bg-brand-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Paste Plain Text</span>
        </button>
      </div>

      {/* Upload Box */}
      {activeTab === 'upload' ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragging
              ? 'border-brand-500 bg-brand-500/10 scale-[1.01]'
              : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/80'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-brand-400 shadow-xl group-hover:scale-110 transition-transform">
              {isUploading ? (
                <div className="w-6 h-6 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
              ) : successInfo ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              ) : (
                <Upload className="w-8 h-8" />
              )}
            </div>

            <div>
              <h3 className="text-base font-semibold text-white">
                {isUploading
                  ? 'Extracting document text...'
                  : successInfo
                  ? `Uploaded: ${successInfo.name}`
                  : 'Click or drag & drop your resume file'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Supports PDF, DOCX, or TXT (Max size 10MB)
              </p>
            </div>

            {successInfo && (
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-medium">
                <FileText className="w-3.5 h-3.5" />
                <span>Text Extracted Successfully</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Textarea Box */
        <div className="space-y-3">
          <textarea
            rows={10}
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Paste your full resume content here (Work experience, education, skills, projects)..."
            className="w-full p-4 bg-slate-900/80 border border-slate-800 rounded-2xl text-slate-200 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-mono resize-y"
          />
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <div className="flex space-x-4">
              <span>Words: {wordCount}</span>
              <span>Characters: {charCount}</span>
            </div>
            <button
              type="button"
              onClick={handlePasteSubmit}
              disabled={pastedText.trim().length < 50}
              className="flex items-center space-x-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-brand-500/20 disabled:opacity-50 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Use Pasted Text</span>
            </button>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center space-x-3 text-rose-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
