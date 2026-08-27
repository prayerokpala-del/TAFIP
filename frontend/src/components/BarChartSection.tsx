"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { BarChart3 } from "lucide-react";

interface BarChartSectionProps {
  summary: any;
}

export const BarChartSection: React.FC<BarChartSectionProps> = ({ summary }) => {
  const [painPointData, setPainPointData] = useState<any[]>([]);
  const [securityFeatureData, setSecurityFeatureData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/bar-charts-data")
      .then((res) => res.json())
      .then((data) => {
        if (data.pain_point_data) setPainPointData(data.pain_point_data);
        if (data.security_feature_data) setSecurityFeatureData(data.security_feature_data);
        setLoading(false);
      })
      .catch(() => {
        // Zero state fallback during loading
        setLoading(false);
      });
  }, []);

  return (
    <section id="barcharts" className="mb-10">
      <div className="flex items-center space-x-2 mb-4">
        <BarChart3 className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-bold text-slate-900">Frustration & Pain Point Severity Bar Charts</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Negative Feedback Count By Pain Point */}
        <div className="saas-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Number Of Negative Feedback Items By Pain Point</h3>
              <p className="text-xs text-slate-500">Frequency of user reported friction across survey responses</p>
            </div>

            {/* High Contrast Header Legend Badges */}
            <div className="flex items-center space-x-2 text-xs font-semibold flex-shrink-0">
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-rose-100 border border-rose-300 text-rose-800 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Parkway (Nigeria)</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-sky-100 border border-sky-300 text-sky-800 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                <span>Revolut (UK)</span>
              </span>
            </div>
          </div>

          <div className="h-80 w-full">
            {loading || painPointData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs font-mono">
                [Loading computed pain point counts...]
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={painPointData} margin={{ top: 20, right: 10, left: -15, bottom: 45 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#475569", fontSize: 10, fontWeight: 600 }}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    dy={5}
                  />
                  <YAxis tick={{ fill: "#64748b", fontSize: 10 }} domain={[0, 50]} />
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
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: "11px", paddingBottom: "10px" }} />
                  <Bar name="Parkway (Nigeria)" dataKey="Parkway" fill="#fbcfe8" stroke="#f43f5e" strokeWidth={1.5} radius={[4, 4, 0, 0]} />
                  <Bar name="Revolut (UK)" dataKey="Revolut" fill="#bae6fd" stroke="#0284c7" strokeWidth={1.5} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 2: Security Feature Implementation Comparison */}
        <div className="saas-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Technical Security Feature Confidence Level (%)</h3>
              <p className="text-xs text-slate-500">Perceived strength of technical security mechanisms (0 - 100 Scale)</p>
            </div>

            {/* High Contrast Header Legend Badges */}
            <div className="flex items-center space-x-2 text-xs font-semibold flex-shrink-0">
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-teal-100 border border-teal-300 text-teal-800 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                <span>Parkway (Nigeria)</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-purple-100 border border-purple-300 text-purple-800 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                <span>Revolut (UK)</span>
              </span>
            </div>
          </div>

          <div className="h-80 w-full">
            {loading || securityFeatureData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs font-mono">
                [Loading computed feature confidence scores...]
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={securityFeatureData} margin={{ top: 20, right: 10, left: -15, bottom: 45 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="feature"
                    tick={{ fill: "#475569", fontSize: 10, fontWeight: 600 }}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    dy={5}
                  />
                  <YAxis tick={{ fill: "#64748b", fontSize: 10 }} domain={[0, 100]} />
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
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: "11px", paddingBottom: "10px" }} />
                  <Bar name="Parkway Confidence (%)" dataKey="Parkway" fill="#99f6e4" stroke="#0d9488" strokeWidth={1.5} radius={[4, 4, 0, 0]} />
                  <Bar name="Revolut Confidence (%)" dataKey="Revolut" fill="#e9d5ff" stroke="#9333ea" strokeWidth={1.5} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
