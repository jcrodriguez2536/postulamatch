import React from 'react';
import { JobTranslation } from '../types';
import { Quote, Languages, Eye, Flame, FileText, Check, X, Search } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface JobTranslationViewProps {
  translation: JobTranslation | null;
  onGenerate: () => void; // New prop
}

const JobTranslationView: React.FC<JobTranslationViewProps> = ({ translation, onGenerate }) => {
  if (!translation) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6 animate-fade-in bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-white/50">
          <div className="w-20 h-20 bg-emerald-100/80 rounded-full flex items-center justify-center">
            <Languages className="w-10 h-10 text-emerald-600" />
          </div>
          <div className="max-w-md space-y-2">
            <h2 className="text-2xl font-bold text-stone-800">Decodificador de Vacantes</h2>
            <p className="text-stone-500">
              Traduce el lenguaje corporativo, detecta exageraciones y encuentra el significado real detrás de "ambiente dinámico" y "salario competitivo".
            </p>
          </div>
          <button
            onClick={onGenerate}
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-emerald-500/30 flex items-center"
          >
            <Search className="w-5 h-5 mr-2" />
            Decodificar Vacante
          </button>
        </div>
      );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="bg-teal-900/90 backdrop-blur-md text-white rounded-2xl p-8 shadow-xl border border-teal-800">
        <div className="flex items-center mb-4">
            <Languages className="w-8 h-8 mr-3 text-teal-300" />
            <h2 className="text-3xl font-bold font-serif">Decodificador de Vacantes</h2>
        </div>
        <p className="text-teal-200 text-lg leading-relaxed max-w-2xl">
            La traducción honesta de lo que la empresa realmente quiere decir, sin filtros corporativos ni exageraciones de marketing.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
          {/* Ambiguities */}
          <div className="bg-white/60 backdrop-blur-md p-6 rounded-xl border border-white/50 shadow-sm">
             <h3 className="flex items-center text-lg font-bold text-stone-800 mb-6 border-b border-stone-200/50 pb-2">
                <Quote className="w-5 h-5 mr-2 text-emerald-500" />
                Ambigüedades y Exageraciones
             </h3>
             <div className="space-y-4">
                {translation.ambiguities.map((item, idx) => (
                    <div key={idx} className="bg-stone-50/50 p-4 rounded-lg">
                        <p className="text-xs font-bold text-stone-400 uppercase mb-1">Cita textual</p>
                        <p className="text-stone-800 font-medium italic mb-3">"{item.quote}"</p>
                        <p className="text-xs font-bold text-emerald-500 uppercase mb-1">Traducción Real</p>
                        <p className="text-emerald-900 text-sm">{item.explanation}</p>
                    </div>
                ))}
             </div>
          </div>

          {/* Dictionary */}
          <div className="bg-white/60 backdrop-blur-md p-6 rounded-xl border border-white/50 shadow-sm">
             <h3 className="flex items-center text-lg font-bold text-stone-800 mb-6 border-b border-stone-200/50 pb-2">
                <Languages className="w-5 h-5 mr-2 text-green-500" />
                Diccionario Corporativo
             </h3>
             <div className="space-y-3">
                {translation.dictionary.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border-b border-stone-100/50 last:border-0 hover:bg-white/50 transition-colors rounded">
                        <span className="font-bold text-stone-700 sm:w-1/2 mb-1 sm:mb-0">{item.jargon}</span>
                        <div className="hidden sm:block text-stone-300 mx-2">→</div>
                        <span className="text-green-700 font-medium sm:w-1/2 text-right sm:text-left bg-green-50/50 px-2 py-0.5 rounded sm:bg-transparent sm:px-0">
                            {item.reality}
                        </span>
                    </div>
                ))}
             </div>
          </div>
      </div>

      {/* Hidden Signals */}
      <div className="bg-amber-50/60 backdrop-blur-sm border border-amber-200/50 rounded-xl p-8">
          <h3 className="flex items-center text-xl font-bold text-amber-900 mb-6">
              <Eye className="w-6 h-6 mr-2" />
              Señales Ocultas (Lo que no dicen)
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
              {translation.hiddenSignals.map((signal, idx) => (
                  <div key={idx} className="flex items-start">
                      <Flame className="w-5 h-5 mr-2 text-amber-600 mt-0.5 flex-shrink-0" />
                      <p className="text-amber-800 text-sm">{signal}</p>
                  </div>
              ))}
          </div>
      </div>

      {/* Responsibilities: Smoke vs Real */}
      <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/60 backdrop-blur-md border border-white/50 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-teal-50/80 p-4 border-b border-teal-100/50">
                  <h3 className="font-bold text-teal-900 flex items-center">
                      <Check className="w-5 h-5 mr-2" />
                      Responsabilidades Reales
                  </h3>
              </div>
              <div className="p-6">
                  <ul className="space-y-2">
                      {translation.responsibilities.real.map((resp, idx) => (
                          <li key={idx} className="text-sm text-stone-700 flex items-start">
                              <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                              {resp}
                          </li>
                      ))}
                  </ul>
              </div>
          </div>

          <div className="bg-white/60 backdrop-blur-md border border-white/50 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-stone-100/80 p-4 border-b border-stone-200/50">
                  <h3 className="font-bold text-stone-600 flex items-center">
                      <X className="w-5 h-5 mr-2" />
                      Humo / Relleno (Ignorar)
                  </h3>
              </div>
              <div className="p-6">
                  <ul className="space-y-2">
                      {translation.responsibilities.smoke.map((resp, idx) => (
                          <li key={idx} className="text-sm text-stone-500 flex items-start line-through decoration-stone-300">
                              <span className="w-1.5 h-1.5 bg-stone-300 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                              {resp}
                          </li>
                      ))}
                  </ul>
              </div>
          </div>
      </div>

      {/* Honest Version */}
      <div className="bg-white/60 backdrop-blur-md border border-white/50 rounded-xl p-8 shadow-sm">
          <h3 className="flex items-center text-xl font-bold text-stone-800 mb-6">
              <FileText className="w-6 h-6 mr-2 text-emerald-600" />
              Versión Honesta y Simplificada
          </h3>
          <div className="prose prose-stone max-w-none text-stone-700">
              <ReactMarkdown>{translation.honestVersion}</ReactMarkdown>
          </div>
      </div>
    </div>
  );
};

export default JobTranslationView;