import React from 'react';
import { AIAnalysisResult } from '../types';
import { Icons } from './Icons';

interface AIAnalysisCardProps {
  analysis: AIAnalysisResult | null;
  loading: boolean;
}

const AIAnalysisCard: React.FC<AIAnalysisCardProps> = ({ analysis, loading }) => {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-[#1c2128] to-[#0d1117] border border-purple-500/30 rounded-xl p-6 animate-pulse">
        <div className="flex items-center gap-2 text-purple-400 mb-4">
          <Icons.Sparkles className="animate-spin-slow" />
          <span className="font-semibold">Gemini is analyzing profile...</span>
        </div>
        <div className="h-4 bg-github-border rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-github-border rounded w-1/2 mb-6"></div>
        <div className="flex gap-2 mb-4">
            <div className="h-8 w-20 bg-github-border rounded-full"></div>
            <div className="h-8 w-20 bg-github-border rounded-full"></div>
            <div className="h-8 w-20 bg-github-border rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-purple-500/40 rounded-xl p-6 shadow-lg shadow-purple-900/10 relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center gap-2 text-purple-400 mb-4 relative z-10">
        <Icons.Sparkles size={20} />
        <h3 className="font-semibold text-lg">AI Profile Analysis</h3>
      </div>

      <div className="space-y-4 relative z-10">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-github-muted mb-1">Professional Summary</h4>
          <p className="text-gray-300 leading-relaxed text-sm">
            {analysis.professionalSummary}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-github-muted mb-2">Core Strengths</h4>
                <div className="flex flex-wrap gap-2">
                    {analysis.topSkills.map((skill, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        {skill}
                    </span>
                    ))}
                </div>
            </div>
            <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-github-muted mb-2">Suggested Roles</h4>
                 <ul className="space-y-1">
                    {analysis.suggestedRoles.map((role, i) => (
                        <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                             <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                             {role}
                        </li>
                    ))}
                 </ul>
            </div>
        </div>

        <div className="pt-2 border-t border-github-border/50">
             <p className="text-xs text-purple-300/80 italic">
                ✨ Fun Fact: {analysis.funFact}
             </p>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisCard;
