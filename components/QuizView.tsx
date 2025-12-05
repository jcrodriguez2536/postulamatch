import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { CheckCircle, AlertCircle, ArrowRight, XCircle, FileBarChart } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface QuizViewProps {
  title: string;
  questions: QuizQuestion[];
  caseStudy?: string;
  feedbackReport?: string;
  onClose: () => void;
  onComplete: (score: number, total: number) => void;
}

const QuizView: React.FC<QuizViewProps> = ({ title, questions, caseStudy, feedbackReport, onClose, onComplete }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const currentQ = questions[currentQIndex];

  // Helper to get a stable key for the answer map
  const getQuestionKey = (q: QuizQuestion, index: number) => q.id || index.toString();

  const handleAnswer = (val: string) => {
    const key = getQuestionKey(currentQ, currentQIndex);
    setAnswers(prev => ({ ...prev, [key]: val }));
  };

  const handleNext = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      calculateScore();
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
       const key = getQuestionKey(q, idx);
       const userAns = answers[key];
       // Simple normalization for text comparison
       if (userAns && userAns.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()) {
         correct++;
       }
    });
    setScore(correct);
    setShowResult(true);
    
    // Trigger completion only once
    if (!submitted) {
        onComplete(correct, questions.length);
        setSubmitted(true);
    }
  };

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 70;

    return (
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 overflow-hidden animate-fade-in mb-12">
        <div className={`p-10 text-center ${passed ? 'bg-emerald-50/50' : 'bg-orange-50/50'}`}>
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${passed ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                <span className="text-3xl font-bold">{percentage}%</span>
            </div>
            <h2 className={`text-4xl font-bold mb-4 ${passed ? 'text-emerald-800' : 'text-orange-800'}`}>
                {passed ? "¡Excelente Trabajo!" : "Sigue Practicando"}
            </h2>
            <p className="text-stone-700 mb-8 text-lg">
                Obtuviste <span className="font-bold">{score}</span> de <span className="font-bold">{questions.length}</span>.
            </p>
            
            <div className="flex justify-center space-x-4">
                <button 
                    onClick={onClose}
                    className="px-8 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors font-bold shadow-lg"
                >
                    Volver a la Ruta
                </button>
            </div>
        </div>
        
        {/* Feedback Report if available */}
        {feedbackReport && (
            <div className="p-8 border-t border-stone-200/50 bg-stone-50/30">
                <h3 className="flex items-center text-lg font-bold text-stone-800 mb-4">
                    <FileBarChart className="w-5 h-5 mr-2 text-emerald-600" />
                    Informe de Retroalimentación
                </h3>
                <div className="bg-white/80 p-6 rounded-xl border border-white/50 prose prose-stone max-w-none text-sm backdrop-blur-sm">
                    <ReactMarkdown>{feedbackReport}</ReactMarkdown>
                </div>
            </div>
        )}

        {/* Results Breakdown */}
        <div className="bg-stone-50/50 p-8 border-t border-stone-200/50 max-h-[500px] overflow-y-auto">
            <h3 className="font-bold text-stone-700 mb-6 uppercase text-sm tracking-wider">Detalle de Respuestas</h3>
            <div className="space-y-4">
                {questions.map((q, idx) => {
                    const key = getQuestionKey(q, idx);
                    const userAns = answers[key];
                    const isCorrect = userAns?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim();
                    return (
                        <div key={idx} className={`p-5 rounded-lg border text-sm backdrop-blur-sm ${isCorrect ? 'bg-white/60 border-stone-200/50' : 'bg-red-50/50 border-red-100/50'}`}>
                            <div className="flex items-start gap-3">
                                {isCorrect ? <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-500 mt-0.5" />}
                                <div className="flex-1">
                                    <p className="font-bold text-stone-800 mb-2 text-base">{q.question}</p>
                                    <div className="grid md:grid-cols-2 gap-4 mt-3">
                                        <div className={`p-2 rounded ${isCorrect ? 'bg-emerald-50/80 text-emerald-800' : 'bg-red-100/80 text-red-800'}`}>
                                            <span className="text-xs font-bold uppercase block mb-1">Tu Respuesta</span>
                                            {userAns || "Omitida"}
                                        </div>
                                        {!isCorrect && (
                                            <div className="p-2 rounded bg-stone-100/80 text-stone-800">
                                                <span className="text-xs font-bold uppercase block mb-1 text-stone-500">Respuesta Correcta</span>
                                                {q.correctAnswer}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
      </div>
    );
  }

  // Current Answer Key for logic
  const currentKey = getQuestionKey(currentQ, currentQIndex);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
        <div className="flex justify-between items-center bg-white/70 backdrop-blur-md p-4 rounded-xl shadow-sm border border-white/50">
             <h2 className="text-xl font-bold text-stone-800 truncate max-w-md">{title}</h2>
             <span className="text-sm font-bold bg-emerald-100/80 text-emerald-700 px-3 py-1 rounded-full">
                 Pregunta {currentQIndex + 1} / {questions.length}
             </span>
        </div>

        {/* Case Study Panel if present */}
        {caseStudy && (
            <div className="bg-amber-50/70 border border-amber-200/50 p-8 rounded-xl shadow-sm backdrop-blur-sm">
                <h3 className="text-amber-900 font-bold flex items-center mb-4 text-lg">
                    <AlertCircle className="w-6 h-6 mr-2"/> 
                    Caso Práctico
                </h3>
                <div className="prose prose-amber prose-sm max-w-none text-amber-900">
                    <ReactMarkdown>{caseStudy}</ReactMarkdown>
                </div>
            </div>
        )}

        <div className="bg-white/80 rounded-2xl shadow-lg border border-white/50 p-8 min-h-[400px] flex flex-col justify-between relative overflow-hidden backdrop-blur-xl">
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 h-1 bg-emerald-600 transition-all duration-300" style={{ width: `${((currentQIndex) / questions.length) * 100}%` }}></div>

            <div className="space-y-8">
                <div className="text-xl font-medium text-stone-800 leading-relaxed font-serif">
                    {currentQ.question}
                </div>
                
                <div className="space-y-3">
                    {currentQ.type === 'MultipleChoice' && currentQ.options?.map((opt, i) => (
                        <div 
                            key={i} 
                            onClick={() => handleAnswer(opt)}
                            className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all group ${answers[currentKey] === opt ? 'border-emerald-600 bg-emerald-50/50' : 'border-stone-100 hover:border-emerald-200 hover:bg-stone-50/50'}`}
                        >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${answers[currentKey] === opt ? 'border-emerald-600' : 'border-stone-300 group-hover:border-emerald-400'}`}>
                                {answers[currentKey] === opt && <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full" />}
                            </div>
                            <span className="text-stone-700 font-medium">{opt}</span>
                        </div>
                    ))}

                    {currentQ.type === 'TrueFalse' && ['True', 'False'].map((opt, i) => (
                        <div 
                            key={i} 
                            onClick={() => handleAnswer(opt)}
                            className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all group ${answers[currentKey] === opt ? 'border-emerald-600 bg-emerald-50/50' : 'border-stone-100 hover:border-emerald-200 hover:bg-stone-50/50'}`}
                        >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${answers[currentKey] === opt ? 'border-emerald-600' : 'border-stone-300 group-hover:border-emerald-400'}`}>
                                {answers[currentKey] === opt && <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full" />}
                            </div>
                            <span className="text-stone-700 font-medium">{opt}</span>
                        </div>
                    ))}

                    {currentQ.type === 'ShortAnswer' && (
                        <div className="relative">
                            <input 
                                type="text" 
                                className="w-full p-5 border-2 border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600 outline-none text-lg transition-colors text-stone-900 bg-stone-50/50 focus:bg-white placeholder-stone-500 font-medium"
                                placeholder="Escribe tu respuesta aquí..."
                                value={answers[currentKey] || ''}
                                onChange={(e) => handleAnswer(e.target.value)}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-stone-100 mt-8">
                <button 
                    onClick={() => setCurrentQIndex(Math.max(0, currentQIndex - 1))}
                    disabled={currentQIndex === 0}
                    className="text-stone-400 hover:text-stone-600 disabled:opacity-30 disabled:hover:text-stone-400 font-medium px-4"
                >
                    Anterior
                </button>
                <button 
                    onClick={handleNext}
                    disabled={!answers[currentKey]}
                    className="flex items-center px-8 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95 font-bold shadow-md hover:shadow-lg"
                >
                    {currentQIndex === questions.length - 1 ? 'Enviar Evaluación' : 'Siguiente Pregunta'}
                    <ArrowRight className="ml-2 w-5 h-5" />
                </button>
            </div>
        </div>
    </div>
  );
};

export default QuizView;