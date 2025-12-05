import React from 'react';
import { UserProfile, QuizResult, FileAttachment } from '../types';
import { Award, TrendingUp, Calendar, CheckCircle, XCircle, Briefcase } from 'lucide-react';

interface StatisticsViewProps {
  userProfile: UserProfile;
  quizResults: QuizResult[];
  jobFile?: FileAttachment | null;
}

const StatisticsView: React.FC<StatisticsViewProps> = ({ userProfile, quizResults }) => {
  const totalQuizzes = quizResults.length;
  const averageScore = totalQuizzes > 0 
    ? Math.round(quizResults.reduce((acc, curr) => acc + curr.percentage, 0) / totalQuizzes) 
    : 0;
  
  const passedQuizzes = quizResults.filter(q => q.passed).length;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* User Profile Card */}
      <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg flex-shrink-0">
          {userProfile.name.charAt(0)}
        </div>
        <div className="flex-1 text-center md:text-left space-y-2">
          <h2 className="text-3xl font-bold text-stone-800 font-serif">{userProfile.name}</h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-stone-600">
             <span className="flex items-center"><Briefcase className="w-4 h-4 mr-1" /> {userProfile.currentRole}</span>
             <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {userProfile.yearsExperience} Exp</span>
          </div>
          <div className="pt-4">
             <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Habilidades Principales</p>
             <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {userProfile.topSkills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white/70 text-stone-700 rounded-full text-xs font-medium border border-stone-200 shadow-sm backdrop-blur-sm">
                        {skill}
                    </span>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white/60 backdrop-blur-md p-6 rounded-xl border border-white/50 shadow-sm flex items-center space-x-4">
            <div className="p-4 bg-teal-100/80 rounded-full text-teal-600">
                <Award className="w-8 h-8" />
            </div>
            <div>
                <p className="text-sm text-stone-500 font-bold uppercase">Evaluaciones</p>
                <p className="text-2xl font-bold text-stone-800">{totalQuizzes} Completadas</p>
            </div>
         </div>
         <div className="bg-white/60 backdrop-blur-md p-6 rounded-xl border border-white/50 shadow-sm flex items-center space-x-4">
            <div className="p-4 bg-emerald-100/80 rounded-full text-emerald-600">
                <CheckCircle className="w-8 h-8" />
            </div>
            <div>
                <p className="text-sm text-stone-500 font-bold uppercase">Aprobadas</p>
                <p className="text-2xl font-bold text-stone-800">{passedQuizzes} Exámenes</p>
            </div>
         </div>
         <div className="bg-white/60 backdrop-blur-md p-6 rounded-xl border border-white/50 shadow-sm flex items-center space-x-4">
            <div className={`p-4 rounded-full ${averageScore >= 70 ? 'bg-emerald-100/80 text-emerald-600' : 'bg-orange-100/80 text-orange-600'}`}>
                <TrendingUp className="w-8 h-8" />
            </div>
            <div>
                <p className="text-sm text-stone-500 font-bold uppercase">Promedio Global</p>
                <p className="text-2xl font-bold text-stone-800">{averageScore}%</p>
            </div>
         </div>
      </div>

      {/* Quiz History List */}
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-sm border border-white/50 overflow-hidden">
        <div className="p-6 border-b border-stone-200/50 bg-stone-50/50">
            <h3 className="text-lg font-bold text-stone-800">Historial de Calificaciones</h3>
        </div>
        
        {quizResults.length === 0 ? (
            <div className="p-12 text-center text-stone-500">
                <p>Aún no has completado ninguna evaluación.</p>
                <p className="text-sm mt-2">Ve a la pestaña "Ruta de Estudio" para comenzar.</p>
            </div>
        ) : (
            <div className="divide-y divide-stone-100/50">
                {quizResults.map((result, idx) => (
                    <div key={idx} className="p-6 flex items-center justify-between hover:bg-white/50 transition-colors">
                        <div>
                            <h4 className="font-bold text-stone-800">{result.quizTitle}</h4>
                            <p className="text-xs text-stone-500 mt-1">
                                {result.date.toLocaleDateString()} - {result.totalQuestions} Preguntas
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <span className={`text-2xl font-bold ${result.passed ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {result.score}/{result.totalQuestions}
                                </span>
                                <span className="block text-xs text-stone-400 font-bold">{result.percentage}%</span>
                            </div>
                            {result.passed ? (
                                <CheckCircle className="w-6 h-6 text-emerald-500" />
                            ) : (
                                <XCircle className="w-6 h-6 text-red-500" />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsView;