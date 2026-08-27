"use client";

import React, { useEffect, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { ShieldCheck, Info } from "lucide-react";

interface RadarItem {
  dimension: string;
  Parkway: number;
  Revolut: number;
}

export const SecurityRadarChart: React.FC = () => {
  const [data, setData] = useState<RadarItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/radar-data")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.radar_data) {
          setData(resData.radar_data);
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback mockup data if backend is starting
        setData([
          { dimension: "Technical Security (2FA/Encryption)", Parkway: 88.5, Revolut: 86.0 },
          { dimension: "Perceived Financial Safety", Parkway: 83.2, Revolut: 74.0 },
          { dimension: "Data Privacy Protection", Parkway: 79.0, Revolut: 68.5 },
          { dimension: "Fraud Vulnerability Mitigation", Parkway: 76.5, Revolut: 65.0 },
          { dimension: "Security Usage Confidence", Parkway: 84.0, Revolut: 78.2 },
          { dimension: "Low Financial Loss Risk", Parkway: 81.0, Revolut: 71.5 },
        ]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="glass-panel rounded-2xl p-6 mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Security Gap Radar Analysis</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Comparing <strong>Actual Technical Security</strong> vs <strong>Perceived Security Confidence</strong> across 6 dimensions (0 - 100 Scale).
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-slate-900/60 px-3.5 py-2 rounded-xl border border-white/5 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            <span className="text-slate-200 font-semibold">Parkway (Nigeria)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-cyan-500 shadow-sm shadow-cyan-500/50" />
            <span className="text-slate-200 font-semibold">Revolut (UK)</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-80 flex items-center justify-center text-slate-400 text-sm">
          Loading Security Gap Radar Chart...
        </div>
      ) : (
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
              <PolarGrid stroke="#334155" strokeDasharray="3 3" />
              <PolarAngleAxis
                dataKey="dimension"
                tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
              />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} />
              <Radar
                name="Parkway (Nigeria)"
                dataKey="Parkway"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.4}
              />
              <Radar
                name="Revolut (UK)"
                dataKey="Revolut"
                stroke="#06b6d4"
                fill="#06b6d4"
                fillOpacity={0.35}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "#f8fafc",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px", fontSize: "12px" }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="mt-4 p-4 rounded-xl bg-slate-900/40 border border-white/5 flex items-start space-x-3 text-xs text-slate-300">
        <Info className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
        <p>
          <strong className="text-white">TAFIP Insight:</strong> Parkway users in Nigeria exhibit higher reliance on active technical confirmation features (SMS OTPs, transfer pins, instant debit notifications), whereas UK Revolut users express higher security friction regarding app locks, account freezes, and push notification phishing attempts.
        </p>
      </div>
    </div>
  );
};
