import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { FileAttachment } from '../types';

interface FileUploadProps {
  onAnalyze: (resume: FileAttachment, job: FileAttachment) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onAnalyze, isLoading }) => {
  const [resumeFile, setResumeFile] = useState<FileAttachment | null>(null);
  const [jobFile, setJobFile] = useState<FileAttachment | null>(null);
  
  // Metadata for validation
  const [resumeMeta, setResumeMeta] = useState<{ name: string; size: number } | null>(null);
  const [jobMeta, setJobMeta] = useState<{ name: string; size: number } | null>(null);

  const validateFile = (file: File, type: 'resume' | 'job'): boolean => {
    // 1. Check File Size (Max 2MB to prevent API Payload Errors)
    const MAX_SIZE_MB = 2;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        alert(`El archivo es demasiado grande (${(file.size / 1024 / 1024).toFixed(2)}MB). El límite es ${MAX_SIZE_MB}MB para asegurar un análisis rápido.`);
        return false;
    }

    // 2. Check File Type explicitly
    const validExtensions = ['pdf', 'doc', 'docx', 'txt', 'md'];
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (!extension || !validExtensions.includes(extension)) {
      alert("Formato no soportado. Por favor sube archivos PDF, DOCX, TXT o MD.");
      return false;
    }

    // 3. Check for Duplicates (Same file in both slots)
    if (type === 'resume') {
      if (jobMeta && jobMeta.name === file.name && jobMeta.size === file.size) {
        alert("Error: No puedes utilizar el mismo archivo para la Hoja de Vida y la Vacante.");
        return false;
      }
    } else {
      if (resumeMeta && resumeMeta.name === file.name && resumeMeta.size === file.size) {
        alert("Error: Ya subiste este archivo como Hoja de Vida. Por favor selecciona el documento de la Vacante.");
        return false;
      }
    }

    return true;
  };

  const processFile = (file: File, type: 'resume' | 'job') => {
    if (!validateFile(file, type)) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const base64Data = result.split(',')[1];
      
      const attachment: FileAttachment = {
        mimeType: file.type || 'text/plain', // Fallback for some OS/Browsers
        data: base64Data,
        sourceType: type
      };

      if (type === 'resume') {
        setResumeFile(attachment);
        setResumeMeta({ name: file.name, size: file.size });
      } else {
        setJobFile(attachment);
        setJobMeta({ name: file.name, size: file.size });
      }
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent, type: 'resume' | 'job') => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0], type);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'resume' | 'job') => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0], type);
    }
  };

  const handleAnalyze = () => {
    if (resumeFile && jobFile) {
      // Final Safety Check
      if (resumeMeta?.name === jobMeta?.name && resumeMeta?.size === jobMeta?.size) {
         alert("Error Crítico: Los archivos parecen ser idénticos. Por favor verifica.");
         return;
      }
      onAnalyze(resumeFile, jobFile);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-stone-800 drop-shadow-sm">Inicia tu Análisis Profesional</h2>
        <p className="text-stone-600">Sube tu Hoja de Vida y la Descripción de la Vacante para generar tu estrategia.</p>
        
        <div className="flex items-center justify-center space-x-2 text-xs text-amber-600 bg-amber-50/80 backdrop-blur-sm p-2 rounded-lg inline-block mx-auto border border-amber-100">
           <AlertCircle className="w-4 h-4" />
           <span>Máximo 2MB por archivo para evitar errores de conexión.</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Resume Upload */}
        <div 
          className={`border-2 rounded-xl p-8 flex flex-col items-center justify-center transition-all duration-300 relative backdrop-blur-sm ${resumeFile ? 'border-solid border-emerald-500 bg-emerald-50/50 shadow-md ring-4 ring-emerald-50/50' : 'border-dashed border-white/50 hover:border-emerald-400 bg-white/40 hover:shadow-sm'}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => onDrop(e, 'resume')}
        >
          <div className={`p-4 rounded-full mb-4 transition-all duration-500 ${resumeFile ? 'bg-emerald-100 scale-110' : 'bg-teal-100/80'}`}>
            {resumeFile ? <CheckCircle className="w-8 h-8 text-emerald-600" /> : <FileText className="w-8 h-8 text-teal-600" />}
          </div>
          <h3 className="font-semibold text-lg mb-1 text-stone-700">Subir Hoja de Vida (CV)</h3>
          {resumeMeta ? (
             <div className="flex flex-col items-center animate-fade-in-up">
                <p className="text-sm font-medium text-stone-700 mb-1 bg-white/80 px-3 py-1 rounded-md border border-stone-200 shadow-sm max-w-[200px] truncate">
                    {resumeMeta.name}
                </p>
                <div className="flex items-center space-x-2">
                    <p className="text-xs text-stone-500">{(resumeMeta.size / 1024).toFixed(1)} KB</p>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100/80 px-2 py-0.5 rounded-full flex items-center border border-emerald-200">
                        <CheckCircle className="w-3 h-3 mr-1"/> Listo
                    </span>
                </div>
             </div>
          ) : (
             <p className="text-sm text-stone-500 text-center mb-4">Arrastra o selecciona<br/>(PDF, DOCX, TXT)</p>
          )}
          
          <input 
            type="file" 
            accept=".txt,.md,.pdf,.docx,.doc" 
            className="hidden" 
            id="resume-upload" 
            onChange={(e) => onFileSelect(e, 'resume')}
          />
          <label 
            htmlFor="resume-upload"
            className="mt-4 px-4 py-2 bg-white/80 border border-stone-300 rounded-lg text-sm font-medium hover:bg-white cursor-pointer shadow-sm transition-colors text-stone-700 hover:text-emerald-700 hover:border-emerald-300 backdrop-blur-sm"
          >
            {resumeFile ? "Cambiar CV" : "Seleccionar CV"}
          </label>
        </div>

        {/* Job Upload */}
        <div 
          className={`border-2 rounded-xl p-8 flex flex-col items-center justify-center transition-all duration-300 relative backdrop-blur-sm ${jobFile ? 'border-solid border-emerald-500 bg-emerald-50/50 shadow-md ring-4 ring-emerald-50/50' : 'border-dashed border-white/50 hover:border-emerald-400 bg-white/40 hover:shadow-sm'}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => onDrop(e, 'job')}
        >
          <div className={`p-4 rounded-full mb-4 transition-all duration-500 ${jobFile ? 'bg-emerald-100 scale-110' : 'bg-teal-100/80'}`}>
            {jobFile ? <CheckCircle className="w-8 h-8 text-emerald-600" /> : <Upload className="w-8 h-8 text-teal-600" />}
          </div>
          <h3 className="font-semibold text-lg mb-1 text-stone-700">Subir Vacante (JD)</h3>
           {jobMeta ? (
             <div className="flex flex-col items-center animate-fade-in-up">
                <p className="text-sm font-medium text-stone-700 mb-1 bg-white/80 px-3 py-1 rounded-md border border-stone-200 shadow-sm max-w-[200px] truncate">
                    {jobMeta.name}
                </p>
                <div className="flex items-center space-x-2">
                    <p className="text-xs text-stone-500">{(jobMeta.size / 1024).toFixed(1)} KB</p>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100/80 px-2 py-0.5 rounded-full flex items-center border border-emerald-200">
                        <CheckCircle className="w-3 h-3 mr-1"/> Listo
                    </span>
                </div>
             </div>
          ) : (
             <p className="text-sm text-stone-500 text-center mb-4">Arrastra o selecciona<br/>(PDF, DOCX, TXT)</p>
          )}
          <input 
            type="file" 
            accept=".txt,.md,.pdf,.docx,.doc" 
            className="hidden" 
            id="job-upload" 
            onChange={(e) => onFileSelect(e, 'job')}
          />
          <label 
            htmlFor="job-upload"
            className="mt-4 px-4 py-2 bg-white/80 border border-stone-300 rounded-lg text-sm font-medium hover:bg-white cursor-pointer shadow-sm transition-colors text-stone-700 hover:text-emerald-700 hover:border-emerald-300 backdrop-blur-sm"
          >
            {jobFile ? "Cambiar Vacante" : "Seleccionar Vacante"}
          </label>
        </div>
      </div>

      <div className="flex justify-center pt-6">
        <button
          onClick={handleAnalyze}
          disabled={!resumeFile || !jobFile || isLoading}
          className={`
            px-8 py-4 rounded-xl text-white font-bold text-lg shadow-lg flex items-center space-x-3 transition-all transform
            ${(!resumeFile || !jobFile || isLoading) ? 'bg-stone-300 cursor-not-allowed scale-100' : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 hover:scale-105 shadow-emerald-500/30'}
          `}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Generando Ruta de 15 Semanas...</span>
            </>
          ) : (
            <span>Generar Ruta de Estudio</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default FileUpload;