import React, { useState } from 'react';
import { MarketTrends, SalaryNegotiation } from '../types';
import { TrendingUp, TrendingDown, AlertTriangle, Target, Briefcase, DollarSign, Lock, Unlock, MessageCircle, AlertCircle, BarChart } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface MarketTrendsViewProps {
  trends: MarketTrends | null;
  salaryData: SalaryNegotiation | null;
  onGenerateSalary: () => void;
  loadingSalary: boolean;
  onGenerate: () => void; // New prop to trigger generation
}

const MarketTrendsView: React.FC<MarketTrendsViewProps> = ({ trends, salaryData, onGenerateSalary, loadingSalary, onGenerate }) => {
  const [offerRevealed, setOfferRevealed] = useState(false);

  if (!trends) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6 animate-fade-in bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-white/50">
        <div className="w-20 h-20 bg-emerald-100/80 rounded-full flex items-center justify-center">
          <TrendingUp className="w-10 h-10 text-emerald-600" />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-2xl font-bold text-stone-800">Tendencias del Mercado</h2>
          <p className="text-stone-500">
            Analiza las brechas de mercado, tecnologías en auge y proyecciones salariales para tu perfil en los próximos 12 meses.
          </p>
        </div>
        <button
          onClick={onGenerate}
          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-emerald-500/30 flex items-center"
        >
          <BarChart className="w-5 h-5 mr-2" />
          Generar Análisis de Mercado
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-stone-800 font-serif mb-2">Análisis de Mercado en Tiempo Real</h2>
        <p className="text-stone-500">Proyección a 12 meses basada en tu perfil y datos globales.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Growing Tech */}
        <div className="bg-green-50/60 backdrop-blur-sm border border-green-200/50 rounded-xl p-6">
          <h3 className="flex items-center text-lg font-bold text-green-800 mb-4">
            <TrendingUp className="w-6 h-6 mr-2" />
            En Crecimiento (High Demand)
          </h3>
          <ul className="space-y-2">
            {trends.growingTech.map((item, idx) => (
              <li key={idx} className="flex items-start">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                <span className="text-stone-700 font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Declining Tech */}
        <div className="bg-red-50/60 backdrop-blur-sm border border-red-200/50 rounded-xl p-6">
          <h3 className="flex items-center text-lg font-bold text-red-800 mb-4">
            <TrendingDown className="w-6 h-6 mr-2" />
            Perdiendo Demanda (Legacy)
          </h3>
          <ul className="space-y-2">
            {trends.decliningTech.map((item, idx) => (
              <li key={idx} className="flex items-start">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                <span className="text-stone-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Market Gaps */}
      <div className="bg-amber-50/60 backdrop-blur-sm border border-amber-200/50 rounded-xl p-6 shadow-sm">
         <h3 className="flex items-center text-lg font-bold text-amber-800 mb-4">
            <AlertTriangle className="w-6 h-6 mr-2" />
            Tus Brechas de Mercado (Próximos 12 meses)
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {trends.marketGaps.map((gap, idx) => (
                <div key={idx} className="bg-white/80 p-4 rounded-lg border border-amber-100/50 text-stone-700 text-sm shadow-sm backdrop-blur-sm">
                    {gap}
                </div>
            ))}
          </div>
      </div>

      {/* Emerging Roles & Recommendations */}
      <div className="grid md:grid-cols-2 gap-6">
         <div className="bg-white/60 backdrop-blur-md border border-white/50 rounded-xl p-6 shadow-sm">
            <h3 className="flex items-center text-lg font-bold text-stone-800 mb-4">
                <Briefcase className="w-6 h-6 mr-2 text-emerald-600" />
                Roles Emergentes para Ti
            </h3>
            <div className="space-y-3">
                 {trends.emergingRoles.map((role, idx) => (
                    <div key={idx} className="p-3 bg-stone-50/50 rounded-lg text-stone-700 font-medium border border-stone-100">
                        {role}
                    </div>
                 ))}
            </div>
         </div>

         <div className="bg-white/60 backdrop-blur-md border border-white/50 rounded-xl p-6 shadow-sm">
            <h3 className="flex items-center text-lg font-bold text-stone-800 mb-4">
                <Target className="w-6 h-6 mr-2 text-emerald-600" />
                Acciones Recomendadas
            </h3>
             <ul className="space-y-3">
                {trends.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start text-sm text-stone-600 bg-emerald-50/50 p-3 rounded-lg">
                        <span className="font-bold text-emerald-600 mr-2">{idx + 1}.</span>
                        {rec}
                    </li>
                ))}
            </ul>
         </div>
      </div>

      {/* Salary Negotiation Simulator */}
      <div className="mt-12 pt-8 border-t border-stone-200/50">
          <div className="bg-stone-900/95 backdrop-blur-md rounded-2xl p-8 text-white shadow-xl relative overflow-hidden border border-stone-800">
             <div className="relative z-10 flex flex-col md:flex-row justify-between items-center mb-6 gap-6">
                <div>
                    <h2 className="text-2xl font-bold font-serif flex items-center">
                        <DollarSign className="w-8 h-8 mr-2 text-emerald-400" />
                        Simulador de Negociación (Modo Tiburón)
                    </h2>
                    <p className="text-stone-400 text-sm mt-1">
                        Genera una oferta realista y practica cómo contrarrestar las tácticas del reclutador.
                    </p>
                </div>
                {!salaryData && (
                    <button 
                        onClick={onGenerateSalary}
                        disabled={loadingSalary}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/50 disabled:opacity-50"
                    >
                        {loadingSalary ? "Negociando..." : "Simular Oferta y Contraoferta"}
                    </button>
                )}
             </div>

             {/* Background Decoration */}
             <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>

             {salaryData && (
                 <div className="relative z-10 space-y-6 animate-fade-in">
                    {/* The Offer Envelope */}
                    <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
                        <div className={`p-6 text-center transition-all ${offerRevealed ? 'bg-stone-50 border-b border-stone-200' : 'bg-stone-100 py-12'}`}>
                            {!offerRevealed ? (
                                <div className="flex flex-col items-center justify-center">
                                    <Lock className="w-12 h-12 text-stone-400 mb-4" />
                                    <h3 className="text-xl font-bold text-stone-700 mb-2">Oferta Confidencial Recibida</h3>
                                    <button 
                                        onClick={() => setOfferRevealed(true)}
                                        className="mt-4 px-6 py-2 bg-stone-800 text-white rounded-lg font-bold hover:bg-stone-700 transition-colors"
                                    >
                                        Revelar Oferta
                                    </button>
                                </div>
                            ) : (
                                <div className="text-left animate-fade-in">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold text-stone-800">Propuesta Económica</h3>
                                        <Unlock className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <p className="text-2xl font-mono text-stone-900 font-bold mb-4 bg-yellow-50 inline-block px-2 py-1 border border-yellow-200 rounded">
                                        {salaryData.initialOffer}
                                    </p>
                                    <div className="bg-red-50 border border-red-100 p-4 rounded-lg mb-4">
                                        <h4 className="font-bold text-red-800 text-sm flex items-center mb-1">
                                            <MessageCircle className="w-4 h-4 mr-2" />
                                            Lo que dice el Reclutador (La Excusa)
                                        </h4>
                                        <p className="text-red-900 italic">"{salaryData.recruiterExcuse}"</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {offerRevealed && (
                            <div className="p-6 bg-stone-50">
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Risks */}
                                    <div>
                                        <h4 className="font-bold text-stone-700 mb-3 flex items-center text-sm uppercase">
                                            <AlertCircle className="w-4 h-4 mr-2 text-orange-500" />
                                            Riesgos de no negociar
                                        </h4>
                                        <ul className="space-y-2">
                                            {salaryData.lowballRisks.map((risk, idx) => (
                                                <li key={idx} className="text-sm text-stone-600 flex items-start">
                                                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                                                    {risk}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    {/* Playbook */}
                                    <div>
                                         <h4 className="font-bold text-stone-700 mb-3 flex items-center text-sm uppercase">
                                            <Target className="w-4 h-4 mr-2 text-emerald-500" />
                                            Playbook de Contraoferta
                                        </h4>
                                        <div className="space-y-4">
                                            {salaryData.negotiationStrategy.map((strat, idx) => (
                                                <div key={idx} className="bg-white p-3 rounded border border-stone-200 text-sm shadow-sm">
                                                    <p className="font-bold text-stone-800 text-xs mb-1">Si objetan: "{strat.objection}"</p>
                                                    <p className="text-emerald-700 font-medium">Tú dices: "{strat.counterScript}"</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 pt-4 border-t border-stone-200">
                                    <h4 className="font-bold text-stone-700 text-sm mb-2">Consejos de Cierre</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {salaryData.closingTips.map((tip, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                                                {tip}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                 </div>
             )}
          </div>
      </div>
    </div>
  );
};

export default MarketTrendsView;