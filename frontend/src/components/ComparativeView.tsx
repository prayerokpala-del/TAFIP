"use client";

import React from "react";
import { BarChart3, CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface ComparativeViewProps {
  summary: any;
}

export const ComparativeView: React.FC<ComparativeViewProps> = ({ summary }) => {
  if (!summary) return null;

  const { parkway, revolut } = summary;

  const comparisonRows = [
    {
      metric: "Consolidated Trust Score (0-100)",
      parkwayVal: `${parkway.trust_score}`,
      revolutVal: `${revolut.trust_score}`,
      winner: parkway.trust_score > revolut.trust_score ? "Parkway" : "Revolut",
      notes: "Parkway scores slightly higher due to high perceived transaction honesty and strong user dependence."
    },
    {
      metric: "Actual Technical Security Score",
      parkwayVal: `${parkway.actual_security_score}%`,
      revolutVal: `${revolut.actual_security_score}%`,
      winner: parkway.actual_security_score > revolut.actual_security_score ? "Parkway" : "Revolut",
      notes: "Parkway incorporates multi-factor SMS/OTP verification and CBN regulation protocols."
    },
    {
      metric: "Perceived Security Score",
      parkwayVal: `${parkway.perceived_security_score}%`,
      revolutVal: `${revolut.perceived_security_score}%`,
      winner: parkway.perceived_security_score > revolut.perceived_security_score ? "Parkway" : "Revolut",
      notes: "Nigerian users express high confidence in security features when active confirmation steps are present."
    },
    {
      metric: "Security Gap (Actual vs Perceived)",
      parkwayVal: `${parkway.security_gap}%`,
      revolutVal: `${revolut.security_gap}%`,
      winner: "Benchmark",
      notes: "Revolut exhibits a wider security gap due to user anxiety regarding automated account freezes."
    },
    {
      metric: "Overall User Satisfaction",
      parkwayVal: `${parkway.satisfaction_score}%`,
      revolutVal: `${revolut.satisfaction_score}%`,
      winner: parkway.satisfaction_score > revolut.satisfaction_score ? "Parkway" : "Revolut",
      notes: "Parkway scores 82.5% satisfaction vs Revolut 78.0% among survey participants."
    },
    {
      metric: "NLP Frustration Index",
      parkwayVal: `${parkway.nlp_frustration_score}%`,
      revolutVal: `${revolut.nlp_frustration_score}%`,
      winner: parkway.nlp_frustration_score < revolut.nlp_frustration_score ? "Parkway" : "Revolut",
      notes: "Parkway frustration stems from network downtime, while Revolut frustration stems from support delay."
    }
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 mb-8">
      <div className="flex items-center space-x-2 mb-6">
        <BarChart3 className="w-5 h-5 text-indigo-400" />
        <h2 className="text-xl font-bold text-white">Parkway vs Revolut Side-by-Side Benchmark</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10">
            <tr>
              <th className="py-3 px-4">Evaluation Metric</th>
              <th className="py-3 px-4 text-emerald-400 font-bold">Parkway (Nigeria)</th>
              <th className="py-3 px-4 text-cyan-400 font-bold">Revolut (United Kingdom)</th>
              <th className="py-3 px-4">Leading Benchmark</th>
              <th className="py-3 px-4">Key Insight</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {comparisonRows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-white">{row.metric}</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400">{row.parkwayVal}</td>
                <td className="py-3.5 px-4 font-bold text-cyan-400">{row.revolutVal}</td>
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      row.winner === "Parkway"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : row.winner === "Revolut"
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{row.winner}</span>
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-400 text-[11px]">{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
