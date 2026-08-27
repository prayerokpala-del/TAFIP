"use client";

import React from "react";
import { ShieldCheck, Lock, AlertTriangle, Cpu, MessageSquare, TrendingUp, Award } from "lucide-react";

interface SummaryData {
  total_samples: number;
  parkway: {
    name: string;
    country: string;
    sample_size: number;
    trust_score: number;
    actual_security_score: number;
    perceived_security_score: number;
    security_gap: number;
    satisfaction_score: number;
    nlp_sentiment_score: number;
    nlp_frustration_score: number;
  };
  revolut: {
    name: string;
    country: string;
    sample_size: number;
    trust_score: number;
    actual_security_score: number;
    perceived_security_score: number;
    security_gap: number;
    satisfaction_score: number;
    nlp_sentiment_score: number;
    nlp_frustration_score: number;
  };
  model_info: {
    algorithm: string;
    r2_score: number;
  };
}

interface OverviewCardsProps {
  data: SummaryData | null;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({ data }) => {
  if (!data) return null;

  const { parkway, revolut, model_info } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Parkway Card */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Nigeria ({parkway.sample_size} Surveys)
            </span>
            <h3 className="text-xl font-black text-white mt-1">Parkway</h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="mb-4">
          <div className="text-3xl font-extrabold text-emerald-400 tracking-tight flex items-baseline gap-1">
            {parkway.trust_score}
            <span className="text-xs text-slate-400 font-normal">/ 100 TAFIP Index</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Satisfaction: <strong className="text-slate-200">{parkway.satisfaction_score}%</strong>
          </p>
        </div>

        <div className="pt-3 border-t border-white/5 space-y-1.5 text-xs text-slate-300">
          <div className="flex justify-between">
            <span className="text-slate-400">Actual Security:</span>
            <span className="font-semibold text-emerald-400">{parkway.actual_security_score}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Perceived Security:</span>
            <span className="font-semibold text-cyan-400">{parkway.perceived_security_score}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">NLP Frustration Index:</span>
            <span className="font-semibold text-amber-400">{parkway.nlp_frustration_score}%</span>
          </div>
        </div>
      </div>

      {/* Revolut Card */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all" />
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              United Kingdom ({revolut.sample_size} Surveys)
            </span>
            <h3 className="text-xl font-black text-white mt-1">Revolut</h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Lock className="w-5 h-5" />
          </div>
        </div>

        <div className="mb-4">
          <div className="text-3xl font-extrabold text-cyan-400 tracking-tight flex items-baseline gap-1">
            {revolut.trust_score}
            <span className="text-xs text-slate-400 font-normal">/ 100 TAFIP Index</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Satisfaction: <strong className="text-slate-200">{revolut.satisfaction_score}%</strong>
          </p>
        </div>

        <div className="pt-3 border-t border-white/5 space-y-1.5 text-xs text-slate-300">
          <div className="flex justify-between">
            <span className="text-slate-400">Actual Security:</span>
            <span className="font-semibold text-emerald-400">{revolut.actual_security_score}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Perceived Security:</span>
            <span className="font-semibold text-cyan-400">{revolut.perceived_security_score}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">NLP Frustration Index:</span>
            <span className="font-semibold text-amber-400">{revolut.nlp_frustration_score}%</span>
          </div>
        </div>
      </div>

      {/* Model Accuracy Card */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Predictive AI Engine
            </span>
            <h3 className="text-xl font-black text-white mt-1">ML Model</h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

        <div className="mb-4">
          <div className="text-3xl font-extrabold text-indigo-300 tracking-tight flex items-baseline gap-1">
            {(model_info.r2_score * 100).toFixed(1)}%
            <span className="text-xs text-slate-400 font-normal">R² Accuracy</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 truncate">
            Algorithm: <strong className="text-slate-200">{model_info.algorithm}</strong>
          </p>
        </div>

        <div className="pt-3 border-t border-white/5 space-y-1.5 text-xs text-slate-300">
          <div className="flex justify-between">
            <span className="text-slate-400">Cross Validation:</span>
            <span className="font-semibold text-indigo-300">5-Fold Stratified</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Target Scale:</span>
            <span className="font-semibold text-slate-200">0 - 100 Continuous</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Feature Count:</span>
            <span className="font-semibold text-slate-200">15 Variables</span>
          </div>
        </div>
      </div>

      {/* Qualitative NLP Card */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Interview Insights
            </span>
            <h3 className="text-xl font-black text-white mt-1">NLP Engine</h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="mb-4">
          <div className="text-3xl font-extrabold text-amber-400 tracking-tight flex items-baseline gap-1">
            6
            <span className="text-xs text-slate-400 font-normal">Transcripts Analyzed</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Method: <strong className="text-slate-200">VADER + Keyword Lexicon</strong>
          </p>
        </div>

        <div className="pt-3 border-t border-white/5 space-y-1.5 text-xs text-slate-300">
          <div className="flex justify-between">
            <span className="text-slate-400">Parkway Frustration:</span>
            <span className="font-semibold text-emerald-400">Downtime & Network</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Revolut Frustration:</span>
            <span className="font-semibold text-cyan-400">Support & Account Freeze</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Overall Sentiment:</span>
            <span className="font-semibold text-emerald-400">Positive (+0.68)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
