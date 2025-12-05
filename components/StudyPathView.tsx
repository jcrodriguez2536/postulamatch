import React, { useState, useEffect, useRef } from 'react';
import { AnalysisResult, WeeklyModule } from '../types';
import { BookOpen, FileText, ChevronDown, ChevronUp, PlayCircle, Info, PauseCircle, GraduationCap, Video, Book, Settings, FileSearch, Clock, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface StudyPathViewProps {
  data: AnalysisResult;
  onStartQuiz: (moduleIndex: number, assessmentIndex: number) => void;
  onFinalQuiz: () => void;
}

const PodcastPlayer: React.FC<{ script: string; summary: string; title: string }> = ({ script, summary, title }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
    const [showSummary, setShowSummary] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);
    
    // Split script into sentences for granularity
    const sentences = useRef<string[]>([]);
    
    useEffect(() => {
        // Simple sentence splitting (could be improved with regex)
        sentences.current = script.match(/[^.!?]+[.!?]+["']?|[^.!?]+$/g) || [script];
    }, [script]);

    useEffect(() => {
        const loadVoices = () => {
            const available = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('es'));
            setVoices(available);
            // Try to find a good quality Google/Microsoft voice
            const preferred = available.findIndex(v => v.name.includes('Google') || v.name.includes('Microsoft'));
            if (preferred !== -1) setSelectedVoiceIndex(preferred);
        };

        window.speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices();

        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const speakSentence = (index: number) => {
        if (index >= sentences.current.length) {
            setIsPlaying(false);
            setProgress(100);
            return;
        }

        window.speechSynthesis.cancel(); // Stop current

        const utterance = new SpeechSynthesisUtterance(sentences.current[index]);
        utterance.lang = 'es-ES';
        if (voices.length > 0) {
            utterance.voice = voices[selectedVoiceIndex];
        }
        
        // Slight pitch variance to simulate dialogue if we detect "Host" keywords
        if (sentences.current[index].includes("Host A:")) {
             utterance.pitch = 0.9;
             utterance.rate = 1.0;
        } else if (sentences.current[index].includes("Host B:")) {
             utterance.pitch = 1.1;
             utterance.rate = 1.1;
        }

        utterance.onend = () => {
            if (isPlaying) { // Check if still playing (wasn't paused)
                const nextIndex = index + 1;
                setCurrentSentenceIndex(nextIndex);
                setProgress((nextIndex / sentences.current.length) * 100);
                speakSentence(nextIndex);
            }
        };

        window.speechSynthesis.speak(utterance);
    };

    const handlePlay = () => {
        if (isPlaying) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
        } else {
            setIsPlaying(true);
            speakSentence(currentSentenceIndex);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = Number(e.target.value);
        setProgress(newVal);
        const newIndex = Math.floor((newVal / 100) * sentences.current.length);
        setCurrentSentenceIndex(newIndex);
        
        if (isPlaying) {
            speakSentence(newIndex);
        }
    };

    const changeVoice = () => {
        const nextIndex = (selectedVoiceIndex + 1) % voices.length;
        setSelectedVoiceIndex(nextIndex);
        if (isPlaying) {
            speakSentence(currentSentenceIndex); // Restart current sentence with new voice
        }
    };

    return (
        <div className="bg-stone-900/90 backdrop-blur-md rounded-xl p-6 text-white shadow-lg mb-6 border border-stone-700/50">
            <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                    <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Podcast IA</h5>
                    <h4 className="font-bold text-lg truncate pr-4">{title}</h4>
                </div>
                <div className="flex space-x-2">
                    <button 
                        onClick={() => setShowSummary(!showSummary)}
                        className={`p-2 rounded-full transition-colors ${showSummary ? 'bg-emerald-600 text-white' : 'bg-stone-700 text-stone-300 hover:bg-stone-600'}`}
                        title="Ver Resumen"
                    >
                        <FileSearch className="w-5 h-5" />
                    </button>
                    {voices.length > 1 && (
                         <button 
                            onClick={changeVoice}
                            className="p-2 rounded-full bg-stone-700 text-stone-300 hover:bg-stone-600 transition-colors"
                            title="Cambiar Voz IA"
                        >
                            <Settings className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            {showSummary ? (
                <div className="bg-stone-800/80 rounded-lg p-4 text-sm text-stone-300 leading-relaxed mb-4 animate-fade-in border border-stone-600/50">
                    <h5 className="font-bold text-white mb-2 flex items-center"><Info className="w-4 h-4 mr-2"/>Resumen del Episodio</h5>
                    <ReactMarkdown>{summary}</ReactMarkdown>
                </div>
            ) : (
                <>
                    {/* Visualizer bars simulation */}
                    <div className="flex items-end justify-center space-x-1 h-12 mb-6 bg-stone-800/50 rounded-lg p-2">
                        {[...Array(30)].map((_, i) => (
                            <div 
                                key={i} 
                                className={`w-1 bg-emerald-400 rounded-t-sm transition-all duration-150 ease-in-out`}
                                style={{ 
                                    height: isPlaying ? `${Math.random() * 100}%` : '4px',
                                    opacity: isPlaying ? 1 : 0.3 
                                }}
                            ></div>
                        ))}
                    </div>
                </>
            )}

            <div className="flex items-center space-x-4">
                 <button 
                    onClick={handlePlay}
                    className="flex-shrink-0 p-3 rounded-full bg-emerald-500 hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30 text-white"
                >
                    {isPlaying ? <PauseCircle className="w-8 h-8" /> : <PlayCircle className="w-8 h-8" />}
                </button>
                
                <div className="flex-1">
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={progress} 
                        onChange={handleSeek}
                        className="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400"
                    />
                    <div className="flex justify-between text-xs text-stone-400 mt-1">
                        <span>{Math.floor((progress / 100) * 15)}:00 (Est.)</span> {/* Fake duration estimation */}
                        <span>{progress.toFixed(0)}%</span>
                    </div>
                </div>
            </div>
            
            <p className="text-xs text-stone-500 text-center mt-4">
                Voz actual: {voices[selectedVoiceIndex]?.name.slice(0, 20) || 'Sistema'}
            </p>
        </div>
    );
};

const StudyPathView: React.FC<StudyPathViewProps> = ({ data, onStartQuiz, onFinalQuiz }) => {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(0);

  const toggleWeek = (index: number) => {
    setExpandedWeek(expandedWeek === index ? null : index);
  };

  const getIconForType = (type: string) => {
      if (type === 'Video') return <Video className="w-4 h-4 text-red-500" />;
      if (type === 'Document') return <FileText className="w-4 h-4 text-orange-500" />;
      return <Book className="w-4 h-4 text-emerald-500" />;
  };

  // Helper to generate a functional search URL instead of a broken direct link
  const getResourceLink = (type: string, query: string) => {
      const q = encodeURIComponent(query);
      switch (type) {
          case 'Video': return `https://www.youtube.com/results?search_query=${q}`;
          case 'Document': return `https://www.google.com/search?q=${q}+filetype:pdf`;
          default: return `https://www.google.com/search?q=${q}`;
      }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-end pb-4 border-b border-stone-200/50 gap-4">
         <div>
            <h2 className="text-2xl font-bold text-stone-800 font-serif">Ruta de Estudio Avanzada</h2>
            <p className="text-stone-500 text-sm mt-1">Recursos densos, podcasts generados y evaluaciones múltiples.</p>
         </div>
         {data.accessibilityStatement && (
             <div className="flex items-center bg-teal-50/80 text-teal-800 text-xs px-3 py-1.5 rounded-full border border-teal-100 backdrop-blur-sm">
                 <Info className="w-3 h-3 mr-2" />
                 {data.accessibilityStatement}
             </div>
         )}
      </div>

      <div className="space-y-4">
        {data.studyPath.map((module, moduleIdx) => (
          <div key={moduleIdx} className="border border-white/50 rounded-xl bg-white/60 backdrop-blur-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <button
              onClick={() => toggleWeek(moduleIdx)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-white/50 transition-colors focus:outline-none group"
            >
              <div className="flex items-center space-x-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-colors ${expandedWeek === moduleIdx ? 'bg-emerald-600 text-white' : 'bg-emerald-50/80 text-emerald-700 group-hover:bg-emerald-100'}`}>
                  S{module.weekNumber}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-stone-800">{module.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 uppercase tracking-wide mt-1">
                      <span className="flex items-center"><FileText className="w-3 h-3 mr-1"/> {module.resources.length} Recursos</span>
                      <span className="flex items-center"><GraduationCap className="w-3 h-3 mr-1"/> {module.assessments.length} Exámenes</span>
                      {module.estimatedHours && (
                        <span className="flex items-center text-emerald-600 font-semibold bg-emerald-50/80 px-2 py-0.5 rounded-md border border-emerald-100">
                            <Clock className="w-3 h-3 mr-1" /> {module.estimatedHours}
                        </span>
                      )}
                  </div>
                </div>
              </div>
              {expandedWeek === moduleIdx ? <ChevronUp className="text-stone-400" /> : <ChevronDown className="text-stone-400" />}
            </button>

            {expandedWeek === moduleIdx && (
              <div className="p-6 pt-0 border-t border-stone-100/50 bg-stone-50/30">
                
                {/* Podcast Section */}
                <div className="mt-6">
                    <PodcastPlayer 
                        script={module.podcastScript} 
                        summary={module.podcastSummary}
                        title={module.title} 
                    />
                </div>

                {/* Theory Section */}
                <div className="mt-6 prose prose-stone max-w-none">
                  <h4 className="flex items-center text-sm font-bold uppercase text-stone-500 mb-3">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Base Teórica
                  </h4>
                  <div className="bg-white/80 p-6 rounded-lg border border-white/60 text-stone-700 leading-relaxed text-sm shadow-sm backdrop-blur-sm">
                    <ReactMarkdown>{module.theory}</ReactMarkdown>
                  </div>
                </div>

                {/* Resources Grid */}
                <div className="mt-6">
                  <h4 className="flex items-center text-sm font-bold uppercase text-stone-500 mb-3">
                    <FileText className="w-4 h-4 mr-2" />
                    Documentación Técnica y Papers
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {module.resources.map((res, rIdx) => {
                      const searchUrl = getResourceLink(res.type, res.link);
                      return (
                        <a 
                          key={rIdx} 
                          href={searchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex flex-col p-4 bg-white/80 border border-white/60 rounded-lg hover:border-emerald-400 hover:ring-1 hover:ring-emerald-400 transition-all no-underline h-full shadow-sm backdrop-blur-sm"
                        >
                          <div className="flex items-center justify-between mb-2">
                             <div className="flex items-center">
                                 {getIconForType(res.type)}
                                 <span className="text-xs font-bold text-stone-500 uppercase ml-2">{res.type}</span>
                             </div>
                             <ExternalLink className="w-3 h-3 text-stone-400 group-hover:text-emerald-500" />
                          </div>
                          <span className="font-semibold text-stone-800 group-hover:text-emerald-600 transition-colors mb-2 line-clamp-1">{res.title}</span>
                          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-2">{res.description}</p>
                          <p className="text-[10px] text-emerald-600 font-mono truncate bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                             🔍 Buscar: "{res.link}"
                          </p>
                        </a>
                      );
                    })}
                  </div>
                </div>

                {/* Assessments Section - Multiple Quizzes */}
                <div className="mt-8">
                    <h4 className="flex items-center text-sm font-bold uppercase text-stone-500 mb-4">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        Evaluaciones de Competencia
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {module.assessments.map((quiz, qIdx) => (
                             <button 
                                key={qIdx}
                                onClick={() => onStartQuiz(moduleIdx, qIdx)}
                                className="flex flex-col items-center justify-center p-4 bg-white/80 border border-white/60 rounded-xl hover:bg-emerald-50/80 hover:border-emerald-200 transition-all group shadow-sm backdrop-blur-sm"
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
                                    quiz.type === 'Conceptual' ? 'bg-teal-100/80 text-teal-600' :
                                    quiz.type === 'Practical' ? 'bg-green-100/80 text-green-600' :
                                    'bg-purple-100/80 text-purple-600'
                                }`}>
                                    <GraduationCap className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-stone-800 text-sm mb-1">{quiz.title}</span>
                                <span className="text-xs text-stone-500 font-medium bg-stone-100/50 px-2 py-0.5 rounded-md uppercase tracking-wide">{quiz.type}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Week Navigation */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-stone-200/50">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setExpandedWeek(moduleIdx - 1);
                        }}
                        disabled={moduleIdx === 0}
                        className="flex items-center px-4 py-2 text-stone-500 hover:text-stone-800 disabled:opacity-30 disabled:hover:text-stone-500 font-medium transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        Semana Anterior
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setExpandedWeek(moduleIdx + 1);
                        }}
                        disabled={moduleIdx === data.studyPath.length - 1}
                        className="flex items-center px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-stone-300 disabled:cursor-not-allowed font-medium transition-colors shadow-sm"
                    >
                        Siguiente Semana
                        <ChevronRight className="w-5 h-5 ml-1" />
                    </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Final Exam CTA */}
      <div className="mt-12 p-8 bg-gradient-to-br from-stone-900/90 via-emerald-900/90 to-teal-900/90 backdrop-blur-md rounded-2xl text-white text-center shadow-xl relative overflow-hidden border border-white/10">
          <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-3 font-serif">Certificación Final</h3>
              <p className="text-emerald-100 mb-8 max-w-xl mx-auto text-lg">
                  Completa tu preparación con el caso de estudio integral y el examen final de 25 preguntas.
              </p>
              <button 
                onClick={onFinalQuiz}
                className="px-8 py-4 bg-white text-stone-900 rounded-xl font-bold hover:bg-emerald-50 transition-all transform hover:scale-105 shadow-lg"
              >
                  Comenzar Examen Final
              </button>
          </div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      </div>
    </div>
  );
};

export default StudyPathView;