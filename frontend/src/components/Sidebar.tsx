"use client";

import React from "react";
import {
  LayoutDashboard,
  ShieldCheck,
  BarChart3,
  Sparkles,
  MapPin,
  Cpu,
  Upload,
  ChevronDown,
  Layers,
  LineChart
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onOpenUpload: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  action?: () => void;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  setActiveSection,
  onOpenUpload,
}) => {
  const sections: NavGroup[] = [
    {
      title: "GENERAL",
      items: [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "products", label: "Parkway vs Revolut", icon: Layers },
      ],
    },
    {
      title: "ANALYSIS",
      items: [
        { id: "barcharts", label: "Pain Points & Bar Charts", icon: BarChart3 },
        { id: "radar", label: "Security Radar Chart", icon: ShieldCheck },
        { id: "accuracy", label: "ML Accuracy & Error Plot", icon: LineChart },
        { id: "wordcloud", label: "Word Cloud & Sentiment", icon: Sparkles },
        { id: "heatmap", label: "Regional Analysis", icon: MapPin },
        { id: "predictor", label: "ML Trust Predictor", icon: Cpu },
      ],
    },
    {
      title: "INFORMATION",
      items: [
        { id: "upload", label: "Raw CSV Importer", icon: Upload, action: onOpenUpload },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen p-5 flex flex-col justify-between flex-shrink-0">
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-8 p-2 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              T
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">TAFIP Dashboard</h2>
              <span className="text-[11px] text-slate-500 font-medium">Fintech Trust</span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>

        {/* Navigation Sections */}
        <div className="space-y-6">
          {sections.map((group, idx) => (
            <div key={idx}>
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-3">
                {group.title}
              </h3>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          if (item.action) {
                            item.action();
                          } else {
                            setActiveSection(item.id);
                            const el = document.getElementById(item.id);
                            if (el) {
                              el.scrollIntoView({ behavior: "smooth" });
                            }
                          }
                        }}
                        className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                          isActive
                            ? "bg-slate-100 text-blue-600 font-bold border-l-4 border-blue-600"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                        <span>{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom User Info Badge */}
      <div className="pt-4 border-t border-slate-200 flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">
          PO
        </div>
        <div className="overflow-hidden">
          <p className="text-xs font-bold text-slate-900 truncate">Prayer Okpala</p>
          <p className="text-[10px] text-slate-500 truncate">Lead Fintech Researcher</p>
        </div>
      </div>
    </aside>
  );
};
