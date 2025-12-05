import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { CheckCircle, XCircle, AlertTriangle, FileText, Clock, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AnalysisViewProps {
  data: AnalysisResult;
}

interface ExpandableCardProps {
  title: string;
  content: string;
  icon: React.ReactNode;
  defaultExpanded?: boolean;
}

const ExpandableAnalysisCard: React.FC<ExpandableCardProps> = ({ title, content, icon, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  // Robust check for content availability
  const hasContent = content && content.trim().length > 0;

  return (
    <div 
      className={`bg-white/60 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 transition-all duration-300 overflow-hidden group 
        ${hasContent ? (isExpanded ? 'ring-1 ring-emerald-500/30 shadow-md' : 'hover:shadow-md cursor-pointer hover:bg-white/80') : 'opacity-80 bg-stone-50/50'}`}
      onClick={() => hasContent && setIsExpanded(!isExpanded)}
      role="button"
      tabIndex={hasContent ? 0 : -1}
      aria-expanded={isExpanded}
      onKeyDown={(e) => {
          if (hasContent && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              setIsExpanded(!isExpanded);
          }
      }}
    >
      <div className="flex items-center justify-between p-6 pb-2">
        <div className="flex items-center">
           {icon}
           <h3 className="text-xl font-bold text-stone-800 ml-3">{title}</h3>
        </div>
        {hasContent && (
            <div className={`text-stone-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-6 h-6" />
            </div>
        )}
      </div>
      
      <div className="px-6 pb-6 pt-2">
           {!hasContent ? (
               <div className="flex items-start p-3 bg-red-50/50 border border-red-100 rounded-lg text-red-700 animate-fade-in">
                   <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                   <div>
                       <p className="font-bold text-sm">No se pudieron cargar los detalles</p>
                       <p className="text-xs mt-1 text-red-600">El análisis para esta sección no generó contenido válido. Intenta procesar los documentos nuevamente.</p>
                   </div>
               </div>
           ) : (
               <>
                   <div className={`prose prose-stone text-sm text-stone-600 max-w-none leading-relaxed transition-all ${!isExpanded ? 'line-clamp-3 overflow-hidden' : ''}`}>
                        <ReactMarkdown>{content}</ReactMarkdown>
                   </div>
                   {!isExpanded && (
                       <div className="mt-3 text-xs font-bold text-emerald-600 flex items-center opacity-60 group-hover:opacity-100 transition-opacity">
                           Ver más detalles <ChevronDown className="w-3 h-3 ml-1" />
                       </div>
                   )}
               </>
           )}
      </div>
    </div>
  );
};

const AnalysisView: React.FC<AnalysisViewProps> = ({ data }) => {
  const isApto = data.verdict === "APTO";

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Verdict Header */}
      <div className={`p-8 rounded-2xl text-center border-2 shadow-sm backdrop-blur-sm ${isApto ? 'bg-emerald-50/70 border-emerald-200/60' : 'bg-red-50/70 border-red-200/60'}`}>
        <div className="flex justify-center mb-4">
          {isApto ? (
            <CheckCircle className="w-16 h-16 text-emerald-600" />
          ) : (
            <XCircle className="w-16 h-16 text-red-600" />
          )}
        </div>
        <h2 className={`text-4xl font-bold mb-3 font-serif ${isApto ? 'text-emerald-800' : 'text-red-800'}`}>
          {data.verdict}
        </h2>
        {data.analysisDuration && (
            <div className="flex items-center justify-center text-xs text-stone-400 mb-4 font-mono bg-white/50 inline-block px-3 py-1 rounded-full border border-stone-200/50">
                <Clock className="w-3 h-3 mr-1.5" />
                Procesado en {data.analysisDuration.toFixed(1)} segundos
            </div>
        )}
        <div className="text-stone-700 max-w-3xl mx-auto text-lg leading-relaxed prose prose-sm">
           <ReactMarkdown>{data.verdictExplanation}</ReactMarkdown>
        </div>
      </div>

      {/* Deep Analysis Grid (Expandable Cards) */}
      <div className="grid md:grid-cols-2 gap-6">
        <ExpandableAnalysisCard 
          title="Análisis de la Vacante" 
          content={data.vacancyAnalysis}
          icon={<FileText className="w-6 h-6 text-emerald-500"/>}
          defaultExpanded={false}
        />
        <ExpandableAnalysisCard 
          title="Análisis del Candidato" 
          content={data.candidateAnalysis}
          icon={<FileText className="w-6 h-6 text-teal-500"/>}
          defaultExpanded={false}
        />
      </div>

      {/* Comparison Matrix */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 overflow-hidden">
        <div className="p-6 border-b border-stone-200/50 bg-stone-50/50">
          <h3 className="text-xl font-bold text-stone-800 font-serif">Matriz Comparativa</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50/30 text-stone-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Criterio</th>
                <th className="p-4 font-semibold">Requisito</th>
                <th className="p-4 font-semibold">Coincidencia</th>
                <th className="p-4 font-semibold text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100/50">
              {data.comparisonMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/50 transition-colors">
                  <td className="p-4 font-bold text-stone-800 w-1/4">{row.criteria}</td>
                  <td className="p-4 text-stone-600 text-sm w-1/4">{row.requirement}</td>
                  <td className="p-4 text-stone-600 text-sm w-1/4">{row.candidateMatch}</td>
                  <td className="p-4 w-1/6 text-center">
                    <span className={`
                      inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                      ${row.status === 'Match' ? 'bg-emerald-100/80 text-emerald-700' : 
                        row.status === 'Gap' ? 'bg-red-100/80 text-red-700' : 
                        'bg-amber-100/80 text-amber-700'}
                    `}>
                      {row.status === 'Match' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {row.status === 'Gap' && <XCircle className="w-3 h-3 mr-1" />}
                      {row.status === 'Partial' && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalysisView;