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
  Tooltip
} from "recharts";
import { ShieldCheck, Info } from "lucide-react";

export const RadarChartSection: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
        setLoading(false);
      });
  }, []);

  return (
    <section id="radar" className="mb-10">
      <div className="saas-card p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-900">Severity Of Pain Points & Security Radar</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluating Actual Technical Security vs Perceived User Safety (0 - 100 Scale)
            </p>
          </div>
          <div className="flex items-center space-x-4 text-xs font-semibold">
            <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200 text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Parkway (Nigeria)</span>
            </div>
            <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded border border-blue-200 text-blue-700">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Revolut (UK)</span>
            </div>
          </div>
        </div>

        {/* Clean Light-Mode Hexagonal Radar Chart */}
        <div className="h-96 w-full">
          {loading || data.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs font-mono">
              [Loading dynamic radar security dimensions...]
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fill: "#475569", fontSize: 11, fontWeight: 500 }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <Radar
                  name="Parkway (Nigeria)"
                  dataKey="Parkway"
                  stroke="#10b981"
                  fill="#a7f3d0"
                  fillOpacity={0.45}
                />
                <Radar
                  name="Revolut (UK)"
                  dataKey="Revolut"
                  stroke="#0284c7"
                  fill="#bae6fd"
                  fillOpacity={0.45}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#cbd5e1",
                    borderRadius: "8px",
                    color: "#0f172a",
                    fontSize: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "15px" }} />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="mt-4 p-4 rounded-lg bg-blue-50/60 border border-blue-100 flex items-start space-x-3 text-xs text-slate-700">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <p>
            <strong className="text-slate-900">Key Finding:</strong> Parkway displays a smaller security gap because Nigerian users rely directly on mandatory multi-step technical verifications (SMS OTPs, transfer pins, instant debit notifications). Revolut users in the UK experience security anxiety primarily related to automated account freezes and push notification phishing scams.
          </p>
        </div>
      </div>
    </section>
  );
};
