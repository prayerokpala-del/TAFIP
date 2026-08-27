"use client";

import React, { useState } from "react";
import { ExternalLink, Star, ShieldCheck, Lock, Building2 } from "lucide-react";

interface ProductOverviewCardsProps {
  summary: any;
}

export const ProductOverviewCards: React.FC<ProductOverviewCardsProps> = ({ summary }) => {
  const [sortBy, setSortBy] = useState<string>("Trust Score");
  const allCompanies = summary?.all_companies || {};

  const companyKeys = Object.keys(allCompanies);

  let productList = companyKeys.length > 0
    ? companyKeys.map((key) => {
        const item = allCompanies[key];
        const isParkway = item.name.toLowerCase().includes("parkway");
        return {
          id: key,
          name: item.name,
          country: item.country || "Global",
          sample_size: item.sample_size || 0,
          description: `${item.name} — Survey responses evaluated for trust and security analysis`,
          rating: item.rating_scale_5 || `${item.satisfaction_score ? (item.satisfaction_score / 20).toFixed(1) : "0.0"} / 5.0 (${item.sample_size || 0} responses)`,
          trustScore: item.trust_score || 0.0,
          satisfaction: item.satisfaction_score || 0.0,
          actualSecurity: item.actual_security_score || 0.0,
          accent: isParkway ? "border-l-4 border-emerald-500" : "border-l-4 border-blue-500",
          badgeBg: isParkway ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-blue-50 text-blue-700 border-blue-200",
          logoBg: isParkway ? "bg-emerald-600 text-white" : "bg-blue-600 text-white",
          icon: isParkway ? ShieldCheck : (item.name.toLowerCase().includes("revolut") ? Lock : Building2)
        };
      })
    : [
        {
          id: "parkway",
          name: summary?.parkway?.name || "Parkway",
          country: summary?.parkway?.country || "Nigeria",
          sample_size: summary?.parkway?.sample_size || 0,
          description: "Parkway — Survey responses evaluated for trust and security analysis",
          rating: summary?.parkway?.rating_scale_5 || "0.0 / 5.0 (0 responses)",
          trustScore: summary?.parkway?.trust_score || 0.0,
          satisfaction: summary?.parkway?.satisfaction_score || 0.0,
          actualSecurity: summary?.parkway?.actual_security_score || 0.0,
          accent: "border-l-4 border-emerald-500",
          badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          logoBg: "bg-emerald-600 text-white",
          icon: ShieldCheck
        },
        {
          id: "revolut",
          name: summary?.revolut?.name || "Revolut",
          country: summary?.revolut?.country || "United Kingdom",
          sample_size: summary?.revolut?.sample_size || 0,
          description: "Revolut — Survey responses evaluated for trust and security analysis",
          rating: summary?.revolut?.rating_scale_5 || "0.0 / 5.0 (0 responses)",
          trustScore: summary?.revolut?.trust_score || 0.0,
          satisfaction: summary?.revolut?.satisfaction_score || 0.0,
          actualSecurity: summary?.revolut?.actual_security_score || 0.0,
          accent: "border-l-4 border-blue-500",
          badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
          logoBg: "bg-blue-600 text-white",
          icon: Lock
        }
      ];

  // Dynamic sorting implementation
  productList.sort((a, b) => {
    if (sortBy === "Satisfaction") return b.satisfaction - a.satisfaction;
    if (sortBy === "Actual Security") return b.actualSecurity - a.actualSecurity;
    return b.trustScore - a.trustScore;
  });

  return (
    <section id="products" className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Company Analysis</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Comparative analysis of detected fintech applications ({productList.length} Companies Analyzed)
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500 font-medium">Sorted by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-semibold text-slate-700 focus:outline-none shadow-sm cursor-pointer"
          >
            <option value="Trust Score">Consolidated TAFIP Trust Score</option>
            <option value="Satisfaction">User Satisfaction Score</option>
            <option value="Actual Security">Technical Security Rating</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {productList.map((p) => {
          const LogoIcon = p.icon;
          return (
            <div key={p.id} className={`saas-card p-6 relative overflow-hidden ${p.accent}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl ${p.logoBg} flex items-center justify-center font-bold shadow-sm`}>
                    <LogoIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${p.badgeBg} mb-1`}>
                      {p.country}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{p.name}</h3>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 mb-4">{p.description}</p>

              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 flex items-center space-x-1">
                  <Star className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                  <span>{p.rating}</span>
                </span>
                <span className="text-xs text-slate-500">{p.sample_size} Survey Samples Evaluated</span>
                <a href="#barcharts" className="text-xs font-semibold text-blue-600 hover:underline flex items-center space-x-1 ml-auto">
                  <span>View analysis</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Trust Score</span>
                  <span className="text-lg font-black text-slate-900">{p.trustScore}</span>
                  <span className="text-[10px] text-slate-500 block">/ 100</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Satisfaction</span>
                  <span className="text-lg font-black text-slate-900">{p.satisfaction}%</span>
                  <span className="text-[10px] text-slate-500 block">Survey Mean</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Actual Security</span>
                  <span className="text-lg font-black text-slate-900">{p.actualSecurity}%</span>
                  <span className="text-[10px] text-slate-500 block">Tech Rating</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
