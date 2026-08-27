"use client";

import React, { useEffect, useState } from "react";
import { MapPin, Globe, Compass, ShieldCheck } from "lucide-react";

interface HeatmapPoint {
  id: string;
  lat: number;
  lng: number;
  app: string;
  country: string;
  trust_score: number;
  intensity: number;
}

export const RegionalTrustHeatmap: React.FC = () => {
  const [points, setPoints] = useState<HeatmapPoint[]>([]);
  const [selectedApp, setSelectedApp] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/heatmap-data")
      .then((res) => res.json())
      .then((data) => {
        if (data.heatmap_points) {
          setPoints(data.heatmap_points);
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback sample heatmap points
        setPoints([
          { id: "1", lat: 6.5244, lng: 3.3792, app: "Parkway", country: "Nigeria", trust_score: 82.5, intensity: 0.82 },
          { id: "2", lat: 9.0765, lng: 7.3986, app: "Parkway", country: "Nigeria", trust_score: 79.1, intensity: 0.79 },
          { id: "3", lat: 4.8156, lng: 7.0498, app: "Parkway", country: "Nigeria", trust_score: 77.4, intensity: 0.77 },
          { id: "4", lat: 51.5074, lng: -0.1278, app: "Revolut", country: "United Kingdom", trust_score: 74.2, intensity: 0.74 },
          { id: "5", lat: 53.4808, lng: -2.2426, app: "Revolut", country: "United Kingdom", trust_score: 72.8, intensity: 0.72 },
          { id: "6", lat: 53.8008, lng: -1.5491, app: "Revolut", country: "United Kingdom", trust_score: 71.5, intensity: 0.71 },
        ]);
        setLoading(false);
      });
  }, []);

  const filteredPoints = points.filter((p) => selectedApp === "All" || p.app === selectedApp);

  const parkwayPoints = points.filter((p) => p.app === "Parkway");
  const revolutPoints = points.filter((p) => p.app === "Revolut");

  const parkwayAvg = parkwayPoints.length ? (parkwayPoints.reduce((a, b) => a + b.trust_score, 0) / parkwayPoints.length).toFixed(1) : "78.1";
  const revolutAvg = revolutPoints.length ? (revolutPoints.reduce((a, b) => a + b.trust_score, 0) / revolutPoints.length).toFixed(1) : "73.1";

  return (
    <div className="glass-panel rounded-2xl p-6 mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Regional Trust Heatmap Analysis</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Geographic location coordinates mapped across <strong>Nigeria (Parkway)</strong> and <strong>United Kingdom (Revolut)</strong>.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center space-x-2 bg-slate-900/60 p-1.5 rounded-xl border border-white/5 text-xs">
          {["All", "Parkway", "Revolut"].map((app) => (
            <button
              key={app}
              onClick={() => setSelectedApp(app)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                selectedApp === app
                  ? app === "Parkway"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : app === "Revolut"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {app === "All" ? "Global View" : app}
            </button>
          ))}
        </div>
      </div>

      {/* Region High-Level Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
              NG
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Nigeria Region (Parkway)</h4>
              <p className="text-xs text-slate-400">{parkwayPoints.length} Geocoded Respondents</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-black text-emerald-400">{parkwayAvg}</div>
            <span className="text-[10px] text-slate-400 uppercase">Avg Trust Score</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm">
              UK
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">United Kingdom Region (Revolut)</h4>
              <p className="text-xs text-slate-400">{revolutPoints.length} Geocoded Respondents</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-black text-cyan-400">{revolutAvg}</div>
            <span className="text-[10px] text-slate-400 uppercase">Avg Trust Score</span>
          </div>
        </div>
      </div>

      {/* Heatmap Point Grid Display */}
      <div className="bg-slate-950/80 rounded-xl p-5 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Active Survey Regional Coordinates</span>
          </h4>
          <span className="text-xs text-slate-400">Showing {filteredPoints.length} Locations</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
          {filteredPoints.map((pt) => {
            const isParkway = pt.app === "Parkway";
            return (
              <div
                key={pt.id}
                className={`p-3 rounded-xl border transition-all ${
                  isParkway
                    ? "bg-emerald-950/30 border-emerald-500/20 hover:border-emerald-500/40"
                    : "bg-cyan-950/30 border-cyan-500/20 hover:border-cyan-500/40"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-1.5">
                    <MapPin className={`w-3.5 h-3.5 ${isParkway ? "text-emerald-400" : "text-cyan-400"}`} />
                    <span className="text-xs font-bold text-white">{pt.app}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      isParkway ? "bg-emerald-500/20 text-emerald-400" : "bg-cyan-500/20 text-cyan-400"
                    }`}
                  >
                    {pt.trust_score}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex justify-between">
                  <span>Country: {pt.country}</span>
                  <span className="font-mono text-slate-500">
                    {pt.lat.toFixed(2)}, {pt.lng.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
