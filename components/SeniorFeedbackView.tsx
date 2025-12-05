import React from 'react';
import { SeniorFeedback } from '../types';
import { AlertOctagon, TrendingUp, XCircle, CheckCircle, Zap, Crosshair, Briefcase, Play } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface SeniorFeedbackViewProps {
  feedback: SeniorFeedback | null;
  onGenerate: () => void; // New prop
}

const SeniorFeedbackView: React.FC<SeniorFeedbackViewProps> = ({ feedback, onGenerate }) => {
  if (!feedback) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6 animate-fade-in bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-white/50">
          <div className="w-20 h-20 bg-amber-100/80 rounded-full flex items-center justify-center">
            <Zap className="w-10 h-10 text-amber-600" />
          </div>
          <div className="max-w-md space-y-2">
            <h2 className="text-2xl font-bold text-stone-800">Mentoría Senior (Sin Filtros)</h2>
            <p className="text-stone-500">
              Recibe un análisis brutalmente honesto de un CTO simulado. Descubre qué estás haciendo mal y qué debes dejar de hacer ya.
            </p>
          </div>
          <button
            onClick={onGenerate}
            className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-amber-500/30 flex items-center"
          >
            <Play className="w-5 h-5 mr-2" />
            Solicitar Feedback Honesto
          </button>
        </div>
      );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="bg-stone-900/95 backdrop-blur-md text-white p-8 rounded-2xl shadow-xl relative overflow-hidden border border-stone-800">
        <div className="relative z-10">
            <h2 className="text-3xl font-bold font-serif mb-4 flex items-center">
            <Briefcase className="w-8 h-8 mr-3 text-emerald-400" />
            Mentoria Senior (Sin Filtros)
            </h2>
            <div className="text-lg text-stone-300 leading-relaxed font-mono bg-stone-800/50 p-6 rounded-xl border border-stone-700 backdrop-blur-sm">
                <ReactMarkdown>{feedback.realityCheck}</ReactMarkdown>
            </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600 rounded-full mix-blend-overlay filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* The Good */}
        <div className="bg-white/60 backdrop-blur-md p-6 rounded-xl border border-white/50 shadow-sm">
            <h3 className="flex items-center text-lg font-bold text-green-700 mb-4 uppercase tracking-wide">
                <CheckCircle className="w-5 h-5 mr-2" />
                Lo que estás haciendo bien
            </h3>
            <ul className="space-y-3">
                {feedback.doingWell.map((item, idx) => (
                    <li key={idx} className="flex items-start text-sm text-stone-700 bg-green-50/50 p-3 rounded-lg border border-green-100/50 backdrop-blur-sm">
                        <span className="font-bold text-green-600 mr-2 flex-shrink-0">✓</span>
                        {item}
                    </li>
                ))}
            </ul>
        </div>

        {/* The Bad */}
        <div className="bg-white/60 backdrop-blur-md p-6 rounded-xl border border-white/50 shadow-sm">
            <h3 className="flex items-center text-lg font-bold text-orange-700 mb-4 uppercase tracking-wide">
                <XCircle className="w-5 h-5 mr-2" />
                Lo que estás haciendo mal
            </h3>
            <ul className="space-y-3">
                {feedback.doingPoorly.map((item, idx) => (
                    <li key={idx} className="flex items-start text-sm text-stone-700 bg-orange-50/50 p-3 rounded-lg border border-orange-100/50 backdrop-blur-sm">
                         <span className="font-bold text-orange-600 mr-2 flex-shrink-0">✕</span>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
      </div>

      {/* STOP DOING - Critical Section */}
      <div className="bg-red-50/60 backdrop-blur-sm border-l-4 border-red-600 p-8 rounded-r-xl shadow-sm border-y border-r border-red-100/50">
          <h3 className="flex items-center text-xl font-bold text-red-800 mb-6 uppercase tracking-widest">
              <AlertOctagon className="w-6 h-6 mr-3" />
              DEJA DE HACER ESTO INMEDIATAMENTE
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
              {feedback.stopDoingImmediately.map((item, idx) => (
                  <div key={idx} className="bg-white/80 p-4 rounded-lg shadow-sm text-red-900 font-medium border border-red-100/50 flex items-center backdrop-blur-sm">
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
                      {item}
                  </div>
              ))}
          </div>
      </div>

      {/* Strategy & Priorities */}
      <div className="grid md:grid-cols-3 gap-6">
          <div className="col-span-1 bg-emerald-700/90 backdrop-blur-md text-white p-6 rounded-xl shadow-lg border border-emerald-600/50">
              <h3 className="flex items-center text-lg font-bold mb-4">
                  <Crosshair className="w-5 h-5 mr-2 text-emerald-200" />
                  Prioridades (80/20)
              </h3>
              <ul className="space-y-4">
                  {feedback.priorities.map((item, idx) => (
                      <li key={idx} className="flex items-start text-sm text-emerald-100">
                          <span className="font-bold text-white mr-2">{idx + 1}.</span>
                          {item}
                      </li>
                  ))}
              </ul>
          </div>
          
          <div className="col-span-1 md:col-span-2 bg-white/60 backdrop-blur-md border border-white/50 p-6 rounded-xl shadow-sm">
               <h3 className="flex items-center text-lg font-bold text-stone-800 mb-4">
                  <TrendingUp className="w-5 h-5 mr-2 text-emerald-600" />
                  Plan de Mejora y Tendencias
              </h3>
              <div className="mb-6">
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Tendencias Clave para Ti</h4>
                  <div className="flex flex-wrap gap-2">
                      {feedback.marketTrends.map((trend, idx) => (
                          <span key={idx} className="px-3 py-1 bg-stone-100/50 text-stone-600 rounded-full text-xs font-bold border border-stone-200/50">
                              {trend}
                          </span>
                      ))}
                  </div>
              </div>
              <div className="prose prose-sm text-stone-600 max-w-none border-t border-stone-100/50 pt-4">
                  <ReactMarkdown>{feedback.improvementPlan}</ReactMarkdown>
              </div>
          </div>
      </div>
    </div>
  );
};

export default SeniorFeedbackView;