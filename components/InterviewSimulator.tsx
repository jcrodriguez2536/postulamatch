import React, { useState } from 'react';
import { InterviewSimulation } from '../types';
import { User, Shield, Zap, Brain, Eye, EyeOff, Target, ThumbsUp, Mic } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface InterviewSimulatorProps {
  simulation: InterviewSimulation | null;
  onGenerate: () => void; // New prop
}

const InterviewSimulator: React.FC<InterviewSimulatorProps> = ({ simulation, onGenerate }) => {
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  const toggleReveal = (id: string) => {
    const newSet = new Set(revealedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setRevealedIds(newSet);
  };

  if (!simulation) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6 animate-fade-in bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-white/50">
          <div className="w-20 h-20 bg-teal-100/80 rounded-full flex items-center justify-center">
            <Mic className="w-10 h-10 text-teal-600" />
          </div>
          <div className="max-w-md space-y-2">
            <h2 className="text-2xl font-bold text-stone-800">Simulador de Entrevista</h2>
            <p className="text-stone-500">
              Enfréntate a un "Bar Raiser" de Big Tech. Preguntas trampa, presión y análisis de cultura para medir tu verdadero nivel.
            </p>
          </div>
          <button
            onClick={onGenerate}
            className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-teal-500/30 flex items-center"
          >
            <Zap className="w-5 h-5 mr-2" />
            Iniciar Simulación
          </button>
        </div>
      );
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Pressure': return <Zap className="w-5 h-5 text-yellow-500" />;
      case 'Trick': return <Brain className="w-5 h-5 text-teal-500" />;
      case 'Culture': return <User className="w-5 h-5 text-emerald-500" />;
      default: return <Shield className="w-5 h-5 text-red-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Pressure': return 'bg-yellow-50/80 border-yellow-200/50 text-yellow-800';
      case 'Trick': return 'bg-teal-50/80 border-teal-200/50 text-teal-800';
      case 'Culture': return 'bg-emerald-50/80 border-emerald-200/50 text-emerald-800';
      default: return 'bg-red-50/80 border-red-200/50 text-red-800';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="bg-stone-900/95 backdrop-blur-md text-white rounded-2xl p-8 shadow-xl border border-stone-800">
        <h2 className="text-3xl font-bold font-serif mb-4 flex items-center">
          <User className="w-8 h-8 mr-3 text-emerald-400" />
          Simulador de Entrevista "Bar Raiser"
        </h2>
        <p className="text-stone-300 text-lg leading-relaxed max-w-3xl">
          {simulation.introduction}
        </p>
      </div>

      <div className="grid gap-6">
        {simulation.questions.map((q, idx) => (
          <div key={idx} className="bg-white/70 backdrop-blur-sm rounded-xl shadow-md border border-white/50 overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                 <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center backdrop-blur-sm ${getCategoryColor(q.category)}`}>
                    {getCategoryIcon(q.category)}
                    <span className="ml-2">{q.category}</span>
                 </span>
                 <span className="text-stone-400 text-xs font-bold">Pregunta {idx + 1}</span>
              </div>
              
              <h3 className="text-xl font-bold text-stone-800 mb-6 leading-snug">
                "{q.question}"
              </h3>

              <div className="flex justify-center">
                 <button 
                    onClick={() => toggleReveal(idx.toString())}
                    className={`flex items-center px-6 py-2 rounded-full text-sm font-bold transition-all ${revealedIds.has(idx.toString()) ? 'bg-stone-100 text-stone-600' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md'}`}
                 >
                    {revealedIds.has(idx.toString()) ? (
                        <>
                            <EyeOff className="w-4 h-4 mr-2" /> Ocultar Análisis
                        </>
                    ) : (
                        <>
                            <Eye className="w-4 h-4 mr-2" /> Revelar Intención y Guía
                        </>
                    )}
                 </button>
              </div>
            </div>

            {revealedIds.has(idx.toString()) && (
                <div className="bg-stone-50/50 backdrop-blur-sm border-t border-stone-200/50 p-6 grid md:grid-cols-2 gap-6 animate-fade-in">
                    <div className="bg-white/80 p-5 rounded-lg border border-white/50 shadow-sm backdrop-blur-sm">
                        <h4 className="flex items-center text-sm font-bold text-emerald-900 uppercase tracking-wide mb-3">
                            <Target className="w-4 h-4 mr-2" />
                            Intención Oculta
                        </h4>
                        <p className="text-stone-700 text-sm leading-relaxed">
                            {q.intent}
                        </p>
                    </div>
                    <div className="bg-white/80 p-5 rounded-lg border border-white/50 shadow-sm backdrop-blur-sm">
                        <h4 className="flex items-center text-sm font-bold text-green-700 uppercase tracking-wide mb-3">
                            <ThumbsUp className="w-4 h-4 mr-2" />
                            Cómo Responder
                        </h4>
                        <div className="text-stone-700 text-sm leading-relaxed prose prose-sm">
                             <ReactMarkdown>{q.guide}</ReactMarkdown>
                        </div>
                    </div>
                </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-emerald-50/60 backdrop-blur-sm border border-emerald-100/50 rounded-xl p-8">
         <h3 className="text-xl font-bold text-emerald-900 mb-6 font-serif">Consejos de Lenguaje Corporal y Actitud</h3>
         <div className="grid md:grid-cols-2 gap-4">
             {simulation.generalTips.map((tip, idx) => (
                 <div key={idx} className="flex items-start bg-white/80 p-4 rounded-lg shadow-sm border border-emerald-100/50 backdrop-blur-sm">
                     <div className="bg-emerald-100 text-emerald-600 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs mr-3 flex-shrink-0">
                         {idx + 1}
                     </div>
                     <p className="text-stone-700 text-sm">{tip}</p>
                 </div>
             ))}
         </div>
      </div>
    </div>
  );
};

export default InterviewSimulator;