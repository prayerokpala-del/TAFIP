"use client";

import React from "react";
import { ShieldCheck, BarChart3, Upload, Activity, Cpu, MapPin, Sparkles } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenUpload: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenUpload }) => {
  const tabs = [
    { id: "overview", label: "Executive Summary", icon: Activity },
    { id: "comparative", label: "Parkway vs Revolut", icon: BarChart3 },
    { id: "radar", label: "Security Gap Radar", icon: ShieldCheck },
    { id: "heatmap", label: "Regional Heatmap", icon: MapPin },
    { id: "nlp", label: "NLP Sentiment Engine", icon: Sparkles },
    { id: "predictor", label: "ML Trust Predictor", icon: Cpu },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 px-6 py-4 mb-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Title */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
              TAFIP Dashboard
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Trust & Security Analysis Framework (Parkway vs Revolut)
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex flex-wrap items-center justify-center gap-1 bg-slate-900/60 p-1.5 rounded-xl border border-white/5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Upload Raw CSV Action Button */}
        <button
          onClick={onOpenUpload}
          className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 px-4 py-2 rounded-xl font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <Upload className="w-4 h-4 stroke-[2.5]" />
          <span>Upload Raw CSV</span>
        </button>
      </div>
    </header>
  );
};
