"use client";

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Cpu, CheckCircle2 } from "lucide-react";

export const ModelAccuracyChartSection: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [mae, setMae] = useState<number>(0);
  const [r2, setR2] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/model-accuracy-data")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.accuracy_data) setData(resData.accuracy_data);
        if (resData.mae) setMae(resData.mae);
        if (resData.r2) setR2(resData.r2);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section id="accuracy" className="mb-10">
      <div className="saas-card p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-900">XGBoost ML Model Prediction Accuracy & Error Plot</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparing <strong>Actual Ground-Truth Trust Score</strong> vs <strong>XGBoost Model Predicted Score</strong> across survey respondents
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200 font-bold">
              Model R² Accuracy: {r2 ? (r2 * 100).toFixed(1) : "0"}%
            </span>
            <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-200 font-bold">
              MAE: {mae || "0"} Points
            </span>
          </div>
        </div>

        {/* Prediction Accuracy Line/Scatter Plot */}
        <div className="h-80 w-full mb-4">
          {loading || data.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs font-mono">
              [Loading ML model row-by-row prediction comparison...]
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 15, right: 20, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="sample" tick={{ fill: "#475569", fontSize: 9, fontWeight: 600 }} interval={0} angle={-25} textAnchor="end" />
                <YAxis domain={[40, 100]} tick={{ fill: "#64748b", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#cbd5e1",
                    borderRadius: "8px",
                    fontSize: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Line
                  type="monotone"
                  name="Actual Ground-Truth Target Score"
                  dataKey="ActualTarget"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#10b981" }}
                />
                <Line
                  type="monotone"
                  name="XGBoost ML Model Predicted Score"
                  dataKey="MLPredicted"
                  stroke="#0284c7"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 4, fill: "#0284c7" }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </section>
  );
};
