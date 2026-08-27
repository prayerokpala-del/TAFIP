"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, MessageSquare, AlertTriangle, ArrowRight } from "lucide-react";

export const WordCloudSection: React.FC = () => {
  const [wordCloudWords, setWordCloudWords] = useState<any[]>([]);
  const [complaintTable, setComplaintTable] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/wordcloud-data")
      .then((res) => res.json())
      .then((data) => {
        if (data.wordcloud_words) setWordCloudWords(data.wordcloud_words);
        if (data.complaint_table) setComplaintTable(data.complaint_table);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section id="wordcloud" className="mb-10">
      <div className="saas-card p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-900">Sentiment Summary & Word Cloud Insights</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Natural Language Processing (VADER Sentiment Engine) extracted from 6 interview transcripts and survey text
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          {/* Sentiment Word Cloud Canvas */}
          <div className="lg:col-span-6 bg-slate-900 p-6 rounded-xl text-white flex flex-col justify-between relative overflow-hidden min-h-[300px]">
            <div className="flex justify-between items-center z-10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700">
                NLP Sentiment Word Cloud
              </span>
              <span className="text-[11px] text-slate-400">Word size = term density</span>
            </div>

            {loading || wordCloudWords.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-slate-500 text-xs font-mono">
                [Loading NLP sentiment word cloud...]
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-3.5 my-6 z-10 px-2">
                {wordCloudWords.map((w, idx) => (
                  <span key={idx} className={`${w.size} ${w.color} transition-all hover:scale-110 cursor-pointer font-sans`}>
                    {w.text}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between z-10 border-t border-slate-800 pt-3 text-[11px] text-slate-400">
              <span>Lexicon: VADER Financial Dictionary</span>
              <span>Source: Transcripts + Q8/Q10/Q12 Text</span>
            </div>
          </div>

          {/* Qualitative Review Complaint Table */}
          <div className="lg:col-span-6 bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Review Analysis Insights & Complaint Distribution
                </h3>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold">
                  Keyword Term Volume
                </span>
              </div>

              {loading || complaintTable.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs font-mono">
                  [Loading review analysis table...]
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-[10px] text-slate-400 uppercase font-bold">
                        <th className="py-2 font-bold">Feedback Keyword</th>
                        <th className="py-2 font-bold text-center">Volume</th>
                        <th className="py-2 font-bold text-center">Parkway (NG)</th>
                        <th className="py-2 font-bold text-center">Revolut (UK)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {complaintTable.map((row, idx) => (
                        <tr key={idx} className="hover:bg-white transition-colors">
                          <td className="py-2.5 font-bold text-slate-800">{row.keyword}</td>
                          <td className="py-2.5 text-center text-slate-500 font-mono text-[11px]">{row.volume}</td>
                          <td className="py-2.5 text-center">
                            <span className="inline-block bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded text-[11px]">
                              {row.pkPerc} ({row.pkFreq})
                            </span>
                          </td>
                          <td className="py-2.5 text-center">
                            <span className="inline-block bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded text-[11px]">
                              {row.revPerc} ({row.revFreq})
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between items-center">
              <span>Transcripts Evaluated: 6 Semi-Structured Interviews</span>
              <span className="font-semibold text-slate-700">Parkway Frustration Index: 19.5%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
