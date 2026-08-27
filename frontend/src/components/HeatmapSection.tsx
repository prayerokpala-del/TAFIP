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
import { Globe, Cpu, CheckCircle2 } from "lucide-react";

export const HeatmapSection: React.FC = () => {
  const [cityData, setCityData] = useState<any[]>([]);
  const [distributionData, setDistributionData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/heatmap-data")
      .then((res) => res.json())
      .then((data) => {
        if (data.city_data) setCityData(data.city_data);
        if (data.distribution_data) setDistributionData(data.distribution_data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section id="heatmap" className="mb-10">
      <div className="saas-card p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-900">Regional Trust & Geographic ML Analysis</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Visualizing ML predicted trust scores across <strong>Nigeria (Parkway)</strong> and <strong>United Kingdom (Revolut)</strong> urban clusters
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-bold border border-blue-200">
              <Cpu className="w-3.5 h-3.5" />
              <span>XGBoost ML Analyzed Dataset</span>
            </span>
          </div>
        </div>

        {/* Region KPI Summary Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                NG
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-700 tracking-wider">Nigeria Region</span>
                <h4 className="text-sm font-bold text-slate-900">Parkway (50 Survey Samples)</h4>
                <p className="text-xs text-slate-500">Lagos, Abuja, Port Harcourt</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-700">78.1</span>
              <span className="text-[10px] text-emerald-800 block font-semibold">Mean ML Trust Score</span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                UK
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-blue-700 tracking-wider">United Kingdom Region</span>
                <h4 className="text-sm font-bold text-slate-900">Revolut (50 Survey Samples)</h4>
                <p className="text-xs text-slate-500">London, Manchester, Leeds</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-blue-700">73.1</span>
              <span className="text-[10px] text-blue-800 block font-semibold">Mean ML Trust Score</span>
            </div>
          </div>
        </div>

        {/* Visual Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Visual Chart 1: Mean Trust Score By Urban Cluster */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <div className="mb-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Mean Trust Score By Major Urban Cluster
              </h3>
              <p className="text-[11px] text-slate-500">Comparing ML evaluated trust ratings across cities</p>
            </div>

            <div className="h-64 w-full">
              {loading || cityData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs font-mono">
                  [Loading city cluster trust scores...]
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cityData} margin={{ top: 15, right: 10, left: -15, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="city" tick={{ fill: "#475569", fontSize: 10, fontWeight: 600 }} interval={0} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 10 }} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderColor: "#cbd5e1",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar name="Parkway (Nigeria)" dataKey="Parkway" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar name="Revolut (UK)" dataKey="Revolut" fill="#0284c7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Visual Chart 2: Regional Trust Tier Distribution (%) */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <div className="mb-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Regional Trust Tier Distribution (%)
              </h3>
              <p className="text-[11px] text-slate-500">Percentage of users in High, Moderate, and At-Risk trust tiers</p>
            </div>

            <div className="h-64 w-full">
              {loading || distributionData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs font-mono">
                  [Loading trust tier distribution percentages...]
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distributionData} margin={{ top: 15, right: 10, left: -15, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="tier" tick={{ fill: "#475569", fontSize: 10, fontWeight: 600 }} interval={0} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 10 }} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderColor: "#cbd5e1",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Bar name="Parkway (%)" dataKey="Parkway" fill="#a7f3d0" stroke="#059669" strokeWidth={1.5} radius={[4, 4, 0, 0]} />
                    <Bar name="Revolut (%)" dataKey="Revolut" fill="#bae6fd" stroke="#0284c7" strokeWidth={1.5} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
