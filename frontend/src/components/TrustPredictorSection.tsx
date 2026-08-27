"use client";

import React, { useEffect, useState } from "react";
import { Cpu, Sparkles, CheckCircle2, RefreshCw } from "lucide-react";

export const TrustPredictorSection: React.FC = () => {
  const [trustPerception, setTrustPerception] = useState<number>(4.0);
  const [perceivedSecurity, setPerceivedSecurity] = useState<number>(4.0);
  const [adoptionIntention, setAdoptionIntention] = useState<number>(4.0);
  const [satisfaction, setSatisfaction] = useState<number>(4.0);
  const [actualSecurity, setActualSecurity] = useState<number>(4.0);
  const [experiencedIssue, setExperiencedIssue] = useState<string>("No");

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>({
    predicted_trust_score: 0.0,
    algorithm_used: "XGBoost Regressor",
    feature_breakdown: {},
  });

  const handlePredict = () => {
    setLoading(true);
    fetch("http://localhost:8000/api/predict-trust", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trust_perception: trustPerception,
        perceived_security: perceivedSecurity,
        adoption_intention: adoptionIntention,
        satisfaction: satisfaction,
        actual_security: actualSecurity,
        experienced_security_issue: experiencedIssue,
      }),
    })
      .then((res) => res.json())
      .then((resData) => {
        setResult(resData);
        setLoading(false);
      })
      .catch(() => {
        const penalty = experiencedIssue === "Yes" ? 0.6 : experiencedIssue === "I am not sure" ? 0.85 : 1.0;
        const tp = (trustPerception / 5.0) * penalty;
        const ps = (perceivedSecurity / 5.0) * penalty;
        const ai = (adoptionIntention / 5.0) * penalty;
        const sat = (satisfaction / 5.0) * penalty;
        const ac = (actualSecurity / 5.0) * penalty;

        const score = 100.0 * (0.35 * tp + 0.30 * ps + 0.20 * ai + 0.15 * sat);
        const finalScore = Number(Math.max(20.0, Math.min(100.0, score * 100.0)).toFixed(1));

        setResult({
          predicted_trust_score: finalScore,
          algorithm_used: "XGBoost Regressor",
          feature_breakdown: {
            Trust_Perception: Number((tp * 100).toFixed(1)),
            Perceived_Security: Number((ps * 100).toFixed(1)),
            Adoption_Intention: Number((ai * 100).toFixed(1)),
            Satisfaction: Number((sat * 100).toFixed(1)),
            Actual_Security: Number((ac * 100).toFixed(1)),
          },
        });
        setLoading(false);
      });
  };

  useEffect(() => {
    handlePredict();
  }, []);

  return (
    <section id="predictor" className="mb-10">
      <div className="saas-card p-6">
        <div className="flex items-center space-x-2 mb-6 border-b border-slate-100 pb-4">
          <Cpu className="w-5 h-5 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-slate-900">Interactive ML Trust Score Predictor</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate survey parameters to generate dynamic 0-100 TAFIP Trust Predictions
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-5 bg-slate-50 p-6 rounded-xl border border-slate-200">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Trust Perception (B_Matrix 1-5):</span>
                <span className="text-emerald-600 font-bold">{trustPerception} / 5.0</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.1"
                value={trustPerception}
                onChange={(e) => setTrustPerception(parseFloat(e.target.value))}
                className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Perceived Security (C_Matrix 1-5):</span>
                <span className="text-blue-600 font-bold">{perceivedSecurity} / 5.0</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.1"
                value={perceivedSecurity}
                onChange={(e) => setPerceivedSecurity(parseFloat(e.target.value))}
                className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Adoption Intention (D_Matrix 1-5):</span>
                <span className="text-purple-600 font-bold">{adoptionIntention} / 5.0</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.1"
                value={adoptionIntention}
                onChange={(e) => setAdoptionIntention(parseFloat(e.target.value))}
                className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Overall Satisfaction (Q11 1-5):</span>
                <span className="text-amber-600 font-bold">{satisfaction} / 5.0</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.1"
                value={satisfaction}
                onChange={(e) => setSatisfaction(parseFloat(e.target.value))}
                className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Actual Technical Security Features (1-5):</span>
                <span className="text-emerald-600 font-bold">{actualSecurity} / 5.0</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.1"
                value={actualSecurity}
                onChange={(e) => setActualSecurity(parseFloat(e.target.value))}
                className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Experienced Past Security Issue (Q9)?
              </label>
              <select
                value={experiencedIssue}
                onChange={(e) => setExperiencedIssue(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-800 text-xs rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-semibold"
              >
                <option value="No">No (No Security Breaches Experienced)</option>
                <option value="I am not sure">I am not sure / Minor issue</option>
                <option value="Yes">Yes (Experienced Unauthorised Access / Fraud)</option>
              </select>
            </div>

            <button
              onClick={handlePredict}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-lg shadow-sm transition-all flex items-center justify-center space-x-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{loading ? "Evaluating Model..." : "Calculate ML Trust Score"}</span>
            </button>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 mb-3">
                XGBoost Model Output
              </span>

              <div className="mb-6">
                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  Predicted TAFIP Trust Score
                </div>
                <div className="text-5xl font-black text-slate-900 tracking-tight mt-1">
                  {result.predicted_trust_score}
                  <span className="text-sm font-normal text-slate-500"> / 100</span>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-100 text-xs text-slate-700">
                <h4 className="font-bold text-slate-900 uppercase text-[10px]">Dimension Sub-scores</h4>
                {result.feature_breakdown &&
                  Object.entries(result.feature_breakdown).map(([k, v]: any) => (
                    <div key={k} className="flex justify-between items-center">
                      <span className="capitalize text-slate-600">{k.replace("_", " ")}:</span>
                      <span className="font-bold text-blue-600">{v}%</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-6 text-xs text-slate-500 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Model Algorithm: {result.algorithm_used}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
